/**
 * Batch-fetch hotel intros & images from official websites.
 * Output: src/data/hotel-enrichment.json (consumed by seed)
 *
 * Usage:
 *   npx tsx scripts/enrich-hotels.ts [--limit=50] [--brand=four-seasons]
 *   npx tsx scripts/enrich-hotels.ts --images-only   # retry entries missing heroImage
 *   npx tsx scripts/enrich-hotels.ts --force         # re-fetch all (within limit)
 */
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { resolveOfficialUrl } from "../src/lib/hotel-official-url";
import { enrichHotelFromWeb } from "../src/lib/hotel-enrichment";

const OUT_PATH = join(__dirname, "../src/data/hotel-enrichment.json");
const DELAY_MS = 800;

type CachedEnrichment = {
  websiteUrl: string;
  description?: string;
  descriptionZh?: string;
  heroImage?: string;
  galleryImages?: string[];
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
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
  };
}

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const brandArg = args.find((a) => a.startsWith("--brand="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;
  const brandFilter = brandArg?.split("=")[1];
  const force = args.includes("--force");
  const imagesOnly = args.includes("--images-only");

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
        if (prev?.heroImage) continue;
      } else if (prev?.description && prev?.heroImage) {
        continue;
      }
    }

    const websiteUrl = hotel.websiteUrl ?? resolveOfficialUrl(hotel);
    if (!websiteUrl) continue;

    process.stdout.write(`  ${hotel.slug} ... `);
    const result = await enrichHotelFromWeb({ ...hotel, websiteUrl });

    const merged = mergeEnrichment(prev, result ? {
      websiteUrl: result.websiteUrl,
      description: result.description,
      descriptionZh: result.descriptionZh,
      heroImage: result.heroImage,
      galleryImages: result.galleryImages,
    } : null, websiteUrl);

    existing[hotel.slug] = merged;

    if (result?.description || result?.heroImage) {
      enriched++;
      console.log(merged.heroImage ? "ok+img" : "ok");
    } else if (merged.heroImage || merged.description) {
      console.log("kept cache");
    } else {
      console.log("url only");
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