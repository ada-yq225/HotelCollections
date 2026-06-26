import type { HotelEntry } from "@/data/hotels/types";
import discoveredUrlsData from "@/data/hotel-url-discovered.json";

const discoveredUrls = discoveredUrlsData as Record<string, string>;

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

const SHANGRI_LA_PATHS: Record<string, string> = {
  "shangri-la-singapore": "singapore/shangrila",
  "shangri-la-tokyo": "tokyo/shangrila",
  "shangri-la-bangkok": "bangkok/shangrila",
  "shangri-la-hong-kong": "hongkong/shangrila",
  "shangri-la-kerry-hong-kong": "hongkong/kerry",
  "shangri-la-beijing": "beijing/shangrila",
  "shangri-la-china-world-beijing": "beijing/chinaworld",
  "shangri-la-shanghai": "shanghai/shangrila",
  "shangri-la-pudong-shanghai": "shanghai/pudongshangrila",
  "shangri-la-guangzhou": "guangzhou/shangrila",
  "shangri-la-shenzhen": "shenzhen/shangrila",
  "shangri-la-chengdu": "chengdu/shangrila",
  "shangri-la-hangzhou": "hangzhou/shangrila",
  "shangri-la-sanya": "sanya/shangrila",
  "shangri-la-paris": "paris/shangrila",
  "shangri-la-london": "london/shangrila",
  "shangri-la-sydney": "sydney/shangrila",
  "shangri-la-dubai": "dubai/shangrila",
  "shangri-la-abu-dhabi": "abudhabi/shangrila",
  "shangri-la-boracay": "boracay/shangrila",
  "shangri-la-mactan": "cebu/shangrila",
  "shangri-la-borneo": "kotakinabalu/shangrila",
};

const PENINSULA_PATHS: Record<string, string> = {
  "peninsula-hong-kong": "hong-kong/5-star-luxury-hotel-kowloon",
  "peninsula-shanghai": "shanghai/5-star-luxury-hotel-bund",
  "peninsula-beijing": "beijing/5-star-luxury-hotel-wangfujing",
  "peninsula-tokyo": "tokyo/5-star-luxury-hotel-ginza",
  "peninsula-bangkok": "bangkok/5-star-luxury-hotel-riverside",
  "peninsula-manila": "manila/5-star-luxury-hotel-makati",
  "peninsula-chicago": "chicago/5-star-luxury-hotel-magnificent-mile",
  "peninsula-new-york": "new-york/5-star-luxury-hotel-fifth-avenue",
  "peninsula-london": "london/5-star-luxury-hotel-belgravia",
  "peninsula-paris": "paris/5-star-luxury-hotel-16th-arrondissement",
};

