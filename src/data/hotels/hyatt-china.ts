import type { HotelEntry } from "./types";

/** Hyatt luxury brands in Greater China (CN/HK/MO/TW) */
export const HYATT_CHINA_HOTELS: HotelEntry[] = [
  // ── Park Hyatt ──
  { slug: "park-hyatt-beijing", name: "Park Hyatt Beijing", nameZh: "北京柏悦酒店", brandSlug: "park-hyatt", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 39.9089, longitude: 116.4596, openedYear: 2008 },
  { slug: "park-hyatt-shanghai", name: "Park Hyatt Shanghai", nameZh: "上海柏悦酒店", brandSlug: "park-hyatt", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.2352, longitude: 121.5058, openedYear: 2008 },
  { slug: "park-hyatt-guangzhou", name: "Park Hyatt Guangzhou", nameZh: "广州柏悦酒店", brandSlug: "park-hyatt", city: "Guangzhou", cityZh: "广州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 23.1198, longitude: 113.3248, openedYear: 2015 },
  { slug: "park-hyatt-shenzhen", name: "Park Hyatt Shenzhen", nameZh: "深圳柏悦酒店", brandSlug: "park-hyatt", city: "Shenzhen", cityZh: "深圳", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 22.5365, longitude: 114.0568, openedYear: 2019 },
  { slug: "park-hyatt-hangzhou", name: "Park Hyatt Hangzhou", nameZh: "杭州柏悦酒店", brandSlug: "park-hyatt", city: "Hangzhou", cityZh: "杭州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.2582, longitude: 120.2125, openedYear: 2017 },
  { slug: "park-hyatt-sanya", name: "Park Hyatt Sanya Sunny Bay Resort", nameZh: "三亚太阳湾柏悦酒店", brandSlug: "park-hyatt", city: "Sanya", cityZh: "三亚", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 18.2052, longitude: 109.5285, openedYear: 2015 },
  { slug: "park-hyatt-suzhou", name: "Park Hyatt Suzhou", nameZh: "苏州柏悦酒店", brandSlug: "park-hyatt", city: "Suzhou", cityZh: "苏州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.2985, longitude: 120.7122, openedYear: 2020 },
  { slug: "park-hyatt-hong-kong", name: "Park Hyatt Hong Kong", nameZh: "香港柏悦酒店", brandSlug: "park-hyatt", city: "Hong Kong", cityZh: "香港", country: "Hong Kong", countryCode: "HK", region: "asia-pacific", latitude: 22.2868, longitude: 114.1585, openedYear: 2009 },
  { slug: "park-hyatt-taipei", name: "Park Hyatt Taipei", nameZh: "台北柏悦酒店", brandSlug: "park-hyatt", city: "Taipei", cityZh: "台北", country: "Taiwan", countryCode: "TW", region: "asia-pacific", latitude: 25.0382, longitude: 121.5685, openedYear: 2014 },
  { slug: "park-hyatt-ningbo", name: "Park Hyatt Ningbo Resort and Spa", nameZh: "宁波柏悦酒店", brandSlug: "park-hyatt", city: "Ningbo", cityZh: "宁波", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 29.8682, longitude: 121.5485, openedYear: 2012 },

  // ── Andaz ──
  { slug: "andaz-shanghai", name: "Andaz Shanghai", nameZh: "上海新天地安达仕酒店", brandSlug: "andaz", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.2205, longitude: 121.4752, openedYear: 2021 },
  { slug: "andaz-guangzhou", name: "Andaz Guangzhou", nameZh: "广州安达仕酒店", brandSlug: "andaz", city: "Guangzhou", cityZh: "广州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 23.1065, longitude: 113.3412, openedYear: 2024 },
  { slug: "andaz-shenzhen", name: "Andaz Shenzhen Bay", nameZh: "深圳湾安达仕酒店", brandSlug: "andaz", city: "Shenzhen", cityZh: "深圳", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 22.5178, longitude: 113.9445, openedYear: 2020 },
  { slug: "andaz-xiamen", name: "Andaz Xiamen", nameZh: "厦门安达仕酒店", brandSlug: "andaz", city: "Xiamen", cityZh: "厦门", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 24.4788, longitude: 118.0885, openedYear: 2020 },
  { slug: "andaz-hong-kong", name: "Andaz Hong Kong", nameZh: "香港安达仕酒店", brandSlug: "andaz", city: "Hong Kong", cityZh: "香港", country: "Hong Kong", countryCode: "HK", region: "asia-pacific", latitude: 22.3028, longitude: 114.1688, openedYear: 2025 },

  // ── Alila ──
  { slug: "alila-wuzhen", name: "Alila Wuzhen", nameZh: "乌镇阿丽拉", brandSlug: "alila", city: "Wuzhen", cityZh: "乌镇", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.7485, longitude: 120.4882, openedYear: 2018 },
  { slug: "alila-anji", name: "Alila Anji", nameZh: "安吉阿丽拉", brandSlug: "alila", city: "Anji", cityZh: "安吉", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.6385, longitude: 119.6782, openedYear: 2016 },
  { slug: "alila-yangshuo", name: "Alila Yangshuo", nameZh: "阳朔阿丽拉", brandSlug: "alila", city: "Yangshuo", cityZh: "阳朔", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 24.7785, longitude: 110.4982, openedYear: 2017 },
  { slug: "alila-shanghai", name: "Alila Shanghai", nameZh: "上海阿丽拉", brandSlug: "alila", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.2282, longitude: 121.4485, openedYear: 2024 },
];