/**
 * OTA reference price lookup via Bing (Trip.com / Ctrip snippets).
 * Server/scripts only.
 */

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function parseCnyFromText(text: string): number[] {
  const prices: number[] = [];
  for (const m of text.matchAll(/[¥￥]\s*([\d,]{3,6})/g)) {
    const n = parseInt(m[1].replace(/,/g, ""), 10);
    if (n >= 400 && n <= 80000) prices.push(n);
  }
  for (const m of text.matchAll(/CNY\s*([\d,]{3,6})/gi)) {
    const n = parseInt(m[1].replace(/,/g, ""), 10);
    if (n >= 400 && n <= 80000) prices.push(n);
  }
  return prices;
}

async function bingWebSearch(query: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=zh-Hans`,
      {
        headers: { "User-Agent": UA, Accept: "text/html", "Accept-Language": "zh-CN,zh;q=0.9" },
        signal: AbortSignal.timeout(18000),
      }
    );
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

/** Try Trip.com / Ctrip search snippets for a nightly CNY rate */
export async function scrapeOtaPriceCny(hotel: {
  name: string;
  nameZh?: string | null;
  city: string;
  cityZh: string;
}): Promise<{ priceCny: number; source: "trip" | "ctrip" } | null> {
  const label = hotel.nameZh || hotel.name;
  const queries = [
    `site:trip.com ${label} ${hotel.cityZh} 酒店`,
    `site:hotels.ctrip.com ${label} ${hotel.cityZh}`,
    `site:ctrip.com ${label} ${hotel.cityZh} 每晚`,
    `${label} ${hotel.cityZh} trip.com 价格`,
  ];

  for (const q of queries) {
    const html = await bingWebSearch(q);
    if (!html) continue;
    const prices = parseCnyFromText(html);
    if (prices.length === 0) continue;
    prices.sort((a, b) => a - b);
    const median = prices[Math.floor(prices.length / 2)];
    const source = q.includes("ctrip") ? "ctrip" : "trip";
    return { priceCny: median, source };
  }
  return null;
}