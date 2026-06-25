import { resolveOfficialUrl, resolveOfficialUrlZh } from "@/lib/hotel-official-url";
import type { HotelEntry } from "@/data/hotels/types";

export type HotelEnrichment = {
  websiteUrl: string;
  description?: string;
  descriptionZh?: string;
  heroImage?: string;
  galleryImages: string[];
};

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
};

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
      /* skip malformed blocks */
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

const LOGO_URL_MARKERS = [
  "MHZoeVCBctQ7CntVRZ2z",
  "/logo",
  "brandmark",
  "favicon",
  "sprite",
  "placeholder",
  "avatar",
  "badge",
];

function isBadImageUrl(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.endsWith(".svg") || lower.includes("data:image")) return true;
  return LOGO_URL_MARKERS.some((m) => lower.includes(m.toLowerCase()));
}

function pickBestHeroImage(candidates: string[]): string | undefined {
  const filtered = candidates.filter((u) => !isBadImageUrl(u));
  if (filtered.length === 0) return undefined;
  const photo = filtered.find((u) => /\.jpe?g|\.webp/i.test(u));
  return photo ?? filtered[0];
}

function extractImageUrls(html: string): string[] {
  const urls = new Set<string>();

  const patterns = [
    /https:\/\/media\.ffycdn\.net\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/cdn-assets-eu\.frontify\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/cache\.marriott\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/digital\.ihg\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*hilton\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*hyatt\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*fourseasons\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*aman\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*rosewoodhotels\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*chevalblanc\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*bulgarihotels\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*kempinski\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*sixsenses\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*belmond\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*andbeyond\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*singita\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*constancehotels\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*joali\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*patinahotels\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*niccolohotels\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*thehousecollective\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*aubergeresorts\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*viceroyhotelsandresorts\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*comohotels\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*anantara\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*atlantissanya\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/[^"'\\]*langhamhotels\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/images\.squarespace-cdn\.com\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/cdn\.sanity\.io\/[^"'\\]+?\.(?:jpg|jpeg|png|webp)/gi,
    /property=["']og:image["'][^>]+content=["'](https:\/\/[^"']+)["']/gi,
    /content=["'](https:\/\/[^"']+)["'][^>]+property=["']og:image["']/gi,
    /src:\s*&#x27;(https:\/\/[^&#]+?)&#x27;/gi,
    /"image"\s*:\s*"(https:\/\/[^"]+)"/gi,
    /"heroImage"\s*:\s*"(https:\/\/[^"]+)"/gi,
    /<img[^>]+src=["'](https:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi,
    /<img[^>]+data-src=["'](https:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi,
  ];

  for (const re of patterns) {
    for (const m of html.matchAll(re)) {
      const raw = m[1] ?? m[0];
      if (!raw?.startsWith("http")) continue;
      const url = decodeHtmlEntities(raw).replace(/\\u002F/g, "/");
      const lower = url.toLowerCase();
      if (!isBadImageUrl(url)) {
        urls.add(url.split("?")[0]);
      }
    }
  }

  return Array.from(urls).slice(0, 6);
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(15000),
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html") && !ct.includes("application/xhtml")) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function parseHtml(html: string): Omit<HotelEnrichment, "websiteUrl"> {
  const jsonLd = extractJsonLd(html);
  const metaDesc = extractMeta(html, "description") ?? extractMeta(html, "og:description");
  const masthead = extractMastheadDescription(html);

  let description =
    masthead ??
    (typeof jsonLd?.description === "string" ? jsonLd.description : undefined) ??
    metaDesc;

  const galleryImages = extractImageUrls(html);

  const heroCandidates: string[] = [];
  if (typeof jsonLd?.image === "string") heroCandidates.push(jsonLd.image);
  else if (Array.isArray(jsonLd?.image)) {
    for (const img of jsonLd.image) {
      if (typeof img === "string") heroCandidates.push(img);
    }
  }
  const ogImage = extractMeta(html, "og:image") ?? extractMeta(html, "twitter:image");
  if (ogImage) heroCandidates.push(ogImage);
  heroCandidates.push(...galleryImages);

  const heroImage = pickBestHeroImage(heroCandidates);
  const gallery = [...galleryImages];
  if (heroImage && !gallery.includes(heroImage)) gallery.unshift(heroImage);

  return {
    description: description ? decodeHtmlEntities(description) : undefined,
    heroImage,
    galleryImages: gallery.slice(0, 6),
  };
}

/** Fetch official site content for a hotel entry */
export async function enrichHotelFromWeb(
  hotel: Pick<HotelEntry, "slug" | "brandSlug" | "name" | "city" | "websiteUrl">
): Promise<HotelEnrichment | null> {
  const websiteUrl = hotel.websiteUrl ?? resolveOfficialUrl(hotel);
  if (!websiteUrl) return null;

  const html = await fetchHtml(websiteUrl);
  if (!html) return null;

  const parsed = parseHtml(html);
  let descriptionZh: string | undefined;

  const zhUrl = resolveOfficialUrlZh(websiteUrl);
  if (zhUrl) {
    const zhHtml = await fetchHtml(zhUrl);
    if (zhHtml) {
      const zhParsed = parseHtml(zhHtml);
      descriptionZh = zhParsed.description;
    }
  }

  if (!parsed.description && !parsed.heroImage && parsed.galleryImages.length === 0) {
    return null;
  }

  return {
    websiteUrl,
    description: parsed.description,
    descriptionZh,
    heroImage: parsed.heroImage ?? parsed.galleryImages[0],
    galleryImages: parsed.galleryImages,
  };
}

export function parseGalleryImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? arr.filter((u): u is string => typeof u === "string") : [];
  } catch {
    return [];
  }
}