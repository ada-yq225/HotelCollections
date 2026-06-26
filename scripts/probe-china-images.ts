import { ALL_HOTELS } from "../src/data/hotels";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122";

async function bingImages(query: string): Promise<string[]> {
  const res = await fetch(
    `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:photo-photo`,
    { headers: { "User-Agent": UA, Accept: "text/html" }, signal: AbortSignal.timeout(20000) }
  );
  const html = await res.text();
  const imgs: string[] = [];
  for (const m of html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&]+?)&quot;/g)) imgs.push(m[1]);
  for (const m of html.matchAll(/"murl":"(https?:\/\/[^"]+)"/g)) imgs.push(m[1]);
  return [...new Set(imgs)].filter((u) => !isBadImageUrl(u));
}

async function zhWikiImage(nameZh: string, cityZh: string): Promise<string | undefined> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${nameZh} ${cityZh}`,
    gsrlimit: "3",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "1600",
    format: "json",
    origin: "*",
  });
  const res = await fetch(`https://zh.wikipedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) return undefined;
  const data = (await res.json()) as {
    query?: { pages?: Record<string, { thumbnail?: { source?: string } }> };
  };
  for (const page of Object.values(data.query?.pages ?? {})) {
    const src = page.thumbnail?.source;
    if (src && !isBadImageUrl(src)) return src;
  }
  return undefined;
}

async function fetchOgImage(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "zh-CN,zh;q=0.9" },
      signal: AbortSignal.timeout(18000),
    });
    const html = await res.text();
    const og =
      html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
    return og && !isBadImageUrl(og) ? og : undefined;
  } catch {
    return undefined;
  }
}

const china = ALL_HOTELS.filter(
  (h) => ["CN", "HK", "MO", "TW"].includes(h.countryCode) && h.isActive !== false
).slice(0, 12);

async function main() {
  for (const h of china) {
    let bing: string[] = [];
    let wiki: string | undefined;
    let marriottOg: string | undefined;
    try {
      bing = await bingImages(`${h.nameZh} 酒店 外观`);
    } catch (e) {
      console.log("bing err", (e as Error).message);
    }
    try {
      wiki = await zhWikiImage(h.nameZh, h.cityZh);
    } catch {
      /* blocked */
    }
    try {
      marriottOg = await fetchOgImage(
        `https://www.marriott.com/zh-cn/hotels/${h.slug}/overview/`
      );
    } catch {
      /* skip */
    }
    console.log(
      h.slug,
      "| bing:", bing.length,
      "| wiki:", wiki ? "yes" : "no",
      "| marriott:", marriottOg ? "yes" : "no",
      "| sample:", (bing[0] ?? wiki ?? marriottOg ?? "").slice(0, 90)
    );
    await new Promise((r) => setTimeout(r, 800));
  }
}

main();