import { isBadImageUrl } from "../src/lib/hotel-cover-image";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122";

const PREFERRED_HOSTS = [
  "ctrip.com",
  "c-ctrip.com",
  "trip.com",
  "marriott.com",
  "cache.marriott.com",
  "hyatt.com",
  "hilton.com",
  "shangri-la.com",
  "fourseasons.com",
  "mandarinoriental.com",
  "rosewoodhotels.com",
  "peninsula.com",
  "bulgarihotels.com",
  "accor.com",
  "ahstatic.com",
];

async function bingImages(query: string): Promise<string[]> {
  const res = await fetch(
    `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`,
    { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) }
  );
  const html = await res.text();
  const imgs: string[] = [];
  for (const m of html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&]+?)&quot;/g)) imgs.push(m[1]);
  for (const m of html.matchAll(/"murl":"(https?:\/\/[^"]+)"/g)) imgs.push(m[1]);
  return [...new Set(imgs)].filter((u) => !isBadImageUrl(u));
}

function rank(urls: string[]): string[] {
  return [...urls].sort((a, b) => {
    const ah = PREFERRED_HOSTS.findIndex((h) => a.includes(h));
    const bh = PREFERRED_HOSTS.findIndex((h) => b.includes(h));
    const as = ah === -1 ? 0 : 20 - ah;
    const bs = bh === -1 ? 0 : 20 - bh;
    return bs - as;
  });
}

const tests = [
  "site:ctrip.com 北京丽思卡尔顿酒店",
  "site:marriott.com 北京丽思卡尔顿",
  "北京丽思卡尔顿酒店 site:ctrip.com",
  "上海浦东丽思卡尔顿酒店 外观",
  "北京王府半岛酒店 site:peninsula.com",
];

async function main() {
  for (const q of tests) {
    const imgs = rank(await bingImages(q));
    console.log("\n", q);
    for (const u of imgs.slice(0, 4)) console.log(" ", u.slice(0, 100));
    await new Promise((r) => setTimeout(r, 1200));
  }
}

main();