import { isChineseLocaleUrl, toChineseLocaleUrl } from "@/lib/china-official-url";
import { resolveOfficialUrl, resolveOfficialUrlZh } from "@/lib/hotel-official-url";
import { resolveUrlCandidates } from "@/lib/hotel-url-candidates";
import { translateEnToZh } from "@/lib/translate-text";
import { fetchWikipediaHotelImage } from "@/lib/hotel-image-fallback";
import {
  absolutizeImageUrl,
  detectMarriottPropertyCode,
  filterGalleryImages,
  isBadImageUrl,
  pickBestImage,
} from "@/lib/hotel-cover-image";
import {
  extractScrapedBasePriceCny,
  validateScrapedPriceCny,
} from "@/lib/hotel-price-scrape";
import { isGreaterChinaHotel } from "@/lib/china-hotel-images";
import type { HotelEntry } from "@/data/hotels/types";

export type HotelEnrichment = {
  websiteUrl: string;
  description?: string;
  descriptionZh?: string;
  heroImage?: string;
  galleryImages: string[];
  avgBasePrice?: number;
  avgSuitePrice?: number;
  priceSource?: "scraped" | "estimated";
};

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
};

/** Headers optimised for Chinese hotel websites */
const FETCH_HEADERS_CN = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.5",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
};

const MARRIOTT_BRANDS = new Set([
  "ritz-carlton",
  "st-regis",
  "jw-marriott",
  "luxury-collection",
  "w-hotels",
  "edition",
  "ritz-carlton-reserve",
]);

const ACCOR_BRANDS = new Set(["fairmont", "raffles", "sofitel-legend"]);
const HYATT_BRANDS = new Set(["park-hyatt", "andaz", "alila"]);

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#xD;&#xA;/g, "\n")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMeta(html: string, name: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeHtmlEntities(m[1]);
  }
  return undefined;
}

function extractJsonLd(html: string): Record<string, unknown> | null {
  const blocks = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const block of blocks) {
    try {
      const raw = block[1].replace(/&#x2B;/g, "+");
      const data = JSON.parse(raw) as Record<string, unknown>;
      if (data["@type"] === "Hotel" || data.description || data.image) return data;
    } catch {
      /* skip */
    }
  }
  return null;
}

function extractMastheadDescription(html: string): string | undefined {
  const m = html.match(
    /<div class="masthead-description-text">\s*([\s\S]*?)\s*<\/div>/i
  );
  if (m?.[1]) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    if (text.length > 20) return decodeHtmlEntities(text);
  }
  return undefined;
}

