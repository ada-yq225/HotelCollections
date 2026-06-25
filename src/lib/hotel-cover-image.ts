const BAD_IMAGE_MARKERS = [
  "FS_Header_Logo",
  "FS_Logo_Mobile",
  "/etc/designs/fourseasons/img/logos",
  "MHZoeVCBctQ7CntVRZ2z",
  "/logo",
  "niccolo-logo",
  "brandmark",
  "favicon",
  "sprite",
  "placeholder",
  "avatar",
  "badge",
  "icon-",
  "/icons/",
  "[object Object]",
  "1x1",
  "pixel",
  "spacer",
  "transparent",
  ".mp4/",
  "jcr:content",
  "apple-touch-icon",
  "default-social-media",
  "social-media-image",
  ":1by1",
  "met_p_a112-79",
  "niccolo-logo",
];

const GOOD_IMAGE_MARKERS = [
  "content/dam",
  "cache.marriott.com/is/image",
  "cache.marriott.com/content/dam",
  "media.ffycdn.net",
  "digital.ihg.com",
  "m.ahstatic.com/is/image",
  "cdn.sanity.io",
  "images.squarespace-cdn.com",
  "bulgarihotels.com/.imaging",
  "hyatt.com",
  "shangri-la.com",
  "_original.jpg",
  "/hero",
  "/gallery",
  "property",
  "exterior",
  "suite",
  "villa",
  "pool",
  "room",
  "renditions",
];

export function isBadImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return true;
  const lower = url.toLowerCase();
  if (lower.endsWith(".svg") || lower.includes("data:image")) return true;
  if (lower.endsWith(".gif") && lower.includes("logo")) return true;
  return BAD_IMAGE_MARKERS.some((m) => lower.includes(m.toLowerCase()));
}

function scoreImageUrl(url: string): number {
  if (isBadImageUrl(url)) return -1;
  let score = 0;
  const lower = url.toLowerCase();
  if (/\.jpe?g|\.webp/i.test(url)) score += 3;
  if (GOOD_IMAGE_MARKERS.some((m) => lower.includes(m))) score += 5;
  if (lower.includes("original")) score += 2;
  if (lower.includes("wide") || lower.includes("hero")) score += 2;
  if (lower.includes("thumb") || lower.includes("small")) score -= 2;
  return score;
}

export function pickBestImage(candidates: string[]): string | undefined {
  const ranked = candidates
    .map((url) => ({ url, score: scoreImageUrl(url) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.url;
}

export function filterGalleryImages(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    if (isBadImageUrl(url) || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

/** Resolve card/detail cover: hero → gallery[0] → null */
export function resolveHotelCoverImage(
  heroImage: string | null | undefined,
  galleryImages: string[] = []
): string | null {
  const gallery = filterGalleryImages(galleryImages);
  if (heroImage && !isBadImageUrl(heroImage)) return heroImage;
  return gallery[0] ?? null;
}

export function absolutizeImageUrl(url: string, baseUrl: string): string {
  if (url.startsWith("http")) return url.split("?")[0];
  try {
    return new URL(url, baseUrl).href.split("?")[0];
  } catch {
    return url;
  }
}