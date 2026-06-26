/**
 * Fetch China hotel images via Bing (no VPN) and cache to public/hotel-media/.
 * Updates src/data/hotel-enrichment.json
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";
import { resolveHotelMediaBundle } from "../src/lib/hotel-media-cache";

const OUT = join(__dirname, "../src/data/hotel-enrichment.json");
const DELAY_MS = 700;

type Cache = Record<
  string,
  { heroImage?: string; galleryImages?: string[]; imageSource?: string; [k: string]: unknown }
>;

function hasValidImage(entry?: Cache[string]): boolean {
  if (!entry) return false;
  if (entry.heroImage?.startsWith("/hotel-media/")) return true;
  if (entry.heroImage && !isBadImageUrl(entry.heroImage)) return true;
  return (entry.galleryImages ?? []).some(
    (u) => u.startsWith("/hotel-media/") || !isBadImageUrl(u)
  );
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

  let hotels = ALL_HOTELS.filter(
    (h) => ["CN", "HK", "MO", "TW"].includes(h.countryCode) && h.isActive !== false
  );
  if (slugFilter) hotels = hotels.filter((h) => h.slug === slugFilter);
  if (!force) {
    hotels = hotels.filter((h) => {
      const e = cache[h.slug];
      if (!hasValidImage(e)) return true;
      const hero = e?.heroImage ?? "";
      return (
        isBadImageUrl(hero) ||
        hero.includes("rc-club-ap-lifestyle") ||
        hero.includes("gvarz") ||
        hero.includes("SBARZ")
      );
    });
  }

  console.log(`China image enrich: ${hotels.length} hotels`);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < hotels.length; i++) {
    const hotel = hotels[i];
    const result = await resolveHotelMediaBundle(hotel, 6);
    if (result) {
      cache[hotel.slug] = {
        ...cache[hotel.slug],
        heroImage: result.heroImage,
        galleryImages: result.galleryImages,
        imageSource: result.source,
        websiteUrl: cache[hotel.slug]?.websiteUrl,
      };
      ok++;
      console.log(`  [${i + 1}/${hotels.length}] ${hotel.slug} ← ${result.source}`);
    } else {
      fail++;
      console.log(`  [${i + 1}/${hotels.length}] ${hotel.slug} — no image`);
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