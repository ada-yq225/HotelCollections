/**
 * Flight fare lookup via Bing snippets (Ctrip / Trip.com / Fliggy / airline sites).
 * Scripts/server only.
 */

import { getAirportByIata } from "@/data/airports";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export type FlightCabinKind = "economy" | "business" | "premium";
export type FlightPriceSource = "ctrip" | "trip" | "fliggy" | "official";

export type ScrapedFlightFare = {
  priceCny: number;
  source: FlightPriceSource;
  scrapedAt: string;
};

const CABIN_ZH: Record<FlightCabinKind, string> = {
  economy: "经济舱",
  business: "商务舱",
  premium: "头等舱",
};

const REJECT_EXACT = new Set([999, 9999, 10000, 10240, 10244, 10245]);

function parseCnyPrices(text: string, min: number, max: number): number[] {
  const prices: number[] = [];
  for (const m of text.matchAll(/[¥￥]\s*([\d,]{2,7})/g)) {
    const n = parseInt(m[1].replace(/,/g, ""), 10);
    if (n >= min && n <= max && !REJECT_EXACT.has(n)) prices.push(n);
  }
  for (const m of text.matchAll(/CNY\s*([\d,]{2,7})/gi)) {
    const n = parseInt(m[1].replace(/,/g, ""), 10);
    if (n >= min && n <= max && !REJECT_EXACT.has(n)) prices.push(n);
  }
  for (const m of text.matchAll(/([\d,]{3,7})\s*元/g)) {
    const n = parseInt(m[1].replace(/,/g, ""), 10);
    if (n >= min && n <= max && !REJECT_EXACT.has(n)) prices.push(n);
  }
  return prices;
}

function cabinBounds(cabin: FlightCabinKind): { min: number; max: number } {
  if (cabin === "economy") return { min: 180, max: 60000 };
  if (cabin === "business") return { min: 800, max: 250000 };
  return { min: 8000, max: 600000 };
}

function pickMedian(prices: number[]): number | null {
  if (prices.length === 0) return null;
  const sorted = [...prices].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function routeDistanceKm(from: string, to: string): number | null {
  const a = getAirportByIata(from);
  const b = getAirportByIata(to);
  if (!a || !b) return null;
  return haversineKm(a.latitude, a.longitude, b.latitude, b.longitude);
}

/** Reject snippet noise (taxes, hotel prices mis-parsed as fares) */
export function validateFlightFareCny(
  priceCny: number,
  from: string,
  to: string,
  cabin: FlightCabinKind
): number | null {
  if (REJECT_EXACT.has(priceCny)) return null;

  const dist = routeDistanceKm(from, to);
  if (dist == null) return priceCny;

  const a = getAirportByIata(from);
  const b = getAirportByIata(to);
  const international = a && b && a.countryCode !== b.countryCode;

  let minEco: number;
  if (dist < 600) minEco = 280;
  else if (dist < 1200) minEco = 380;
  else if (dist < 2500) minEco = international ? 650 : 450;
  else if (dist < 5000) minEco = international ? 1200 : 750;
  else if (dist < 9000) minEco = 2200;
  else minEco = 3200;

  const min =
    cabin === "economy" ? minEco : cabin === "business" ? minEco * 2.8 : minEco * 8;

  const max =
    cabin === "economy" ? 65000 : cabin === "business" ? 280000 : 650000;

  if (priceCny < min || priceCny > max) return null;
  return priceCny;
}

async function bingSearch(query: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=zh-Hans`,
      {
        headers: { "User-Agent": UA, Accept: "text/html", "Accept-Language": "zh-CN,zh;q=0.9" },
        signal: AbortSignal.timeout(20000),
      }
    );
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

function routeLabels(from: string, to: string): { fromZh: string; toZh: string } | null {
  const a = getAirportByIata(from);
  const b = getAirportByIata(to);
  if (!a || !b) return null;
  return { fromZh: a.cityZh, toZh: b.cityZh };
}

/** Scrape one-way fare for a city-pair + cabin from OTA/airline snippets */
export async function scrapeFlightFareCny(
  from: string,
  to: string,
  cabin: FlightCabinKind,
  productName?: string
): Promise<ScrapedFlightFare | null> {
  const labels = routeLabels(from, to);
  if (!labels) return null;

  const { min, max } = cabinBounds(cabin);
  const cabinZh = CABIN_ZH[cabin];
  const pair = `${from} ${to}`;
  const cityPair = `${labels.fromZh} ${labels.toZh}`;

  const queries: { q: string; source: FlightPriceSource }[] = [
    { q: `site:flights.ctrip.com ${labels.fromZh}到${labels.toZh} ${cabinZh} 机票`, source: "ctrip" },
    { q: `site:ctrip.com ${cityPair} 机票 ${cabinZh} 价格`, source: "ctrip" },
    { q: `site:fliggy.com ${labels.fromZh}飞${labels.toZh} ${cabinZh}`, source: "fliggy" },
    { q: `site:trip.com ${from} to ${to} ${cabin} flight price CNY`, source: "trip" },
    { q: `${cityPair} ${cabinZh} 单程机票 多少钱`, source: "ctrip" },
  ];

  if (cabin === "premium" && productName) {
    queries.unshift(
      { q: `site:fliggy.com ${productName} ${cityPair} 价格`, source: "fliggy" },
      { q: `site:ctrip.com ${productName} ${cityPair}`, source: "ctrip" },
      { q: `${productName} ${cityPair} 单程 价格`, source: "trip" }
    );
  }

  for (const { q, source } of queries) {
    const html = await bingSearch(q);
    if (!html) continue;
    const prices = parseCnyPrices(html, min, max);
    if (prices.length < 2) continue;
    const median = pickMedian(prices);
    if (median == null) continue;
    const validated = validateFlightFareCny(median, from, to, cabin);
    if (validated == null) continue;
    return { priceCny: validated, source, scrapedAt: new Date().toISOString() };
  }

  return null;
}