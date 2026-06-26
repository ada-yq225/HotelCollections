const FX_TO_CNY: Record<string, number> = {
  CNY: 1,
  RMB: 1,
  USD: 7.25,
  EUR: 7.85,
  GBP: 9.15,
  HKD: 0.92,
  MOP: 0.9,
  JPY: 0.048,
  SGD: 5.35,
  AED: 1.98,
  CHF: 8.1,
  AUD: 4.7,
  THB: 0.2,
  MVR: 0.47,
};

/** Minimum plausible nightly rate (CNY) by luxury tier */
const BRAND_MIN_CNY: Record<string, number> = {
  aman: 4500,
  "cheval-blanc": 6000,
  soneva: 7000,
  "one-and-only": 8000,
  patina: 6000,
  "ritz-carlton-reserve": 5500,
  "north-island": 15000,
  "the-brando": 8000,
  singita: 8000,
  "four-seasons": 1200,
  "mandarin-oriental": 1100,
  rosewood: 1000,
  peninsula: 1000,
  "ritz-carlton": 900,
  "st-regis": 900,
  "park-hyatt": 850,
  fairmont: 700,
  intercontinental: 600,
  kempinski: 600,
  "shangri-la": 550,
  waldorf: 2500,
  bulgari: 4500,
  "bulgari-hotel": 4500,
  amanresorts: 4500,
  "the-house-collective": 2000,
};

const DEFAULT_MIN_CNY = 650;

/**
 * Market reference hotel prices (CNY per night, base room) for popular Chinese traveler destinations.
 * Based on Ctrip/Fliggy observable price ranges as of 2026.
 * Used for validation and estimation fallback.
 */
export const HOTEL_PRICE_REFERENCE: Record<string, { low: number; high: number }> = {
  // ---- China domestic luxury ----
  "beijing-bulgari": { low: 4500, high: 6000 },
  "shanghai-bulgari": { low: 4800, high: 6500 },
  "beijing-peninsula": { low: 3500, high: 5000 },
  "shanghai-peninsula": { low: 3800, high: 5500 },
  "beijing-rosewood": { low: 2800, high: 4500 },
  "guangzhou-rosewood": { low: 2200, high: 3800 },
  "sanya-mandarin-oriental": { low: 2500, high: 4500 },
  "sanya-rosewood": { low: 2000, high: 4000 },
  "hangzhou-four-seasons": { low: 3500, high: 5500 },
  "hong-kong-four-seasons": { low: 5000, high: 8000 },
  "hong-kong-peninsula": { low: 4500, high: 7500 },
  "hong-kong-rosewood": { low: 4000, high: 7000 },
  "macau-four-seasons": { low: 2500, high: 4500 },
  "beijing-waldorf-astoria": { low: 2500, high: 4000 },
  "shanghai-waldorf-astoria": { low: 2800, high: 4500 },
  "chengdu-the-temple-house": { low: 2000, high: 3500 },
  "beijing-aman-summer-palace": { low: 4500, high: 7000 },
  "shanghai-amanyangyun": { low: 6000, high: 9000 },
  "hangzhou-amanfayun": { low: 5000, high: 7500 },

  // ---- Maldives ----
  "maldives-four-seasons-kuda-huraa": { low: 8000, high: 15000 },
  "maldives-st-regis": { low: 10000, high: 20000 },
  "maldives-cheval-blanc": { low: 15000, high: 30000 },

  // ---- Bali ----
  "bali-four-seasons-jimbaran": { low: 3000, high: 6000 },
  "bali-bulgari": { low: 5000, high: 10000 },

  // ---- Phuket ----
  "phuket-amanpuri": { low: 5000, high: 8000 },

  // ---- Tokyo ----
  "tokyo-aman": { low: 8000, high: 12000 },
  "tokyo-peninsula": { low: 5000, high: 8000 },

  // ---- Singapore ----
  "singapore-marina-bay-sands": { low: 3500, high: 6000 },

  // ---- Dubai ----
  "dubai-burj-al-arab": { low: 8000, high: 15000 },

  // ---- Paris ----
  "paris-four-seasons-george-v": { low: 12000, high: 25000 },

  // ---- Tahiti / Bora Bora ----
  "bora-bora-four-seasons": { low: 10000, high: 20000 },
};

/**
 * Get a market-validated price range for a known hotel.
 * Returns null if the hotel is not in the reference table.
 */
export function getHotelPriceReference(key: string): { low: number; high: number } | null {
  return HOTEL_PRICE_REFERENCE[key] ?? null;
}

/** Known bogus cluster prices from mis-parsed Marriott/MO widgets */
const REJECT_EXACT_CNY = new Set([
  10040, 10240, 10244, 10245, 10248, 336, 750, 1088, 1717, 3171, 3676, 3925, 4821,
]);

function toCny(amount: number, currency: string): number {
  const rate = FX_TO_CNY[currency.toUpperCase()] ?? 7.25;
  return Math.round(amount * rate);
}

function parseAmount(raw: string): number | null {
  const n = parseFloat(raw.replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 50 || n > 500000) return null;
  return n;
}

