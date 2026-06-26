/**
 * Remove invalid / cluster bogus prices from hotel-enrichment.json
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { ACTIVE_HOTELS } from "../src/data/hotels";
import { validateScrapedPriceCny } from "../src/lib/hotel-price-scrape";

const OUT = join(__dirname, "../src/data/hotel-enrichment.json");
const bySlug = Object.fromEntries(ACTIVE_HOTELS.map((h) => [h.slug, h]));

type Cache = Record<
  string,
  { avgBasePrice?: number; priceSource?: string; avgSuitePrice?: number; [k: string]: unknown }
>;

const cache: Cache = existsSync(OUT)
  ? (JSON.parse(readFileSync(OUT, "utf-8")) as Cache)
  : {};

let removed = 0;
for (const [slug, entry] of Object.entries(cache)) {
  if (entry.priceSource !== "scraped" || entry.avgBasePrice == null) continue;
  const hotel = bySlug[slug];
  if (!hotel) continue;
  const ok = validateScrapedPriceCny(entry.avgBasePrice, hotel.brandSlug, hotel.countryCode);
  if (ok == null) {
    const { avgBasePrice: _a, avgSuitePrice: _s, priceSource: _p, priceScrapeSource: _ps, ...rest } =
      entry;
    cache[slug] = rest;
    removed++;
    console.log(`  drop ${slug}: ¥${entry.avgBasePrice}`);
  }
}

writeFileSync(OUT, JSON.stringify(cache, null, 2) + "\n");
console.log(`Removed ${removed} invalid prices`);