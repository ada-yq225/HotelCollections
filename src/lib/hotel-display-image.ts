import { existsSync } from "fs";
import { localHotelMediaFile, localHotelMediaPath } from "@/lib/china-hotel-images";

/** Prefer locally cached same-origin images; proxy other remotes for firewall resilience */
export function hotelDisplayImageUrl(
  slug: string,
  heroImage: string | null | undefined
): string | null {
  if (!heroImage) return null;
  if (heroImage.startsWith("/hotel-media/")) return heroImage;
  if (existsSync(localHotelMediaFile(slug))) return localHotelMediaPath(slug);
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