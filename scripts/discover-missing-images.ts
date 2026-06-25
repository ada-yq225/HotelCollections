/**
 * Discover official URLs for hotels still missing cover images.
 */
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { resolveOfficialUrl } from "../src/lib/hotel-official-url";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";

const OUT = join(__dirname, "../src/data/hotel-url-discovered.json");
const CACHE = join(__dirname, "../src/data/hotel-enrichment.json");
const DELAY = 1100;

const DOMAIN_HINTS: Record<string, string> = {
  "ritz-carlton": "ritzcarlton.com",
  "ritz-carlton-reserve": "ritzcarlton.com",
  "st-regis": "marriott.com",
  "jw-marriott": "marriott.com",
  "w-hotels": "marriott.com",
  edition: "marriott.com",
  "luxury-collection": "marriott.com",
  "park-hyatt": "hyatt.com",
  andaz: "hyatt.com",
  alila: "hyatt.com",
  intercontinental: "ihg.com",
  regent: "ihg.com",
  "waldorf-astoria": "hilton.com",
  conrad: "hilton.com",
  lxr: "hilton.com",
  fairmont: "fairmont.com",
  peninsula: "peninsula.com",
  "shangri-la": "shangri-la.com",
  capella: "capellahotels.com",
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

async function ddgSearch(query: string): Promise<string[]> {
  const body = new URLSearchParams({ q: query });
  const res = await fetch("https://html.duckduckgo.com/html/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122",
    },
    body: body.toString(),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return [];
  const html = await res.text();
  const urls: string[] = [];
  for (const m of html.matchAll(/uddg=([^&"']+)/g)) {
    try {
      const decoded = decodeURIComponent(m[1]);
      if (decoded.startsWith("http")) urls.push(decoded.split("&")[0]);
    } catch {
      /* skip */
    }
  }
  return [...new Set(urls)];
}

function pickUrl(urls: string[], domain: string, slug: string): string | null {
  const ranked = urls
    .filter((u) => u.includes(domain))
    .map((u) => {
      let score = 0;
      const l = u.toLowerCase();
      if (l.includes("/hotels/") || l.includes("/hotel/")) score += 4;
      if (l.includes("/overview")) score += 2;
      if (l.includes(slug)) score += 3;
      if (l.includes("search")) score -= 6;
      return { u, score };
    })
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.u ?? null;
}

async function main() {
  const cache = existsSync(CACHE)
    ? (JSON.parse(readFileSync(CACHE, "utf8")) as Record<string, { heroImage?: string; galleryImages?: string[] }>)
    : {};
  let discovered: Record<string, string> = existsSync(OUT)
    ? (JSON.parse(readFileSync(OUT, "utf8")) as Record<string, string>)
    : {};

  const targets = ALL_HOTELS.filter(
    (h) => h.isActive !== false && !hasImage(h.slug, cache) && DOMAIN_HINTS[h.brandSlug]
  );

  console.log(`Discovering URLs for ${targets.length} hotels without images...`);

  for (const h of targets) {
    if (discovered[h.slug]) continue;
    const domain = DOMAIN_HINTS[h.brandSlug];
    const query = `site:${domain} "${h.name}"`;
    process.stdout.write(`${h.slug} ... `);
    const results = await ddgSearch(query);
    const picked = pickUrl(results, domain, h.slug);
    if (picked && picked !== resolveOfficialUrl(h)) {
      discovered[h.slug] = picked;
      console.log(picked.slice(0, 72));
    } else {
      console.log("—");
    }
    await sleep(DELAY);
  }

  writeFileSync(OUT, JSON.stringify(discovered, null, 2));
  console.log(`\nSaved ${Object.keys(discovered).length} discovered URLs`);
}

main().catch(console.error);