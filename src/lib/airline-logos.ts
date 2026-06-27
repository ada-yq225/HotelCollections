import type { AirlineAllianceSlug } from "@/data/airlines";

const KIWI_CDN = "https://images.kiwi.com/airlines/128";

/**
 * Airlines whose Kiwi CDN marks are outdated — use curated sources instead.
 * OZ: Kumho wing logo removed after Korean Air merger (2025); tail-stripe livery is current.
 */
const CDN_OVERRIDES: Record<string, string> = {
  OZ: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/OZ.png?width=128&height=128",
};

/** Local airline logo path if cached in public/airlines/ */
export function getAirlineLogoPath(iata: string): string {
  return `/airlines/${iata}.png`;
}

export function getAirlineLogoUrl(iata: string, hasLocal = true): string {
  if (hasLocal) return getAirlineLogoPath(iata);
  return CDN_OVERRIDES[iata] ?? `${KIWI_CDN}/${iata}.png`;
}

const ALLIANCE_LOGO_EXT: Record<AirlineAllianceSlug, "svg" | "png"> = {
  "star-alliance": "svg",
  skyteam: "png",
  oneworld: "svg",
};

export function getAllianceLogoPath(alliance: AirlineAllianceSlug): string {
  const ext = ALLIANCE_LOGO_EXT[alliance];
  return `/alliances/${alliance}.${ext}`;
}

export const ALLIANCE_META: Record<
  AirlineAllianceSlug,
  { nameZh: string; color: string }
> = {
  "star-alliance": { nameZh: "星空联盟", color: "#1a1a1a" },
  skyteam: { nameZh: "天合联盟", color: "#003580" },
  oneworld: { nameZh: "寰宇一家", color: "#006564" },
};