function inferCurrency(ctx: string): string {
  const u = ctx.toUpperCase();
  if (u.includes("CNY") || u.includes("RMB") || u.includes("¥") || u.includes("￥")) return "CNY";
  if (u.includes("HKD") || u.includes("HK$")) return "HKD";
  if (u.includes("EUR") || u.includes("€")) return "EUR";
  if (u.includes("GBP") || u.includes("£")) return "GBP";
  if (u.includes("SGD")) return "SGD";
  if (u.includes("AED")) return "AED";
  if (u.includes("USD") || u.includes("US$") || u.includes("$")) return "USD";
  return "CNY";
}

type PriceCandidate = { cny: number; confidence: number };

function addCandidate(list: PriceCandidate[], amount: number, currency: string, confidence: number) {
  const cny = toCny(amount, currency);
  if (cny >= 200 && cny <= 500000) list.push({ cny, confidence });
}

/** Extract nightly starting rate from official hotel HTML (CNY) */
export function extractScrapedBasePriceCny(html: string): number | null {
  const candidates: PriceCandidate[] = [];

  for (const m of html.matchAll(/"priceRange"\s*:\s*"[¥$€£]?([\d,]+)[^"]*"/gi)) {
    const amt = parseAmount(m[1]);
    if (amt) addCandidate(candidates, amt, inferCurrency(m[0]), 3);
  }

  for (const m of html.matchAll(
    /"lowPrice"\s*:\s*"?([\d.]+)"?[\s\S]{0,120}?"priceCurrency"\s*:\s*"([A-Z]{3})"/gi
  )) {
    const amt = parseAmount(m[1]);
    if (amt) addCandidate(candidates, amt, m[2], 5);
  }

  for (const m of html.matchAll(
    /"priceCurrency"\s*:\s*"([A-Z]{3})"[\s\S]{0,120}?"lowPrice"\s*:\s*"?([\d.]+)"?/gi
  )) {
    const amt = parseAmount(m[2]);
    if (amt) addCandidate(candidates, amt, m[1], 5);
  }

  // Marriott / Hyatt embedded rate widgets
  for (const m of html.matchAll(
    /"(?:lowestRate|minRate|fromRate|rateFrom)"\s*:\s*\{[^}]*"amount"\s*:\s*([\d.]+)[^}]*"currency(?:Code)?"\s*:\s*"([A-Z]{3})"/gi
  )) {
    const amt = parseAmount(m[1]);
    if (amt) addCandidate(candidates, amt, m[2], 6);
  }

  for (const m of html.matchAll(
    /data-rate=["']([\d.]+)["'][^>]*data-currency=["']([A-Z]{3})["']/gi
  )) {
    const amt = parseAmount(m[1]);
    if (amt) addCandidate(candidates, amt, m[2], 4);
  }

  const textPatterns: { re: RegExp; confidence: number }[] = [
    { re: /(?:每晚|起价|房价|价格)[：:\s]*[¥￥]?\s*([\d,]+)/gi, confidence: 4 },
    { re: /(?:from|rates?\s+from)\s*(USD|CNY|HKD|EUR|GBP|SGD|AED)?\s*[¥$€£]?\s*([\d,]+(?:\.\d+)?)/gi, confidence: 3 },
    { re: /[¥￥]\s*([\d,]+)\s*(?:起|\/晚|per night)/gi, confidence: 4 },
    { re: /(?:CNY|USD|HKD|EUR|GBP|SGD|AED)\s*([\d,]+(?:\.\d+)?)/gi, confidence: 3 },
    { re: /\$\s*([\d,]+(?:\.\d+)?)\s*(?:\/\s*night|per night|USD)/gi, confidence: 4 },
  ];

  for (const { re, confidence } of textPatterns) {
    for (const m of html.matchAll(re)) {
      const hasCurrencyFirst = m.length >= 3 && /^[A-Z]{3}$/.test(m[1] ?? "");
      const rawAmt = hasCurrencyFirst ? m[2] : m[1];
      const amt = parseAmount(rawAmt ?? "");
      if (!amt) continue;
      const currency = hasCurrencyFirst ? m[1]! : inferCurrency(m[0]);
      addCandidate(candidates, amt, currency, confidence);
    }
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.confidence - a.confidence || a.cny - b.cny);
  const topConf = candidates[0].confidence;
  const tier = candidates.filter((c) => c.confidence >= topConf - 1);
  tier.sort((a, b) => a.cny - b.cny);
  return tier[Math.floor(tier.length / 2)].cny;
}

/** Reject obvious currency misreads and out-of-range luxury rates */
export function validateScrapedPriceCny(
  cny: number,
  brandSlug: string,
  countryCode: string
): number | null {
  const min = BRAND_MIN_CNY[brandSlug] ?? DEFAULT_MIN_CNY;

  // Values like 336/750 are often USD mistaken as CNY — try USD reinterpretation
  if (cny >= 150 && cny <= 3500) {
    const asUsd = toCny(cny, "USD");
    if (asUsd >= min && cny < min * 2) return asUsd;
  }

  if (REJECT_EXACT_CNY.has(cny)) return null;
  if (cny < min * 0.85) return null;
  if (cny > 120000) return null;

  // Maldives / safari ultra-lux can be very high but not absurd
  if (countryCode === "MV" && cny < 1500) {
    const asUsd = toCny(cny, "USD");
    if (asUsd >= 1500) return asUsd;
    return null;
  }

  return cny;
}