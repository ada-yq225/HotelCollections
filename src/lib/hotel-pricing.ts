import type { HotelEntry } from "@/data/hotels/types";

/** Nightly reference rates in CNY — updated for 2026 luxury market */
const BRAND_BASE_CNY: Record<string, number> = {
  "cheval-blanc": 12000,
  aman: 8500,
  soneva: 14000,
  joali: 12000,
  singita: 15000,
  "one-and-only": 9000,
  "the-brando": 11000,
  "four-seasons": 3200,
  "mandarin-oriental": 3000,
  rosewood: 2800,
  peninsula: 2600,
  capella: 3500,
  como: 4000,
  belmond: 4500,
  "ritz-carlton-reserve": 8000,
  "ritz-carlton": 2200,
  "st-regis": 2100,
  "park-hyatt": 2000,
  "waldorf-astoria": 2300,
  edition: 2600,
  conrad: 1700,
  andaz: 1500,
  alila: 2800,
  "six-senses": 5500,
  intercontinental: 1400,
  regent: 2000,
  fairmont: 1500,
  raffles: 2200,
  "sofitel-legend": 1800,
  "banyan-tree": 2500,
  "luxury-collection": 1600,
  "jw-marriott": 1200,
  "w-hotels": 1400,
  patina: 5000,
  anantara: 3200,
  oberoi: 3800,
  "shangri-la": 1500,
  kempinski: 1600,
  gili: 9000,
  huvafen: 8500,
  velaa: 12000,
  niyama: 7000,
  milaidhoo: 8000,
  qualia: 7500,
  likuliku: 6500,
  "north-island": 25000,
  vignette: 2800,
};

const RESORT_REGIONS = new Set([
  "maldives",
  "tahiti",
  "fiji",
  "caribbean",
  "bodrum",
  "bali",
  "phuket",
  "samui",
  "phu-quoc",
  "safari",
  "indian-ocean",
  "southeast-asia-island",
  "hawaii",
  "mexico-resort",
  "mediterranean",
  "alps",
]);

const ISLAND_COUNTRIES = new Set(["MV", "PF", "FJ", "SC", "BS", "TC", "AI", "MU", "MG"]);

const REGION_MULT: Record<string, number> = {
  maldives: 2.6,
  tahiti: 2.4,
  safari: 2.0,
  caribbean: 1.9,
  fiji: 2.0,
  "indian-ocean": 2.2,
  bodrum: 1.7,
  bali: 1.4,
  phuket: 1.35,
  samui: 1.35,
  "phu-quoc": 1.3,
  hawaii: 2.0,
  mediterranean: 1.45,
  alps: 1.3,
  "mexico-resort": 1.6,
  "southeast-asia-island": 1.8,
  "china-beijing": 1.1,
  "china-shanghai": 1.15,
  "china-hongkong": 1.25,
  "china-sanya": 1.2,
  "china-guangzhou": 1.05,
  "china-shenzhen": 1.08,
  "china-chengdu": 1.0,
  "china-hangzhou": 1.05,
};

const TIER1_CHINA_CITIES = new Set(["北京", "上海", "香港", "广州", "深圳"]);

function roundPrice(n: number): number {
  if (n >= 15000) return Math.round(n / 1000) * 1000;
  if (n >= 5000) return Math.round(n / 500) * 500;
  if (n >= 2000) return Math.round(n / 100) * 100;
  return Math.round(n / 50) * 50;
}

function getRegionMultiplier(hotel: Pick<HotelEntry, "region" | "countryCode" | "cityZh">): number {
  if (hotel.region.startsWith("china-")) {
    return REGION_MULT[hotel.region] ?? 1.0;
  }
  if (hotel.countryCode === "JP") return 1.15;
  if (hotel.countryCode === "SG") return 1.2;
  if (hotel.countryCode === "AE" || hotel.cityZh.includes("迪拜")) return 1.35;
  if (TIER1_CHINA_CITIES.has(hotel.cityZh) && hotel.countryCode === "CN") return 1.1;
  if (hotel.countryCode === "HK") return 1.25;
  if (hotel.countryCode === "MO") return 1.15;
  return REGION_MULT[hotel.region] ?? 1.0;
}

function isResortContext(hotel: Pick<HotelEntry, "region" | "countryCode">): boolean {
  return RESORT_REGIONS.has(hotel.region) || ISLAND_COUNTRIES.has(hotel.countryCode);
}

