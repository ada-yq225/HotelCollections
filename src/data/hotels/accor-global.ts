import type { HotelEntry } from "./types";

/** Accor luxury brands outside Greater China */
export const ACCOR_GLOBAL_HOTELS: HotelEntry[] = [
  // ── Raffles — Global ──
  { slug: "raffles-singapore", name: "Raffles Singapore", nameZh: "新加坡莱佛士酒店", brandSlug: "raffles", city: "Singapore", cityZh: "新加坡", country: "Singapore", countryCode: "SG", region: "asia-pacific", latitude: 1.2948, longitude: 103.8545, openedYear: 1887 },
  { slug: "raffles-istanbul", name: "Raffles Istanbul", nameZh: "伊斯坦布尔莱佛士酒店", brandSlug: "raffles", city: "Istanbul", cityZh: "伊斯坦布尔", country: "Turkey", countryCode: "TR", region: "europe", latitude: 41.1085, longitude: 29.0282, openedYear: 2013 },
  { slug: "raffles-dubai", name: "Raffles Dubai", nameZh: "迪拜莱佛士酒店", brandSlug: "raffles", city: "Dubai", cityZh: "迪拜", country: "United Arab Emirates", countryCode: "AE", region: "mea", latitude: 25.2285, longitude: 55.3182, openedYear: 2007 },
  { slug: "raffles-bali", name: "Raffles Bali", nameZh: "巴厘岛莱佛士酒店", brandSlug: "raffles", city: "Jimbaran", cityZh: "金巴兰", country: "Indonesia", countryCode: "ID", region: "asia-pacific", latitude: -8.7985, longitude: 115.1685, openedYear: 2022 },
  { slug: "raffles-phnom-penh", name: "Raffles Hotel Le Royal", nameZh: "金边莱佛士酒店", brandSlug: "raffles", city: "Phnom Penh", cityZh: "金边", country: "Cambodia", countryCode: "KH", region: "asia-pacific", latitude: 11.5685, longitude: 104.9282, openedYear: 1929 },
  { slug: "raffles-seychelles", name: "Raffles Seychelles", nameZh: "塞舌尔莱佛士酒店", brandSlug: "raffles", city: "Praslin", cityZh: "普拉兰岛", country: "Seychelles", countryCode: "SC", region: "indian-ocean", latitude: -4.3182, longitude: 55.7382, openedYear: 2011 },
  { slug: "raffles-london", name: "Raffles London at The OWO", nameZh: "伦敦莱佛士酒店", brandSlug: "raffles", city: "London", cityZh: "伦敦", country: "United Kingdom", countryCode: "GB", region: "europe", latitude: 51.5085, longitude: -0.1282, openedYear: 2023 },
  { slug: "raffles-boston", name: "Raffles Boston", nameZh: "波士顿莱佛士酒店", brandSlug: "raffles", city: "Boston", cityZh: "波士顿", country: "United States", countryCode: "US", region: "americas", latitude: 42.3522, longitude: -71.0685, openedYear: 2024 },

  // ── Fairmont — Global ──
  { slug: "fairmont-san-francisco", name: "Fairmont San Francisco", nameZh: "旧金山费尔蒙酒店", brandSlug: "fairmont", city: "San Francisco", cityZh: "旧金山", country: "United States", countryCode: "US", region: "americas", latitude: 37.7925, longitude: -122.4085, openedYear: 1907 },
  { slug: "fairmont-banff-springs", name: "Fairmont Banff Springs", nameZh: "班夫费尔蒙温泉酒店", brandSlug: "fairmont", city: "Banff", cityZh: "班夫", country: "Canada", countryCode: "CA", region: "americas", latitude: 51.1685, longitude: -115.5782, openedYear: 1888 },
  { slug: "fairmont-le-chateau-frontenac", name: "Fairmont Le Château Frontenac", nameZh: "魁北克费尔蒙芳堤娜城堡酒店", brandSlug: "fairmont", city: "Quebec City", cityZh: "魁北克城", country: "Canada", countryCode: "CA", region: "americas", latitude: 46.8125, longitude: -71.2082, openedYear: 1893 },
  { slug: "fairmont-singapore", name: "Fairmont Singapore", nameZh: "新加坡费尔蒙酒店", brandSlug: "fairmont", city: "Singapore", cityZh: "新加坡", country: "Singapore", countryCode: "SG", region: "asia-pacific", latitude: 1.2925, longitude: 103.8552, openedYear: 1986 },
  { slug: "fairmont-jakarta", name: "Fairmont Jakarta", nameZh: "雅加达费尔蒙酒店", brandSlug: "fairmont", city: "Jakarta", cityZh: "雅加达", country: "Indonesia", countryCode: "ID", region: "asia-pacific", latitude: -6.2285, longitude: 106.7982, openedYear: 2015 },
  { slug: "fairmont-dubai", name: "Fairmont Dubai", nameZh: "迪拜费尔蒙酒店", brandSlug: "fairmont", city: "Dubai", cityZh: "迪拜", country: "United Arab Emirates", countryCode: "AE", region: "mea", latitude: 25.2282, longitude: 55.2782, openedYear: 2007 },
  { slug: "fairmont-monte-carlo", name: "Fairmont Monte Carlo", nameZh: "蒙特卡洛费尔蒙酒店", brandSlug: "fairmont", city: "Monte Carlo", cityZh: "蒙特卡洛", country: "Monaco", countryCode: "MC", region: "europe", latitude: 43.7385, longitude: 7.4282, openedYear: 1985 },
  { slug: "fairmont-jaipur", name: "Fairmont Jaipur", nameZh: "斋浦尔费尔蒙酒店", brandSlug: "fairmont", city: "Jaipur", cityZh: "斋浦尔", country: "India", countryCode: "IN", region: "asia-pacific", latitude: 27.0285, longitude: 75.8582, openedYear: 2012 },

  // ── Sofitel Legend — Global ──
  { slug: "sofitel-legend-old-cataract-aswan", name: "Sofitel Legend Old Cataract Aswan", nameZh: "阿斯旺老卡塔拉克索菲特传奇酒店", brandSlug: "sofitel-legend", city: "Aswan", cityZh: "阿斯旺", country: "Egypt", countryCode: "EG", region: "mea", latitude: 24.0885, longitude: 32.8882, openedYear: 1899 },
  { slug: "sofitel-legend-metropole-hanoi", name: "Sofitel Legend Metropole Hanoi", nameZh: "河内索菲特传奇大都市酒店", brandSlug: "sofitel-legend", city: "Hanoi", cityZh: "河内", country: "Vietnam", countryCode: "VN", region: "asia-pacific", latitude: 21.0285, longitude: 105.8582, openedYear: 1901 },
  { slug: "sofitel-legend-santa-clara-cartagena", name: "Sofitel Legend Santa Clara Cartagena", nameZh: "卡塔赫纳圣克拉拉索菲特传奇酒店", brandSlug: "sofitel-legend", city: "Cartagena", cityZh: "卡塔赫纳", country: "Colombia", countryCode: "CO", region: "americas", latitude: 10.4285, longitude: -75.5482, openedYear: 1621 },
  { slug: "sofitel-legend-the-grand-amsterdam", name: "Sofitel Legend The Grand Amsterdam", nameZh: "阿姆斯特丹索菲特传奇大酒店", brandSlug: "sofitel-legend", city: "Amsterdam", cityZh: "阿姆斯特丹", country: "Netherlands", countryCode: "NL", region: "europe", latitude: 52.3722, longitude: 4.8985, openedYear: 1411 },
  { slug: "sofitel-legend-casco-viejo", name: "Sofitel Legend Casco Viejo", nameZh: "巴拿马老城索菲特传奇酒店", brandSlug: "sofitel-legend", city: "Panama City", cityZh: "巴拿马城", country: "Panama", countryCode: "PA", region: "americas", latitude: 8.9485, longitude: -79.5382, openedYear: 2018 },

  // ── Banyan Tree — Global ──
  { slug: "banyan-tree-bangkok", name: "Banyan Tree Bangkok", nameZh: "曼谷悦榕庄", brandSlug: "banyan-tree", city: "Bangkok", cityZh: "曼谷", country: "Thailand", countryCode: "TH", region: "asia-pacific", latitude: 13.7282, longitude: 100.5385, openedYear: 1994 },
  { slug: "banyan-tree-phuket", name: "Banyan Tree Phuket", nameZh: "普吉岛悦榕庄", brandSlug: "banyan-tree", city: "Phuket", cityZh: "普吉岛", country: "Thailand", countryCode: "TH", region: "asia-pacific", latitude: 7.9785, longitude: 98.2782, openedYear: 1994 },
  { slug: "banyan-tree-samui", name: "Banyan Tree Samui", nameZh: "苏梅岛悦榕庄", brandSlug: "banyan-tree", city: "Koh Samui", cityZh: "苏梅岛", country: "Thailand", countryCode: "TH", region: "samui", latitude: 9.5485, longitude: 100.0585, openedYear: 2010 },
  { slug: "banyan-tree-lang-co", name: "Banyan Tree Lang Co", nameZh: "越南陵姑悦榕庄", brandSlug: "banyan-tree", city: "Lang Co", cityZh: "陵姑", country: "Vietnam", countryCode: "VN", region: "asia-pacific", latitude: 16.2585, longitude: 108.0582, openedYear: 2013 },
  { slug: "banyan-tree-seychelles", name: "Banyan Tree Seychelles", nameZh: "塞舌尔悦榕庄", brandSlug: "banyan-tree", city: "Mahe", cityZh: "马埃岛", country: "Seychelles", countryCode: "SC", region: "indian-ocean", latitude: -4.6785, longitude: 55.4782, openedYear: 2011 },

  { slug: "banyan-tree-dubai", name: "Banyan Tree Dubai", nameZh: "迪拜悦榕庄", brandSlug: "banyan-tree", city: "Dubai", cityZh: "迪拜", country: "United Arab Emirates", countryCode: "AE", region: "mea", latitude: 25.2182, longitude: 55.3285, openedYear: 2021 },
  { slug: "banyan-tree-mayakoba", name: "Banyan Tree Mayakoba", nameZh: "墨西哥玛雅哥悦榕庄", brandSlug: "banyan-tree", city: "Playa del Carmen", cityZh: "普拉亚德尔卡曼", country: "Mexico", countryCode: "MX", region: "americas", latitude: 20.6885, longitude: -87.0282, openedYear: 2009 },
  { slug: "banyan-tree-santorini", name: "Banyan Tree Santorini", nameZh: "圣托里尼悦榕庄", brandSlug: "banyan-tree", city: "Santorini", cityZh: "圣托里尼", country: "Greece", countryCode: "GR", region: "mediterranean", latitude: 36.4085, longitude: 25.4282, openedYear: 2023 },
];