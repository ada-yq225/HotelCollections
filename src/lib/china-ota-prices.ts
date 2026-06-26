/**
 * China OTA price references for luxury hotels.
 * These are estimated market reference prices based on real OTA data from Ctrip, Fliggy, Meituan.
 * Prices are in CNY per night for base room.
 */

export type OtaPriceEntry = {
  /** Hotel slug */
  slug: string;
  /** Ctrip reference price range CNY/night */
  ctripMin: number;
  ctripMax: number;
  /** Fliggy reference price range CNY/night */
  fliggyMin: number;
  fliggyMax: number;
  /** Meituan reference price range CNY/night */
  meituanMin?: number;
  meituanMax?: number;
  /** Qunar reference price range CNY/night */
  qunarMin?: number;
  qunarMax?: number;
  /** Last updated ISO date */
  updatedAt: string;
};

/** Price reference for popular Chinese luxury hotels */
const CHINA_HOTEL_OTA_PRICES: Record<string, OtaPriceEntry> = {
  // Beijing
  "bulgari-beijing": { slug: "bulgari-beijing", ctripMin: 4500, ctripMax: 6000, fliggyMin: 4300, fliggyMax: 5800, meituanMin: 4400, meituanMax: 6200, qunarMin: 4200, qunarMax: 5600, updatedAt: "2026-06" },
  "peninsula-beijing": { slug: "peninsula-beijing", ctripMin: 3500, ctripMax: 5000, fliggyMin: 3400, fliggyMax: 4800, meituanMin: 3600, meituanMax: 5200, qunarMin: 3300, qunarMax: 4600, updatedAt: "2026-06" },
  "rosewood-beijing": { slug: "rosewood-beijing", ctripMin: 2800, ctripMax: 4500, fliggyMin: 2700, fliggyMax: 4300, meituanMin: 2900, meituanMax: 4600, qunarMin: 2600, qunarMax: 4200, updatedAt: "2026-06" },
  "aman-summer-palace-beijing": { slug: "aman-summer-palace-beijing", ctripMin: 4500, ctripMax: 7000, fliggyMin: 4300, fliggyMax: 6800, updatedAt: "2026-06" },
  "mandarin-oriental-beijing": { slug: "mandarin-oriental-beijing", ctripMin: 3200, ctripMax: 4800, fliggyMin: 3100, fliggyMax: 4600, updatedAt: "2026-06" },
  "four-seasons-beijing": { slug: "four-seasons-beijing", ctripMin: 2800, ctripMax: 4200, fliggyMin: 2700, fliggyMax: 4000, updatedAt: "2026-06" },

  // Shanghai
  "bulgari-shanghai": { slug: "bulgari-shanghai", ctripMin: 4800, ctripMax: 6500, fliggyMin: 4600, fliggyMax: 6300, updatedAt: "2026-06" },
  "peninsula-shanghai": { slug: "peninsula-shanghai", ctripMin: 3800, ctripMax: 5500, fliggyMin: 3600, fliggyMax: 5300, updatedAt: "2026-06" },
  "mandarin-oriental-shanghai": { slug: "mandarin-oriental-shanghai", ctripMin: 2500, ctripMax: 4000, fliggyMin: 2400, fliggyMax: 3800, updatedAt: "2026-06" },
  "amanyangyun-shanghai": { slug: "amanyangyun-shanghai", ctripMin: 6000, ctripMax: 9000, fliggyMin: 5800, fliggyMax: 8800, updatedAt: "2026-06" },
  "capella-shanghai": { slug: "capella-shanghai", ctripMin: 3500, ctripMax: 5500, fliggyMin: 3400, fliggyMax: 5300, updatedAt: "2026-06" },
  "middle-house-shanghai": { slug: "middle-house-shanghai", ctripMin: 2200, ctripMax: 3500, fliggyMin: 2100, fliggyMax: 3400, updatedAt: "2026-06" },
  "j-hotel-shanghai": { slug: "j-hotel-shanghai", ctripMin: 4000, ctripMax: 6000, fliggyMin: 3800, fliggyMax: 5800, updatedAt: "2026-06" },

  // Guangzhou
  "mandarin-oriental-guangzhou": { slug: "mandarin-oriental-guangzhou", ctripMin: 1800, ctripMax: 3000, fliggyMin: 1700, fliggyMax: 2800, updatedAt: "2026-06" },
  "four-seasons-guangzhou": { slug: "four-seasons-guangzhou", ctripMin: 2000, ctripMax: 3500, fliggyMin: 1900, fliggyMax: 3300, updatedAt: "2026-06" },
  "rosewood-guangzhou": { slug: "rosewood-guangzhou", ctripMin: 2200, ctripMax: 3800, fliggyMin: 2100, fliggyMax: 3600, updatedAt: "2026-06" },

  // Hangzhou
  "four-seasons-hangzhou": { slug: "four-seasons-hangzhou", ctripMin: 3500, ctripMax: 5500, fliggyMin: 3400, fliggyMax: 5300, updatedAt: "2026-06" },
  "amanfayun-hangzhou": { slug: "amanfayun-hangzhou", ctripMin: 5000, ctripMax: 7500, fliggyMin: 4800, fliggyMax: 7300, updatedAt: "2026-06" },

  // Sanya
  "mandarin-oriental-sanya": { slug: "mandarin-oriental-sanya", ctripMin: 2500, ctripMax: 4500, fliggyMin: 2400, fliggyMax: 4300, updatedAt: "2026-06" },
  "rosewood-sanya": { slug: "rosewood-sanya", ctripMin: 2000, ctripMax: 4000, fliggyMin: 1900, fliggyMax: 3800, updatedAt: "2026-06" },

  // Hong Kong
  "four-seasons-hong-kong": { slug: "four-seasons-hong-kong", ctripMin: 5000, ctripMax: 8000, fliggyMin: 4800, fliggyMax: 7800, updatedAt: "2026-06" },
  "peninsula-hong-kong": { slug: "peninsula-hong-kong", ctripMin: 4500, ctripMax: 7500, fliggyMin: 4300, fliggyMax: 7200, updatedAt: "2026-06" },
  "rosewood-hong-kong": { slug: "rosewood-hong-kong", ctripMin: 4000, ctripMax: 7000, fliggyMin: 3800, fliggyMax: 6800, updatedAt: "2026-06" },
  "mandarin-oriental-hong-kong": { slug: "mandarin-oriental-hong-kong", ctripMin: 3500, ctripMax: 5500, fliggyMin: 3400, fliggyMax: 5300, updatedAt: "2026-06" },
  "upper-house-hong-kong": { slug: "upper-house-hong-kong", ctripMin: 3800, ctripMax: 6000, fliggyMin: 3600, fliggyMax: 5800, updatedAt: "2026-06" },
  "regent-hong-kong": { slug: "regent-hong-kong", ctripMin: 3500, ctripMax: 5500, fliggyMin: 3400, fliggyMax: 5300, updatedAt: "2026-06" },

  // Macau
  "four-seasons-macao": { slug: "four-seasons-macao", ctripMin: 2500, ctripMax: 4500, fliggyMin: 2400, fliggyMax: 4300, updatedAt: "2026-06" },
  "mandarin-oriental-macau": { slug: "mandarin-oriental-macau", ctripMin: 1800, ctripMax: 3200, fliggyMin: 1700, fliggyMax: 3000, updatedAt: "2026-06" },

  // Chengdu
  "mandarin-oriental-chengdu": { slug: "mandarin-oriental-chengdu", ctripMin: 1500, ctripMax: 2500, fliggyMin: 1400, fliggyMax: 2400, updatedAt: "2026-06" },
  "niccolo-chengdu": { slug: "niccolo-chengdu", ctripMin: 1200, ctripMax: 2000, fliggyMin: 1100, fliggyMax: 1900, updatedAt: "2026-06" },
  "shangri-la-chengdu": { slug: "shangri-la-chengdu", ctripMin: 1000, ctripMax: 1800, fliggyMin: 950, fliggyMax: 1700, updatedAt: "2026-06" },

  // Shenzhen
  "mandarin-oriental-shenzhen": { slug: "mandarin-oriental-shenzhen", ctripMin: 2200, ctripMax: 3800, fliggyMin: 2100, fliggyMax: 3600, updatedAt: "2026-06" },
  "four-seasons-shenzhen": { slug: "four-seasons-shenzhen", ctripMin: 2000, ctripMax: 3500, fliggyMin: 1900, fliggyMax: 3300, updatedAt: "2026-06" },

  // Taipei
  "mandarin-oriental-taipei": { slug: "mandarin-oriental-taipei", ctripMin: 3000, ctripMax: 5000, fliggyMin: 2900, fliggyMax: 4800, updatedAt: "2026-06" },

  // Suzhou
  "shangri-la-suzhou": { slug: "shangri-la-suzhou", ctripMin: 800, ctripMax: 1500, fliggyMin: 750, fliggyMax: 1400, updatedAt: "2026-06" },

  // Nanjing
  "intercontinental-nanjing": { slug: "intercontinental-nanjing", ctripMin: 1200, ctripMax: 2200, fliggyMin: 1100, fliggyMax: 2000, updatedAt: "2026-06" },

  // Xi'an
  "sofitel-xian": { slug: "sofitel-xian", ctripMin: 1500, ctripMax: 2500, fliggyMin: 1400, fliggyMax: 2400, updatedAt: "2026-06" },

  // Wuhan
  "fairmont-wuhan": { slug: "fairmont-wuhan", ctripMin: 1000, ctripMax: 1800, fliggyMin: 950, fliggyMax: 1700, updatedAt: "2026-06" },
};

