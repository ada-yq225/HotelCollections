export type ExperienceTag = {
  slug: string;
  label: string;
  color: string;
};

const TAG_DEFS: Record<string, Omit<ExperienceTag, "slug">> = {
  "island-resort": { label: "海岛度假", color: "#0ea5e9" },
  safari: { label: "游猎探险", color: "#854d0e" },
  "city-luxury": { label: "城市奢华", color: "#1a1a1a" },
  "ski-alps": { label: "阿尔卑斯滑雪", color: "#64748b" },
  wellness: { label: "康养疗愈", color: "#059669" },
  "heritage-palace": { label: "古堡庄园", color: "#7c3aed" },
  "design-boutique": { label: "设计精品", color: "#db2777" },
  "overwater-villa": { label: "水上别墅", color: "#0284c7" },
  "gastronomy": { label: "米其林餐饮", color: "#b45309" },
  "family-resort": { label: "亲子度假", color: "#f59e0b" },
  "business-hub": { label: "商务枢纽", color: "#475569" },
  "cultural-immersion": { label: "文化沉浸", color: "#9333ea" },
};

const RESORT_REGIONS = new Set([
  "maldives", "tahiti", "fiji", "caribbean", "bodrum", "bali", "phuket",
  "samui", "phu-quoc", "safari", "indian-ocean", "southeast-asia-island",
  "hawaii", "mexico-resort", "mediterranean", "alps",
]);

const ISLAND_CODES = new Set(["MV", "PF", "FJ", "SC", "BS", "TC", "MU", "MG"]);

const DESIGN_BRANDS = new Set([
  "edition", "w-hotels", "andaz", "alila", "patina", "sofitel-legend",
]);

const PALACE_BRANDS = new Set([
  "ritz-carlton", "st-regis", "raffles", "peninsula", "mandarin-oriental",
  "rosewood", "aman",
]);

const GASTRO_REGIONS = new Set(["paris", "tokyo", "hongkong", "singapore", "london"]);

export function inferExperienceTags(hotel: {
  region: string;
  countryCode: string;
  brandSlug: string;
  city?: string;
  cityZh?: string;
}): ExperienceTag[] {
  const slugs = new Set<string>();

  if (hotel.region === "safari" || hotel.brandSlug.includes("singita")) {
    slugs.add("safari");
  }

  if (
    RESORT_REGIONS.has(hotel.region) ||
    ISLAND_CODES.has(hotel.countryCode) ||
    hotel.brandSlug.includes("maldives") ||
    hotel.brandSlug.includes("resort")
  ) {
    slugs.add("island-resort");
  }

  if (
    hotel.region === "maldives" ||
    hotel.brandSlug.includes("overwater") ||
    ["soneva", "joali", "gili", "huvafen", "velaa", "niyama", "milaidhoo"].some((b) =>
      hotel.brandSlug.includes(b)
    )
  ) {
    slugs.add("overwater-villa");
  }

  if (hotel.region === "alps" || hotel.city?.toLowerCase().includes("zermatt")) {
    slugs.add("ski-alps");
  }

  if (DESIGN_BRANDS.has(hotel.brandSlug)) {
    slugs.add("design-boutique");
  }

  if (PALACE_BRANDS.has(hotel.brandSlug)) {
    slugs.add("heritage-palace");
  }

  if (
    ["six-senses", "como", "anantara", "banyan-tree"].includes(hotel.brandSlug) ||
    hotel.region === "wellness"
  ) {
    slugs.add("wellness");
  }

  const cityKey = (hotel.cityZh || hotel.city || "").toLowerCase();
  if (
    GASTRO_REGIONS.has(cityKey) ||
    ["ritz-carlton", "mandarin-oriental", "four-seasons", "peninsula"].includes(hotel.brandSlug)
  ) {
    slugs.add("gastronomy");
  }

  if (
    ["beijing", "shanghai", "hongkong", "singapore", "dubai", "tokyo", "london", "paris", "new-york"].some(
      (c) => hotel.region.includes(c) || cityKey.includes(c)
    ) &&
    !RESORT_REGIONS.has(hotel.region)
  ) {
    slugs.add("city-luxury");
    slugs.add("business-hub");
  }

  if (
    hotel.brandSlug.includes("kids") ||
    ["club-med", "anantara", "banyan-tree"].includes(hotel.brandSlug)
  ) {
    slugs.add("family-resort");
  }

  if (["china", "japan", "india", "morocco", "peru"].some((c) => hotel.region.includes(c))) {
    slugs.add("cultural-immersion");
  }

  if (slugs.size === 0) {
    if (RESORT_REGIONS.has(hotel.region)) slugs.add("island-resort");
    else slugs.add("city-luxury");
  }

  return [...slugs].map((slug) => ({
    slug,
    ...TAG_DEFS[slug],
  }));
}

export const ALL_EXPERIENCE_TAGS: ExperienceTag[] = Object.entries(TAG_DEFS).map(
  ([slug, def]) => ({ slug, ...def })
);

export function hotelMatchesExperienceTag(
  hotel: Parameters<typeof inferExperienceTags>[0],
  tagSlug: string
): boolean {
  return inferExperienceTags(hotel).some((t) => t.slug === tagSlug);
}