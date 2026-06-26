import type { HotelEntry } from "@/data/hotels/types";
import {
  cacheHotelImageLocally,
  isGreaterChinaHotel,
  localHotelMediaFile,
  localHotelMediaPath,
  resolveHotelMediaBundle,
} from "@/lib/hotel-media-cache";

export {
  cacheHotelImageLocally,
  isGreaterChinaHotel,
  localHotelMediaFile,
  localHotelMediaPath,
} from "@/lib/hotel-media-cache";

export async function resolveChinaHotelImage(
  hotel: Pick<HotelEntry, "slug" | "cityZh" | "name" | "city" | "countryCode" | "brandSlug"> & {
    nameZh?: string | null;
  }
): Promise<{ heroImage: string; galleryImages?: string[]; source: string } | null> {
  if (!isGreaterChinaHotel(hotel.countryCode)) return null;
  const bundle = await resolveHotelMediaBundle(hotel, 6);
  if (!bundle) return null;
  return {
    heroImage: bundle.heroImage,
    galleryImages: bundle.galleryImages,
    source: bundle.source,
  };
}