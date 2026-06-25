/**
 * Downloads real brand logos into public/brands/{slug}.svg|.png
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/brands");

/** slug → Wikipedia article title (for logo via pageimages) or direct URL */
const BRAND_SOURCES = {
  "st-regis": { url: "https://upload.wikimedia.org/wikipedia/commons/d/dc/St._Regis_Hotels_%26_Resorts_logo.svg" },
  "ritz-carlton": { wiki: "The Ritz-Carlton Hotel Company" },
  "jw-marriott": { wiki: "JW Marriott" },
  "luxury-collection": { wiki: "The Luxury Collection" },
  "w-hotels": { wiki: "W Hotels" },
  edition: { wiki: "EDITION Hotels" },
  "park-hyatt": { wiki: "Park Hyatt" },
  andaz: { wiki: "Andaz (hotel)" },
  alila: { url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Alila_Hotels_and_Resorts_logo.svg" },
  miraval: { domain: "miravalresorts.com" },
  "six-senses": { wiki: "Six Senses Hotels Resorts Spas" },
  intercontinental: { wiki: "InterContinental" },
  regent: { wiki: "Regent Hotels & Resorts" },
  vignette: { domain: "ihg.com" },
  "waldorf-astoria": { wiki: "Waldorf Astoria Hotels and Resorts" },
  conrad: { url: "https://upload.wikimedia.org/wikipedia/commons/1/12/ConradHotelsLogo.svg" },
  lxr: { domain: "lxrhotels.com" },
  raffles: { wiki: "Raffles Hotels & Resorts" },
  fairmont: { wiki: "Fairmont Hotels and Resorts" },
  "sofitel-legend": { wiki: "Sofitel" },
  "banyan-tree": { wiki: "Banyan Tree Holdings" },
  "four-seasons": { wiki: "Four Seasons Hotels and Resorts" },
  "mandarin-oriental": { wiki: "Mandarin Oriental Hotel Group" },
  "cheval-blanc": { wiki: "Cheval Blanc (hotel)" },
  rosewood: { wiki: "Rosewood Hotels & Resorts" },
  aman: { url: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Aman_Resorts_logo.svg" },
  peninsula: { wiki: "The Peninsula Hotels" },
  belmond: { wiki: "Belmond Limited" },
  oberoi: { wiki: "The Oberoi Group" },
  "shangri-la": { wiki: "Shangri-La Hotels and Resorts" },
  capella: { wiki: "Capella Hotel Group" },
  "one-and-only": { wiki: "One&Only Resorts" },
  como: { wiki: "COMO Hotels and Resorts" },
  patina: { domain: "patinahotels.com" },
  soneva: { wiki: "Soneva" },
  joali: { domain: "joali.com" },
  anantara: { wiki: "Anantara Hotels, Resorts & Spas" },
  baglioni: { domain: "baglionihotels.com" },
  gili: { domain: "gili-lankanfushi.com" },
  huvafen: { domain: "huvafenfushi.com" },
  velaa: { domain: "velaaprivateisland.com" },
  niyama: { domain: "niyama.com" },
  nautilus: { domain: "thenautilusmaldives.com" },
  "crown-champa": { domain: "crownandchamparesorts.com" },
  milaidhoo: { domain: "milaidhoo.com" },
  baros: { domain: "baros.com" },
  vakkaru: { domain: "vakkarumaldives.com" },
  amilla: { domain: "amilla.mv" },
  ayada: { domain: "ayadamaldives.com" },
  "the-brando": { domain: "thebrando.com" },
  "le-tahaa": { domain: "letahaa.com" },
  singita: { domain: "singita.com" },
  "north-island": { domain: "north-island.com" },
  qualia: { domain: "qualia.com.au" },
  likuliku: { domain: "likulikulagoon.com" },
  "the-datai": { domain: "thedatai.com" },
  kempinski: { wiki: "Kempinski" },
  "ritz-carlton-reserve": { domain: "ritzcarlton.com" },
};

const GROUP_SOURCES = {
  marriott: { wiki: "Marriott International" },
  hyatt: { url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Hyatt_Logo.svg" },
  ihg: { wiki: "IHG Hotels & Resorts" },
  hilton: { wiki: "Hilton Worldwide" },
  accor: { wiki: "Accor" },
  "four-seasons": { wiki: "Four Seasons Hotels and Resorts" },
  "mandarin-oriental": { wiki: "Mandarin Oriental Hotel Group" },
  "cheval-blanc": { wiki: "Cheval Blanc (hotel)" },
};

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "HotelCollections/1.0" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) return null;
  return res.json();
}

async function getWikiLogoUrl(title) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&piprop=original`;
  const data = await fetchJson(api);
  if (!data) return null;
  const pages = data.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  return page?.original?.source ?? null;
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "HotelCollections/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 300) return false;
  fs.writeFileSync(dest, buf);
  return true;
}

function extFromContentType(ct, url) {
  if (ct?.includes("svg") || url.endsWith(".svg")) return ".svg";
  return ".png";
}

async function resolveSource(source) {
  if (source.url) return source.url;
  if (source.wiki) return getWikiLogoUrl(source.wiki);
  if (source.domain) return `https://logo.clearbit.com/${source.domain}`;
  return null;
}

async function fetchOne(slug, source) {
  const url = await resolveSource(source);
  if (!url) return false;

  const ext =
    source.domain && !url.includes("wikimedia")
      ? ".png"
      : url.includes(".svg")
        ? ".svg"
        : ".png";
  const dest = path.join(OUT_DIR, `${slug}${ext}`);

  return download(url, dest);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  let fail = 0;

  const all = { ...BRAND_SOURCES, ...GROUP_SOURCES };

  for (const [slug, source] of Object.entries(all)) {
    process.stdout.write(`${slug}... `);
    try {
      if (await fetchOne(slug, source)) {
        console.log("OK");
        ok++;
      } else {
        console.log("FAIL");
        fail++;
      }
    } catch (e) {
      console.log(`FAIL (${e.message})`);
      fail++;
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone: ${ok} saved, ${fail} failed`);
}

main().catch(console.error);