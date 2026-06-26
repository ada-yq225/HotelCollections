/**
 * Discover official hotel URLs via Bing search (DDG often blocked).
 * Output: src/data/hotel-url-discovered.json
 */
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { resolveOfficialUrl } from "../src/lib/hotel-official-url";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";

const OUT = join(__dirname, "../src/data/hotel-url-discovered.json");
const CACHE = join(__dirname, "../src/data/hotel-enrichment.json");
const DELAY = 1400;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122";

const BRAND_DOMAINS: Record<string, string[]> = {
  "park-hyatt": ["hyatt.com"],
  andaz: ["hyatt.com"],
  alila: ["hyatt.com"],
  intercontinental: ["ihg.com"],
  regent: ["ihg.com"],
  "st-regis": ["marriott.com"],
  "jw-marriott": ["marriott.com"],
  "w-hotels": ["marriott.com"],
  edition: ["marriott.com"],
  "luxury-collection": ["marriott.com"],
  "waldorf-astoria": ["hilton.com"],
  conrad: ["hilton.com"],
  lxr: ["hilton.com"],
  peninsula: ["peninsula.com"],
  "shangri-la": ["shangri-la.com"],
  capella: ["capellahotels.com"],
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function hasImage(slug: string, cache: Record<string, { heroImage?: string; galleryImages?: string[] }>): boolean {
  const e = cache[slug];
  if (!e) return false;
  if (e.heroImage && !isBadImageUrl(e.heroImage)) return true;
  return (e.galleryImages ?? []).some((u) => !isBadImageUrl(u));
}

async function bingSearch(query: string): Promise<string[]> {
  try {
    const res = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return [];
    const html = await res.text();
    const urls: string[] = [];
    for (const m of html.matchAll(/href="(https?:\/\/[^"]+)"/gi)) {
      const u = m[1].replace(/&amp;/g, "&");
      if (!u.includes("bing.com") && !u.includes("microsoft.com") && !u.includes("javascript:")) {
        urls.push(u.split("&")[0]);
      }
    }
    for (const m of html.matchAll(/<cite[^>]*>([^<]+)<\/cite>/gi)) {
      const cite = m[1].replace(/<[^>]+>/g, "").trim();
      const clean = cite.replace(/\s*›\s*/g, "/").replace(/\s+/g, "");
      if (clean.includes(".com") || clean.includes(".cn")) {
        const u = clean.startsWith("http") ? clean : `https://${clean}`;
        urls.push(u);
      }
    }
    return [...new Set(urls)];
  } catch {
    return [];
  }
}

function pickUrl(
  urls: string[],
  domains: string[],
  slug: string,
  name: string,
  city: string
): string | null {
  const slugTokens = slug.split("-").filter((t) => t.length > 2);
  const nameTokens = name.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
  const cityToken = city.toLowerCase().replace(/\s+/g, "");

  const ranked = urls
    .filter((u) => domains.some((d) => u.includes(d)))
    .map((u) => {
      let score = 0;
      const l = u.toLowerCase();
      if (l.includes("/hotels/") || l.includes("/hotel/") || l.includes("/overview")) score += 4;
      if (l.includes("hoteldetail")) score += 3;
      for (const t of slugTokens) {
        if (l.includes(t)) score += 2;
      }
      for (const t of nameTokens) {
        if (l.includes(t)) score += 3;
      }
      if (cityToken && l.includes(cityToken.slice(0, 4))) score += 2;
      if (l.includes("booking.com") || l.includes("trip.com") || l.includes(".cn/")) score -= 10;
      if (l.includes("search") || l.includes("login")) score -= 8;
      return { u, score };
    })
    .filter((x) => x.score >= 5)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.u ?? null;
}

async function main() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const brandArg = process.argv.find((a) => a.startsWith("--brand="))?.split("=")[1];
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

  const cache = existsSync(CACHE)
    ? (JSON.parse(readFileSync(CACHE, "utf8")) as Record<string, { heroImage?: string; galleryImages?: string[] }>)
    : {};

  let discovered: Record<string, string> = existsSync(OUT)
    ? (JSON.parse(readFileSync(OUT, "utf8")) as Record<string, string>)
    : {};

  let targets = ALL_HOTELS.filter(
    (h) => h.isActive !== false && !hasImage(h.slug, cache) && BRAND_DOMAINS[h.brandSlug]
  );
  if (brandArg) targets = targets.filter((h) => h.brandSlug === brandArg);

  console.log(`Bing discover: ${targets.length} hotels without images`);

  let n = 0;
  for (const h of targets) {
    if (n >= limit) break;
    if (discovered[h.slug]) continue;

    const domains = BRAND_DOMAINS[h.brandSlug];
    const query = `site:${domains[0]} "${h.name}" ${h.city}`;
    process.stdout.write(`${h.slug} ... `);
    const results = await bingSearch(query);
    const picked = pickUrl(results, domains, h.slug, h.name, h.city);
    const current = resolveOfficialUrl(h);
    if (picked && picked !== current) {
      discovered[h.slug] = picked;
      console.log(picked.slice(0, 72));
      n++;
    } else {
      console.log("—");
    }
    await sleep(DELAY);
  }

  writeFileSync(OUT, JSON.stringify(discovered, null, 2));
  console.log(`\nSaved ${Object.keys(discovered).length} URLs`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});