import type { HotelEntry } from "./types";

/** Hyatt luxury brands outside Greater China */
export const HYATT_GLOBAL_HOTELS: HotelEntry[] = [
  // ── Park Hyatt — Asia-Pacific ──
  { slug: "park-hyatt-tokyo", name: "Park Hyatt Tokyo", nameZh: "东京柏悦酒店", brandSlug: "park-hyatt", city: "Tokyo", cityZh: "东京", country: "Japan", countryCode: "JP", region: "asia-pacific", latitude: 35.6852, longitude: 139.6912, openedYear: 1994 },
  { slug: "park-hyatt-kyoto", name: "Park Hyatt Kyoto", nameZh: "京都柏悦酒店", brandSlug: "park-hyatt", city: "Kyoto", cityZh: "京都", country: "Japan", countryCode: "JP", region: "asia-pacific", latitude: 35.0085, longitude: 135.7685, openedYear: 2019 },
  { slug: "park-hyatt-seoul", name: "Park Hyatt Seoul", nameZh: "首尔柏悦酒店", brandSlug: "park-hyatt", city: "Seoul", cityZh: "首尔", country: "South Korea", countryCode: "KR", region: "asia-pacific", latitude: 37.5245, longitude: 127.0278, openedYear: 2012 },
  { slug: "park-hyatt-busan", name: "Park Hyatt Busan", nameZh: "釜山柏悦酒店", brandSlug: "park-hyatt", city: "Busan", cityZh: "釜山", country: "South Korea", countryCode: "KR", region: "asia-pacific", latitude: 35.1585, longitude: 129.1582, openedYear: 2013 },
  { slug: "park-hyatt-sydney", name: "Park Hyatt Sydney", nameZh: "悉尼柏悦酒店", brandSlug: "park-hyatt", city: "Sydney", cityZh: "悉尼", country: "Australia", countryCode: "AU", region: "asia-pacific", latitude: -33.8585, longitude: 151.2082, openedYear: 1990 },
  { slug: "park-hyatt-melbourne", name: "Park Hyatt Melbourne", nameZh: "墨尔本柏悦酒店", brandSlug: "park-hyatt", city: "Melbourne", cityZh: "墨尔本", country: "Australia", countryCode: "AU", region: "asia-pacific", latitude: -37.8182, longitude: 144.9682, openedYear: 1999 },
  { slug: "park-hyatt-bangkok", name: "Park Hyatt Bangkok", nameZh: "曼谷柏悦酒店", brandSlug: "park-hyatt", city: "Bangkok", cityZh: "曼谷", country: "Thailand", countryCode: "TH", region: "asia-pacific", latitude: 13.7382, longitude: 100.5482, openedYear: 2017 },


  // ── Park Hyatt — Americas ──
  { slug: "park-hyatt-new-york", name: "Park Hyatt New York", nameZh: "纽约柏悦酒店", brandSlug: "park-hyatt", city: "New York", cityZh: "纽约", country: "United States", countryCode: "US", region: "americas", latitude: 40.7645, longitude: -73.9782, openedYear: 2014 },
  { slug: "park-hyatt-chicago", name: "Park Hyatt Chicago", nameZh: "芝加哥柏悦酒店", brandSlug: "park-hyatt", city: "Chicago", cityZh: "芝加哥", country: "United States", countryCode: "US", region: "americas", latitude: 41.8982, longitude: -87.6285, openedYear: 2000 },
  { slug: "park-hyatt-washington-dc", name: "Park Hyatt Washington", nameZh: "华盛顿柏悦酒店", brandSlug: "park-hyatt", city: "Washington", cityZh: "华盛顿", country: "United States", countryCode: "US", region: "americas", latitude: 38.9028, longitude: -77.0485, openedYear: 2001 },
  { slug: "park-hyatt-beaver-creek", name: "Park Hyatt Beaver Creek Resort and Spa", nameZh: "海狸溪柏悦度假酒店", brandSlug: "park-hyatt", city: "Beaver Creek", cityZh: "海狸溪", country: "United States", countryCode: "US", region: "americas", latitude: 39.6085, longitude: -106.5282, openedYear: 1989 },
  { slug: "park-hyatt-st-kitts", name: "Park Hyatt St. Kitts Christophe Harbour", nameZh: "圣基茨柏悦酒店", brandSlug: "park-hyatt", city: "Basseterre", cityZh: "巴斯特尔", country: "Saint Kitts and Nevis", countryCode: "KN", region: "americas", latitude: 17.2785, longitude: -62.6282, openedYear: 2017 },
  { slug: "park-hyatt-mendoza", name: "Park Hyatt Mendoza", nameZh: "门多萨柏悦酒店", brandSlug: "park-hyatt", city: "Mendoza", cityZh: "门多萨", country: "Argentina", countryCode: "AR", region: "americas", latitude: -32.8885, longitude: -68.8282, openedYear: 2000 },

  // ── Park Hyatt — Europe & MEA ──
  { slug: "park-hyatt-paris-vendome", name: "Park Hyatt Paris-Vendôme", nameZh: "巴黎旺多姆柏悦酒店", brandSlug: "park-hyatt", city: "Paris", cityZh: "巴黎", country: "France", countryCode: "FR", region: "europe", latitude: 48.8685, longitude: 2.3282, openedYear: 2002 },
  { slug: "park-hyatt-milan", name: "Park Hyatt Milano", nameZh: "米兰柏悦酒店", brandSlug: "park-hyatt", city: "Milan", cityZh: "米兰", country: "Italy", countryCode: "IT", region: "europe", latitude: 45.4685, longitude: 9.1882, openedYear: 2003 },
  { slug: "park-hyatt-vienna", name: "Park Hyatt Vienna", nameZh: "维也纳柏悦酒店", brandSlug: "park-hyatt", city: "Vienna", cityZh: "维也纳", country: "Austria", countryCode: "AT", region: "europe", latitude: 48.2085, longitude: 16.3682, openedYear: 2014 },
  { slug: "park-hyatt-zurich", name: "Park Hyatt Zurich", nameZh: "苏黎世柏悦酒店", brandSlug: "park-hyatt", city: "Zurich", cityZh: "苏黎世", country: "Switzerland", countryCode: "CH", region: "europe", latitude: 47.3685, longitude: 8.5382, openedYear: 2004 },
  { slug: "park-hyatt-dubai", name: "Park Hyatt Dubai", nameZh: "迪拜柏悦酒店", brandSlug: "park-hyatt", city: "Dubai", cityZh: "迪拜", country: "United Arab Emirates", countryCode: "AE", region: "mea", latitude: 25.2185, longitude: 55.3282, openedYear: 2005 },
  { slug: "park-hyatt-abu-dhabi", name: "Park Hyatt Abu Dhabi Hotel and Villas", nameZh: "阿布扎比柏悦酒店", brandSlug: "park-hyatt", city: "Abu Dhabi", cityZh: "阿布扎比", country: "United Arab Emirates", countryCode: "AE", region: "mea", latitude: 24.5285, longitude: 54.4282, openedYear: 2011 },

  // ── Andaz — Global ──
  { slug: "andaz-tokyo", name: "Andaz Tokyo Toranomon Hills", nameZh: "东京虎之门之丘安达仕酒店", brandSlug: "andaz", city: "Tokyo", cityZh: "东京", country: "Japan", countryCode: "JP", region: "asia-pacific", latitude: 35.6678, longitude: 139.7485, openedYear: 2014 },
  { slug: "andaz-seoul-gangnam", name: "Andaz Seoul Gangnam", nameZh: "首尔江南安达仕酒店", brandSlug: "andaz", city: "Seoul", cityZh: "首尔", country: "South Korea", countryCode: "KR", region: "asia-pacific", latitude: 37.5082, longitude: 127.0588, openedYear: 2019 },
  { slug: "andaz-singapore", name: "Andaz Singapore", nameZh: "新加坡安达仕酒店", brandSlug: "andaz", city: "Singapore", cityZh: "新加坡", country: "Singapore", countryCode: "SG", region: "asia-pacific", latitude: 1.2982, longitude: 103.8515, openedYear: 2017 },
  { slug: "andaz-papagayo", name: "Andaz Costa Rica Resort at Peninsula Papagayo", nameZh: "哥斯达黎加帕帕加约安达仕度假酒店", brandSlug: "andaz", city: "Peninsula Papagayo", cityZh: "帕帕加约半岛", country: "Costa Rica", countryCode: "CR", region: "mexico-resort", latitude: 10.6285, longitude: -85.6782, openedYear: 2013 },
  { slug: "andaz-maui", name: "Andaz Maui at Wailea Resort", nameZh: "茂宜岛威雷亚安达仕度假酒店", brandSlug: "andaz", city: "Wailea", cityZh: "威雷亚", country: "United States", countryCode: "US", region: "hawaii", latitude: 20.6885, longitude: -156.4282, openedYear: 2013 },
  { slug: "andaz-5th-avenue", name: "Andaz 5th Avenue", nameZh: "纽约第五大道安达仕酒店", brandSlug: "andaz", city: "New York", cityZh: "纽约", country: "United States", countryCode: "US", region: "americas", latitude: 40.7525, longitude: -73.9785, openedYear: 2010 },
  { slug: "andaz-west-hollywood", name: "Andaz West Hollywood", nameZh: "西好莱坞安达仕酒店", brandSlug: "andaz", city: "West Hollywood", cityZh: "西好莱坞", country: "United States", countryCode: "US", region: "americas", latitude: 34.0985, longitude: -118.3782, openedYear: 2009 },
  { slug: "andaz-london-liverpool-street", name: "Andaz London Liverpool Street", nameZh: "伦敦利物浦街安达仕酒店", brandSlug: "andaz", city: "London", cityZh: "伦敦", country: "United Kingdom", countryCode: "GB", region: "europe", latitude: 51.5185, longitude: -0.0782, openedYear: 2007 },
  { slug: "andaz-amsterdam", name: "Andaz Amsterdam Prinsengracht", nameZh: "阿姆斯特丹王子运河安达仕酒店", brandSlug: "andaz", city: "Amsterdam", cityZh: "阿姆斯特丹", country: "Netherlands", countryCode: "NL", region: "europe", latitude: 52.3625, longitude: 4.8882, openedYear: 2012 },
  { slug: "andaz-vienna", name: "Andaz Vienna Am Belvedere", nameZh: "维也纳美景宫安达仕酒店", brandSlug: "andaz", city: "Vienna", cityZh: "维也纳", country: "Austria", countryCode: "AT", region: "europe", latitude: 48.1925, longitude: 16.3785, openedYear: 2019 },

  // ── Alila — Global ──
  { slug: "alila-ubud", name: "Alila Ubud", nameZh: "巴厘岛乌布阿丽拉", brandSlug: "alila", city: "Ubud", cityZh: "乌布", country: "Indonesia", countryCode: "ID", region: "asia-pacific", latitude: -8.4885, longitude: 115.2582, openedYear: 2001 },
  { slug: "alila-seminyak", name: "Alila Seminyak", nameZh: "巴厘岛水明漾阿丽拉", brandSlug: "alila", city: "Seminyak", cityZh: "水明漾", country: "Indonesia", countryCode: "ID", region: "asia-pacific", latitude: -8.6785, longitude: 115.1585, openedYear: 2015 },
  { slug: "alila-villas-uluwatu", name: "Alila Villas Uluwatu", nameZh: "巴厘岛乌鲁瓦图阿丽拉别墅", brandSlug: "alila", city: "Uluwatu", cityZh: "乌鲁瓦图", country: "Indonesia", countryCode: "ID", region: "asia-pacific", latitude: -8.8285, longitude: 115.0882, openedYear: 2008 },
  { slug: "alila-manggis", name: "Alila Manggis", nameZh: "巴厘岛曼格斯阿丽拉", brandSlug: "alila", city: "Manggis", cityZh: "曼格斯", country: "Indonesia", countryCode: "ID", region: "asia-pacific", latitude: -8.5185, longitude: 115.5282, openedYear: 1996 },

  { slug: "alila-napa-valley", name: "Alila Napa Valley", nameZh: "纳帕谷阿丽拉", brandSlug: "alila", city: "St. Helena", cityZh: "圣赫勒拿", country: "United States", countryCode: "US", region: "americas", latitude: 38.5085, longitude: -122.4782, openedYear: 2021 },
];