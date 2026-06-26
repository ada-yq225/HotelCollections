import { readFileSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";

const cache = JSON.parse(
  readFileSync(join(__dirname, "../src/data/hotel-enrichment.json"), "utf-8")
) as Record<string, { heroImage?: string; galleryImages?: string[] }>;

const china = ALL_HOTELS.filter((h) =>
  ["CN", "HK", "MO", "TW"].includes(h.countryCode)
);

let withImg = 0;
let bad = 0;
let none = 0;

for (const h of china) {
  const e = cache[h.slug];
  const hero = e?.heroImage;
  const gallery = e?.galleryImages ?? [];
  const valid =
    (hero && !isBadImageUrl(hero)) ||
    gallery.some((u) => !isBadImageUrl(u));
  if (!e || (!hero && gallery.length === 0)) none++;
  else if (!valid) bad++;
  else withImg++;
}

console.log(`China hotels: ${china.length}, with image: ${withImg}, bad/generic: ${bad}, none: ${none}`);