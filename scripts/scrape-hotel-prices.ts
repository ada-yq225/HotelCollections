/**
 * Batch-scrape official nightly starting rates from hotel websites.
 * Updates src/data/hotel-enrichment.json (priceSource: "scraped" only when validated).
 *
 * Usage:
 *   npx tsx scripts/scrape-hotel-prices.ts
 *   npx tsx scripts/scrape-hotel-prices.ts --slug=four-seasons-prague
 *   npx tsx scripts/scrape-hotel-prices.ts --missing-only
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { resolveOfficialUrl } from "../src/lib/hotel-official-url";
import { resolveUrlCandidates } from "../src/lib/hotel-url-candidates";
import {
  extractScrapedBasePriceCny,
  validateScrapedPriceCny,
} from "../src/lib/hotel-price-scrape";

const OUT_PATH = join(__dirname, "../src/data/hotel-enrichment.json");
const DELAY_MS = 500;

type CachedEnrichment = {
  websiteUrl?: string;
  avgBasePrice?: number;
  avgSuitePrice?: number;
  priceSource?: "scraped" | "estimated";
  [key: string]: unknown;
};

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(16000),
    });
    if (!res.ok && res.status !== 403) return null;
    const html = await res.text();
    return html.length >= 500 ? html : null;
  } catch {
    return null;
  }
}

function suiteFromBase(hotel: (typeof ALL_HOTELS)[0], base: number): number {
  const isMaldives =
    hotel.region === "maldives" || hotel.slug.includes("maldives");
  return Math.round(base * (isMaldives ? 3.5 : 2.2));
}

async function scrapePriceForHotel(hotel: (typeof ALL_HOTELS)[0]): Promise<{
  avgBasePrice?: number;
  avgSuitePrice?: number;
  priceSource?: "scraped";
  websiteUrl?: string;
} | null> {
  const cachedUrl = existsSync(OUT_PATH)
    ? (JSON.parse(readFileSync(OUT_PATH, "utf-8")) as Record<string, CachedEnrichment>)[
        hotel.slug
      ]?.websiteUrl
    : undefined;

  const websiteUrl =
    hotel.websiteUrl ?? cachedUrl ?? resolveOfficialUrl(hotel) ?? undefined;
  if (!websiteUrl) return null;

  const candidates = [websiteUrl, ...resolveUrlCandidates(hotel).filter((u) => u !== websiteUrl)];

  for (const url of candidates.slice(0, 3)) {
    const html = await fetchHtml(url);
    if (!html) continue;

    const raw = extractScrapedBasePriceCny(html);
    if (raw == null) continue;

    const validated = validateScrapedPriceCny(raw, hotel.brandSlug, hotel.countryCode);
    if (validated == null) continue;

    return {
      websiteUrl: url,
      avgBasePrice: validated,
      avgSuitePrice: suiteFromBase(hotel, validated),
      priceSource: "scraped",
    };
  }

  return null;
}

function loadCache(): Record<string, CachedEnrichment> {
  if (!existsSync(OUT_PATH)) return {};
  return JSON.parse(readFileSync(OUT_PATH, "utf-8")) as Record<string, CachedEnrichment>;
}

async function main() {
  const args = process.argv.slice(2);
  const slugFilter = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const missingOnly = args.includes("--missing-only");
  const revalidate = args.includes("--revalidate");

  const cache = loadCache();
  let hotels = ALL_HOTELS.filter((h) => h.isActive !== false);
  if (slugFilter) hotels = hotels.filter((h) => h.slug === slugFilter);

  if (missingOnly) {
    hotels = hotels.filter((h) => cache[h.slug]?.priceSource !== "scraped");
  }

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`Scraping prices for ${hotels.length} hotels...`);

  for (let i = 0; i < hotels.length; i++) {
    const hotel = hotels[i];
    const prev = cache[hotel.slug];

    if (!revalidate && prev?.priceSource === "scraped" && prev.avgBasePrice) {
      const revalidated = validateScrapedPriceCny(
        prev.avgBasePrice,
        hotel.brandSlug,
        hotel.countryCode
      );
      if (revalidated != null) {
        skipped++;
        continue;
      }
      console.log(`  [fix] ${hotel.slug}: invalid cached price ¥${prev.avgBasePrice}`);
    }

    const result = await scrapePriceForHotel(hotel);
    if (result?.priceSource === "scraped") {
      cache[hotel.slug] = { ...prev, ...result };
      updated++;
      console.log(`  [${i + 1}/${hotels.length}] ${hotel.slug}: ¥${result.avgBasePrice}`);
    } else {
      if (prev?.priceSource === "scraped" && !revalidate) {
        const fixed = prev.avgBasePrice
          ? validateScrapedPriceCny(prev.avgBasePrice, hotel.brandSlug, hotel.countryCode)
          : null;
        if (fixed == null) {
          const { avgBasePrice: _a, avgSuitePrice: _s, priceSource: _p, ...rest } = prev;
          cache[hotel.slug] = rest;
          console.log(`  [drop] ${hotel.slug}: removed invalid price`);
          updated++;
        } else if (fixed !== prev.avgBasePrice) {
          cache[hotel.slug] = {
            ...prev,
            avgBasePrice: fixed,
            avgSuitePrice: suiteFromBase(hotel, fixed),
          };
          console.log(`  [fix] ${hotel.slug}: ¥${prev.avgBasePrice} → ¥${fixed}`);
          updated++;
        } else {
          failed++;
        }
      } else {
        failed++;
      }
    }

    if (i < hotels.length - 1) await sleep(DELAY_MS);
  }

  writeFileSync(OUT_PATH, JSON.stringify(cache, null, 2) + "\n");
  console.log(`Done. updated=${updated} skipped=${skipped} no-price=${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});