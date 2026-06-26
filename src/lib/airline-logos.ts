import type { AirlineAllianceSlug } from "@/data/airlines";

const KIWI_CDN = "https://images.kiwi.com/airlines/128";

/** Local airline logo path if cached in public/airlines/ */
export function getAirlineLogoPath(iata: string): string {
  return `/airlines/${iata}.png`;
}

export function getAirlineLogoUrl(iata: string, hasLocal = true): string {
  if (hasLocal) return getAirlineLogoPath(iata);
  return `${KIWI_CDN}/${iata}.png`;
}

export function getAllianceLogoPath(alliance: AirlineAllianceSlug): string {
  return `/alliances/${alliance}.svg`;
}

export const ALLIANCE_META: Record<
  AirlineAllianceSlug,
  { nameZh: string; color: string }
> = {
  "star-alliance": { nameZh: "星空联盟", color: "#1a1a1a" },
  skyteam: { nameZh: "天合联盟", color: "#003580" },
  oneworld: { nameZh: "寰宇一家", color: "#006564" },
};