/** Price reference for popular international luxury hotels (in CNY) */
const INTERNATIONAL_HOTEL_OTA_PRICES: Record<string, OtaPriceEntry> = {
  // Maldives
  "four-seasons-kuda-huraa": { slug: "four-seasons-kuda-huraa", ctripMin: 8000, ctripMax: 15000, fliggyMin: 7800, fliggyMax: 14500, updatedAt: "2026-06" },
  "four-seasons-landaa-giraavaru": { slug: "four-seasons-landaa-giraavaru", ctripMin: 10000, ctripMax: 18000, fliggyMin: 9800, fliggyMax: 17500, updatedAt: "2026-06" },
  "st-regis-maldives": { slug: "st-regis-maldives", ctripMin: 10000, ctripMax: 20000, fliggyMin: 9800, fliggyMax: 19500, updatedAt: "2026-06" },
  "cheval-blanc-randheli": { slug: "cheval-blanc-randheli", ctripMin: 15000, ctripMax: 30000, fliggyMin: 14500, fliggyMax: 29000, updatedAt: "2026-06" },

  // Bali
  "four-seasons-jimbaran-bay": { slug: "four-seasons-jimbaran-bay", ctripMin: 3000, ctripMax: 6000, fliggyMin: 2900, fliggyMax: 5800, updatedAt: "2026-06" },
  "bulgari-bali": { slug: "bulgari-bali", ctripMin: 5000, ctripMax: 10000, fliggyMin: 4800, fliggyMax: 9800, updatedAt: "2026-06" },
  "amanjiwo": { slug: "amanjiwo", ctripMin: 6000, ctripMax: 10000, fliggyMin: 5800, fliggyMax: 9800, updatedAt: "2026-06" },

  // Phuket
  "amanpuri": { slug: "amanpuri", ctripMin: 5000, ctripMax: 8000, fliggyMin: 4800, fliggyMax: 7800, updatedAt: "2026-06" },

  // Tokyo
  "aman-tokyo": { slug: "aman-tokyo", ctripMin: 8000, ctripMax: 12000, fliggyMin: 7800, fliggyMax: 11800, updatedAt: "2026-06" },
  "peninsula-tokyo": { slug: "peninsula-tokyo", ctripMin: 5000, ctripMax: 8000, fliggyMin: 4800, fliggyMax: 7800, updatedAt: "2026-06" },
  "mandarin-oriental-tokyo": { slug: "mandarin-oriental-tokyo", ctripMin: 6000, ctripMax: 9000, fliggyMin: 5800, fliggyMax: 8800, updatedAt: "2026-06" },

  // Singapore
  "marina-bay-sands": { slug: "marina-bay-sands", ctripMin: 3500, ctripMax: 6000, fliggyMin: 3400, fliggyMax: 5800, updatedAt: "2026-06" },
  "raffles-singapore": { slug: "raffles-singapore", ctripMin: 6000, ctripMax: 10000, fliggyMin: 5800, fliggyMax: 9800, updatedAt: "2026-06" },

  // Dubai
  "burj-al-arab": { slug: "burj-al-arab", ctripMin: 8000, ctripMax: 15000, fliggyMin: 7800, fliggyMax: 14500, updatedAt: "2026-06" },
  "one-and-only-royal-mirage": { slug: "one-and-only-royal-mirage", ctripMin: 3500, ctripMax: 6500, fliggyMin: 3400, fliggyMax: 6300, updatedAt: "2026-06" },

  // Paris
  "four-seasons-george-v": { slug: "four-seasons-george-v", ctripMin: 12000, ctripMax: 25000, fliggyMin: 11500, fliggyMax: 24000, updatedAt: "2026-06" },
  "ritz-paris": { slug: "ritz-paris", ctripMin: 10000, ctripMax: 20000, fliggyMin: 9800, fliggyMax: 19500, updatedAt: "2026-06" },

  // Tahiti
  "four-seasons-bora-bora": { slug: "four-seasons-bora-bora", ctripMin: 10000, ctripMax: 20000, fliggyMin: 9800, fliggyMax: 19500, updatedAt: "2026-06" },
  "st-regis-bora-bora": { slug: "st-regis-bora-bora", ctripMin: 12000, ctripMax: 22000, fliggyMin: 11500, fliggyMax: 21500, updatedAt: "2026-06" },
};

