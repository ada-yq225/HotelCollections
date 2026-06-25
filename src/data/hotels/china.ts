import type { HotelEntry } from "./types";

/** Independent & non-chain luxury hotels in Greater China (CN/HK/MO/TW) */
export const CHINA_HOTELS: HotelEntry[] = [
  // ── Beijing ──
  { slug: "peninsula-beijing", name: "The Peninsula Beijing", nameZh: "北京王府半岛酒店", brandSlug: "peninsula", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 39.9142, longitude: 116.4178, openedYear: 2014 },
  { slug: "mandarin-oriental-beijing", name: "Mandarin Oriental Wangfujing, Beijing", nameZh: "北京王府井文华东方酒店", brandSlug: "mandarin-oriental", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 39.9145, longitude: 116.4112, openedYear: 2019 },
  { slug: "four-seasons-beijing", name: "Four Seasons Hotel Beijing", nameZh: "北京四季酒店", brandSlug: "four-seasons", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 39.9498, longitude: 116.4622, openedYear: 2014 },
  { slug: "rosewood-beijing", name: "Rosewood Beijing", nameZh: "北京瑰丽酒店", brandSlug: "rosewood", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 39.9178, longitude: 116.4586, openedYear: 2014 },
  { slug: "aman-summer-palace-beijing", name: "Aman at Summer Palace, Beijing", nameZh: "北京颐和安缦", brandSlug: "aman", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 39.9998, longitude: 116.2752, openedYear: 2008 },

  // ── Shanghai ──
  { slug: "peninsula-shanghai", name: "The Peninsula Shanghai", nameZh: "上海外滩半岛酒店", brandSlug: "peninsula", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.2412, longitude: 121.4905, openedYear: 2009 },
  { slug: "mandarin-oriental-shanghai", name: "Mandarin Oriental Pudong, Shanghai", nameZh: "上海浦东文华东方酒店", brandSlug: "mandarin-oriental", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.2398, longitude: 121.5012, openedYear: 2013 },
  { slug: "amanyangyun-shanghai", name: "Amanyangyun", nameZh: "上海养云安缦", brandSlug: "aman", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.1185, longitude: 121.5282, openedYear: 2018 },
  { slug: "capella-shanghai", name: "Capella Shanghai, Jian Ye Li", nameZh: "上海建业里嘉佩乐酒店", brandSlug: "capella", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.2182, longitude: 121.4625, openedYear: 2017 },
  { slug: "rosewood-shanghai", name: "Rosewood Shanghai", nameZh: "上海瑰丽酒店", brandSlug: "rosewood", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.2342, longitude: 121.5065, openedYear: 2024 },
  {
    slug: "four-seasons-shanghai",
    name: "Four Seasons Hotel Shanghai",
    nameZh: "上海四季酒店",
    brandSlug: "four-seasons",
    city: "Shanghai",
    cityZh: "上海",
    country: "China",
    countryCode: "CN",
    region: "asia-pacific",
    latitude: 31.2278,
    longitude: 121.4512,
    openedYear: 2005,
    isActive: false,
    status: "closed",
    notes: "Puxi Four Seasons closed ~2022; brand exited Shanghai market",
  },

  // ── Guangzhou ──
  { slug: "mandarin-oriental-guangzhou", name: "Mandarin Oriental, Guangzhou", nameZh: "广州文华东方酒店", brandSlug: "mandarin-oriental", city: "Guangzhou", cityZh: "广州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 23.1188, longitude: 113.3275, openedYear: 2012 },
  { slug: "four-seasons-guangzhou", name: "Four Seasons Hotel Guangzhou", nameZh: "广州四季酒店", brandSlug: "four-seasons", city: "Guangzhou", cityZh: "广州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 23.1195, longitude: 113.3265, openedYear: 2012 },
  { slug: "rosewood-guangzhou", name: "Rosewood Guangzhou", nameZh: "广州瑰丽酒店", brandSlug: "rosewood", city: "Guangzhou", cityZh: "广州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 23.1182, longitude: 113.3292, openedYear: 2019 },

  // ── Shenzhen ──
  { slug: "mandarin-oriental-shenzhen", name: "Mandarin Oriental, Shenzhen", nameZh: "深圳文华东方酒店", brandSlug: "mandarin-oriental", city: "Shenzhen", cityZh: "深圳", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 22.5348, longitude: 114.0595, openedYear: 2022 },
  { slug: "four-seasons-shenzhen", name: "Four Seasons Hotel Shenzhen", nameZh: "深圳四季酒店", brandSlug: "four-seasons", city: "Shenzhen", cityZh: "深圳", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 22.5358, longitude: 114.0578, openedYear: 2016 },

  // ── Chengdu ──
  { slug: "mandarin-oriental-chengdu", name: "Mandarin Oriental, Chengdu", nameZh: "成都文华东方酒店", brandSlug: "mandarin-oriental", city: "Chengdu", cityZh: "成都", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.6592, longitude: 104.0798, openedYear: 2023 },

  // ── Hangzhou ──
  { slug: "four-seasons-hangzhou", name: "Four Seasons Hotel Hangzhou at West Lake", nameZh: "杭州西子湖四季酒店", brandSlug: "four-seasons", city: "Hangzhou", cityZh: "杭州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.2412, longitude: 120.1485, openedYear: 2004 },
  { slug: "amanfayun-hangzhou", name: "Amanfayun", nameZh: "杭州法云安缦", brandSlug: "aman", city: "Hangzhou", cityZh: "杭州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.2285, longitude: 120.0952, openedYear: 2010 },

  // ── Sanya / Hainan ──
  { slug: "mandarin-oriental-sanya", name: "Mandarin Oriental, Sanya", nameZh: "三亚文华东方酒店", brandSlug: "mandarin-oriental", city: "Sanya", cityZh: "三亚", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 18.2185, longitude: 109.5122, openedYear: 2009 },
  { slug: "rosewood-sanya", name: "Rosewood Sanya", nameZh: "三亚保利瑰丽酒店", brandSlug: "rosewood", city: "Sanya", cityZh: "三亚", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 18.2312, longitude: 109.6512, openedYear: 2017 },

  // ── Hong Kong ──
  { slug: "mandarin-oriental-hong-kong", name: "Mandarin Oriental, Hong Kong", nameZh: "香港文华东方酒店", brandSlug: "mandarin-oriental", city: "Hong Kong", cityZh: "香港", country: "Hong Kong", countryCode: "HK", region: "asia-pacific", latitude: 22.2785, longitude: 114.1582, openedYear: 1963 },
  { slug: "peninsula-hong-kong", name: "The Peninsula Hong Kong", nameZh: "香港半岛酒店", brandSlug: "peninsula", city: "Hong Kong", cityZh: "香港", country: "Hong Kong", countryCode: "HK", region: "asia-pacific", latitude: 22.2952, longitude: 114.1718, openedYear: 1928 },
  { slug: "four-seasons-hong-kong", name: "Four Seasons Hotel Hong Kong", nameZh: "香港四季酒店", brandSlug: "four-seasons", city: "Hong Kong", cityZh: "香港", country: "Hong Kong", countryCode: "HK", region: "asia-pacific", latitude: 22.2865, longitude: 114.1578, openedYear: 2005 },
  { slug: "rosewood-hong-kong", name: "Rosewood Hong Kong", nameZh: "香港瑰丽酒店", brandSlug: "rosewood", city: "Hong Kong", cityZh: "香港", country: "Hong Kong", countryCode: "HK", region: "asia-pacific", latitude: 22.2872, longitude: 114.1585, openedYear: 2019 },
  {
    slug: "intercontinental-hong-kong",
    name: "InterContinental Hong Kong",
    nameZh: "香港洲际酒店",
    brandSlug: "intercontinental",
    city: "Hong Kong",
    cityZh: "香港",
    country: "Hong Kong",
    countryCode: "HK",
    region: "asia-pacific",
    latitude: 22.2935,
    longitude: 114.1732,
    openedYear: 1980,
    isActive: false,
    status: "rebranded",
    notes: "Closed 2024; rebranded as Regent Hong Kong (regent-hong-kong)",
  },

  // ── Macau ──
  { slug: "mandarin-oriental-macau", name: "Mandarin Oriental, Macau", nameZh: "澳门文华东方酒店", brandSlug: "mandarin-oriental", city: "Macau", cityZh: "澳门", country: "Macau", countryCode: "MO", region: "asia-pacific", latitude: 22.1885, longitude: 113.5418, openedYear: 2010 },
  { slug: "four-seasons-macao", name: "Four Seasons Hotel Macao", nameZh: "澳门四季酒店", brandSlug: "four-seasons", city: "Macau", cityZh: "澳门", country: "Macau", countryCode: "MO", region: "asia-pacific", latitude: 22.1482, longitude: 113.5575, openedYear: 2008 },

  // ── Taiwan ──
  { slug: "mandarin-oriental-taipei", name: "Mandarin Oriental, Taipei", nameZh: "台北文华东方酒店", brandSlug: "mandarin-oriental", city: "Taipei", cityZh: "台北", country: "Taiwan", countryCode: "TW", region: "asia-pacific", latitude: 25.0518, longitude: 121.5245, openedYear: 2014 },

  // ── Other Chinese cities (independent) ──
  { slug: "shangri-la-suzhou", name: "Shangri-La Hotel, Suzhou", nameZh: "苏州香格里拉大酒店", brandSlug: "shangri-la", city: "Suzhou", cityZh: "苏州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 31.3012, longitude: 120.7085, openedYear: 2006 },
  { slug: "shangri-la-guilin", name: "Shangri-La Hotel, Guilin", nameZh: "桂林香格里拉大酒店", brandSlug: "shangri-la", city: "Guilin", cityZh: "桂林", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 25.2785, longitude: 110.2982, openedYear: 2010 },
  { slug: "shangri-la-fuzhou", name: "Shangri-La Hotel, Fuzhou", nameZh: "福州香格里拉大酒店", brandSlug: "shangri-la", city: "Fuzhou", cityZh: "福州", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 26.0785, longitude: 119.2982, openedYear: 2005 },
  { slug: "shangri-la-ningbo", name: "Shangri-La Hotel, Ningbo", nameZh: "宁波香格里拉大酒店", brandSlug: "shangri-la", city: "Ningbo", cityZh: "宁波", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 29.8685, longitude: 121.5482, openedYear: 2007 },
  { slug: "shangri-la-beijing", name: "China World Summit Wing, Beijing", nameZh: "北京国贸大酒店", brandSlug: "shangri-la", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 39.9088, longitude: 116.4612, openedYear: 2010 },
  { slug: "shangri-la-chengdu", name: "Shangri-La Hotel, Chengdu", nameZh: "成都香格里拉大酒店", brandSlug: "shangri-la", city: "Chengdu", cityZh: "成都", country: "China", countryCode: "CN", region: "asia-pacific", latitude: 30.6485, longitude: 104.0782, openedYear: 2007 },

  // ── 北京补全 ──
  { slug: "bulgari-beijing", name: "Bulgari Hotel Beijing", nameZh: "北京宝格丽酒店", brandSlug: "vignette", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "china-beijing", latitude: 39.9485, longitude: 116.4625, openedYear: 2017, websiteUrl: "https://www.bulgarihotels.com/en_US/beijing" },
  { slug: "kerry-beijing", name: "Kerry Hotel, Beijing", nameZh: "北京嘉里大酒店", brandSlug: "shangri-la", city: "Beijing", cityZh: "北京", country: "China", countryCode: "CN", region: "china-beijing", latitude: 39.9185, longitude: 116.4582, openedYear: 1999 },

  // ── 上海补全 ──
  { slug: "bulgari-shanghai", name: "Bulgari Hotel Shanghai", nameZh: "上海宝格丽酒店", brandSlug: "vignette", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "china-shanghai", latitude: 31.2385, longitude: 121.4882, openedYear: 2018, websiteUrl: "https://www.bulgarihotels.com/en_US/shanghai" },
  { slug: "j-hotel-shanghai", name: "J Hotel Shanghai Tower", nameZh: "上海中心J酒店", brandSlug: "vignette", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "china-shanghai", latitude: 31.2355, longitude: 121.5055, openedYear: 2021, notes: "全球最高酒店之一，位于上海中心大厦" },
  { slug: "middle-house-shanghai", name: "The Middle House", nameZh: "上海镛舍", brandSlug: "vignette", city: "Shanghai", cityZh: "上海", country: "China", countryCode: "CN", region: "china-shanghai", latitude: 31.2285, longitude: 121.4485, openedYear: 2018, websiteUrl: "https://www.thehousecollective.com/en/shanghai/the-middle-house/" },

  // ── 成都 / 长沙 / 南京 / 西安 / 武汉 / 重庆 ──
  { slug: "niccolo-chengdu", name: "Niccolo Chengdu", nameZh: "成都尼依格罗酒店", brandSlug: "vignette", city: "Chengdu", cityZh: "成都", country: "China", countryCode: "CN", region: "china-chengdu", latitude: 30.6585, longitude: 104.0682, openedYear: 2015, websiteUrl: "https://www.niccolohotels.com/en/chengdu" },
  { slug: "niccolo-changsha", name: "Niccolo Changsha", nameZh: "长沙尼依格罗酒店", brandSlug: "vignette", city: "Changsha", cityZh: "长沙", country: "China", countryCode: "CN", region: "china-changsha", latitude: 28.1985, longitude: 112.9782, openedYear: 2018 },
  { slug: "intercontinental-nanjing", name: "InterContinental Nanjing", nameZh: "南京洲际酒店", brandSlug: "intercontinental", city: "Nanjing", cityZh: "南京", country: "China", countryCode: "CN", region: "china-nanjing", latitude: 32.0485, longitude: 118.7782, openedYear: 2010 },
  { slug: "sofitel-xian", name: "Sofitel Legend People's Grand Hotel Xi'an", nameZh: "西安索菲特传奇人民大厦", brandSlug: "sofitel-legend", city: "Xi'an", cityZh: "西安", country: "China", countryCode: "CN", region: "china-xian", latitude: 34.2585, longitude: 108.9482, openedYear: 1953 },
  { slug: "fairmont-wuhan", name: "Fairmont Wuhan", nameZh: "武汉费尔蒙酒店", brandSlug: "fairmont", city: "Wuhan", cityZh: "武汉", country: "China", countryCode: "CN", region: "china-wuhan", latitude: 30.5785, longitude: 114.2982, openedYear: 2014 },
  { slug: "niccolo-chongqing", name: "Niccolo Chongqing", nameZh: "重庆尼依格罗酒店", brandSlug: "vignette", city: "Chongqing", cityZh: "重庆", country: "China", countryCode: "CN", region: "china-chongqing", latitude: 29.5585, longitude: 106.5782, openedYear: 2017 },

  // ── 香港补全 ──
  { slug: "upper-house-hong-kong", name: "The Upper House", nameZh: "香港奕居", brandSlug: "vignette", city: "Hong Kong", cityZh: "香港", country: "Hong Kong", countryCode: "HK", region: "china-hongkong", latitude: 22.2785, longitude: 114.1682, openedYear: 2009, websiteUrl: "https://www.upperhouse.com/en/" },
  { slug: "regent-hong-kong", name: "Regent Hong Kong", nameZh: "香港丽晶酒店", brandSlug: "regent", city: "Hong Kong", cityZh: "香港", country: "Hong Kong", countryCode: "HK", region: "china-hongkong", latitude: 22.2935, longitude: 114.1732, openedYear: 2023, notes: "前身为洲际香港，2023年全面翻新换牌丽晶" },
  { slug: "murray-hong-kong", name: "The Murray, Hong Kong", nameZh: "香港美利酒店", brandSlug: "vignette", city: "Hong Kong", cityZh: "香港", country: "Hong Kong", countryCode: "HK", region: "china-hongkong", latitude: 22.2788, longitude: 114.1588, openedYear: 2017, websiteUrl: "https://www.niccolohotels.com/en/hongkong/themurray" },
];