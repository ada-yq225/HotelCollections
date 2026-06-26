/** Client-safe helpers — no Node.js fs */

const GREATER_CHINA = new Set(["CN", "HK", "MO", "TW"]);

export function isGreaterChinaHotel(countryCode: string): boolean {
  return GREATER_CHINA.has(countryCode);
}

export function localHotelMediaPath(slug: string, index = 0): string {
  return index === 0 ? `/hotel-media/${slug}.jpg` : `/hotel-media/${slug}-${index + 1}.jpg`;
}