import { enrichHotelFromWeb } from "@/lib/hotel-enrichment";
import { isBadImageUrl, resolveHotelCoverImage } from "@/lib/hotel-cover-image";
import {
  cacheHotelImageLocally,
  localHotelMediaPath,
} from "@/lib/hotel-media-cache";
import { getUserOfficialUrlCandidates } from "@/lib/hotel-official-urls-user";
import type { HotelEntry } from "@/data/hotels/types";

export type OfficialScrapeResult = {
  websiteUrl: string;
  heroImage: string;
  galleryImages: string[];
  description?: string;
  descriptionZh?: string;
  source: "user-official-url";
};

/** Scrape images from user-provided official URL(s) and cache locally */
export async function scrapeOfficialImagesForHotel(
  hotel: HotelEntry,
  websiteUrl: string,
  targetCount = 6
): Promise<OfficialScrapeResult | null> {
  const candidates = [
    websiteUrl,
    ...getUserOfficialUrlCandidates(hotel.slug).filter((u) => u !== websiteUrl),
  ];

  let best: Awaited<ReturnType<typeof enrichHotelFromWeb>> = null;
  let bestUrl = websiteUrl;

  for (const url of candidates.slice(0, 5)) {
    const result = await enrichHotelFromWeb({
      slug: hotel.slug,
      brandSlug: hotel.brandSlug,
      name: hotel.name,
      nameZh: hotel.nameZh,
      city: hotel.city,
      cityZh: hotel.cityZh,
      country: hotel.country,
      countryCode: hotel.countryCode,
      websiteUrl: url,
    });
    if (!result) continue;
    const imgCount =
      (result.heroImage && !isBadImageUrl(result.heroImage) ? 1 : 0) +
      result.galleryImages.filter((u) => !isBadImageUrl(u)).length;
    const bestCount =
      best == null
        ? 0
        : (best.heroImage && !isBadImageUrl(best.heroImage) ? 1 : 0) +
          best.galleryImages.filter((u) => !isBadImageUrl(u)).length;
    if (!best || imgCount > bestCount) {
      best = result;
      bestUrl = url;
    }
    if (imgCount >= 3) break;
  }

  if (!best) return null;

  const remoteImages = [
    ...(best.heroImage && !isBadImageUrl(best.heroImage) ? [best.heroImage] : []),
    ...best.galleryImages.filter((u) => !isBadImageUrl(u)),
  ];

  const uniqueRemote: string[] = [];
  const seen = new Set<string>();
  for (const u of remoteImages) {
    const key = u.split("?")[0];
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueRemote.push(u);
  }

  if (uniqueRemote.length === 0) return null;

  const localGallery: string[] = [];
  for (let i = 0; i < Math.min(uniqueRemote.length, targetCount); i++) {
    const local = await cacheHotelImageLocally(hotel.slug, uniqueRemote[i], i);
    if (local) localGallery.push(local);
  }

  if (localGallery.length === 0) {
    const cover = resolveHotelCoverImage(best.heroImage, best.galleryImages);
    if (!cover) return null;
    return {
      websiteUrl: bestUrl,
      heroImage: cover,
      galleryImages: best.galleryImages.slice(0, targetCount),
      description: best.description,
      descriptionZh: best.descriptionZh,
      source: "user-official-url",
    };
  }

  return {
    websiteUrl: bestUrl,
    heroImage: localGallery[0],
    galleryImages: localGallery,
    description: best.description,
    descriptionZh: best.descriptionZh,
    source: "user-official-url",
  };
}

export function listLocalGalleryPaths(slug: string, max = 6): string[] {
  const paths: string[] = [];
  for (let i = 0; i < max; i++) {
    paths.push(localHotelMediaPath(slug, i));
  }
  return paths;
}