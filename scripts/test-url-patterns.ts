import { ALL_HOTELS } from "../src/data/hotels";

const SAMPLES = [
  "park-hyatt-tokyo",
  "andaz-tokyo",
  "intercontinental-singapore",
  "waldorf-astoria-bangkok",
  "conrad-bali",
  "w-bangkok",
  "jw-marriott-bangkok",
  "st-regis-singapore",
  "fairmont-singapore",
  "shangri-la-singapore",
  "raffles-singapore",
  "edition-barcelona",
];

async function probe(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122" },
      signal: AbortSignal.timeout(12000),
    });
    const final = res.url;
    const html = await res.text();
    const og = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
    return `${res.status} → ${final.slice(0, 80)} | og:${og?.slice(0, 60) ?? "none"}`;
  } catch (e) {
    return `ERR ${(e as Error).message}`;
  }
}

function hyattUrl(slug: string, countryCode: string, city: string): string {
  const country = ({
    JP: "japan", US: "united-states", GB: "united-kingdom", FR: "france",
    IT: "italy", DE: "germany", AU: "australia", SG: "singapore", TH: "thailand",
    KR: "south-korea", AE: "united-arab-emirates", CN: "china", HK: "hong-kong",
    ID: "indonesia", ES: "spain", AT: "austria", CH: "switzerland", NL: "netherlands",
    CR: "costa-rica", AR: "argentina", KN: "saint-kitts-and-nevis",
  } as Record<string, string>)[countryCode] ?? countryCode.toLowerCase();
  const citySlug = city.toLowerCase().replace(/[.\s]+/g, "-");
  return `https://www.hyatt.com/en-US/hotel/${country}/${citySlug}/${slug}`;
}

function ihgUrl(brand: string, city: string, slug: string): string {
  const citySlug = city.toLowerCase().replace(/\s+/g, "-");
  const tail = slug.replace(/^(intercontinental|regent|six-senses)-/, "");
  return `https://www.ihg.com/${brand}/hotels/us/en/${citySlug}/${slug.replace(/-/g, "")}-${brand}-${tail}`;
}

function marriottSearch(name: string): string {
  return `https://www.marriott.com/search/findHotels.mi?searchType=InCity&marriottBrands=MC&recordsPerPage=20&destinationAddress=${encodeURIComponent(name)}`;
}

async function main() {
  for (const slug of SAMPLES) {
    const h = ALL_HOTELS.find((x) => x.slug === slug);
    if (!h) continue;
    console.log(`\n=== ${slug} ===`);
    const urls: string[] = [];
    if (h.brandSlug === "park-hyatt" || h.brandSlug === "andaz" || h.brandSlug === "alila") {
      urls.push(hyattUrl(h.slug, h.countryCode, h.city));
      urls.push(`https://www.hyatt.com/${h.brandSlug}/en-US/${h.slug}`);
    }
    if (h.brandSlug === "intercontinental" || h.brandSlug === "regent") {
      urls.push(ihgUrl(h.brandSlug === "regent" ? "regent" : "intercontinental", h.city, h.slug));
      urls.push(`https://www.ihg.com/${h.brandSlug}/hotels/us/en/find-hotels/hotel-search?qDest=${encodeURIComponent(h.name)}`);
    }
    if (["st-regis", "w-hotels", "jw-marriott", "edition", "luxury-collection"].includes(h.brandSlug)) {
      urls.push(`https://www.marriott.com/en-us/hotels/search?query=${encodeURIComponent(h.name)}`);
      urls.push(marriottSearch(h.name));
    }
    if (h.brandSlug === "waldorf-astoria" || h.brandSlug === "conrad") {
      urls.push(`https://www.hilton.com/en/search/?query=${encodeURIComponent(h.name)}`);
      urls.push(`https://www.hilton.com/en/hotels/${h.slug}/`);
    }
    if (h.brandSlug === "fairmont") {
      const loc = h.slug.replace(/^fairmont-/, "");
      urls.push(`https://www.fairmont.com/${h.city.toLowerCase().replace(/\s+/g, "-")}/${loc}/`);
    }
    if (h.brandSlug === "shangri-la") {
      urls.push(`https://www.shangri-la.com/${h.city.toLowerCase().replace(/\s+/g, "-")}/${h.slug.replace(/^shangri-la-/, "")}/`);
    }
    if (h.brandSlug === "raffles") {
      urls.push(`https://www.raffles.com/${h.city.toLowerCase().replace(/\s+/g, "-")}/`);
    }
    for (const u of urls.slice(0, 3)) {
      console.log(`  ${u}`);
      console.log(`    ${await probe(u)}`);
      await new Promise((r) => setTimeout(r, 400));
    }
  }
}

main();