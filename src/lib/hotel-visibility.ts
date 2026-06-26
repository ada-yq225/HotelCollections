import type { HotelEntry } from "@/data/hotels/types";

/** Current calendar year — hotels with openedYear after this are treated as not yet open */
export const LISTING_YEAR = 2026;

/**
 * Slugs verified as phantom, cancelled, or not yet operating.
 * Kept in source data for history but excluded from listing / seed.
 */
export const INACTIVE_HOTEL_SLUGS = new Set([
  // 虚假 / 从未开业
  "ritz-carlton-shenyang",

  // 尚未开业（开业年份在未来或官网无预订页）
  "mandarin-oriental-amsterdam",
  "mandarin-oriental-cortina",
  "mandarin-oriental-mallorca",
]);

export function isHotelListed(hotel: Pick<HotelEntry, "slug" | "isActive" | "status" | "openedYear">): boolean {
  if (hotel.isActive === false) return false;
  if (hotel.status === "closed" || hotel.status === "rebranded") return false;
  if (INACTIVE_HOTEL_SLUGS.has(hotel.slug)) return false;
  if (hotel.openedYear != null && hotel.openedYear > LISTING_YEAR) return false;
  return true;
}