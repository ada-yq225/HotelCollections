/**
 * Download premium cabin images to public/flight-cabin/
 */
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { PREMIUM_CABIN_PRODUCTS } from "../src/data/flight-cabin-products";

const OUT_DIR = join(__dirname, "../public/flight-cabin");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

/** Verified Wikimedia Commons / press URLs (prefer upload.wikimedia.org) */
const CURATED_URLS: Record<string, string[]> = {
  "etihad-residence": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/A380_The_Residence_Apartment_Etihad_Airways_ITB2015_%281%29.JPG/1280px-A380_The_Residence_Apartment_Etihad_Airways_ITB2015_%281%29.JPG",
  ],
  "singapore-suites": [
    "https://upload.wikimedia.org/wikipedia/commons/7/70/Singapore_Airlines_old_suites.jpg",
  ],
  "emirates-first": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Emirates_A380_First_Class_Suite_ITB_2017_%281%29.JPG/1280px-Emirates_A380_First_Class_Suite_ITB_2017_%281%29.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/Emirates_First_Class_Suite.jpg",
  ],
  "cathay-first": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Cathay_Pacific_Aria_Suite_sample_at_Taikoo_Li_Sanlitun_West_%2820250428154203%29.jpg/1280px-Cathay_Pacific_Aria_Suite_sample_at_Taikoo_Li_Sanlitun_West_%2820250428154203%29.jpg",
  ],
  "air-france-premiere": [
    "https://upload.wikimedia.org/wikipedia/commons/4/44/AF_LEspace_Premiere_777_cabin.jpg",
  ],
  "ana-the-suite": [
    "https://upload.wikimedia.org/wikipedia/commons/0/07/ANA_Inspiration_of_Japan_-_First_Square.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8e/ANA_B777-300ER%E2%91%A0.JPG",
  ],
  "qatar-qsuite": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Qatar_Airways_Qsuite_Business_Class_ITB_2017_%2802%29.JPG/1280px-Qatar_Airways_Qsuite_Business_Class_ITB_2017_%2802%29.JPG",
  ],
};

const BING_QUERIES: Record<string, string[]> = {
  "etihad-residence": [
    "site:wikimedia.org Etihad The Residence A380",
    "Etihad Residence A380 suite interior",
  ],
  "singapore-suites": [
    "site:wikimedia.org Singapore Airlines Suites A380",
    "Singapore Airlines Suites Class A380",
  ],
  "emirates-first": [
    "site:wikimedia.org Emirates A380 first class suite",
    "Emirates first class A380 private suite",
  ],
  "cathay-first": [
    "site:wikimedia.org Cathay Pacific first class",
    "Cathay Pacific first class suite 777",
  ],
  "air-france-premiere": [
    "site:wikimedia.org Air France La Premiere",
    "Air France La Premiere cabin",
  ],
  "ana-the-suite": [
    "site:wikimedia.org ANA first class suite",
    "ANA The Suite 777 interior",
  ],
  "qatar-qsuite": [
    "site:wikimedia.org Qatar Airways Qsuite",
    "Qatar Airways Qsuite business class",
  ],
};

async function bingImage(query: string): Promise<string | null> {
  const res = await fetch(
    `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:photo-photo`,
    {
      headers: { "User-Agent": UA, Accept: "text/html", "Accept-Language": "en-US,en;q=0.9" },
      signal: AbortSignal.timeout(22000),
    }
  );
  if (!res.ok) return null;
  const html = await res.text();
  const urls: string[] = [];
  for (const m of html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&]+?)&quot;/g)) urls.push(m[1]);
  for (const m of html.matchAll(/"murl":"(https?:\/\/[^"]+)"/g)) urls.push(m[1]);
  const PREFERRED = [
    "etihad.com",
    "singaporeair.com",
    "emirates.com",
    "ekstatic",
    "cathaypacific.com",
    "airfrance",
    "ana.co.jp",
    "qatarairways.com",
    "wikimedia.org",
    "airline",
    "a380",
  ];
  const REJECT = [
    "gamerant", "twinkl", "popsugar", "bowinshipping", "ccaonline", "gfihvac",
    "wacowla", "360kuai", "zhimg.com/50", "xuexili", "uptt.com",
    "padlet.net", "qunarzz.com", "616pic.com", "ntimg.cn", "ttgchina",
    "londonmumsmagazine", "opengraph.jpg", "ifengimg.com", "etsystatic",
    "699pic.com", "iamaileen.com",
  ];

  const scored = urls
    .filter(
      (u) =>
        /\.(jpg|jpeg|webp)/i.test(u) &&
        !u.includes("logo") &&
        !REJECT.some((h) => u.toLowerCase().includes(h))
    )
    .map((u) => {
      const lower = u.toLowerCase();
      const pref = PREFERRED.findIndex((h) => lower.includes(h));
      return { u, score: pref >= 0 ? 50 - pref : 1 };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.u ?? null;
}

async function wikimediaThumb(search: string): Promise<string | null> {
  try {
    const api =
      "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
      `&gsrsearch=${encodeURIComponent(search)}&gsrlimit=8&prop=imageinfo` +
      "&iiprop=url&iiurlwidth=1280&format=json";
    const res = await fetch(api, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      query?: { pages?: Record<string, { imageinfo?: { thumburl?: string }[] }> };
    };
    for (const page of Object.values(data.query?.pages ?? {})) {
      const url = page.imageinfo?.[0]?.thumburl;
      if (url && /\.(jpg|jpeg|webp)/i.test(url)) return url;
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function download(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "image/*", Referer: url },
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 12000) return false;
    const head = buf.subarray(0, 3).toString("hex");
    if (head !== "ffd8ff" && !head.startsWith("89504e")) return false;
    writeFileSync(dest, buf);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const force = process.argv.includes("--force");
  mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  for (const product of PREMIUM_CABIN_PRODUCTS) {
    const dest = join(OUT_DIR, `${product.id}.jpg`);
    if (!force && existsSync(dest)) {
      console.log(`  skip ${product.id}`);
      ok++;
      continue;
    }
    let saved = false;

    for (const url of CURATED_URLS[product.id] ?? []) {
      if (await download(url, dest)) {
        ok++;
        saved = true;
        console.log(`    ✓ curated ${url.slice(0, 72)}...`);
        break;
      }
    }
    if (saved) continue;

    const wikiQuery = BING_QUERIES[product.id]?.[0]?.replace("site:wikimedia.org ", "") ?? product.name;
    const wikiUrl = await wikimediaThumb(wikiQuery);
    if (wikiUrl && (await download(wikiUrl, dest))) {
      ok++;
      saved = true;
      console.log(`    ✓ wikimedia ${wikiUrl.slice(0, 72)}...`);
    }
    if (saved) continue;

    const queries = BING_QUERIES[product.id] ?? [`${product.name} ${product.airlineIata} cabin`];
    let savedBing = false;
    for (const query of queries) {
      console.log(`  ${product.id} ← bing: ${query}`);
      const url = await bingImage(query);
      if (!url) continue;
      if (await download(url, dest)) {
        ok++;
        savedBing = true;
        console.log(`    ✓ ${url.slice(0, 72)}...`);
        break;
      }
    }
    if (!savedBing) console.log(`    ✗ no image`);
    await new Promise((r) => setTimeout(r, 600));
  }
  console.log(`\nDone: ${ok}/${PREMIUM_CABIN_PRODUCTS.length} images in public/flight-cabin/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});