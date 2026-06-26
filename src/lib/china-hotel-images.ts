import type { HotelEntry } from "@/data/hotels/types";
import { isGreaterChinaHotel, localHotelMediaPath } from "@/lib/hotel-media-paths";
import {
  cacheHotelImageLocally,
  localHotelMediaFile,
  resolveHotelMediaBundle,
} from "@/lib/hotel-media-cache";

export { isGreaterChinaHotel, localHotelMediaPath } from "@/lib/hotel-media-paths";
export { cacheHotelImageLocally, localHotelMediaFile } from "@/lib/hotel-media-cache";

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