function getSuiteMultiplier(
  hotel: Pick<HotelEntry, "region" | "countryCode" | "brandSlug">,
  base: number
): number {
  const ultraLux = new Set([
    "aman",
    "cheval-blanc",
    "soneva",
    "joali",
    "singita",
    "one-and-only",
    "north-island",
    "the-brando",
    "ritz-carlton-reserve",
  ]);

  if (hotel.region === "maldives" || hotel.countryCode === "MV") return 4.5;
  if (hotel.region === "tahiti" || hotel.countryCode === "PF") return 4.2;
  if (hotel.region === "safari") return 3.2;
  if (hotel.region === "caribbean" || hotel.region === "fiji") return 3.6;
  if (hotel.region === "indian-ocean" || ISLAND_COUNTRIES.has(hotel.countryCode)) return 3.8;
  if (RESORT_REGIONS.has(hotel.region)) return 3.0;

  if (ultraLux.has(hotel.brandSlug)) return Math.max(3.5, 12000 / base);

  return 2.2;
}

export type HotelPriceEstimate = {
  avgBasePrice: number;
  avgSuitePrice: number;
  priceCurrency: "CNY";
  suiteLabel: string;
  isResort: boolean;
  /** True when price comes from official-site scrape, not formula */
  fromOfficial?: boolean;
};

export type HotelPriceResult = {
  avgBasePrice?: number;
  avgSuitePrice?: number;
  priceCurrency: "CNY";
  suiteLabel: string;
  isResort: boolean;
  fromOfficial: boolean;
};

export function getSuiteLabel(hotel: Pick<HotelEntry, "region" | "countryCode">): string {
  if (isResortContext(hotel)) return "特色套房 / 别墅";
  return "特色套房";
}

export type PriceInput = Pick<
  HotelEntry,
  "brandSlug" | "region" | "countryCode" | "cityZh" | "avgBasePrice" | "avgSuitePrice" | "slug"
> & {
  /** Official-site scraped reference price (CNY/night) */
  scrapedBasePrice?: number;
  scrapedSuitePrice?: number;
  priceSource?: "scraped" | "estimated";
};

function suiteFromBase(hotel: Pick<HotelEntry, "brandSlug" | "region" | "slug">, base: number): number {
  const isMaldives =
    hotel.region === "maldives" ||
    hotel.brandSlug.includes("maldives") ||
    hotel.slug?.includes("maldives");
  return Math.round(base * (isMaldives ? 3.5 : 2.2));
}

/** Resolve nightly rates — only returns prices when officially scraped */
export function resolveHotelPrices(hotel: PriceInput): HotelPriceResult {
  const suiteLabel = getSuiteLabel(hotel);
  const isResort = isResortContext(hotel);

  const officialBase =
    hotel.priceSource === "scraped"
      ? hotel.scrapedBasePrice ?? hotel.avgBasePrice
      : hotel.scrapedBasePrice;

  if (officialBase == null) {
    return { priceCurrency: "CNY", suiteLabel, isResort, fromOfficial: false };
  }

  const avgBasePrice = officialBase;
  const avgSuitePrice =
    hotel.scrapedSuitePrice ??
    hotel.avgSuitePrice ??
    suiteFromBase(hotel, avgBasePrice);

  return {
    avgBasePrice,
    avgSuitePrice,
    priceCurrency: "CNY",
    suiteLabel,
    isResort,
    fromOfficial: true,
  };
}

/** @deprecated Internal formula estimate — not shown to users */
export function estimateHotelPrices(hotel: PriceInput): HotelPriceEstimate {
  const official = resolveHotelPrices(hotel);
  if (official.fromOfficial && official.avgBasePrice != null) {
    return {
      avgBasePrice: official.avgBasePrice,
      avgSuitePrice: official.avgSuitePrice!,
      priceCurrency: "CNY",
      suiteLabel: official.suiteLabel,
      isResort: official.isResort,
      fromOfficial: true,
    };
  }

  const brandBase = BRAND_BASE_CNY[hotel.brandSlug] ?? 2000;
  const regionMult = getRegionMultiplier(hotel);
  const computedBase = roundPrice(brandBase * regionMult);
  const suiteMult = getSuiteMultiplier(hotel, computedBase);
  const computedSuite = roundPrice(computedBase * suiteMult);

  return {
    avgBasePrice: computedBase,
    avgSuitePrice: Math.max(computedSuite, computedBase + 800),
    priceCurrency: "CNY",
    suiteLabel: getSuiteLabel(hotel),
    isResort: isResortContext(hotel),
    fromOfficial: false,
  };
}

export function formatHotelPrice(amount: number, currency = "CNY"): string {
  if (currency === "CNY") {
    return `¥${amount.toLocaleString("zh-CN")}`;
  }
  return `${currency} ${amount.toLocaleString("en-US")}`;
}