const HOTEL_URL_OVERRIDES: Record<string, string> = {
  "bulgari-beijing": "https://www.bulgarihotels.com/en_US/beijing",
  "bulgari-shanghai": "https://www.bulgarihotels.com/en_US/shanghai",
  "bulgari-milan": "https://www.bulgarihotels.com/en_US/milan",
  "bulgari-london": "https://www.bulgarihotels.com/en_US/london",
  "bulgari-dubai": "https://www.bulgarihotels.com/en_US/dubai",
  "bulgari-bali": "https://www.bulgarihotels.com/en_US/bali",
  "bulgari-paris": "https://www.bulgarihotels.com/en_US/paris",
  "bulgari-tokyo": "https://www.bulgarihotels.com/en_US/tokyo",
  "bulgari-rome": "https://www.bulgarihotels.com/en_US/rome",
  "middle-house-shanghai": "https://www.thehousecollective.com/en/shanghai/the-middle-house/",
  "upper-house-hong-kong": "https://www.upperhouse.com/en/",
  "murray-hong-kong": "https://www.niccolohotels.com/en/hongkong/themurray",
  "niccolo-chengdu": "https://www.niccolohotels.com/en/chengdu",
  "niccolo-changsha": "https://www.niccolohotels.com/en/changsha",
  "niccolo-suzhou": "https://www.niccolohotels.com/en/suzhou",
  "niccolo-chongqing": "https://www.niccolohotels.com/en/chongqing",
  "opposite-house-beijing": "https://www.thehousecollective.com/en/beijing/the-opposite-house/",
  "east-beijing": "https://www.thehousecollective.com/en/beijing/east-beijing/",
  "j-hotel-shanghai": "https://www.jhotel-shanghai.com/en/",
  "hotel-des-arts-saigon": "https://www.hoteldesartssaigon.com/",
  "conservatorium-amsterdam": "https://www.conservatoriumhotel.com/",
  "ciragan-palace-istanbul": "https://www.kempinski.com/en/istanbul/ciragan-palace-kempinski-istanbul",
  "grand-hotel-stockholm": "https://www.grandhotel.se/en/",
  "nimb-hotel-copenhagen": "https://www.dangleterre.com/",
  "sommerro-oslo": "https://www.sommerrohouse.com/",
  "shangri-la-santa-monica": "https://www.hotelcasadelmar.com/",
  "proper-san-francisco": "https://www.properhotel.com/san-francisco/",
  "faena-miami-beach": "https://www.faena.com/miami-beach",
  "jefferson-washington-dc": "https://www.jeffersondc.com/",
  "encore-las-vegas": "https://www.wynnlasvegas.com/encore",
  "chable-maroma": "https://chablemaroma.com/",
  "jade-mountain-st-lucia": "https://jademountain.com/",
  "alvear-palace-buenos-aires": "https://www.alvearpalace.com/en/",
  "fasano-rio": "https://www.fasano.com.br/en/hotels/fasano-rio-de-janeiro/",
  "halekulani-waikiki": "https://www.halekulani.com/",
  "vomo-island-fiji": "https://www.vomo.com/",
  "lizard-island-resort": "https://www.lizardisland.com.au/",
  "southern-ocean-lodge": "https://www.southernoceanlodge.com.au/",
  "cape-fahn-samui": "https://www.capefahn.com/",
  "new-world-phu-quoc": "https://www.newworldhotels.com/en/hotels/phu-quoc",
  "sri-panwa-phuket": "https://www.sripanwa.com/",
  "keemala-phuket": "https://www.keemala.com/",
  "mulia-bali": "https://www.themulia.com/",
  "paresa-phuket": "https://www.paresaresorts.com/",
  "the-shore-phuket": "https://www.theshorephuket.com/",
  "gili-lankanfushi": "https://www.gili-lankanfushi.com/",
  "huvafen-fushi": "https://www.huvafenfushi.com/",
  "velaa-private-island": "https://www.velaaprivateisland.com/",
  "niyama-private-islands": "https://www.niyama.com/",
  "nautilus-maldives": "https://www.thenautilusmaldives.com/",
  "baglioni-maldives": "https://www.baglionihotels.com/maldives",
  "kudadoo-maldives": "https://www.kudadoo.com/",
  "hurawalhi-maldives": "https://www.hurawalhi.com/",
  "milaidhoo-island": "https://www.milaidhoo.com/",
  "baros-maldives": "https://www.baros.com/",
  "vakkaru-maldives": "https://vakkarumaldives.com/",
  "amilla-maldives": "https://www.amilla.com/",
  "ayada-maldives": "https://www.ayadamaldives.com/",
  "the-brando-tetiaroa": "https://thebrando.com/",
  "le-tahaa-island-resort": "https://www.letahaa.com/",
  "north-island-seychelles": "https://www.north-island.com/",
  "likuliku-lagoon-fiji": "https://www.likulikulagoon.com/",
  "qualia-hamilton-island": "https://www.qualia.com.au/",
  "singita-sabi-sand-boulders": "https://singita.com/lodge/singita-boulders-lodge/",
  "singita-kruger-lebombo": "https://singita.com/lodge/singita-lebombo-lodge/",
  "singita-grumeti-sasakwa": "https://singita.com/lodge/singita-sasakwa-lodge/",
  "the-datai-langkawi": "https://www.thedatai.com/",
  "miraval-austin": "https://www.miravalresorts.com/austin",
  "intercontinental-bora-bora": "https://thalasso.intercontinental.com/",
  "intercontinental-bora-bora-thalasso": "https://thalasso.intercontinental.com/",
  "intercontinental-bora-bora-le-moana": "https://moana.intercontinental.com/",
  "intercontinental-phuket": "https://www.intercontinentalphuket.com/",
  "intercontinental-bali": "https://bali.intercontinental.com/",
  "intercontinental-maldives-maamunagau": "https://maldives.intercontinental.com/",
  "intercontinental-tahiti-resort": "https://www.ihg.com/intercontinental/hotels/us/en/papeete/pptih-intercontinental-resort-tahiti",
};