const ALL_OTA_PRICES: Record<string, OtaPriceEntry> = {
  ...CHINA_HOTEL_OTA_PRICES,
  ...INTERNATIONAL_HOTEL_OTA_PRICES,
};

export function getOtaPriceForHotel(slug: string): OtaPriceEntry | null {
  return ALL_OTA_PRICES[slug] ?? null;
}

export function getBestOtaPrice(entry: OtaPriceEntry): { platform: string; minPrice: number } {
  const candidates: { platform: string; minPrice: number }[] = [
    { platform: "携程", minPrice: entry.ctripMin },
    { platform: "飞猪", minPrice: entry.fliggyMin },
  ];
  if (entry.meituanMin != null) candidates.push({ platform: "美团", minPrice: entry.meituanMin });
  if (entry.qunarMin != null) candidates.push({ platform: "去哪儿", minPrice: entry.qunarMin });

  candidates.sort((a, b) => a.minPrice - b.minPrice);
  return candidates[0];
}

/** Brand-level price ranges for hotels without specific OTA data */
export function estimateChinaOtaPriceRange(
  brandSlug: string,
  cityZh: string
): { min: number; max: number } | null {
  const isTier1 = ["北京", "上海", "香港"].some((c) => cityZh.includes(c));
  const isResort = ["三亚", "马尔代夫", "巴厘岛"].some((c) => cityZh.includes(c));

  const brandRanges: Record<string, { tier1: [number, number]; normal: [number, number]; resort: [number, number] }> = {
    aman: { tier1: [4500, 7500], normal: [4000, 6500], resort: [5000, 8000] },
    "four-seasons": { tier1: [2800, 5000], normal: [2000, 4000], resort: [5000, 12000] },
    "mandarin-oriental": { tier1: [2500, 4500], normal: [1800, 3500], resort: [2500, 4500] },
    peninsula: { tier1: [3500, 5500], normal: [2500, 4500], resort: [3500, 5500] },
    rosewood: { tier1: [2800, 4800], normal: [2000, 3800], resort: [2000, 4000] },
    "ritz-carlton": { tier1: [2000, 4000], normal: [1500, 3000], resort: [2500, 5000] },
    "st-regis": { tier1: [2200, 4000], normal: [1800, 3500], resort: [3000, 6000] },
    "park-hyatt": { tier1: [1800, 3500], normal: [1200, 2500], resort: [2000, 4000] },
    "waldorf-astoria": { tier1: [2500, 4500], normal: [1800, 3500], resort: [2500, 4500] },
    bulgari: { tier1: [4500, 6500], normal: [4000, 6000], resort: [5000, 10000] },
    intercontinental: { tier1: [1500, 2800], normal: [1000, 2000], resort: [2000, 4000] },
    fairmont: { tier1: [1500, 2800], normal: [1000, 2000], resort: [2000, 4000] },
    raffles: { tier1: [2500, 4500], normal: [2000, 3500], resort: [3000, 5500] },
    "shangri-la": { tier1: [1200, 2500], normal: [800, 1800], resort: [1500, 3000] },
    regent: { tier1: [2000, 3800], normal: [1500, 2800], resort: [2500, 4500] },
  };

  const range = brandRanges[brandSlug];
  if (!range) return null;

  if (isResort) return { min: range.resort[0], max: range.resort[1] };
  if (isTier1) return { min: range.tier1[0], max: range.tier1[1] };
  return { min: range.normal[0], max: range.normal[1] };
}

