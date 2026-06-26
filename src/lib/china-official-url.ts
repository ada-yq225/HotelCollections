import type { HotelEntry } from "@/data/hotels/types";
import { MARRIOTT_CHINA_HOTEL_URLS } from "@/data/marriott-china-urls";
import { isGreaterChinaHotel } from "@/lib/hotel-media-paths";

/** Map an English official URL to its Chinese locale equivalent when supported */
export function toChineseLocaleUrl(url: string): string | null {
  if (isChineseLocaleUrl(url)) return url;
  if (url.includes("marriott.com/en-us/")) return url.replace("/en-us/", "/zh-cn/");
  if (url.includes("marriott.com/") && !url.includes("/zh-cn/")) {
    return url.replace("marriott.com/", "marriott.com/zh-cn/");
  }
  if (url.includes("hyatt.com") && url.includes("/en-US/")) return url.replace("/en-US/", "/zh-CN/");
  if (url.includes("hyatt.com") && url.includes("/en-us/")) return url.replace("/en-us/", "/zh-cn/");
  if (url.includes("fourseasons.com/") && !url.includes("/zh/")) {
    const path = url.replace("https://www.fourseasons.com/", "").replace(/\/$/, "");
    return `https://www.fourseasons.com/zh/hotels/${path}/`;
  }
  if (url.includes("mandarinoriental.com/en/")) return url.replace("/en/", "/zh-cn/");
  if (url.includes("shangri-la.com") && !url.includes("/cn/")) {
    return url.replace("www.shangri-la.com/", "www.shangri-la.com/cn/");
  }
  if (url.includes("peninsula.com/en/")) return url.replace("/en/", "/zh-cn/");
  if (url.includes("rosewoodhotels.com/en/")) return url.replace("/en/", "/zh-hans/");
  if (url.includes("aman.com/resorts/")) return url.replace("aman.com/resorts/", "aman.com/zh-cn/resorts/");
  if (url.includes("ihg.com") && url.includes("/gb/en/")) return url.replace("/gb/en/", "/cn/zh/");
  if (url.includes("hilton.com/")) return null; // Hilton uses hilton.com.cn for Chinese, don't convert
  if (url.includes("ritzcarlton.com")) return null;
  return null;
}

/** Prefer zh-cn / cn locale official pages for Greater China hotels */
export function resolveChinaPrimaryUrl(
  hotel: Pick<HotelEntry, "slug" | "brandSlug" | "countryCode">,
  fallbackUrl: string | null
): string | null {
  if (!isGreaterChinaHotel(hotel.countryCode)) return fallbackUrl;

  const marriottZh = MARRIOTT_CHINA_HOTEL_URLS[hotel.slug];
  if (marriottZh) return marriottZh;

  if (!fallbackUrl) return null;
  return toChineseLocaleUrl(fallbackUrl) ?? fallbackUrl;
}

export function isChineseLocaleUrl(url: string): boolean {
  return /\/(zh-cn|zh-CN|zh-hans|\/cn\/|\/zh\/)/i.test(url);
}