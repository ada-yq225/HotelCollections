/**
 * Flight fares — only OTA/official scraped prices are shown to users.
 * Hardcoded tables kept for scripts; estimates are not displayed.
 */
import { routeKey } from "@/data/flight-routes";
import {
  getPremiumProductsForLegs,
  type PremiumCabinProduct,
} from "@/data/flight-cabin-products";
import type { FlightCabinKind } from "@/lib/flight-ota-price";
import {
  getScrapedLegFareCny,
  getScrapedPremiumProductPriceCny,
} from "@/lib/flight-prices-scraped";

/** "DEP-DST" → economy one-way CNY */
export const ROUTE_ECONOMY_CNY: Record<string, number> = {
  // China domestic / Greater China
  "PEK-PVG": 680,
  "PEK-CAN": 980,
  "PEK-SZX": 920,
  "PEK-HKG": 1280,
  "PVG-HKG": 1080,
  "PVG-CAN": 880,
  "CAN-HKG": 720,
  "SZX-HKG": 580,
  "PEK-SYX": 1180,
  "PVG-SYX": 980,
  "CTU-SYX": 780,
  "PEK-CTU": 880,
  "PVG-CTU": 920,
  "PEK-XIY": 720,
  "CTU-XIY": 580,
  // Northeast Asia
  "PVG-NRT": 1380,
  "PEK-NRT": 1580,
  "CAN-NRT": 1480,
  "CTU-NRT": 1780,
  "PVG-HND": 1480,
  "PEK-HND": 1680,
  "CAN-HND": 1580,
  "CTU-HND": 1880,
  "PVG-ICN": 980,
  "PEK-ICN": 1180,
  "CAN-ICN": 1080,
  "CTU-ICN": 1380,
  "HKG-TPE": 880,
  "HKG-NRT": 1680,
  "LAX-NRT": 4200,
  "NRT-HNL": 3200,
  // Southeast Asia
  "PVG-SIN": 1880,
  "PEK-SIN": 2180,
  "CAN-SIN": 1580,
  "CTU-SIN": 1980,
  "HKG-SIN": 1680,
  "PVG-BKK": 1680,
  "PEK-BKK": 1880,
  "CAN-BKK": 1380,
  "CTU-BKK": 1580,
  "HKG-BKK": 980,
  "PVG-DPS": 1980,
  "PEK-DPS": 2280,
  "CAN-DPS": 1480,
  "CTU-DPS": 2080,
  "SIN-DPS": 980,
  "HKG-DPS": 1880,
  "PVG-HKT": 1880,
  "PEK-HKT": 2180,
  "CAN-HKT": 1580,
  "CTU-HKT": 1980,
  "HKG-HKT": 1280,
  "BKK-HKT": 680,
  "SIN-HKT": 1080,
  "SIN-CGK": 880,
  "SIN-BKK": 980,
  "HKG-USM": 1580,
  "BKK-USM": 680,
  "PEK-PQC": 1280,
  "SGN-PQC": 480,
  "SGN-HAN": 680,
  // Middle East
  "PEK-DXB": 2980,
  "PVG-DXB": 3280,
  "CAN-DXB": 2780,
  "CTU-DXB": 3180,
  "HKG-DXB": 2680,
  "PEK-DOH": 3180,
  "PVG-DOH": 3480,
  "CAN-DOH": 3080,
  "CTU-DOH": 3480,
  "PEK-AUH": 3280,
  "PVG-AUH": 3580,
  "CAN-AUH": 3180,
  "CTU-AUH": 3580,
  "HKG-AUH": 2980,
  "AUH-MLE": 2380,
  "AUH-SIN": 2180,
  "DXB-DOH": 880,
  "DXB-IST": 1580,
  "LHR-DXB": 2280,
  "CDG-DXB": 2080,
  // Hub → Indian Ocean / Africa resorts
  "DXB-MLE": 2280,
  "DOH-MLE": 2480,
  "SIN-MLE": 2180,
  "HKG-MLE": 2580,
  "BKK-MLE": 1980,
  // China → Maldives direct / via hubs (economy total with connection)
  "PEK-MLE": 4980,
  "PVG-MLE": 5280,
  "CAN-MLE": 4480,
  "CTU-MLE": 5180,
  // Additional Maldives routes
  "CKG-MLE": 4880,
  "KMG-MLE": 3580,
  "WUH-MLE": 4680,
  "SZX-MLE": 4680,
  "DXB-MRU": 2980,
  "DOH-MRU": 3180,
  "SIN-MRU": 2680,
  "HKG-MRU": 2880,
  "DXB-CPT": 3680,
  "DXB-NBO": 2180,
  "DXB-SEZ": 1980,
  // Europe
  "PEK-LHR": 4280,
  "PVG-LHR": 4680,
  "CAN-LHR": 4180,
  "CTU-LHR": 4880,
  "PEK-CDG": 3980,
  "PVG-CDG": 4380,
  "CAN-CDG": 3880,
  "CTU-CDG": 4580,
  "HKG-LHR": 4980,
  "PEK-IST": 3280,
  "PVG-IST": 3580,
  "CAN-IST": 3180,
  "CTU-IST": 3780,
  "IST-BJV": 480,
  "ATH-JTR": 380,
  "ATH-BJV": 480,
  "AUH-LHR": 4580,
  "DOH-LHR": 4380,
  "SIN-LHR": 4880,
  "JFK-LHR": 3280,
  // Americas / Pacific
  "PEK-JFK": 5280,
  "PVG-JFK": 5680,
  "CAN-JFK": 5180,
  "CTU-JFK": 5880,
  "JFK-MIA": 1080,
  "MIA-SXM": 880,
  "LAX-HNL": 2280,
  "HKG-HNL": 3980,
  // China → Tahiti via hubs
  "PEK-PPT": 7280,
  "PVG-PPT": 7580,
  "CAN-PPT": 6980,
  "CTU-PPT": 7780,
  "HKG-PPT": 6980,
  "NRT-PPT": 6280,
  "LAX-PPT": 5280,
  "AKL-PPT": 3280,
  "SYD-PPT": 3580,
  "HNL-PPT": 2880,
  "HKG-NAN": 6280,
  "SYD-NAN": 2680,
  "AKL-NAN": 1980,
  "DXB-PPT": 8980,
  "SIN-PPT": 6980,
  // Direct long-haul
  "PEK-CPT": 5680,
  "PVG-NBO": 4280,
};

