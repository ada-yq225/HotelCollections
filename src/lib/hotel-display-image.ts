/** Client-safe image URL resolution — no Node.js fs */

export function hotelDisplayImageUrl(
  slug: string,
  heroImage: string | null | undefined
): string | null {
  if (!heroImage) return null;
  if (heroImage.startsWith("/")) return heroImage;
  return `/api/hotel-image?slug=${encodeURIComponent(slug)}&url=${encodeURIComponent(heroImage)}`;
}

export function hotelGalleryDisplayUrls(
  slug: string,
  gallery: string[]
): string[] {
  return gallery
    .map((u) => hotelDisplayImageUrl(slug, u))
    .filter((u): u is string => u != null);
}