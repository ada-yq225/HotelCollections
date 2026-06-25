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

function toCny(amount: number, currency: string): number {
  const rate = FX_TO_CNY[currency.toUpperCase()] ?? 7.25;
  return Math.round(amount * rate);
}

function parseAmount(raw: string): number | null {
  const n = parseFloat(raw.replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 200 || n > 500000) return null;
  return n;
}

/** Extract nightly starting rate from official hotel HTML (CNY) */
export function extractScrapedBasePriceCny(html: string): number | null {
  const candidates: number[] = [];

  for (const m of html.matchAll(
    /"priceRange"\s*:\s*"[¥$€]?([\d,]+)[^"]*"/gi
  )) {
    const amt = parseAmount(m[1]);
    if (amt) candidates.push(amt);
  }

  for (const m of html.matchAll(
    /"lowPrice"\s*:\s*"?([\d.]+)"?[\s\S]{0,120}?"priceCurrency"\s*:\s*"([A-Z]{3})"/gi
  )) {
    const amt = parseAmount(m[1]);
    if (amt) candidates.push(toCny(amt, m[2]));
  }

  for (const m of html.matchAll(
    /"priceCurrency"\s*:\s*"([A-Z]{3})"[\s\S]{0,120}?"lowPrice"\s*:\s*"?([\d.]+)"?/gi
  )) {
    const amt = parseAmount(m[2]);
    if (amt) candidates.push(toCny(amt, m[1]));
  }

  const textPatterns = [
    /(?:每晚|起价|房价|价格)[：:\s]*[¥￥]?\s*([\d,]+)/gi,
    /(?:from|rates?\s+from)\s*(?:USD|CNY|HKD|EUR|£|\$|¥|￥)?\s*([\d,]+(?:\.\d+)?)/gi,
    /[¥￥]\s*([\d,]+)\s*(?:起|\/晚|per night)/gi,
    /(?:CNY|USD|HKD)\s*([\d,]+(?:\.\d+)?)/gi,
  ];

  for (const re of textPatterns) {
    for (const m of html.matchAll(re)) {
      const amt = parseAmount(m[1]);
      if (!amt) continue;
      const ctx = m[0].toUpperCase();
      if (ctx.includes("USD") || ctx.includes("$")) candidates.push(toCny(amt, "USD"));
      else if (ctx.includes("HKD")) candidates.push(toCny(amt, "HKD"));
      else if (ctx.includes("EUR")) candidates.push(toCny(amt, "EUR"));
      else candidates.push(amt);
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a - b);
  const median = candidates[Math.floor(candidates.length / 2)];
  return median;
}