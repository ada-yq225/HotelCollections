import { readFileSync } from "fs";
import { ALL_HOTELS } from "../src/data/hotels";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";

const cache = JSON.parse(readFileSync("src/data/hotel-enrichment.json", "utf8")) as Record<
  string,
  { heroImage?: string; galleryImages?: string[]; websiteUrl?: string; avgBasePrice?: number }
>;

const byBrand: Record<string, { ok: number; fail: number }> = {};
for (const h of ALL_HOTELS) {
  const e = cache[h.slug];
  if (!e) continue;
  const ok =
    (e.heroImage && !isBadImageUrl(e.heroImage)) ||
    (e.galleryImages ?? []).some((u) => !isBadImageUrl(u));
  if (!byBrand[h.brandSlug]) byBrand[h.brandSlug] = { ok: 0, fail: 0 };
  if (ok) byBrand[h.brandSlug].ok++;
  else byBrand[h.brandSlug].fail++;
}

console.log("By brand (ok):", Object.entries(byBrand).sort((a, b) => b[1].ok - a[1].ok).slice(0, 20));

let withHero = 0;
let withoutHero = 0;
for (const h of ALL_HOTELS.filter((x) => x.isActive !== false)) {
  const e = cache[h.slug];
  const ok =
    e &&
    ((e.heroImage && !isBadImageUrl(e.heroImage)) ||
      (e.galleryImages ?? []).some((u) => !isBadImageUrl(u)));
  if (ok) withHero++;
  else withoutHero++;
}
console.log("active hotels with image:", withHero, "without:", withoutHero);