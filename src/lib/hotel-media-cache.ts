import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { isBadImageUrl } from "@/lib/hotel-cover-image";
import type { HotelEntry } from "@/data/hotels/types";

const GREATER_CHINA = new Set(["CN", "HK", "MO", "TW"]);

export function isGreaterChinaHotel(countryCode: string): boolean {
  return GREATER_CHINA.has(countryCode);
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

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
  "avatar",
  "emoji",
  "pinimg.com",
];

const PREFERRED_HOSTS = [
  "c-ctrip.com",
  "ctrip.com",
  "trip.com",
  "booking.com",
  "qunarzz.com",
  "klook.com",
  "cache.marriott.com",
  "media.ffycdn.net",
  "digital.ihg.com",
  "fourseasons.com",
  "mandarinoriental.com",
  "rosewoodhotels.com",
  "peninsula.com",
  "hyatt.com",
  "hilton.com",
  "shangri-la.com",
  "bulgarihotels.com",
  "m.ahstatic.com",
  "accor.com",
  "belmond.com",
  "aman.com",
  "sixsenses.com",
  "capellahotels.com",
  "anantara.com",
  "kempinski.com",
  "tripadvisor.com",
  "agoda.net",
];

export function localHotelMediaPath(slug: string, index = 0): string {
  return index === 0 ? `/hotel-media/${slug}.jpg` : `/hotel-media/${slug}-${index + 1}.jpg`;
}

export function localHotelMediaFile(slug: string, index = 0): string {
  const name = index === 0 ? `${slug}.jpg` : `${slug}-${index + 1}.jpg`;
  return join(process.cwd(), "public/hotel-media", name);
}

function hostScore(url: string): number {
  const lower = url.toLowerCase();
  if (REJECT_HOSTS.some((h) => lower.includes(h))) return -20;
  const idx = PREFERRED_HOSTS.findIndex((h) => lower.includes(h));
  if (idx >= 0) return 40 - idx;
  if (/\.(jpg|jpeg|webp)/i.test(url) && url.length > 60) return 5;
  return 1;
}

function rankImageUrls(urls: string[]): string[] {
  return [...urls]
    .filter((u) => !isBadImageUrl(u))
    .sort((a, b) => hostScore(b) - hostScore(a));
}

async function bingImageSearch(query: string): Promise<string[]> {
  const res = await fetch(
    `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:photo-photo`,
    {
      headers: {
        "User-Agent": UA,
        Accept: "text/html",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      },
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

export async function cacheHotelImageLocally(
  slug: string,
  imageUrl: string,
  index = 0
): Promise<string | null> {
  const outFile = localHotelMediaFile(slug, index);
  if (existsSync(outFile)) return localHotelMediaPath(slug, index);

  const referer = imageUrl.includes("ctrip")
    ? "https://hotels.ctrip.com/"
    : imageUrl.includes("qunar")
      ? "https://www.qunar.com/"
      : imageUrl.includes("booking")
        ? "https://www.booking.com/"
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
    if (buf.length < 6000) return null;

    mkdirSync(join(process.cwd(), "public/hotel-media"), { recursive: true });
    writeFileSync(outFile, buf);
    return localHotelMediaPath(slug, index);
  } catch {
    return null;
  }
}

export async function fetchHotelImageCandidates(
  hotel: Pick<HotelEntry, "name" | "city" | "cityZh" | "brandSlug" | "countryCode"> & {
    nameZh?: string | null;
  }
): Promise<string[]> {
  const label = hotel.nameZh || hotel.name;
  const queries = isGreaterChinaHotel(hotel.countryCode)
    ? [
        `${label} 酒店 套房 泳池`,
        `${label} 酒店 外观`,
        `site:ctrip.com ${label}`,
        `${hotel.name} ${hotel.city} luxury hotel`,
      ]
    : [
        `${hotel.name} ${hotel.city} luxury hotel suite`,
        `${hotel.name} ${hotel.city} hotel pool exterior`,
        `site:booking.com ${hotel.name} ${hotel.city}`,
        `${label} ${hotel.cityZh} 酒店`,
      ];

  const merged: string[] = [];
  for (const q of queries) {
    try {
      const found = await bingImageSearch(q);
      merged.push(...found);
      if (merged.filter((u) => hostScore(u) >= 20).length >= 8) break;
    } catch {
      /* next */
    }
    await new Promise((r) => setTimeout(r, 450));
  }

  const seen = new Set<string>();
  return rankImageUrls(merged).filter((u) => {
    if (hostScore(u) < 0) return false;
    const key = u.split("?")[0];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function resolveHotelMediaBundle(
  hotel: Pick<HotelEntry, "slug" | "name" | "city" | "cityZh" | "brandSlug" | "countryCode"> & {
    nameZh?: string | null;
  },
  targetCount = 6
): Promise<{ heroImage: string; galleryImages: string[]; source: string } | null> {
  const existing: string[] = [];
  for (let i = 0; i < targetCount; i++) {
    if (existsSync(localHotelMediaFile(hotel.slug, i))) {
      existing.push(localHotelMediaPath(hotel.slug, i));
    }
  }
  if (existing.length >= targetCount) {
    return {
      heroImage: existing[0],
      galleryImages: existing,
      source: "local-cache",
    };
  }

  const candidates = await fetchHotelImageCandidates(hotel);
  const gallery: string[] = [...existing];
  const usedUrls = new Set<string>();

  for (const url of candidates) {
    if (gallery.length >= targetCount) break;
    const key = url.split("?")[0];
    if (usedUrls.has(key)) continue;
    usedUrls.add(key);

    const local = await cacheHotelImageLocally(hotel.slug, url, gallery.length);
    if (local) gallery.push(local);
  }

  if (gallery.length === 0) return null;

  const source =
    gallery.length >= targetCount
      ? `bing:${candidates[0] ? new URL(candidates[0]).hostname : "multi"}`
      : `bing-partial:${gallery.length}`;

  return {
    heroImage: gallery[0],
    galleryImages: gallery,
    source,
  };
}