import type { HotelEntry } from "@/data/hotels/types";

/** Slug → official property path overrides (brand sites use non-obvious URLs) */
const FOUR_SEASONS_PATHS: Record<string, string> = {
  "four-seasons-bali-sayan": "sayan",
  "four-seasons-bali-jimbaran": "jimbaranbay",
  "four-seasons-maldives-kuda": "kudahuraa",
  "four-seasons-maldives-landaa": "landaagiraavaru",
  "four-seasons-maldives-voavah": "privateisland",
  "four-seasons-hong-kong": "hongkong",
  "four-seasons-new-york-downtown": "newyorkdowntown",
  "four-seasons-los-angeles": "losangeles",
  "four-seasons-san-francisco": "sanfrancisco",
  "four-seasons-las-vegas": "lasvegas",
  "four-seasons-washington-dc": "washington",
  "four-seasons-koh-samui": "kohsamui",
  "four-seasons-hoi-an": "hoian",
  "four-seasons-costa-palmas": "costapalmas",
  "four-seasons-surfside-miami": "surfclub",
  "four-seasons-jackson-hole": "jacksonhole",
  "four-seasons-orlando-disney": "orlando",
  "four-seasons-napa-valley": "napavalley",
  "four-seasons-golden-triangle": "goldentriangle",
  "four-seasons-desroches-seychelles": "desroches",
  "four-seasons-pearl-qatar": "doha",
  "four-seasons-oahu-ko-olina": "oahu",
  "four-seasons-london-park-lane": "parklane",
  "four-seasons-london-ten-trinity": "tentrinitysquare",
  "four-seasons-istanbul-bosphorus": "bosphorus",
  "four-seasons-cairo-nile-plaza": "nileplaza",
  "four-seasons-cairo-first-residence": "firstresidence",
  "four-seasons-dubai-difc": "difc",
  "four-seasons-dubai-jumeirah": "jumeirahbeach",
  "four-seasons-abu-dhabi": "abudhabi",
  "four-seasons-red-sea": "redsea",
  "four-seasons-cap-ferrat": "capferrat",
  "four-seasons-costa-navarino": "costanavarino",
  "four-seasons-lion-palace": "stpetersburg",
};

const MANDARIN_ORIENTAL_PATHS: Record<string, string> = {
  "mandarin-oriental-bangkok": "bangkok/chao-phraya-river",
  "mandarin-oriental-beijing": "beijing/wangfujing",
  "mandarin-oriental-beijing-qianmen": "beijing/qianmen",
  "mandarin-oriental-bodrum": "bodrum/bodrum",
  "mandarin-oriental-boston": "boston/boston",
  "mandarin-oriental-barcelona": "barcelona/passeig-de-gracia",
  "mandarin-oriental-chengdu": "chengdu/taikoo-li",
  "mandarin-oriental-doha": "doha/msheireb",
  "mandarin-oriental-dubai": "dubai/jumeira",
  "mandarin-oriental-dubai-downtown": "dubai/downtown",
  "mandarin-oriental-geneva": "geneva/geneva",
  "mandarin-oriental-guangzhou": "guangzhou/tianhe",
  "mandarin-oriental-hong-kong": "hong-kong/victoria-harbour",
  "mandarin-oriental-landmark-hong-kong": "hong-kong/the-landmark",
  "mandarin-oriental-jakarta": "jakarta/jakarta",
  "mandarin-oriental-kuala-lumpur": "kuala-lumpur/kuala-lumpur",
  "mandarin-oriental-lake-como": "lake-como/lake-como",
  "mandarin-oriental-london": "london/hyde-park",
  "mandarin-oriental-london-mayfair": "london/mayfair",
  "mandarin-oriental-lucerne": "luzern/palace",
  "mandarin-oriental-macau": "macau/one-central",
  "mandarin-oriental-madrid": "madrid/hotel-ritz-madrid",
  "mandarin-oriental-marrakech": "marrakech/marrakech",
  "mandarin-oriental-mexico-city": "mexico-city/polanco",
  "mandarin-oriental-milan": "milan/la-scala",
  "mandarin-oriental-munich": "munich/altstadt",
  "mandarin-oriental-new-york": "new-york/manhattan",
  "mandarin-oriental-paris": "paris/place-vendome",
  "mandarin-oriental-lutetia-paris": "paris/lutetia",
  "mandarin-oriental-prague": "prague/prague",
  "mandarin-oriental-sanya": "sanya/sanya",
  "mandarin-oriental-shanghai": "shanghai/pudong",
  "mandarin-oriental-shenzhen": "shenzhen/futian",
  "mandarin-oriental-singapore": "singapore/marina-bay",
  "mandarin-oriental-taipei": "taipei/taipei",
  "mandarin-oriental-tokyo": "tokyo/nihonbashi",
  "mandarin-oriental-maldives": "maldives/fari-islands",
  "mandarin-oriental-abu-dhabi": "abu-dhabi/emirates-palace",
  "mandarin-oriental-istanbul": "istanbul/bosphorus",
  "mandarin-oriental-vienna": "vienna/vienna",
  "mandarin-oriental-zurich": "zurich/savoy",
  "mandarin-oriental-amsterdam": "amsterdam/conservatorium",
  "mandarin-oriental-cortina": "cortina/cristallo",
  "mandarin-oriental-mallorca": "mallorca/punta-negra",
  "mandarin-oriental-costa-navarino": "costa-navarino/costa-navarino",
  "mandarin-oriental-desaru-coast": "desaru-coast/desaru-coast",
  "mandarin-oriental-canouan": "canouan/canouan",
  "mandarin-oriental-santiago": "santiago/santiago",
  "mandarin-oriental-muscat": "muscat/muscat",
  "mandarin-oriental-riyadh": "riyadh/al-faisaliah",
};

