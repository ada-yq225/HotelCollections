/**
 * Scrape hotel images from URLs in src/data/hotel-official-urls-user.json
 *
 * Usage:
 *   npm run hotels:scrape-user-urls
 *   npm run hotels:scrape-user-urls -- --slug=ritz-carlton-beijing
 *   npm run hotels:scrape-user-urls -- --force
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { ALL_HOTELS } from "../src/data/hotels";
import { getUserOfficialUrlEntries } from "../src/lib/hotel-official-urls-user";
import { scrapeOfficialImagesForHotel } from "../src/lib/scrape-official-images";

const OUT = join(__dirname, "../src/data/hotel-enrichment.json");
const DELAY_MS = 800;

type Cache = Record<
  string,
  {
    websiteUrl?: string;
    heroImage?: string;
    galleryImages?: string[];
    description?: string;
    descriptionZh?: string;
    imageSource?: string;
    [k: string]: unknown;
  }
>;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const slugFilter = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

  const userUrls = getUserOfficialUrlEntries();
  const slugs = Object.keys(userUrls);

  if (slugs.length === 0) {
    console.log("未找到用户提交的官网地址。");
    console.log("请编辑: src/data/hotel-official-urls-user.json");
    console.log("示例:");
    console.log('  "ritz-carlton-beijing": "https://www.marriott.com/zh-cn/hotels/.../overview/"');
    return;
  }

  const bySlug = Object.fromEntries(ALL_HOTELS.map((h) => [h.slug, h]));
  const cache: Cache = existsSync(OUT)
    ? (JSON.parse(readFileSync(OUT, "utf-8")) as Cache)
    : {};

  let targets = slugs.filter((s) => bySlug[s]);
  if (slugFilter) targets = targets.filter((s) => s === slugFilter);

  const unknown = slugs.filter((s) => !bySlug[s]);
  if (unknown.length) {
    console.warn("以下 slug 在酒店库中不存在，已跳过:", unknown.join(", "));
  }

  if (!force) {
    targets = targets.filter((s) => cache[s]?.imageSource !== "user-official-url");
  }

  console.log(`用户官网抓取: ${targets.length} 家酒店`);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < targets.length; i++) {
    const slug = targets[i];
    const hotel = bySlug[slug];
    const entry = userUrls[slug];

    console.log(`  [${i + 1}/${targets.length}] ${slug}`);
    if (entry.note) console.log(`    备注: ${entry.note}`);

    const result = await scrapeOfficialImagesForHotel(hotel, entry.url, 6);
    if (result) {
      cache[slug] = {
        ...cache[slug],
        websiteUrl: result.websiteUrl,
        heroImage: result.heroImage,
        galleryImages: result.galleryImages,
        description: result.description ?? cache[slug]?.description,
        descriptionZh: result.descriptionZh ?? cache[slug]?.descriptionZh,
        imageSource: result.source,
      };
      ok++;
      console.log(
        `    ✓ ${result.galleryImages.length} 张图片 ← ${result.websiteUrl.slice(0, 72)}...`
      );
    } else {
      fail++;
      console.log(`    ✗ 未能从官网抓取到图片`);
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