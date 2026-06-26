/**
 * Global hotel image enricher — Bing search + local cache (6 images/hotel).
 * Works in mainland China (no VPN). Updates hotel-enrichment.json.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";
import { resolveHotelMediaBundle } from "../src/lib/hotel-media-cache";

const OUT = join(__dirname, "../src/data/hotel-enrichment.json");
const TARGET_GALLERY = 6;
const DELAY_MS = 500;

type Cache = Record<
  string,
  { heroImage?: string; galleryImages?: string[]; imageSource?: string; [k: string]: unknown }
>;

function galleryCount(entry?: Cache[string]): number {
  if (!entry) return 0;
  const g = entry.galleryImages ?? [];
  const local = g.filter((u) => u.startsWith("/hotel-media/")).length;
  if (local > 0) return local;
  if (entry.heroImage?.startsWith("/hotel-media/")) return 1;
  return g.filter((u) => !isBadImageUrl(u)).length + (entry.heroImage && !isBadImageUrl(entry.heroImage) ? 1 : 0);
}

function needsEnrich(entry: Cache[string] | undefined, force: boolean): boolean {
  if (force) return true;
  if (!entry?.heroImage) return true;
  if (isBadImageUrl(entry.heroImage)) return true;
  const h = entry.heroImage;
  if (h.includes("rc-club-ap-lifestyle") || h.includes("gvarz") || h.includes("SBARZ")) return true;
  if (!h.startsWith("/hotel-media/") && galleryCount(entry) < TARGET_GALLERY) return true;
  if (h.startsWith("/hotel-media/") && galleryCount(entry) < TARGET_GALLERY) return true;
  return galleryCount(entry) < TARGET_GALLERY;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const slugFilter = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

  const cache: Cache = existsSync(OUT)
    ? (JSON.parse(readFileSync(OUT, "utf-8")) as Cache)
    : {};

  let hotels = ALL_HOTELS.filter((h) => h.isActive !== false);
  if (slugFilter) hotels = hotels.filter((h) => h.slug === slugFilter);
  else hotels = hotels.filter((h) => needsEnrich(cache[h.slug], force));

  console.log(`Image enrich: ${hotels.length} hotels → ${TARGET_GALLERY} images each`);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < hotels.length; i++) {
    const hotel = hotels[i];
    const bundle = await resolveHotelMediaBundle(hotel, TARGET_GALLERY);
    if (bundle && bundle.galleryImages.length > 0) {
      cache[hotel.slug] = {
        ...cache[hotel.slug],
        heroImage: bundle.heroImage,
        galleryImages: bundle.galleryImages,
        imageSource: bundle.source,
      };
      ok++;
      console.log(
        `  [${i + 1}/${hotels.length}] ${hotel.slug}: ${bundle.galleryImages.length} imgs`
      );
    } else {
      fail++;
      console.log(`  [${i + 1}/${hotels.length}] ${hotel.slug} — failed`);
    }
    if (i < hotels.length - 1) await sleep(DELAY_MS);
  }

  writeFileSync(OUT, JSON.stringify(cache, null, 2) + "\n");
  console.log(`Done: ok=${ok} fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});