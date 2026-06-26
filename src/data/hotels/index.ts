import type { HotelEntry } from "./types";
import { isHotelListed } from "@/lib/hotel-visibility";
import { CHINA_HOTELS } from "./china";
import { MARRIOTT_CHINA_HOTELS } from "./marriott-china";
import { MARRIOTT_GLOBAL_HOTELS } from "./marriott-global";
import { HYATT_CHINA_HOTELS } from "./hyatt-china";
import { HYATT_GLOBAL_HOTELS } from "./hyatt-global";
import { IHG_CHINA_HOTELS } from "./ihg-china";
import { IHG_GLOBAL_HOTELS } from "./ihg-global";
import { HILTON_CHINA_HOTELS } from "./hilton-china";
import { HILTON_GLOBAL_HOTELS } from "./hilton-global";
import { ACCOR_CHINA_HOTELS } from "./accor-china";
import { ACCOR_GLOBAL_HOTELS } from "./accor-global";
import { ASIA_PACIFIC_HOTELS } from "./asia-pacific";
import { EUROPE_HOTELS } from "./europe";
import { AMERICAS_HOTELS } from "./americas";
import { MEA_HOTELS } from "./mea";
import { MALDIVES_HOTELS } from "./maldives";
import { TAHITI_HOTELS } from "./tahiti";
import { RESORT_DESTINATION_HOTELS } from "./resort-destinations";
import { SIGNATURE_BRAND_HOTELS } from "./signature-brands";
import { SOUTHEAST_ASIA_RESORT_HOTELS } from "./southeast-asia-resorts";
import { AFRICA_HOTELS } from "./africa";
import { ISLAND_RESORT_EXTENDED_HOTELS } from "./island-resorts-extended";
import { CHINA_CITIES_EXTENDED_HOTELS } from "./china-cities-extended";

export type { HotelEntry, HotelStatus } from "./types";

function dedupeBySlug(hotels: HotelEntry[]): HotelEntry[] {
  const seen = new Map<string, HotelEntry>();
  for (const hotel of hotels) {
    if (!seen.has(hotel.slug)) {
      seen.set(hotel.slug, hotel);
    }
  }
  return Array.from(seen.values());
}

const ALL_HOTELS_RAW: HotelEntry[] = [
  ...CHINA_HOTELS,
  ...MARRIOTT_CHINA_HOTELS,
  ...HYATT_CHINA_HOTELS,
  ...IHG_CHINA_HOTELS,
  ...HILTON_CHINA_HOTELS,
  ...ACCOR_CHINA_HOTELS,
  ...ASIA_PACIFIC_HOTELS,
  ...EUROPE_HOTELS,
  ...AMERICAS_HOTELS,
  ...MEA_HOTELS,
  ...MARRIOTT_GLOBAL_HOTELS,
  ...HYATT_GLOBAL_HOTELS,
  ...IHG_GLOBAL_HOTELS,
  ...HILTON_GLOBAL_HOTELS,
  ...ACCOR_GLOBAL_HOTELS,
  ...MALDIVES_HOTELS,
  ...TAHITI_HOTELS,
  ...RESORT_DESTINATION_HOTELS,
  ...SIGNATURE_BRAND_HOTELS,
  ...SOUTHEAST_ASIA_RESORT_HOTELS,
  ...AFRICA_HOTELS,
  ...ISLAND_RESORT_EXTENDED_HOTELS,
  ...CHINA_CITIES_EXTENDED_HOTELS,
];

export const ALL_HOTELS: HotelEntry[] = dedupeBySlug(ALL_HOTELS_RAW);

/** Hotels currently open and bookable — excludes closed, phantom & pipeline entries */
export const ACTIVE_HOTELS: HotelEntry[] = ALL_HOTELS.filter(isHotelListed);

export {
  CHINA_HOTELS,
  MARRIOTT_CHINA_HOTELS,
  MARRIOTT_GLOBAL_HOTELS,
  HYATT_CHINA_HOTELS,
  HYATT_GLOBAL_HOTELS,
  IHG_CHINA_HOTELS,
  IHG_GLOBAL_HOTELS,
  HILTON_CHINA_HOTELS,
  HILTON_GLOBAL_HOTELS,
  ACCOR_CHINA_HOTELS,
  ACCOR_GLOBAL_HOTELS,
  ASIA_PACIFIC_HOTELS,
  EUROPE_HOTELS,
  AMERICAS_HOTELS,
  MEA_HOTELS,
  MALDIVES_HOTELS,
  TAHITI_HOTELS,
  RESORT_DESTINATION_HOTELS,
  SIGNATURE_BRAND_HOTELS,
  SOUTHEAST_ASIA_RESORT_HOTELS,
  AFRICA_HOTELS,
  ISLAND_RESORT_EXTENDED_HOTELS,
  CHINA_CITIES_EXTENDED_HOTELS,
};