import { ALL_HOTELS } from "../src/data/hotels";

const UA = "Mozilla/5.0 Chrome/122";

async function check(slug: string, url: string) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
  const html = await res.text();
  const og =
    html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
  const generic = og?.includes("gvarz") || og?.includes("rc-club-ap") || og?.includes("lifestyle-25");
  console.log(res.status, slug.slice(0, 35).padEnd(36), generic ? "GENERIC" : "OK", og?.slice(50, 95) ?? "no og");
}

async function main() {
  const rc = ALL_HOTELS.filter((h) => h.brandSlug === "ritz-carlton").slice(0, 15);
  for (const h of rc) {
    const path = h.slug.replace(/^ritz-carlton-/, "");
    await check(h.slug, `https://www.ritzcarlton.com/en/hotels/${path}`);
    await new Promise((r) => setTimeout(r, 800));
  }
}
main();