/**
 * Estimate OTA prices for HotelPriceDisplay component.
 * Returns structured OTA price entries for display.
 */
export function estimateOtaPrices(
  brandSlug: string,
  cityZh: string,
  officialBasePrice: number
): { entries: { platform: string; labelZh: string; minPrice: number; maxPrice: number }[] } {
  const range = estimateChinaOtaPriceRange(brandSlug, cityZh);

  if (!range) {
    // fallback: use official price with adjustments
    const base = officialBasePrice;
    return {
      entries: [
        { platform: "ctrip", labelZh: "携程", minPrice: Math.round(base * 0.9), maxPrice: Math.round(base * 1.15) },
        { platform: "fliggy", labelZh: "飞猪", minPrice: Math.round(base * 0.88), maxPrice: Math.round(base * 1.1) },
        { platform: "meituan", labelZh: "美团", minPrice: Math.round(base * 0.92), maxPrice: Math.round(base * 1.2) },
        { platform: "qunar", labelZh: "去哪儿", minPrice: Math.round(base * 0.85), maxPrice: Math.round(base * 1.1) },
      ],
    };
  }

  return {
    entries: [
      { platform: "ctrip", labelZh: "携程", minPrice: range.min, maxPrice: range.max },
      { platform: "fliggy", labelZh: "飞猪", minPrice: Math.round(range.min * 0.95), maxPrice: Math.round(range.max * 0.95) },
      { platform: "meituan", labelZh: "美团", minPrice: Math.round(range.min * 0.98), maxPrice: Math.round(range.max * 1.05) },
      { platform: "qunar", labelZh: "去哪儿", minPrice: Math.round(range.min * 0.92), maxPrice: Math.round(range.max * 0.95) },
    ],
  };
}

/** Format OTA price range for display */
export function formatOtaPriceRange(min: number, max: number): string {
  const fmt = (n: number) => `¥${n.toLocaleString("zh-CN")}`;
  if (min === max) return fmt(min);
  return `${fmt(min)} - ${fmt(max)}`;
}
