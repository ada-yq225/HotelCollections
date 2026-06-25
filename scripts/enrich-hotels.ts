/**
 * Batch-fetch hotel intros, images & reference prices from official websites.
 * Output: src/data/hotel-enrichment.json (consumed by seed)
 */
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { resolveOfficialUrl } from "../src/lib/hotel-official-url";
import { enrichHotelFromWeb } from "../src/lib/hotel-enrichment";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";

const OUT_PATH = join(__dirname, "../src/data/hotel-enrichment.json");
const DELAY_MS = 600;

type CachedEnrichment = {
  websiteUrl: string;
  description?: string;
  descriptionZh?: string;
  heroImage?: string;
  galleryImages?: string[];
  avgBasePrice?: number;
  avgSuitePrice?: number;
  priceSource?: "scraped" | "estimated";
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function hasValidImage(entry?: CachedEnrichment): boolean {
  if (!entry) return false;
  if (entry.heroImage && !isBadImageUrl(entry.heroImage)) return true;
  return (entry.galleryImages ?? []).some((u) => !isBadImageUrl(u));
}

function mergeEnrichment(
  prev: CachedEnrichment | undefined,
  result: CachedEnrichment | null,
  websiteUrl: string
): CachedEnrichment {
  if (!result) return prev ?? { websiteUrl };
  return {
    websiteUrl: result.websiteUrl || websiteUrl,
    description: result.description ?? prev?.description,
    descriptionZh: result.descriptionZh ?? prev?.descriptionZh,
    heroImage: result.heroImage ?? prev?.heroImage,
    galleryImages:
      result.galleryImages && result.galleryImages.length > 0
        ? result.galleryImages
        : prev?.galleryImages,
    avgBasePrice: result.avgBasePrice ?? prev?.avgBasePrice,
    avgSuitePrice: result.avgSuitePrice ?? prev?.avgSuitePrice,
    priceSource: result.priceSource ?? prev?.priceSource,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const brandArg = args.find((a) => a.startsWith("--brand="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;
  const brandFilter = brandArg?.split("=")[1];
  const force = args.includes("--force");
  const imagesOnly = args.includes("--images-only") || args.includes("--retry-bad");

  let existing: Record<string, CachedEnrichment> = {};
  if (existsSync(OUT_PATH)) {
    existing = JSON.parse(readFileSync(OUT_PATH, "utf-8")) as Record<string, CachedEnrichment>;
  }

  let hotels = ALL_HOTELS.filter((h) => h.isActive !== false);
  if (brandFilter) hotels = hotels.filter((h) => h.brandSlug === brandFilter);

  let processed = 0;
  let enriched = 0;

  for (const hotel of hotels) {
    if (processed >= limit) break;

    const prev = existing[hotel.slug];
    if (!force) {
      if (imagesOnly) {
        if (hasValidImage(prev)) continue;
      } else if (prev?.description && hasValidImage(prev) && prev?.avgBasePrice) {
        continue;
      }
    }

    const websiteUrl = hotel.websiteUrl ?? resolveOfficialUrl({
      slug: hotel.slug,
      brandSlug: hotel.brandSlug,
      name: hotel.name,
      city: hotel.city,
      countryCode: hotel.countryCode,
      country: hotel.country,
    });
    if (!websiteUrl) continue;

    process.stdout.write(`  ${hotel.slug} ... `);
    const result = await enrichHotelFromWeb({ ...hotel, websiteUrl });

    const merged = mergeEnrichment(
      prev,
      result
        ? {
            websiteUrl: result.websiteUrl,
            description: result.description,
            descriptionZh: result.descriptionZh,
            heroImage: result.heroImage,
            galleryImages: result.galleryImages,
            avgBasePrice: result.avgBasePrice,
            avgSuitePrice: result.avgSuitePrice,
            priceSource: result.priceSource,
          }
        : null,
      websiteUrl
    );

    existing[hotel.slug] = merged;

    if (result?.heroImage || result?.avgBasePrice) {
      enriched++;
      const parts = [];
      if (result.heroImage) parts.push("img");
      if (result.avgBasePrice) parts.push(`¥${result.avgBasePrice}`);
      console.log(parts.join("+") || "ok");
    } else if (hasValidImage(merged)) {
      console.log("kept cache");
    } else {
      console.log("skip");
    }

    processed++;
    await sleep(DELAY_MS);
  }

  writeFileSync(OUT_PATH, JSON.stringify(existing, null, 2), "utf-8");
  console.log(`\nDone: ${enriched} enriched, ${processed} processed → ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});