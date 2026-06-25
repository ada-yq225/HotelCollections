import { ALL_HOTELS } from "../src/data/hotels";
import { resolveOfficialUrl } from "../src/lib/hotel-official-url";
import { readFileSync, existsSync } from "fs";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";

const hotels = ALL_HOTELS.filter((h) => h.isActive !== false);
let withUrl = 0;
let resolved = 0;
let noUrl = 0;
const brandNoUrl: Record<string, number> = {};

for (const h of hotels) {
  const url = h.websiteUrl ?? resolveOfficialUrl(h);
  if (h.websiteUrl) withUrl++;
  else if (url) resolved++;
  else {
    noUrl++;
    brandNoUrl[h.brandSlug] = (brandNoUrl[h.brandSlug] || 0) + 1;
  }
}

console.log("total", hotels.length, "static url", withUrl, "resolved", resolved, "no url", noUrl);
console.log(
  "top no-url brands:",
  Object.entries(brandNoUrl)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
);

const cache = existsSync("src/data/hotel-enrichment.json")
  ? (JSON.parse(readFileSync("src/data/hotel-enrichment.json", "utf8")) as Record<
      string,
      { heroImage?: string; galleryImages?: string[]; avgBasePrice?: number }
    >)
  : {};

let validImg = 0;
let scrapedPrice = 0;
for (const entry of Object.values(cache)) {
  if (entry.heroImage && !isBadImageUrl(entry.heroImage)) validImg++;
  else if ((entry.galleryImages ?? []).some((u) => !isBadImageUrl(u))) validImg++;
  if (entry.avgBasePrice) scrapedPrice++;
}
console.log("cache entries", Object.keys(cache).length, "valid img", validImg, "scraped price", scrapedPrice);