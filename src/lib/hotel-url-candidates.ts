import type { HotelEntry } from "@/data/hotels/types";
import { resolveOfficialUrl, resolveOfficialUrlZh } from "@/lib/hotel-official-url";
import { MARRIOTT_CHINA_HOTEL_URLS } from "@/data/marriott-china-urls";
import { isGreaterChinaHotel } from "@/lib/hotel-media-cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.'']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Ordered list of official URLs to try when fetching hotel media */
export function resolveUrlCandidates(
  hotel: Pick<HotelEntry, "slug" | "brandSlug" | "name" | "city" | "countryCode" | "country">
): string[] {
  const seen = new Set<string>();
  const add = (url: string | null | undefined) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    candidates.push(url);
  };

  const candidates: string[] = [];
  const primary = resolveOfficialUrl(hotel);
  add(primary);
  if (primary) {
    const zh = resolveOfficialUrlZh(primary);
    add(zh);
  }

  if (isGreaterChinaHotel(hotel.countryCode)) {
    add(MARRIOTT_CHINA_HOTEL_URLS[hotel.slug]);
    if (hotel.brandSlug === "shangri-la") {
      add(`https://www.shangri-la.com/cn/${hotel.city.toLowerCase().replace(/\s+/g, "-")}/`);
    }
    if (hotel.brandSlug === "peninsula") {
      add(`https://www.peninsula.com/zh-cn/${hotel.city.toLowerCase().replace(/\s+/g, "-")}`);
    }
  }

  const loc = hotel.slug.replace(/^(ritz-carlton|fairmont|raffles|waldorf-astoria|conrad|park-hyatt|andaz|st-regis|w-|jw-marriott|edition)-/, "");

  if (hotel.brandSlug === "ritz-carlton" || hotel.brandSlug === "ritz-carlton-reserve") {
    const property = hotel.slug.replace(/^ritz-carlton-/, "").replace(/-reserve$/, "");
    add(`https://www.ritzcarlton.com/en/hotels/${property}`);
    add(`https://www.ritzcarlton.com/en/hotels/${property}/photos/`);
    const city = slugify(hotel.city);
    if (city !== property) add(`https://www.ritzcarlton.com/en/hotels/${city}`);
  }

  if (hotel.brandSlug === "fairmont") {
    const property = hotel.slug.replace(/^fairmont-/, "");
    add(`https://www.fairmont.com/${property}/`);
    add(`https://www.fairmont.com/en/hotels/${slugify(hotel.city)}/${property}.html`);
  }

  if (hotel.brandSlug === "raffles") {
    const property = hotel.slug.replace(/^raffles-/, "");
    add(`https://www.raffles.com/${property}/`);
    add(`https://www.raffles.com/${slugify(hotel.city)}/`);
  }

  if (hotel.brandSlug === "mandarin-oriental" || hotel.slug.startsWith("mandarin-oriental-")) {
    const path = hotel.slug.replace(/^mandarin-oriental-/, "").replace(/-/g, "/");
    add(`https://www.mandarinoriental.com/en/${path}`);
  }

  if (hotel.brandSlug === "waldorf-astoria" || hotel.brandSlug === "conrad") {
    add(`https://www.hilton.com/en/hotels/${hotel.slug}/`);
    const brand = hotel.brandSlug === "conrad" ? "conrad" : "waldorf-astoria";
    add(`https://www.hilton.com/en/hotels/${loc}${brand}/`);
  }

  if (hotel.brandSlug === "park-hyatt" || hotel.brandSlug === "andaz" || hotel.brandSlug === "alila") {
    const brandPath = hotel.brandSlug === "park-hyatt" ? "park-hyatt" : hotel.brandSlug;
    add(`https://www.hyatt.com/${brandPath}/en-US/${hotel.slug}`);
    add(`https://www.hyatt.com/en-US/hotel/${slugify(hotel.country)}/${slugify(hotel.city)}/${hotel.slug}`);
  }

  if (
    hotel.brandSlug === "st-regis" ||
    hotel.brandSlug === "w-hotels" ||
    hotel.brandSlug === "jw-marriott" ||
    hotel.brandSlug === "edition" ||
    hotel.brandSlug === "luxury-collection"
  ) {
    add(`https://www.marriott.com/en-us/hotels/${hotel.slug}/overview/`);
  }

  if (hotel.brandSlug === "shangri-la") {
    add(`https://www.shangri-la.com/${slugify(hotel.city)}/shangrila/`);
    add(`https://www.shangri-la.com/cn/${slugify(hotel.city)}/shangrila/`);
  }

  if (hotel.brandSlug === "peninsula") {
    add(`https://www.peninsula.com/en/${slugify(hotel.city)}`);
  }

  if (hotel.brandSlug === "six-senses") {
    const path = hotel.slug.replace(/^six-senses-/, "").replace(/-/g, "/");
    add(`https://www.sixsenses.com/en/hotels/${path}`);
  }

  if (hotel.brandSlug === "intercontinental" || hotel.brandSlug === "regent") {
    add(`https://www.ihg.com/${hotel.brandSlug}/hotels/gb/en/${slugify(hotel.city)}/${hotel.slug}/hoteldetail`);
    add(`https://www.ihg.com/${hotel.brandSlug}/hotels/us/en/${slugify(hotel.city)}/${hotel.slug}/hoteldetail`);
  }

  return candidates;
}