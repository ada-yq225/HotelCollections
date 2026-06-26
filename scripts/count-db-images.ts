import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { ALL_HOTELS } from "../src/data/hotels";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";

const prisma = new PrismaClient();
const cache = JSON.parse(readFileSync("src/data/hotel-enrichment.json", "utf8")) as Record<
  string,
  { heroImage?: string; galleryImages?: string[]; avgBasePrice?: number }
>;

let cacheImg = 0;
let cachePrice = 0;
for (const h of ALL_HOTELS.filter((x) => x.isActive !== false)) {
  const e = cache[h.slug];
  if (!e) continue;
  const ok =
    (e.heroImage && !isBadImageUrl(e.heroImage)) ||
    (e.galleryImages ?? []).some((u) => !isBadImageUrl(u));
  if (ok) cacheImg++;
  if (e.avgBasePrice) cachePrice++;
}

const dbImg = await prisma.hotel.count({ where: { isActive: true, heroImage: { not: null } } });
const dbPrice = await prisma.hotel.count({ where: { isActive: true, avgBasePrice: { not: null } } });

console.log("cache images", cacheImg, "scraped prices", cachePrice);
console.log("db images", dbImg, "db prices", dbPrice);
await prisma.$disconnect();