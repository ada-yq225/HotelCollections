import { isBadImageUrl, pickBestImage } from "@/lib/hotel-cover-image";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122";

/** Try Wikipedia thumbnail for a hotel property */
export async function fetchWikipediaHotelImage(
  name: string,
  city: string
): Promise<string | undefined> {
  const queries = [
    `${name} ${city} hotel`,
    `${name} hotel`,
    name,
  ];

  for (const q of queries) {
    try {
      const params = new URLSearchParams({
        action: "query",
        generator: "search",
        gsrsearch: q,
        gsrlimit: "3",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: "1600",
        format: "json",
        origin: "*",
      });
      const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        query?: { pages?: Record<string, { thumbnail?: { source?: string }; title?: string }> };
      };
      const pages = data.query?.pages ?? {};
      for (const page of Object.values(pages)) {
        const src = page.thumbnail?.source;
        const title = page.title?.toLowerCase() ?? "";
        if (!src || isBadImageUrl(src)) continue;
        if (title.includes("hotel") || title.includes(city.toLowerCase()) || title.includes(name.toLowerCase().slice(0, 8))) {
          return src.replace(/\/\d+px-/, "/1200px-");
        }
      }
    } catch {
      /* try next query */
    }
  }
  return undefined;
}

export async function resolveFallbackHeroImage(
  hotel: { name: string; nameZh: string | null; city: string; cityZh: string },
  existing: string[]
): Promise<string | undefined> {
  const wiki = await fetchWikipediaHotelImage(hotel.name, hotel.city);
  if (wiki && !isBadImageUrl(wiki)) return wiki;
  return pickBestImage(existing);
}