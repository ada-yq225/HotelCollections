import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { validateScrapedPriceCny } from "../src/lib/hotel-price-scrape";

const path = join(__dirname, "../src/data/hotel-enrichment.json");
const cache = JSON.parse(readFileSync(path, "utf-8")) as Record<
  string,
  { avgBasePrice?: number; avgSuitePrice?: number; priceSource?: string }
>;
const bySlug = Object.fromEntries(ALL_HOTELS.map((h) => [h.slug, h]));

let fixed = 0;
let dropped = 0;

for (const [slug, entry] of Object.entries(cache)) {
  if (entry.priceSource !== "scraped" || !entry.avgBasePrice) continue;
  const hotel = bySlug[slug];
  if (!hotel) continue;

  const v = validateScrapedPriceCny(entry.avgBasePrice, hotel.brandSlug, hotel.countryCode);
  if (v == null) {
    delete entry.avgBasePrice;
    delete entry.avgSuitePrice;
    delete entry.priceSource;
    dropped++;
    console.log(`drop ${slug}: was ¥${entry.avgBasePrice}`);
    continue;
  }
  if (v !== entry.avgBasePrice) {
    const isMaldives = hotel.region === "maldives" || hotel.slug.includes("maldives");
    console.log(`fix ${slug}: ¥${entry.avgBasePrice} → ¥${v}`);
    entry.avgBasePrice = v;
    entry.avgSuitePrice = Math.round(v * (isMaldives ? 3.5 : 2.2));
    fixed++;
  }
}

writeFileSync(path, JSON.stringify(cache, null, 2) + "\n");
console.log(`Done: fixed=${fixed} dropped=${dropped}`);