function extractImageUrls(html: string, baseUrl: string): string[] {
  const urls = new Set<string>();

  const patterns: RegExp[] = [
    /https:\/\/media\.ffycdn\.net\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/cdn-assets-eu\.frontify\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/cache\.marriott\.com\/is\/image\/[^"'\\]+/gi,
    /https:\/\/cache\.marriott\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/digital\.ihg\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*hilton\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*hyatt\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*fourseasons\.com\/content\/dam\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*aman\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*rosewoodhotels\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*shangri-la\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*peninsula\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*accor\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/m\.ahstatic\.com\/is\/image\/[^"'\\]+/gi,
    /https:\/\/[^"'\\]*bulgarihotels\.com\/\.imaging\/[^"'\\]+/gi,
    /https:\/\/[^"'\\]*fairmont\.com\/content\/dam\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*raffles\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*comohotels\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*anantara\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/images\.squarespace-cdn\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/cdn\.sanity\.io\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /(?:src|srcset|data-src)=["'](https:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi,
    /publish\/content\/dam\/fourseasons\/images\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /content\/dam\/fourseasons\/images\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
  ];

  for (const re of patterns) {
    for (const m of html.matchAll(re)) {
      const raw = m[1] ?? m[0];
      if (!raw) continue;
      const decoded = decodeHtmlEntities(raw).replace(/\\u002F/g, "/");
      const url = decoded.startsWith("http")
        ? decoded.split("?")[0]
        : absolutizeImageUrl(
            decoded.startsWith("/") ? decoded : `/content/dam/${decoded.replace(/^publish\//, "")}`,
            baseUrl
          );
      if (!isBadImageUrl(url)) urls.add(url);
    }
  }

  return Array.from(urls);
}

async function fetchHtml(url: string, attempt = 0, useChineseHeaders = false): Promise<string | null> {
  try {
    const isZhUrl = /zh-cn|zh-CN|\/cn\//.test(url);
    const headers = (useChineseHeaders || isZhUrl) ? FETCH_HEADERS_CN : FETCH_HEADERS;
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(18000),
      next: { revalidate: 0 },
    });
    if (res.status === 429 && attempt < 3) {
      await new Promise((r) => setTimeout(r, 2500 * (attempt + 1)));
      return fetchHtml(url, attempt + 1, useChineseHeaders);
    }
    if (res.status === 403 && attempt < 2) {
      // Retry with Chinese headers — many CN sites block non-Chinese requests
      if (!useChineseHeaders && !isZhUrl) {
        await new Promise((r) => setTimeout(r, 1200));
        return fetchHtml(url, attempt + 1, true);
      }
    }
    if (res.status >= 500) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (
      !ct.includes("text/html") &&
      !ct.includes("application/xhtml") &&
      !ct.includes("text/plain") &&
      !ct.includes("json")
    ) {
      return null;
    }
    const html = await res.text();
    if (html.length < 500) return null;
    if (res.status === 403) {
      const hasHotelMedia =
        /og:image|application\/ld\+json|digital\.ihg\.com|cache\.marriott\.com|hilton\.com\/.*\.(?:jpg|webp)/i.test(
          html
        );
      if (!hasHotelMedia) return null;
    }
    if (!res.ok && res.status !== 403 && res.status !== 404) return null;
    return html;
  } catch {
    return null;
  }
}

async function fetchSupplementalImages(
  brandSlug: string,
  websiteUrl: string
): Promise<string[]> {
  const base = websiteUrl.replace(/\/$/, "");
  const extra: string[] = [];

  if (brandSlug === "four-seasons") {
    const photosHtml = await fetchHtml(`${base}/photos-and-videos/`);
    if (photosHtml) extra.push(...extractImageUrls(photosHtml, base));
  }

  if (MARRIOTT_BRANDS.has(brandSlug) || brandSlug === "ritz-carlton" || brandSlug === "ritz-carlton-reserve") {
    for (const path of ["/photos/", "/photos-and-videos/", "/gallery/"]) {
      const galleryHtml = await fetchHtml(`${base}${path}`);
      if (galleryHtml) extra.push(...extractImageUrls(galleryHtml, base));
    }
  }

  if (ACCOR_BRANDS.has(brandSlug)) {
    const galleryHtml = await fetchHtml(`${base.replace(/\.html$/, "")}/gallery`);
    if (galleryHtml) extra.push(...extractImageUrls(galleryHtml, base));
  }

  if (HYATT_BRANDS.has(brandSlug)) {
    const galleryHtml = await fetchHtml(`${base}/gallery`);
    if (galleryHtml) extra.push(...extractImageUrls(galleryHtml, base));
  }

  if (brandSlug === "intercontinental" || brandSlug === "regent") {
    const photosHtml = await fetchHtml(`${base}/photos`);
    if (photosHtml) extra.push(...extractImageUrls(photosHtml, base));
  }

  if (brandSlug === "shangri-la") {
    const photosHtml = await fetchHtml(`${base}photos/`);
    if (photosHtml) extra.push(...extractImageUrls(photosHtml, base));
  }

  return extra;
}

function parseHtml(
  html: string,
  baseUrl: string,
  propertyCode?: string
): Omit<HotelEnrichment, "websiteUrl"> & { scrapedBasePrice?: number; propertyCode?: string } {
  const jsonLd = extractJsonLd(html);
  const metaDesc = extractMeta(html, "description") ?? extractMeta(html, "og:description");
  const masthead = extractMastheadDescription(html);

  const description =
    masthead ??
    (typeof jsonLd?.description === "string" ? jsonLd.description : undefined) ??
    metaDesc;

  const galleryImages = filterGalleryImages(extractImageUrls(html, baseUrl));

  const heroCandidates: string[] = [...galleryImages];
  if (typeof jsonLd?.image === "string") heroCandidates.unshift(jsonLd.image);
  else if (Array.isArray(jsonLd?.image)) {
    for (const img of jsonLd.image) {
      if (typeof img === "string") heroCandidates.unshift(img);
      else if (img && typeof img === "object" && "url" in img && typeof img.url === "string") {
        heroCandidates.unshift(img.url);
      }
    }
  } else if (jsonLd?.image && typeof jsonLd.image === "object" && "url" in jsonLd.image) {
    const url = (jsonLd.image as { url?: string }).url;
    if (url) heroCandidates.unshift(url);
  }
  const ogImage = extractMeta(html, "og:image") ?? extractMeta(html, "twitter:image");
  if (ogImage && !isBadImageUrl(ogImage)) heroCandidates.unshift(ogImage);

  const code = propertyCode ?? detectMarriottPropertyCode(html);
  const heroImage = pickBestImage(heroCandidates, code);
  const gallery = filterGalleryImages(
    heroImage ? [heroImage, ...galleryImages] : galleryImages
  );

  const scrapedBasePrice = extractScrapedBasePriceCny(html) ?? undefined;

  return {
    description: description ? decodeHtmlEntities(description) : undefined,
    heroImage,
    galleryImages: gallery.slice(0, 8),
    scrapedBasePrice,
    propertyCode: code,
  };
}

async function enrichFromUrl(
  hotel: Pick<HotelEntry, "slug" | "brandSlug" | "name" | "city" | "country" | "countryCode">,
  websiteUrl: string
): Promise<{
  parsed: ReturnType<typeof parseHtml>;
  supplemental: string[];
  websiteUrl: string;
  propertyCode?: string;
} | null> {
  const html = await fetchHtml(websiteUrl);
  if (!html) return null;
  const propertyCode = detectMarriottPropertyCode(html);
  const parsed = parseHtml(html, websiteUrl, propertyCode);
  const supplemental = await fetchSupplementalImages(hotel.brandSlug, websiteUrl);
  return { parsed, supplemental, websiteUrl, propertyCode: parsed.propertyCode ?? propertyCode };
}

/** Fetch official site content for a hotel entry */
export async function enrichHotelFromWeb(
  hotel: Pick<
    HotelEntry,
    | "slug"
    | "brandSlug"
    | "name"
    | "city"
    | "cityZh"
    | "country"
    | "countryCode"
    | "websiteUrl"
  > & { nameZh?: string | null }
): Promise<HotelEnrichment | null> {
  const isChina = isGreaterChinaHotel(hotel.countryCode);
  let candidates = hotel.websiteUrl
    ? [hotel.websiteUrl, ...resolveUrlCandidates(hotel).filter((u) => u !== hotel.websiteUrl)]
    : resolveUrlCandidates(hotel);

  if (isChina) {
    const zhFirst: string[] = [];
    const rest: string[] = [];
    const seen = new Set<string>();
    for (const url of candidates) {
      if (seen.has(url)) continue;
      seen.add(url);
      const zh = toChineseLocaleUrl(url);
      if (zh && !seen.has(zh)) {
        seen.add(zh);
        zhFirst.push(zh);
      }
      if (isChineseLocaleUrl(url)) zhFirst.push(url);
      else rest.push(url);
    }
    candidates = [...zhFirst, ...rest];
  }

  if (candidates.length === 0) return null;

  let best: {
    websiteUrl: string;
    parsed: ReturnType<typeof parseHtml>;
    supplemental: string[];
    imageCount: number;
    propertyCode?: string;
  } | null = null;

  for (const url of candidates.slice(0, 4)) {
    const result = await enrichFromUrl(hotel, url);
    if (!result) continue;
    const imgs = filterGalleryImages([
      ...(result.parsed.heroImage ? [result.parsed.heroImage] : []),
      ...result.parsed.galleryImages,
      ...result.supplemental,
    ]);
    const score = imgs.length + (result.parsed.description ? 1 : 0) + (result.parsed.scrapedBasePrice ? 2 : 0);
    if (!best || score > best.imageCount) {
      best = {
        websiteUrl: url,
        parsed: result.parsed,
        supplemental: result.supplemental,
        imageCount: score,
        propertyCode: result.propertyCode,
      };
    }
    if (imgs.length >= 2) break;
  }

  if (!best) return null;

  const { websiteUrl, parsed, supplemental, propertyCode } = best;
  const allImages = filterGalleryImages([
    ...(parsed.heroImage ? [parsed.heroImage] : []),
    ...parsed.galleryImages,
    ...supplemental,
  ]);

  let heroImage = pickBestImage(allImages, propertyCode) ?? allImages[0];
  if (!heroImage) {
    const wikiImage = await fetchWikipediaHotelImage(hotel.name, hotel.city);
    if (wikiImage) heroImage = wikiImage;
  }

  let galleryImages = allImages.slice(0, 8);
  // REMOVED: Bing/Baidu search engine fallback for Chinese hotels.
  // Search engine results are unreliable and often return unrelated images.
  // Only official website scraping and Wikipedia are used as image sources.

  let description = parsed.description;
  let descriptionZh: string | undefined;

  if (isChina) {
    const zhCandidates = [
      ...(isChineseLocaleUrl(websiteUrl) ? [websiteUrl] : []),
      resolveOfficialUrlZh(websiteUrl),
      ...candidates.filter((u) => isChineseLocaleUrl(u)),
    ].filter((u): u is string => Boolean(u));

    const seenZh = new Set<string>();
    for (const zhUrl of zhCandidates) {
      if (seenZh.has(zhUrl)) continue;
      seenZh.add(zhUrl);
      const zhHtml = await fetchHtml(zhUrl);
      if (!zhHtml) continue;
      const zhDesc = parseHtml(zhHtml, zhUrl).description;
      if (zhDesc && /[\u4e00-\u9fff]/.test(zhDesc)) {
        descriptionZh = zhDesc;
        break;
      }
    }

    if (!description || !/[\u4e00-\u9fff]/.test(description)) {
      const enUrl = candidates.find((u) => !isChineseLocaleUrl(u));
      if (enUrl) {
        const enHtml = await fetchHtml(enUrl);
        if (enHtml) description = parseHtml(enHtml, enUrl).description ?? description;
      }
    }
  } else {
    const zhUrl = resolveOfficialUrlZh(websiteUrl);
    if (zhUrl) {
      const zhHtml = await fetchHtml(zhUrl);
      if (zhHtml) descriptionZh = parseHtml(zhHtml, zhUrl).description;
    }
    if (description && !descriptionZh) {
      descriptionZh = (await translateEnToZh(description)) ?? undefined;
    }
  }

  if (!description && !descriptionZh && !heroImage && allImages.length === 0 && !parsed.scrapedBasePrice) {
    return null;
  }

  const rawPrice = parsed.scrapedBasePrice;
  const avgBasePrice =
    rawPrice != null
      ? validateScrapedPriceCny(rawPrice, hotel.brandSlug, hotel.countryCode) ?? undefined
      : undefined;
  const avgSuitePrice = avgBasePrice
    ? Math.round(avgBasePrice * (hotel.brandSlug.includes("maldives") || hotel.slug.includes("maldives") ? 3.5 : 2.2))
    : undefined;

  return {
    websiteUrl: isChina && candidates[0] ? candidates[0] : websiteUrl,
    description,
    descriptionZh,
    heroImage,
    galleryImages,
    avgBasePrice,
    avgSuitePrice,
    priceSource: avgBasePrice ? "scraped" : undefined,
  };
}

export function parseGalleryImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as unknown;
    return filterGalleryImages(
      Array.isArray(arr) ? arr.filter((u): u is string => typeof u === "string") : []
    );
  } catch {
    return [];
  }
}

export { isBadImageUrl, resolveHotelCoverImage } from "@/lib/hotel-cover-image";