/**
 * Discover official hotel URLs via DuckDuckGo site: search.
 * Output: src/data/hotel-url-discovered.json
 */
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { resolveOfficialUrl } from "../src/lib/hotel-official-url";

const OUT = join(__dirname, "../src/data/hotel-url-discovered.json");
const DELAY = 1200;

const BRAND_DOMAINS: Record<string, string[]> = {
  "park-hyatt": ["hyatt.com"],
  andaz: ["hyatt.com"],
  alila: ["hyatt.com"],
  intercontinental: ["ihg.com"],
  regent: ["ihg.com"],
  "six-senses": ["sixsenses.com"],
  "st-regis": ["marriott.com"],
  "jw-marriott": ["marriott.com"],
  "w-hotels": ["marriott.com"],
  edition: ["marriott.com"],
  "luxury-collection": ["marriott.com", "marriott.com"],
  "ritz-carlton": ["ritzcarlton.com"],
  "ritz-carlton-reserve": ["ritzcarlton.com", "marriott.com"],
  "waldorf-astoria": ["hilton.com", "waldorfastoria.com"],
  conrad: ["hilton.com", "conradhotels.com"],
  lxr: ["lxrhotels.com", "hilton.com"],
  fairmont: ["fairmont.com"],
  raffles: ["raffles.com"],
  "sofitel-legend": ["sofitel-legend.com", "sofitel.com"],
  "banyan-tree": ["banyantree.com"],
  "shangri-la": ["shangri-la.com"],
  peninsula: ["peninsula.com"],
  capella: ["capellahotels.com"],
  belmond: ["belmond.com"],
  anantara: ["anantara.com"],
  oberoi: ["oberoihotels.com"],
  "one-and-only": ["oneandonlyresorts.com"],
  kempinski: ["kempinski.com"],
  vignette: ["bulgarihotels.com", "thehousecollective.com", "niccolohotels.com", "upperhouse.com"],
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
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

function pickBestUrl(urls: string[], domains: string[], slug: string): string | null {
  const scored = urls
    .filter((u) => domains.some((d) => u.includes(d)))
    .map((u) => {
      let score = 0;
      const lower = u.toLowerCase();
      if (lower.includes("/hotels/") || lower.includes("/hotel/")) score += 3;
      if (lower.includes("/overview")) score += 2;
      if (lower.includes(slug.replace(/-/g, ""))) score += 2;
      const slugTail = slug.split("-").slice(-2).join("-");
      if (lower.includes(slugTail)) score += 1;
      if (lower.includes("search")) score -= 5;
      return { u, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.u ?? null;
}

async function main() {
  const args = process.argv.slice(2);
  const limit = args.find((a) => a.startsWith("--limit="))
    ? parseInt(args.find((a) => a.startsWith("--limit="))!.split("=")[1], 10)
    : Infinity;
  const brandFilter = args.find((a) => a.startsWith("--brand="))?.split("=")[1];

  let existing: Record<string, string> = {};
  if (existsSync(OUT)) {
    existing = JSON.parse(readFileSync(OUT, "utf8"));
  }

  let hotels = ALL_HOTELS.filter((h) => h.isActive !== false);
  if (brandFilter) hotels = hotels.filter((h) => h.brandSlug === brandFilter);

  let n = 0;
  for (const h of hotels) {
    if (n >= limit) break;
    if (existing[h.slug] || h.websiteUrl || resolveOfficialUrl(h)) continue;

    const domains = BRAND_DOMAINS[h.brandSlug];
    if (!domains) continue;

    const query = `site:${domains[0]} "${h.name}"`;
    process.stdout.write(`${h.slug} ... `);
    const results = await ddgSearch(query);
    const picked = pickBestUrl(results, domains, h.slug);
    if (picked) {
      existing[h.slug] = picked;
      console.log(picked.slice(0, 70));
    } else {
      console.log("miss");
    }
    n++;
    await sleep(DELAY);
  }

  writeFileSync(OUT, JSON.stringify(existing, null, 2));
  console.log(`\nSaved ${Object.keys(existing).length} URLs → ${OUT}`);
}

main().catch(console.error);