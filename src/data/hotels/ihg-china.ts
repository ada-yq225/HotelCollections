import type { HotelEntry } from "./types";

/** IHG luxury brands in Greater China (CN/HK/MO/TW) */
export const IHG_CHINA_HOTELS: HotelEntry[] = [
  // ── Regent ──
  { slug: "regent-beijing", name: "Regent Beijing", nameZh: "北京丽晶酒店", brandSlug: "regent", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 39.9482, longitude: 116.4618, openedYear: 2006 },
  {
    slug: "regent-shanghai-pudong",
    name: "Regent Shanghai Pudong",
    nameZh: "上海浦东丽晶酒店",
    brandSlug: "regent",
    city: "Shanghai",
    cityZh: "上海",
    country: "China",
    countryCode: "CN",
    region: "asia-pacific",
    latitude: 31.2358,
    longitude: 121.5082,
    openedYear: 2024,
    address: "前滩太古里（原浦东四季旧址）",
    notes: "Rebranded from Four Seasons Shanghai Pudong (2024)",
  },
  { slug: "regent-hong-kong", name: "Regent Hong Kong", nameZh: "香港丽晶酒店", brandSlug: "regent", city: "Hong Kong", cityZh: "香港", country: "Hong Kong", countryCode: "HK", region: "asia-pacific", latitude: 22.2942, longitude: 114.1725, openedYear: 2023, notes: "Reopened 2023 on former InterContinental Hong Kong site" },
  { slug: "regent-taipei", name: "Regent Taipei", nameZh: "台北晶华酒店", brandSlug: "regent", city: "Taipei", cityZh: "台北", country: "Taiwan", countryCode: "TW", region: "asia-pacific", latitude: 25.0522, longitude: 121.5248, openedYear: 2010 },

  // ── InterContinental — flagship & resort ──
  { slug: "intercontinental-beijing-sanlitun", name: "InterContinental Beijing Sanlitun", nameZh: "北京三里屯洲际酒店", brandSlug: "intercontinental", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 39.9338, longitude: 116.4542, openedYear: 2016 },
  { slug: "intercontinental-shanghai-wonderland", name: "InterContinental Shanghai Wonderland", nameZh: "上海佘山世茂洲际酒店", brandSlug: "intercontinental", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.0612, longitude: 121.1585, openedYear: 2018 },
  { slug: "intercontinental-shanghai-ruijin", name: "InterContinental Shanghai Ruijin", nameZh: "上海瑞金洲际酒店", brandSlug: "intercontinental", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.2125, longitude: 121.4682, openedYear: 2017 },
  { slug: "intercontinental-nanjing", name: "InterContinental Nanjing", nameZh: "南京洲际酒店", brandSlug: "intercontinental", city: "Nanjing", cityZh: "南京", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 32.0585, longitude: 118.7822, openedYear: 2010 },
  { slug: "intercontinental-chongqing", name: "InterContinental Chongqing Raffles City", nameZh: "重庆来福士洲际酒店", brandSlug: "intercontinental", city: "Chongqing", cityZh: "重庆", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 29.5685, longitude: 106.5822, openedYear: 2020 },
  { slug: "intercontinental-sanya", name: "InterContinental Sanya Haitang Bay Resort", nameZh: "三亚海棠湾洲际度假酒店", brandSlug: "intercontinental", city: "Sanya", cityZh: "三亚", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 18.3378, longitude: 109.7268, openedYear: 2016 },
  { slug: "intercontinental-lijiang", name: "InterContinental Lijiang Ancient Town Resort", nameZh: "丽江和府洲际度假酒店", brandSlug: "intercontinental", city: "Lijiang", cityZh: "丽江", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 26.8685, longitude: 100.2288, openedYear: 2010 },
  { slug: "intercontinental-kunming", name: "InterContinental Kunming", nameZh: "昆明洲际酒店", brandSlug: "intercontinental", city: "Kunming", cityZh: "昆明", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 24.9885, longitude: 102.7182, openedYear: 2013 },
  { slug: "intercontinental-hefei", name: "InterContinental Hefei", nameZh: "合肥洲际酒店", brandSlug: "intercontinental", city: "Hefei", cityZh: "合肥", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.8285, longitude: 117.2282, openedYear: 2016 },
  { slug: "intercontinental-chengdu-global-center", name: "InterContinental Chengdu Global Center", nameZh: "成都环球中心洲际酒店", brandSlug: "intercontinental", city: "Chengdu", cityZh: "成都", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.5685, longitude: 104.0682, openedYear: 2013 },
  { slug: "intercontinental-dalian", name: "InterContinental Dalian", nameZh: "大连远洋洲际酒店", brandSlug: "intercontinental", city: "Dalian", cityZh: "大连", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 38.9182, longitude: 121.6285, openedYear: 2008 },
  { slug: "intercontinental-fuzhou", name: "InterContinental Fuzhou", nameZh: "福州世茂洲际酒店", brandSlug: "intercontinental", city: "Fuzhou", cityZh: "福州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 26.0788, longitude: 119.2985, openedYear: 2014 },
  { slug: "intercontinental-xiamen", name: "InterContinental Xiamen", nameZh: "厦门海景洲际酒店", brandSlug: "intercontinental", city: "Xiamen", cityZh: "厦门", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 24.4782, longitude: 118.0885, openedYear: 2014 },
  { slug: "intercontinental-hangzhou", name: "InterContinental Hangzhou", nameZh: "杭州洲际酒店", brandSlug: "intercontinental", city: "Hangzhou", cityZh: "杭州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.2485, longitude: 120.2182, openedYear: 2010 },
  { slug: "intercontinental-wuhan", name: "InterContinental Wuhan", nameZh: "武汉洲际酒店", brandSlug: "intercontinental", city: "Wuhan", cityZh: "武汉", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.5782, longitude: 114.3485, openedYear: 2016 },
  { slug: "intercontinental-taipei", name: "InterContinental Taipei", nameZh: "台北洲际大饭店", brandSlug: "intercontinental", city: "Taipei", cityZh: "台北", country: "Taiwan", countryCode: "TW", region: "asia-pacific", latitude: 25.0388, longitude: 121.5282, openedYear: 2014 },

  // ── Six Senses ──
  { slug: "six-senses-qing-cheng-mountain", name: "Six Senses Qing Cheng Mountain", nameZh: "青城山六善酒店", brandSlug: "six-senses", city: "Chengdu", cityZh: "成都", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.8985, longitude: 103.5782, openedYear: 2016 },

];