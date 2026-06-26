import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { isBadImageUrl } from "@/lib/hotel-cover-image";
import type { HotelEntry } from "@/data/hotels/types";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

/** Stock-photo / irrelevant hosts common in Bing CN results */
const REJECT_HOSTS = [
  "699pic.com",
  "seopic.699pic.com",
  "588ku.com",
  "nipic.com",
  "ooopic.com",
  "51miz.com",
  "placeholder",
  "icon",
  "logo",
];

/** China-accessible travel & brand CDNs (reachable without VPN) */
const PREFERRED_HOSTS = [
  "c-ctrip.com",
  "ctrip.com",
  "trip.com",
  "qunarzz.com",
  "klook.com",
  "mafengwo.net",
  "dianping.com",
  "meituan.net",
  "cache.marriott.com",
  "digital.ihg.com",
  "shangri-la.com",
  "mandarinoriental.com",
  "fourseasons.com",
  "rosewoodhotels.com",
  "peninsula.com",
  "hyatt.com",
  "bulgarihotels.com",
  "m.ahstatic.com",
  "accor.com",
];

const GREATER_CHINA = new Set(["CN", "HK", "MO", "TW"]);

export function isGreaterChinaHotel(countryCode: string): boolean {
  return GREATER_CHINA.has(countryCode);
}

function hostScore(url: string): number {
  const lower = url.toLowerCase();
  if (REJECT_HOSTS.some((h) => lower.includes(h))) return -20;
  const idx = PREFERRED_HOSTS.findIndex((h) => lower.includes(h));
  if (idx >= 0) return 30 - idx;
  if (lower.includes("zhimg.com")) return 2;
  return 0;
}

function rankImageUrls(urls: string[]): string[] {
  return [...urls]
    .filter((u) => !isBadImageUrl(u))
    .sort((a, b) => hostScore(b) - hostScore(a));
}

async function bingImageSearch(query: string): Promise<string[]> {
  const res = await fetch(
    `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`,
    {
      headers: { "User-Agent": UA, Accept: "text/html", "Accept-Language": "zh-CN,zh;q=0.9" },
      signal: AbortSignal.timeout(22000),
    }
  );
  if (!res.ok) return [];
  const html = await res.text();
  const imgs: string[] = [];
  for (const m of html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&]+?)&quot;/g)) imgs.push(m[1]);
  for (const m of html.matchAll(/"murl":"(https?:\/\/[^"]+)"/g)) imgs.push(m[1]);
  return rankImageUrls([...new Set(imgs)]);
}

export function localHotelMediaPath(slug: string): string {
  return `/hotel-media/${slug}.jpg`;
}

export function localHotelMediaFile(slug: string): string {
  return join(process.cwd(), "public/hotel-media", `${slug}.jpg`);
}

/** Download image to public/hotel-media — same-origin serving works behind the firewall */
export async function cacheHotelImageLocally(
  slug: string,
  imageUrl: string
): Promise<string | null> {
  const outFile = localHotelMediaFile(slug);
  if (existsSync(outFile)) return localHotelMediaPath(slug);

  const referer = imageUrl.includes("ctrip")
    ? "https://hotels.ctrip.com/"
    : imageUrl.includes("qunar")
      ? "https://www.qunar.com/"
      : imageUrl.includes("klook")
        ? "https://www.klook.com/"
        : undefined;

  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": UA,
        Accept: "image/*",
        ...(referer ? { Referer: referer } : {}),
      },
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8000) return null;

    mkdirSync(join(process.cwd(), "public/hotel-media"), { recursive: true });
    writeFileSync(outFile, buf);
    return localHotelMediaPath(slug);
  } catch {
    return null;
  }
}

/** Find hotel-specific images via Bing (works in mainland China without VPN) */
export async function fetchChinaHotelImageCandidates(
  hotel: Pick<HotelEntry, "cityZh" | "name" | "city"> & { nameZh?: string | null }
): Promise<string[]> {
  const label = hotel.nameZh || hotel.name;
  const queries = [
    `${label} 酒店 外观`,
    `${label} ${hotel.cityZh}`,
    `site:ctrip.com ${label}`,
    `${hotel.name} ${hotel.city} hotel exterior`,
  ];

  const merged: string[] = [];
  for (const q of queries) {
    try {
      const found = await bingImageSearch(q);
      merged.push(...found);
      if (found.some((u) => hostScore(u) >= 15)) break;
    } catch {
      /* try next query */
    }
    await new Promise((r) => setTimeout(r, 600));
  }

  return rankImageUrls([...new Set(merged)]);
}

export async function resolveChinaHotelImage(
  hotel: Pick<HotelEntry, "slug" | "cityZh" | "name" | "city" | "countryCode"> & {
    nameZh?: string | null;
  }
): Promise<{ heroImage: string; source: string } | null> {
  if (!isGreaterChinaHotel(hotel.countryCode)) return null;

  const existing = localHotelMediaFile(hotel.slug);
  if (existsSync(existing)) {
    return { heroImage: localHotelMediaPath(hotel.slug), source: "local-cache" };
  }

  const candidates = await fetchChinaHotelImageCandidates(hotel);
  for (const url of candidates.slice(0, 8)) {
    if (hostScore(url) < 0) continue;
    const local = await cacheHotelImageLocally(hotel.slug, url);
    if (local) return { heroImage: local, source: `bing:${new URL(url).hostname}` };
  }

  return null;
}