const COUNTRY_SLUG: Record<string, string> = {
  JP: "japan",
  US: "united-states",
  GB: "united-kingdom",
  FR: "france",
  IT: "italy",
  DE: "germany",
  AU: "australia",
  SG: "singapore",
  TH: "thailand",
  KR: "south-korea",
  AE: "united-arab-emirates",
  CN: "china",
  HK: "hong-kong",
  ID: "indonesia",
  ES: "spain",
  AT: "austria",
  CH: "switzerland",
  NL: "netherlands",
  CR: "costa-rica",
  AR: "argentina",
  KN: "saint-kitts-and-nevis",
  MX: "mexico",
  CA: "canada",
  TR: "turkey",
  EG: "egypt",
  VN: "vietnam",
  IN: "india",
  MC: "monaco",
  CO: "colombia",
  PA: "panama",
  KH: "cambodia",
  SC: "seychelles",
  IL: "israel",
  SA: "saudi-arabia",
  PT: "portugal",
  GR: "greece",
  FJ: "fiji",
  MY: "malaysia",
  PH: "philippines",
  TW: "taiwan",
  MO: "macau",
  QA: "qatar",
  MA: "morocco",
  RU: "russia",
  PR: "puerto-rico",
};

const BANYAN_TREE_COUNTRY: Record<string, string> = {
  bangkok: "thailand",
  phuket: "thailand",
  samui: "thailand",
  "lang-co": "vietnam",
  seychelles: "seychelles",
  dubai: "united-arab-emirates",
  mayakoba: "mexico",
  santorini: "greece",
  yangshuo: "china",
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

/** ritzcarlton.com path segment (slug suffix often 404 without this) */
const RITZ_CARLTON_PATHS: Record<string, string> = {
  "ritz-carlton-new-york-central-park": "new-york-central-park",
  "ritz-carlton-half-moon-bay": "half-moon-bay",
  "ritz-carlton-south-beach": "south-beach",
  "ritz-carlton-kapalua": "kapalua",
  "ritz-carlton-lake-tahoe": "lake-tahoe",
  "ritz-carlton-pentagon-city": "pentagon-city",
  "ritz-carlton-san-francisco": "san-francisco",
  "ritz-carlton-los-angeles": "los-angeles",
  "ritz-carlton-shanghai-pudong": "shanghai",
  "ritz-carlton-beijing-financial-street": "beijing",
  "ritz-carlton-hong-kong": "hong-kong",
  "ritz-carlton-singapore": "singapore",
  "ritz-carlton-tokyo": "tokyo",
  "ritz-carlton-osaka": "osaka",
  "ritz-carlton-bali": "bali",
  "ritz-carlton-cairo": "cairo",
  "ritz-carlton-istanbul": "istanbul",
  "ritz-carlton-dubai": "dubai",
  "ritz-carlton-abu-dhabi": "abu-dhabi",
  "ritz-carlton-washington-dc": "washington-dc",
  "ritz-carlton-boston": "boston",
  "ritz-carlton-chicago": "chicago",
  "ritz-carlton-miami": "miami",
  "ritz-carlton-cancun": "cancun",
  "ritz-carlton-vienna": "vienna",
  "ritz-carlton-berlin": "berlin",
  "ritz-carlton-moscow": "moscow",
  "ritz-carlton-madrid": "madrid",
  "ritz-carlton-london": "london",
  "ritz-carlton-paris": "paris",
  "ritz-carlton-sydney": "sydney",
  "ritz-carlton-melbourne": "melbourne",
  "ritz-carlton-perth": "perth",
  "ritz-carlton-bangalore": "bangalore",
  "ritz-carlton-reserve-dorado-beach": "dorado-beach",
  "ritz-carlton-aspen": "aspen",
  "ritz-carlton-st-thomas": "st-thomas",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.'']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function fourSeasonsPath(slug: string): string {
  if (FOUR_SEASONS_PATHS[slug]) return FOUR_SEASONS_PATHS[slug];
  return slug.replace(/^four-seasons-/, "").replace(/-/g, "");
}

function hyattHotelUrl(
  hotel: Pick<HotelEntry, "slug" | "brandSlug" | "countryCode" | "city" | "country">
): string {
  const country = COUNTRY_SLUG[hotel.countryCode] ?? slugify(hotel.country);
  const city = slugify(hotel.city);
  return `https://www.hyatt.com/en-US/hotel/${country}/${city}/${hotel.slug}`;
}

function fairmontUrl(hotel: Pick<HotelEntry, "slug" | "city">): string {
  const property = hotel.slug.replace(/^fairmont-/, "");
  return `https://www.fairmont.com/${property}/`;
}

function rafflesUrl(hotel: Pick<HotelEntry, "slug" | "city">): string {
  const property = hotel.slug.replace(/^raffles-/, "");
  return `https://www.raffles.com/${property}/`;
}

function sofitelLegendUrl(
  hotel: Pick<HotelEntry, "slug" | "city" | "countryCode" | "country">
): string {
  const property = hotel.slug.replace(/^sofitel-legend-/, "");
  const country = COUNTRY_SLUG[hotel.countryCode] ?? slugify(hotel.country);
  const city = slugify(hotel.city);
  return `https://www.sofitel-legend.com/en/${country}/${city}/${property}/`;
}

function ihgBrandUrl(
  brand: string,
  hotel: Pick<HotelEntry, "slug" | "name" | "city">
): string {
  const city = slugify(hotel.city);
  return `https://www.ihg.com/${brand}/hotels/us/en/${city}/${hotel.slug}?brandCode=${brand === "intercontinental" ? "IC" : brand === "regent" ? "REG" : "SX"}`;
}

function hiltonPropertyUrl(hotel: Pick<HotelEntry, "slug" | "name">): string {
  return `https://www.hilton.com/en/hotels/${hotel.slug}/`;
}

function marriottPropertyUrl(hotel: Pick<HotelEntry, "slug" | "name">): string {
  return `https://www.marriott.com/en-us/hotels/${hotel.slug}/overview/`;
}

function belmondUrl(hotel: Pick<HotelEntry, "slug" | "name">): string {
  const loc = hotel.slug.replace(/^belmond-/, "");
  return `https://www.belmond.com/hotels/${loc.replace(/-/g, "/")}`;
}

function anantaraUrl(
  hotel: Pick<HotelEntry, "slug" | "city" | "countryCode" | "country">
): string {
  const loc = hotel.slug.replace(/^anantara-/, "");
  const country = COUNTRY_SLUG[hotel.countryCode] ?? "worldwide";
  return `https://www.anantara.com/en/${country}/${loc}`;
}

function oneAndOnlyUrl(hotel: Pick<HotelEntry, "slug">): string {
  const loc = hotel.slug.replace(/^one-and-only-/, "");
  return `https://www.oneandonlyresorts.com/${loc.replace(/-/g, "-")}`;
}

function kempinskiUrl(hotel: Pick<HotelEntry, "slug" | "city">): string {
  const property = hotel.slug.replace(/^kempinski-/, "");
  const city = slugify(hotel.city);
  return `https://www.kempinski.com/en/${city}/${property}`;
}

function oberoiUrl(hotel: Pick<HotelEntry, "slug" | "city">): string {
  const property = hotel.slug.replace(/^oberoi-/, "");
  return `https://www.oberoihotels.com/hotels-in-${slugify(hotel.city)}/${property}/`;
}

/** Resolve the best-guess official property URL for a hotel */
export function resolveOfficialUrl(
  hotel: Pick<HotelEntry, "slug" | "brandSlug" | "name" | "city" | "countryCode" | "country">
): string | null {
  if (discoveredUrls[hotel.slug]) return discoveredUrls[hotel.slug];
  if (HOTEL_URL_OVERRIDES[hotel.slug]) return HOTEL_URL_OVERRIDES[hotel.slug];

  if (hotel.slug.startsWith("four-seasons-")) {
    return `https://www.fourseasons.com/${fourSeasonsPath(hotel.slug)}/`;
  }
  if (hotel.slug.startsWith("mandarin-oriental-")) {
    const path = MANDARIN_ORIENTAL_PATHS[hotel.slug];
    if (path) return `https://www.mandarinoriental.com/en/${path}`;
  }
  if (hotel.slug.startsWith("cheval-blanc-")) {
    const path = CHEVAL_BLANC_PATHS[hotel.slug];
    if (path) return `https://www.chevalblanc.com/en/maison/${path}`;
  }
  if (hotel.brandSlug === "aman" || hotel.slug.startsWith("aman")) {
    const path = AMAN_PATHS[hotel.slug] ?? hotel.slug.replace(/^aman-/, "").replace(/-/g, "");
    return `https://www.aman.com/resorts/${path}`;
  }
  if (hotel.brandSlug === "rosewood" || hotel.slug.startsWith("rosewood-")) {
    const path = ROSEWOOD_PATHS[hotel.slug] ?? hotel.slug.replace(/^rosewood-/, "");
    return `https://www.rosewoodhotels.com/en/${path}`;
  }
  if (hotel.brandSlug === "banyan-tree") {
    const loc = hotel.slug.replace(/^banyan-tree-/, "");
    const country = BANYAN_TREE_COUNTRY[loc] ?? "thailand";
    return `https://www.banyantree.com/en/${country}/${loc}`;
  }
  if (hotel.brandSlug === "six-senses") {
    const loc = hotel.slug.replace(/^six-senses-/, "");
    return `https://www.sixsenses.com/en/hotels/${loc.replace(/-/g, "/")}`;
  }
  if (hotel.brandSlug === "como") {
    const loc = hotel.slug.replace(/^(como-|trisara-)/, "");
    return `https://www.comohotels.com/${loc.replace(/-/g, "/")}`;
  }
  if (hotel.brandSlug === "ritz-carlton" || hotel.brandSlug === "ritz-carlton-reserve") {
    const path =
      RITZ_CARLTON_PATHS[hotel.slug] ??
      hotel.slug.replace(/^ritz-carlton-/, "").replace(/-reserve$/, "");
    return `https://www.ritzcarlton.com/en/hotels/${path}`;
  }

  if (hotel.brandSlug === "st-regis" || hotel.brandSlug === "jw-marriott" || hotel.brandSlug === "w-hotels" || hotel.brandSlug === "edition" || hotel.brandSlug === "luxury-collection") {
    return marriottPropertyUrl(hotel);
  }
  if (hotel.brandSlug === "park-hyatt" || hotel.brandSlug === "andaz" || hotel.brandSlug === "alila") {
    return hyattHotelUrl(hotel);
  }
  if (hotel.brandSlug === "intercontinental") {
    return ihgBrandUrl("intercontinental", hotel);
  }
  if (hotel.brandSlug === "regent") {
    return ihgBrandUrl("regent", hotel);
  }
  if (hotel.brandSlug === "waldorf-astoria" || hotel.brandSlug === "conrad" || hotel.brandSlug === "lxr") {
    return hiltonPropertyUrl(hotel);
  }
  if (hotel.brandSlug === "fairmont") {
    return fairmontUrl(hotel);
  }
  if (hotel.brandSlug === "raffles") {
    return rafflesUrl(hotel);
  }
  if (hotel.brandSlug === "sofitel-legend") {
    return sofitelLegendUrl(hotel);
  }
  if (hotel.brandSlug === "shangri-la") {
    const path = SHANGRI_LA_PATHS[hotel.slug];
    if (path) return `https://www.shangri-la.com/${path}/`;
    const tail = hotel.slug.replace(/^shangri-la-/, "");
    return `https://www.shangri-la.com/${slugify(hotel.city)}/${tail}/`;
  }
  if (hotel.brandSlug === "peninsula") {
    const path = PENINSULA_PATHS[hotel.slug];
    if (path) return `https://www.peninsula.com/en/${path}`;
    return `https://www.peninsula.com/en/${slugify(hotel.city)}`;
  }
  if (hotel.brandSlug === "capella") {
    const loc = hotel.slug.replace(/^capella-/, "");
    return `https://capellahotels.com/en/capella-hotels-and-resorts/${loc}`;
  }
  if (hotel.brandSlug === "belmond") {
    return belmondUrl(hotel);
  }
  if (hotel.brandSlug === "anantara") {
    return anantaraUrl(hotel);
  }
  if (hotel.brandSlug === "one-and-only") {
    return oneAndOnlyUrl(hotel);
  }
  if (hotel.brandSlug === "kempinski") {
    return kempinskiUrl(hotel);
  }
  if (hotel.brandSlug === "oberoi") {
    return oberoiUrl(hotel);
  }
  if (hotel.brandSlug === "patina") {
    const loc = hotel.slug.replace(/^patina-/, "");
    return `https://patinahotels.com/en/${loc}`;
  }
  if (hotel.brandSlug === "soneva") {
    const loc = hotel.slug.replace(/^soneva-/, "");
    return `https://soneva.com/resorts/${loc}/`;
  }
  if (hotel.brandSlug === "joali") {
    const loc = hotel.slug.replace(/^joali-/, "");
    return `https://www.joali.com/${loc}`;
  }
  if (hotel.slug.startsWith("bulgari-")) {
    const city = hotel.slug.replace(/^bulgari-/, "");
    return `https://www.bulgarihotels.com/en_US/${city}`;
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
  if (websiteUrl.includes("hyatt.com")) {
    return websiteUrl.replace("/en-US/", "/zh-CN/");
  }
  if (websiteUrl.includes("shangri-la.com")) {
    return websiteUrl.replace("www.shangri-la.com", "www.shangri-la.com/cn");
  }
  return null;
}