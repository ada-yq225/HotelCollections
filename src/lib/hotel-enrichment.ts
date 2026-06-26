import { resolveOfficialUrl, resolveOfficialUrlZh } from "@/lib/hotel-official-url";
import { resolveUrlCandidates } from "@/lib/hotel-url-candidates";
import { fetchWikipediaHotelImage } from "@/lib/hotel-image-fallback";
import {
  absolutizeImageUrl,
  filterGalleryImages,
  isBadImageUrl,
  pickBestImage,
} from "@/lib/hotel-cover-image";
import { extractScrapedBasePriceCny } from "@/lib/hotel-price-scrape";
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

async function fetchHtml(url: string, attempt = 0): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(18000),
      next: { revalidate: 0 },
    });
    if (res.status === 429 && attempt < 3) {
      await new Promise((r) => setTimeout(r, 2500 * (attempt + 1)));
      return fetchHtml(url, attempt + 1);
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
    const galleryHtml = await fetchHtml(`${base}/photos/`);
    if (galleryHtml) extra.push(...extractImageUrls(galleryHtml, base));
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

function parseHtml(html: string, baseUrl: string): Omit<HotelEnrichment, "websiteUrl"> & { scrapedBasePrice?: number } {
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

  const heroImage = pickBestImage(heroCandidates);
  const gallery = filterGalleryImages(
    heroImage ? [heroImage, ...galleryImages] : galleryImages
  );

  const scrapedBasePrice = extractScrapedBasePriceCny(html) ?? undefined;

  return {
    description: description ? decodeHtmlEntities(description) : undefined,
    heroImage,
    galleryImages: gallery.slice(0, 8),
    scrapedBasePrice,
  };
}

async function enrichFromUrl(
  hotel: Pick<HotelEntry, "slug" | "brandSlug" | "name" | "city" | "country" | "countryCode">,
  websiteUrl: string
): Promise<{
  parsed: ReturnType<typeof parseHtml>;
  supplemental: string[];
  websiteUrl: string;
} | null> {
  const html = await fetchHtml(websiteUrl);
  if (!html) return null;
  const parsed = parseHtml(html, websiteUrl);
  const supplemental = await fetchSupplementalImages(hotel.brandSlug, websiteUrl);
  return { parsed, supplemental, websiteUrl };
}

/** Fetch official site content for a hotel entry */
export async function enrichHotelFromWeb(
  hotel: Pick<
    HotelEntry,
    "slug" | "brandSlug" | "name" | "city" | "country" | "countryCode" | "websiteUrl"
  >
): Promise<HotelEnrichment | null> {
  const candidates = hotel.websiteUrl
    ? [hotel.websiteUrl, ...resolveUrlCandidates(hotel).filter((u) => u !== hotel.websiteUrl)]
    : resolveUrlCandidates(hotel);

  if (candidates.length === 0) return null;

  let best: {
    websiteUrl: string;
    parsed: ReturnType<typeof parseHtml>;
    supplemental: string[];
    imageCount: number;
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
      best = { websiteUrl: url, parsed: result.parsed, supplemental: result.supplemental, imageCount: score };
    }
    if (imgs.length >= 2) break;
  }

  if (!best) return null;

  const { websiteUrl, parsed, supplemental } = best;
  const allImages = filterGalleryImages([
    ...(parsed.heroImage ? [parsed.heroImage] : []),
    ...parsed.galleryImages,
    ...supplemental,
  ]);

  let heroImage = pickBestImage(allImages) ?? allImages[0];
  if (!heroImage) {
    const wikiImage = await fetchWikipediaHotelImage(hotel.name, hotel.city);
    if (wikiImage) heroImage = wikiImage;
  }

  let descriptionZh: string | undefined;
  const zhUrl = resolveOfficialUrlZh(websiteUrl);
  if (zhUrl) {
    const zhHtml = await fetchHtml(zhUrl);
    if (zhHtml) descriptionZh = parseHtml(zhHtml, zhUrl).description;
  }

  if (!parsed.description && !heroImage && allImages.length === 0 && !parsed.scrapedBasePrice) {
    return null;
  }

  const avgBasePrice = parsed.scrapedBasePrice;
  const avgSuitePrice = avgBasePrice
    ? Math.round(avgBasePrice * (hotel.brandSlug.includes("maldives") || hotel.slug.includes("maldives") ? 3.5 : 2.2))
    : undefined;

  return {
    websiteUrl,
    description: parsed.description,
    descriptionZh,
    heroImage,
    galleryImages: allImages.slice(0, 8),
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