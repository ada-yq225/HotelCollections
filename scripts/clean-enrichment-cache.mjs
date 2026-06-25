/**
 * Remove invalid hero/gallery URLs from hotel-enrichment.json
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../src/data/hotel-enrichment.json");

const BAD = [
  "FS_Header_Logo",
  "FS_Logo_Mobile",
  "/etc/designs/fourseasons/img/logos",
  "MHZoeVCBctQ7CntVRZ2z",
  "/logo",
  "brandmark",
  "favicon",
  "placeholder",
  "[object Object]",
];

function isBad(url) {
  if (!url || typeof url !== "string") return true;
  const lower = url.toLowerCase();
  if (lower.endsWith(".svg")) return true;
  return BAD.some((m) => lower.includes(m.toLowerCase()));
}

function cleanEntry(entry) {
  const gallery = (entry.galleryImages ?? []).filter((u) => !isBad(u));
  let hero = entry.heroImage && !isBad(entry.heroImage) ? entry.heroImage : undefined;
  if (!hero && gallery.length) hero = gallery[0];
  return { ...entry, heroImage: hero, galleryImages: gallery };
}

if (!existsSync(OUT)) {
  console.log("No enrichment cache found.");
  process.exit(0);
}

const data = JSON.parse(readFileSync(OUT, "utf-8"));
let fixed = 0;
for (const slug of Object.keys(data)) {
  const before = JSON.stringify(data[slug]);
  data[slug] = cleanEntry(data[slug]);
  if (JSON.stringify(data[slug]) !== before) fixed++;
}

writeFileSync(OUT, JSON.stringify(data, null, 2), "utf-8");
console.log(`Cleaned ${fixed} entries → ${OUT}`);