const CHEVAL_BLANC_PATHS: Record<string, string> = {
  "cheval-blanc-paris": "paris",
  "cheval-blanc-randheli": "randheli",
  "cheval-blanc-st-barth": "saint-barth",
  "cheval-blanc-courchevel": "courchevel",
  "cheval-blanc-seychelles": "seychelles",
};

const AMAN_PATHS: Record<string, string> = {
  "amanpuri-phuket": "amanpuri",
  "amandari-bali": "amandari",
  "amankila-bali": "amankila",
  "amanruya-bodrum": "amanruya",
};

const ROSEWOOD_PATHS: Record<string, string> = {
  "rosewood-phuket": "phuket",
};

function fourSeasonsPath(slug: string): string {
  if (FOUR_SEASONS_PATHS[slug]) return FOUR_SEASONS_PATHS[slug];
  return slug.replace(/^four-seasons-/, "").replace(/-/g, "");
}

function mandarinPath(slug: string): string | null {
  return MANDARIN_ORIENTAL_PATHS[slug] ?? null;
}

function chevalBlancPath(slug: string): string | null {
  return CHEVAL_BLANC_PATHS[slug] ?? null;
}

function amanPath(slug: string): string | null {
  return AMAN_PATHS[slug] ?? slug.replace(/^aman-/, "").replace(/-/g, "");
}

function rosewoodPath(slug: string): string | null {
  return ROSEWOOD_PATHS[slug] ?? slug.replace(/^rosewood-/, "");
}

/** Resolve the best-guess official property URL for a hotel */
export function resolveOfficialUrl(hotel: Pick<HotelEntry, "slug" | "brandSlug" | "name" | "city">): string | null {
  if (hotel.slug.startsWith("four-seasons-")) {
    return `https://www.fourseasons.com/${fourSeasonsPath(hotel.slug)}/`;
  }
  if (hotel.slug.startsWith("mandarin-oriental-")) {
    const path = mandarinPath(hotel.slug);
    if (path) return `https://www.mandarinoriental.com/en/${path}`;
  }
  if (hotel.slug.startsWith("cheval-blanc-")) {
    const path = chevalBlancPath(hotel.slug);
    if (path) return `https://www.chevalblanc.com/en/maison/${path}`;
  }
  if (hotel.brandSlug === "aman" || hotel.slug.startsWith("aman")) {
    const path = amanPath(hotel.slug);
    if (path) return `https://www.aman.com/resorts/${path}`;
  }
  if (hotel.brandSlug === "rosewood" || hotel.slug.startsWith("rosewood-")) {
    const path = rosewoodPath(hotel.slug);
    if (path) return `https://www.rosewoodhotels.com/en/${path}`;
  }
  if (hotel.brandSlug === "banyan-tree") {
    const loc = hotel.slug.replace(/^banyan-tree-/, "");
    return `https://www.banyantree.com/en/thailand/${loc}`;
  }
  if (hotel.brandSlug === "six-senses") {
    const loc = hotel.slug.replace(/^six-senses-/, "");
    return `https://www.sixsenses.com/en/hotels/${loc.replace(/-/g, "/")}`;
  }
  if (hotel.brandSlug === "como") {
    const loc = hotel.slug.replace(/^(como-|trisara-)/, "");
    return `https://www.comohotels.com/${loc.replace(/-/g, "/")}`;
  }
  if (hotel.brandSlug === "regent") {
    return `https://www.ihg.com/regent/hotels/us/en/${hotel.city.toLowerCase().replace(/\s+/g, "-")}/${hotel.slug}`;
  }
  if (hotel.brandSlug === "ritz-carlton" || hotel.brandSlug === "ritz-carlton-reserve") {
    const loc = hotel.slug.replace(/^ritz-carlton-/, "").replace(/-reserve$/, "");
    return `https://www.ritzcarlton.com/en/hotels/${loc}`;
  }
  if (hotel.brandSlug === "st-regis") {
    return `https://www.marriott.com/en-us/hotels/search?query=${encodeURIComponent(hotel.name)}`;
  }
  if (hotel.brandSlug === "peninsula") {
    return `https://www.peninsula.com/en/${hotel.city.toLowerCase().replace(/\s+/g, "-")}`;
  }
  if (hotel.brandSlug === "capella") {
    const loc = hotel.slug.replace(/^capella-/, "");
    return `https://capellahotels.com/en/capella-hotels-and-resorts/${loc}`;
  }
  if (hotel.brandSlug === "bulgari" || hotel.slug.startsWith("bulgari-")) {
    return `https://www.bulgarihotels.com/en_US/${hotel.city.toLowerCase()}`;
  }
  if (hotel.slug.startsWith("bulgari-")) {
    return `https://www.bulgarihotels.com/en_US/bali`;
  }

  return null;
}

/** Chinese locale URL when the brand supports it */
export function resolveOfficialUrlZh(websiteUrl: string): string | null {
  if (websiteUrl.includes("mandarinoriental.com/en/")) {
    return websiteUrl.replace("/en/", "/zh-cn/");
  }
  if (websiteUrl.includes("fourseasons.com")) {
    return websiteUrl.replace("www.fourseasons.com", "www.fourseasons.com/zh/hotels");
  }
  if (websiteUrl.includes("aman.com/resorts/")) {
    return websiteUrl.replace("aman.com/resorts/", "aman.com/zh-cn/resorts/");
  }
  return null;
}