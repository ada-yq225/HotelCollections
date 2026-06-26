/**
 * Fill missing descriptionZh for non-China hotels via machine translation.
 *
 * Usage:
 *   npm run hotels:translate-descriptions
 *   npm run hotels:translate-descriptions -- --slug=four-seasons-paris
 *   npm run hotels:translate-descriptions -- --force
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { ACTIVE_HOTELS } from "../src/data/hotels";
import { isGreaterChinaHotel } from "../src/lib/hotel-media-cache";
import { translateEnToZh } from "../src/lib/translate-text";

const OUT = join(__dirname, "../src/data/hotel-enrichment.json");
const DELAY_MS = 500;

type Cache = Record<string, { description?: string; descriptionZh?: string; [k: string]: unknown }>;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const slugFilter = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

  const cache: Cache = existsSync(OUT)
    ? (JSON.parse(readFileSync(OUT, "utf-8")) as Cache)
    : {};

  let targets = ACTIVE_HOTELS.filter((h) => !isGreaterChinaHotel(h.countryCode));
  if (slugFilter) targets = targets.filter((h) => h.slug === slugFilter);

  if (!force) {
    targets = targets.filter((h) => {
      const entry = cache[h.slug];
      return entry?.description && !entry.descriptionZh;
    });
  } else {
    targets = targets.filter((h) => cache[h.slug]?.description);
  }

  console.log(`翻译酒店介绍: ${targets.length} 家`);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < targets.length; i++) {
    const hotel = targets[i];
    const entry = cache[hotel.slug];
    const source = entry?.description ?? hotel.description;
    if (!source) continue;

    console.log(`  [${i + 1}/${targets.length}] ${hotel.slug}`);
    const translated = await translateEnToZh(source);
    if (translated) {
      cache[hotel.slug] = { ...entry, descriptionZh: translated };
      ok++;
      console.log(`    ✓ ${translated.slice(0, 48)}…`);
    } else {
      fail++;
      console.log("    ✗ 翻译失败");
    }

    if (i < targets.length - 1) await sleep(DELAY_MS);
  }

  writeFileSync(OUT, JSON.stringify(cache, null, 2) + "\n");
  console.log(`\n完成: 成功 ${ok} · 失败 ${fail}`);
  console.log("运行 npm run db:seed 同步到数据库");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});