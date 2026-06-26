import scraped from "@/data/flight-prices-scraped.json";
import type { FlightCabinKind, FlightPriceSource } from "@/lib/flight-ota-price";
import { routeKey } from "@/data/flight-routes";

export type ScrapedRouteFares = {
  economy?: { priceCny: number; source: FlightPriceSource };
  business?: { priceCny: number; source: FlightPriceSource };
  premium?: { priceCny: number; source: FlightPriceSource };
};

type ScrapedFile = Record<string, ScrapedRouteFares | { priceCny: number; source: FlightPriceSource }>;

const DATA = scraped as ScrapedFile;

function legEntry(from: string, to: string): ScrapedRouteFares | null {
  const forward = DATA[routeKey(from, to)] as ScrapedRouteFares | undefined;
  if (forward) return forward;
  const reverse = DATA[routeKey(to, from)] as ScrapedRouteFares | undefined;
  return reverse ?? null;
}

export function getScrapedLegFareCny(
  from: string,
  to: string,
  cabin: FlightCabinKind
): number | null {
  const entry = legEntry(from, to);
  if (!entry) return null;
  const fare = entry[cabin];
  return fare?.priceCny ?? null;
}

export function getScrapedPremiumProductPriceCny(productId: string): number | null {
  const entry = DATA[productId];
  if (!entry || typeof entry !== "object") return null;
  if ("priceCny" in entry && typeof entry.priceCny === "number") return entry.priceCny;
  return null;
}