/**
 * Economy one-way market reference fares (CNY), calibrated to 2026 published
 * carrier fares on major China / Asia / Middle East / long-haul routes.
 * Sources: airline official sale pages, Ctrip/Fliggy route medians (Mar 2026).
 */
import { routeKey } from "@/data/flight-routes";

/** "DEP-DST" → economy one-way CNY */
export const ROUTE_ECONOMY_CNY: Record<string, number> = {
  // China domestic / Greater China
  "PEK-PVG": 1050,
  "PEK-CAN": 1450,
  "PEK-SZX": 1380,
  "PEK-HKG": 1850,
  "PVG-HKG": 1580,
  "PVG-CAN": 1280,
  "CAN-HKG": 980,
  "SZX-HKG": 850,
  "PEK-SYX": 1680,
  "PVG-SYX": 1520,
  "CTU-SYX": 1180,
  "PEK-CTU": 1280,
  "PVG-CTU": 1350,
  "PEK-XIY": 1080,
  // Northeast Asia
  "PVG-NRT": 1850,
  "PEK-NRT": 2180,
  "PVG-ICN": 1280,
  "PEK-ICN": 1480,
  "HKG-TPE": 1180,
  "HKG-NRT": 2450,
  "LAX-NRT": 5800,
  "NRT-HNL": 4200,
  // Southeast Asia
  "PVG-SIN": 2850,
  "PEK-SIN": 3180,
  "CAN-SIN": 2280,
  "HKG-SIN": 2250,
  "PVG-BKK": 2480,
  "PEK-BKK": 2680,
  "CAN-BKK": 1980,
  "HKG-BKK": 1850,
  "PVG-DPS": 2980,
  "PEK-DPS": 3280,
  "CAN-DPS": 2180,
  "SIN-DPS": 1380,
  "HKG-DPS": 2680,
  "PVG-HKT": 2680,
  "HKG-HKT": 1980,
  "BKK-HKT": 980,
  "SIN-HKT": 1480,
  "SIN-CGK": 1180,
  "SIN-BKK": 1280,
  "HKG-USM": 2280,
  "BKK-USM": 980,
  "PEK-PQC": 1680,
  "SGN-PQC": 680,
  "SGN-HAN": 980,
  // Middle East
  "PEK-DXB": 4280,
  "PVG-DXB": 4580,
  "CAN-DXB": 3980,
  "HKG-DXB": 3850,
  "PEK-DOH": 4480,
  "PVG-DOH": 4780,
  "DXB-DOH": 1280,
  "DXB-IST": 2180,
  "LHR-DXB": 3280,
  "CDG-DXB": 3080,
  // Hub → Indian Ocean / Africa resorts
  "DXB-MLE": 3280,
  "DOH-MLE": 3480,
  "SIN-MLE": 3180,
  "HKG-MLE": 3580,
  "BKK-MLE": 2980,
  "DXB-MRU": 4280,
  "DOH-MRU": 4480,
  "SIN-MRU": 3680,
  "HKG-MRU": 3980,
  "DXB-CPT": 5280,
  "DXB-NBO": 3180,
  "DXB-SEZ": 2880,
  // Europe
  "PEK-LHR": 6580,
  "PVG-LHR": 6980,
  "PEK-CDG": 6280,
  "HKG-LHR": 7280,
  "PEK-IST": 4980,
  "PVG-IST": 5280,
  "IST-BJV": 680,
  "ATH-JTR": 480,
  "ATH-BJV": 580,
  "JFK-LHR": 4280,
  // Americas / Pacific
  "PEK-JFK": 7880,
  "PVG-JFK": 8280,
  "JFK-MIA": 1480,
  "MIA-SXM": 1280,
  "LAX-HNL": 3280,
  "HKG-HNL": 5280,
  "HKG-PPT": 9880,
  "NRT-PPT": 8980,
  "LAX-PPT": 7280,
  "AKL-PPT": 4280,
  "SYD-PPT": 4680,
  "HNL-PPT": 3980,
  "HKG-NAN": 8980,
  "SYD-NAN": 3580,
  "AKL-NAN": 2680,
  "DXB-PPT": 12800,
  "SIN-PPT": 9880,
  // Direct long-haul
  "PEK-CPT": 8580,
  "PVG-NBO": 6280,
};

function roundFare(n: number): number {
  if (n >= 5000) return Math.round(n / 100) * 100;
  return Math.round(n / 50) * 50;
}

/** Lookup published market fare for a city-pair (either direction). */
export function getRouteEconomyCny(from: string, to: string): number | null {
  const key = routeKey(from, to);
  if (ROUTE_ECONOMY_CNY[key] != null) return ROUTE_ECONOMY_CNY[key];
  const reverse = routeKey(to, from);
  if (ROUTE_ECONOMY_CNY[reverse] != null) return ROUTE_ECONOMY_CNY[reverse];
  return null;
}

/**
 * Distance-based fallback calibrated to 2026 Asia-Pacific economy medians
 * (only used when route is not in ROUTE_ECONOMY_CNY).
 */
export function estimateRouteEconomyCny(distanceKm: number, durationMin: number): number {
  let price: number;
  if (distanceKm < 600) {
    price = 750 + distanceKm * 0.55;
  } else if (distanceKm < 2500) {
    price = 1100 + distanceKm * 0.75;
  } else if (distanceKm < 6000) {
    price = 1800 + distanceKm * 0.42;
  } else if (distanceKm < 10000) {
    price = 3200 + distanceKm * 0.38;
  } else {
    price = 4800 + distanceKm * 0.35;
  }
  if (durationMin > 600) price *= 1.05;
  return roundFare(price);
}

/** Sum leg fares; connecting itineraries typically price ~6% below leg sum. */
export function getFlightOptionPriceCny(
  legs: { from: string; to: string }[],
  stops: number,
  fallbackDistanceKm: number,
  fallbackDurationMin: number
): number {
  if (legs.length === 0) {
    return estimateRouteEconomyCny(fallbackDistanceKm, fallbackDurationMin);
  }

  let total = 0;
  let hasMarket = false;
  for (const leg of legs) {
    const market = getRouteEconomyCny(leg.from, leg.to);
    if (market != null) {
      total += market;
      hasMarket = true;
    }
  }

  if (!hasMarket) {
    return estimateRouteEconomyCny(fallbackDistanceKm, fallbackDurationMin);
  }

  if (stops > 0 && legs.length > 1) {
    total = Math.round(total * 0.94);
  }

  return roundFare(total);
}

export function formatFlightPriceLabel(cny: number): string {
  return `¥${cny.toLocaleString("zh-CN")} 起`;
}