/** "DEP-DST" → business one-way CNY (where published; else derived) */
export const ROUTE_BUSINESS_CNY: Record<string, number> = {
  "PEK-PVG": 2480,
  "PEK-HKG": 5800,
  "PVG-HKG": 4800,
  // China → Tokyo
  "PVG-NRT": 6800,
  "PEK-NRT": 7800,
  "CAN-NRT": 6800,
  "CTU-NRT": 8800,
  "PVG-HND": 7200,
  "PEK-HND": 8200,
  "CAN-HND": 7200,
  "CTU-HND": 9200,
  // China → Singapore
  "PVG-SIN": 9800,
  "PEK-SIN": 10800,
  "CAN-SIN": 8800,
  "CTU-SIN": 10800,
  "HKG-SIN": 8800,
  // China → Bangkok
  "PVG-BKK": 7800,
  "HKG-BKK": 5800,
  "PEK-BKK": 8800,
  "CAN-BKK": 6800,
  "CTU-BKK": 7800,
  // China → Bali
  "HKG-DPS": 12800,
  "PVG-DPS": 11800,
  "PEK-DPS": 13800,
  "CAN-DPS": 10800,
  "CTU-DPS": 12800,
  // China → Phuket
  "PVG-HKT": 9800,
  "PEK-HKT": 11800,
  "CAN-HKT": 8800,
  "CTU-HKT": 10800,
  "HKG-HKT": 8800,
  // China → Dubai
  "PEK-DXB": 18800,
  "PVG-DXB": 20800,
  "CAN-DXB": 17800,
  "CTU-DXB": 20800,
  "HKG-DXB": 16800,
  // China → Doha
  "PEK-DOH": 19800,
  "PVG-DOH": 21800,
  "CAN-DOH": 18800,
  "CTU-DOH": 21800,
  // China → Abu Dhabi
  "PEK-AUH": 19800,
  "PVG-AUH": 21800,
  "CAN-AUH": 18800,
  "CTU-AUH": 21800,
  "HKG-AUH": 17800,
  // China → Maldives (business total via hub connections)
  "PEK-MLE": 28800,
  "PVG-MLE": 30800,
  "CAN-MLE": 25800,
  "CTU-MLE": 30800,
  "HKG-MLE": 25800,
  "CKG-MLE": 28800,
  "KMG-MLE": 22800,
  "SZX-MLE": 27800,
  "DXB-MLE": 15800,
  "DOH-MLE": 16800,
  "SIN-MLE": 14800,
  // China → London
  "PEK-LHR": 32800,
  "PVG-LHR": 35800,
  "CAN-LHR": 31800,
  "CTU-LHR": 36800,
  "HKG-LHR": 38800,
  // China → Paris
  "PEK-CDG": 29800,
  "PVG-CDG": 32800,
  "CAN-CDG": 28800,
  "CTU-CDG": 33800,
  // China → Istanbul
  "PEK-IST": 21800,
  "PVG-IST": 23800,
  "CAN-IST": 20800,
  "CTU-IST": 24800,
  // China → New York
  "PEK-JFK": 42800,
  "PVG-JFK": 45800,
  "CAN-JFK": 41800,
  "CTU-JFK": 46800,
  // China → Tahiti (via hubs)
  "PEK-PPT": 42800,
  "PVG-PPT": 45800,
  "CAN-PPT": 40800,
  "CTU-PPT": 46800,
  "HKG-PPT": 40800,
  // Hub premium routes
  "AUH-LHR": 88000,
  "SIN-LHR": 82000,
  "DXB-LHR": 68000,
  // China → Seoul
  "PEK-ICN": 3800,
  "PVG-ICN": 4200,
  "CAN-ICN": 3800,
  "CTU-ICN": 4800,
  // China domestic long-haul
  "PEK-CTU": 3280,
  "PVG-CTU": 3480,
  "PEK-SYX": 4800,
  "PVG-SYX": 4200,
};

