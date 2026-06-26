/**
 * Clean up search engine images from hotel-enrichment.json
 * Strategy: Only remove images with clear "stock photo" or "search engine" URL patterns.
 * Preserve all images from official hotel websites.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

// URL patterns that indicate stock photo / search engine results (NOT official hotel photos)
const SEARCH_ENGINE_PATTERNS = [
  // Chinese stock photo sites
  "699pic.com",
  "588ku.com",
  "nipic.com",
  "ooopic.com",
  "51miz.com",
  "tuchong.com",
  "zcool.com.cn",
  "huaban.com",
  "duitang.com",
  // General stock photo sites
  "shutterstock.com",
  "istockphoto.com",
  "gettyimages.com",
  "alamy.com",
  "dreamstime.com",
  "123rf.com",
  "depositphotos.com",
  "fotolia.com",
  "bigstockphoto.com",
  "stock.adobe.com",
  "vecteezy.com",
  "freepik.com",
  "pexels.com",
  "pixabay.com",
  "unsplash.com",
  // Social media / UGC (often misattributed)
  "pinimg.com",
  "pinterest.com",
  "instagram.com",
  "facebook.com",
  "flickr.com",
  "weibo.com",
  "xiaohongshu.com",
  "xhscdn.com",
  "douyin.com",
  "tiktok.com",
  // Generic CDN / placeholder
  "placeholder.com",
  "placehold.co",
  "via.placeholder",
  // Baidu image CDN
  "bdimg.com",
  "baidu.com",
  // Random image hosts often in search results
  "imgur.com",
  "tinypic.com",
  "photobucket.com",
  "imgbox.com",
  "postimg.cc",
  // Wikipedia (keep only upload.wikimedia.org, not other wiki domains)
  // "wikimedia.org" is kept - only remove non-wikimedia wiki images
  "wikipedia.org",
  "wikimedia.org",
  // Generic blog / news sites
  "wordpress.com",
  "blogspot.com",
  "tumblr.com",
  "medium.com",
  "sinaimg.cn",
  "sohu.com",
  "qq.com",
  "163.com",
  // Suspicious short URLs
  "bit.ly",
  "tinyurl.com",
  "ow.ly",
  "goo.gl",
  // Other known bad
  "seopic.699pic.com",
  "static.wixstatic.com",
  "lirp.cdn-website.com",
  "cdn-ilabmof.nitrocdn.com",
  "cdn-homdd.nitrocdn.com",
  "cdn-6386ba12c1ac189bf80f70f6.closte.com",
  "cdn.prod.website-files.com",
  "framerusercontent.com",
  "pub-29b0abba331044e6b4a8872c4e13f484.r2.dev",
  "bfldr.constancehotels.com",
  "images.ctfassets.net",
  "d1l3wviaauwkfu.cloudfront.net",
  "qualia.imgix.net",
  "wp.theroyalportfolio.com",
  "edge.sitecorecloud.io",
  // Misc file sharing
  "dropbox.com",
  "drive.google.com",
  "onedrive.live.com",
];

// OTA domains - could be hotel photos but not official, KEEP for now
// "c-ctrip.com", "ctrip.com", "fliggy.com", "meituan.com", "qunarzz.com", "qyer.com", "mafengwo.net"

function isSearchEngineImage(url: unknown): boolean {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("/hotel-media/")) return false; // local cache
  const lower = url.toLowerCase();
  return SEARCH_ENGINE_PATTERNS.some((p) => lower.includes(p));
}

const OUT = join(import.meta.dirname ?? __dirname, "../src/data/hotel-enrichment.json");
const data = JSON.parse(readFileSync(OUT, "utf-8")) as Record<string, Record<string, unknown>>;

let heroCleaned = 0;
let galleryRemoved = 0;
let restoredHeroes = 0;
let restoredGallery = 0;

for (const [slug, entry] of Object.entries(data)) {
  // Step 1: Restore previously cleaned heroImage if it wasn't a search engine image
  if (!entry.heroImage && entry._cleanedHero) {
    const oldHero = entry._cleanedHero as string;
    if (!isSearchEngineImage(oldHero)) {
      entry.heroImage = oldHero;
      restoredHeroes++;
    }
    delete entry._cleanedHero;
  }

  // Step 2: Clean current heroImage if it IS a search engine image
  const currentHero = entry.heroImage as string | undefined;
  if (currentHero && isSearchEngineImage(currentHero)) {
    entry._cleanedHero = currentHero;
    delete entry.heroImage;
    heroCleaned++;
  }

  // Step 3: Filter galleryImages to remove search engine images
  const gallery = (entry.galleryImages as string[]) ?? [];
  if (gallery.length > 0) {
    const before = gallery.length;
    const filtered = gallery.filter((url) => !isSearchEngineImage(url));
    if (filtered.length !== before) {
      entry.galleryImages = filtered;
      galleryRemoved += before - filtered.length;
    }
  }

  // Step 4: Remove bing source markers
  if (typeof entry.imageSource === "string" && entry.imageSource.startsWith("bing")) {
    delete entry.imageSource;
  }

  // Step 5: Remove galleryCleanedCount (temp field)
  delete entry.galleryCleanedCount;
  delete entry.heroImageCleaned;
}

writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
console.log(`Restored heroImages: ${restoredHeroes}`);
console.log(`Cleaned heroImages (search engine): ${heroCleaned}`);
console.log(`Removed gallery images (search engine): ${galleryRemoved}`);
console.log(`Total hotels: ${Object.keys(data).length}`);