export type CabinFareTier = {
  cabin: "economy" | "business" | "premium";
  label: string;
  priceCny: number | null;
  priceLabel: string;
  productName?: string;
  productNameZh?: string;
  descriptionZh?: string;
  imageUrl?: string;
  fallbackImageUrls?: string[];
  airlineIata?: string;
};

function roundFare(n: number): number {
  if (n >= 20000) return Math.round(n / 500) * 500;
  if (n >= 5000) return Math.round(n / 100) * 100;
  return Math.round(n / 50) * 50;
}

function lookupRoute(
  table: Record<string, number>,
  from: string,
  to: string
): number | null {
  const key = routeKey(from, to);
  if (table[key] != null) return table[key];
  const reverse = routeKey(to, from);
  if (table[reverse] != null) return table[reverse];
  return null;
}

/** Lookup published economy fare for a city-pair (either direction). */
export function getRouteEconomyCny(from: string, to: string): number | null {
  return lookupRoute(ROUTE_ECONOMY_CNY, from, to);
}

export function getRouteBusinessCny(from: string, to: string): number | null {
  return lookupRoute(ROUTE_BUSINESS_CNY, from, to);
}

/**
 * Distance-based fallback calibrated to 2026 Asia-Pacific economy medians.
 */
export function estimateRouteEconomyCny(distanceKm: number, durationMin: number): number {
  let price: number;
  if (distanceKm < 600) {
    price = 480 + distanceKm * 0.38;
  } else if (distanceKm < 2500) {
    price = 680 + distanceKm * 0.48;
  } else if (distanceKm < 6000) {
    price = 980 + distanceKm * 0.28;
  } else if (distanceKm < 10000) {
    price = 1680 + distanceKm * 0.24;
  } else {
    price = 2800 + distanceKm * 0.22;
  }
  if (durationMin > 600) price *= 1.03;
  return roundFare(price);
}

function estimateRouteBusinessCny(economy: number, distanceKm: number): number {
  const mult =
    distanceKm < 1500 ? 3.2 : distanceKm < 4000 ? 3.8 : distanceKm < 9000 ? 4.5 : 5.2;
  return roundFare(economy * mult);
}

/** Sum leg fares; connecting itineraries typically price ~6% below leg sum. */
export function getFlightOptionPriceCny(
  legs: { from: string; to: string }[],
  stops: number,
  fallbackDistanceKm: number,
  fallbackDurationMin: number
): number | null {
  return getFlightCabinFares(legs, stops, fallbackDistanceKm, fallbackDurationMin).economy;
}

export function formatFlightPriceLabel(cny: number | null | undefined): string {
  if (cny == null || cny <= 0) return "OTA价格待同步";
  return `¥${cny.toLocaleString("zh-CN")} 起`;
}

/** Sum scraped leg fares; returns null if any leg lacks OTA/official data */
function sumScrapedLegFares(
  legs: { from: string; to: string }[],
  cabin: FlightCabinKind,
  stops: number
): number | null {
  if (legs.length === 0) return null;

  let total = 0;
  for (const leg of legs) {
    const fare = getScrapedLegFareCny(leg.from, leg.to, cabin);
    if (fare == null) return null;
    total += fare;
  }

  if (stops > 0 && legs.length > 1) {
    total = Math.round(total * 0.94);
  }

  return roundFare(total);
}

function sumLegFares(
  legs: { from: string; to: string }[],
  table: Record<string, number>,
  stops: number,
  fallbackDistanceKm: number,
  fallbackDurationMin: number,
  estimateFn: (distanceKm: number, durationMin: number) => number
): number {
  if (legs.length === 0) {
    return estimateFn(fallbackDistanceKm, fallbackDurationMin);
  }

  let total = 0;
  let hasMarket = false;
  let missingDist = 0;

  for (const leg of legs) {
    const market = lookupRoute(table, leg.from, leg.to);
    if (market != null) {
      total += market;
      hasMarket = true;
    } else {
      missingDist += fallbackDistanceKm / legs.length;
    }
  }

  if (!hasMarket) {
    return estimateFn(fallbackDistanceKm, fallbackDurationMin);
  }

  if (missingDist > 0) {
    total += estimateFn(missingDist, fallbackDurationMin / legs.length);
  }

  if (stops > 0 && legs.length > 1) {
    total = Math.round(total * 0.94);
  }

  return roundFare(total);
}

function premiumToTier(product: PremiumCabinProduct): CabinFareTier {
  const scraped = getScrapedPremiumProductPriceCny(product.id);
  return {
    cabin: "premium",
    label: product.cabinLabel,
    priceCny: scraped,
    priceLabel: formatFlightPriceLabel(scraped),
    productName: product.name,
    productNameZh: product.nameZh,
    descriptionZh: product.descriptionZh,
    imageUrl: product.imageUrl,
    fallbackImageUrls: product.fallbackImageUrls,
    airlineIata: product.airlineIata,
  };
}

export function getFlightCabinFares(
  legs: { from: string; to: string }[],
  stops: number,
  _fallbackDistanceKm: number,
  _fallbackDurationMin: number
): { economy: number | null; business: number | null; tiers: CabinFareTier[] } {
  const economy = sumScrapedLegFares(legs, "economy", stops);
  const business = sumScrapedLegFares(legs, "business", stops);

  const tiers: CabinFareTier[] = [
    {
      cabin: "economy",
      label: "经济舱",
      priceCny: economy,
      priceLabel: formatFlightPriceLabel(economy),
    },
    {
      cabin: "business",
      label: "商务舱",
      priceCny: business,
      priceLabel: formatFlightPriceLabel(business),
    },
  ];

  const premiumProducts = getPremiumProductsForLegs(legs);
  for (const product of premiumProducts.slice(0, 2)) {
    tiers.push(premiumToTier(product));
  }

  return { economy, business, tiers };
}