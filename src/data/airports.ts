export type Airport = {
  iata: string;
  name: string;
  nameZh: string;
  city: string;
  cityZh: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  isHub?: boolean;
};

/** Major departure airports (China + global gateways) */
export const DEPARTURE_AIRPORTS: Airport[] = [
  { iata: "PEK", name: "Beijing Capital", nameZh: "首都国际机场", city: "Beijing", cityZh: "北京", countryCode: "CN", latitude: 40.0799, longitude: 116.6031 },
  { iata: "PKX", name: "Beijing Daxing", nameZh: "大兴国际机场", city: "Beijing", cityZh: "北京", countryCode: "CN", latitude: 39.5098, longitude: 116.4105 },
  { iata: "PVG", name: "Shanghai Pudong", nameZh: "浦东国际机场", city: "Shanghai", cityZh: "上海", countryCode: "CN", latitude: 31.1443, longitude: 121.8083 },
  { iata: "SHA", name: "Shanghai Hongqiao", nameZh: "虹桥国际机场", city: "Shanghai", cityZh: "上海", countryCode: "CN", latitude: 31.1979, longitude: 121.3363 },
  { iata: "CAN", name: "Guangzhou Baiyun", nameZh: "白云国际机场", city: "Guangzhou", cityZh: "广州", countryCode: "CN", latitude: 23.3924, longitude: 113.2988 },
  { iata: "SZX", name: "Shenzhen Bao'an", nameZh: "宝安国际机场", city: "Shenzhen", cityZh: "深圳", countryCode: "CN", latitude: 22.6393, longitude: 113.8107 },
  { iata: "CTU", name: "Chengdu Shuangliu", nameZh: "双流国际机场", city: "Chengdu", cityZh: "成都", countryCode: "CN", latitude: 30.5785, longitude: 103.9471 },
  { iata: "HGH", name: "Hangzhou Xiaoshan", nameZh: "萧山国际机场", city: "Hangzhou", cityZh: "杭州", countryCode: "CN", latitude: 30.2295, longitude: 120.4344 },
  { iata: "XIY", name: "Xi'an Xianyang", nameZh: "咸阳国际机场", city: "Xi'an", cityZh: "西安", countryCode: "CN", latitude: 34.4471, longitude: 108.7516 },
  { iata: "CKG", name: "Chongqing Jiangbei", nameZh: "江北国际机场", city: "Chongqing", cityZh: "重庆", countryCode: "CN", latitude: 29.7192, longitude: 106.6417 },
  { iata: "NKG", name: "Nanjing Lukou", nameZh: "禄口国际机场", city: "Nanjing", cityZh: "南京", countryCode: "CN", latitude: 31.7420, longitude: 118.8620 },
  { iata: "WUH", name: "Wuhan Tianhe", nameZh: "天河国际机场", city: "Wuhan", cityZh: "武汉", countryCode: "CN", latitude: 30.7838, longitude: 114.2081 },
  { iata: "SYX", name: "Sanya Phoenix", nameZh: "凤凰国际机场", city: "Sanya", cityZh: "三亚", countryCode: "CN", latitude: 18.3029, longitude: 109.4123 },
  { iata: "HKG", name: "Hong Kong International", nameZh: "香港国际机场", city: "Hong Kong", cityZh: "香港", countryCode: "HK", latitude: 22.3080, longitude: 113.9185 },
  { iata: "TPE", name: "Taiwan Taoyuan", nameZh: "桃园国际机场", city: "Taipei", cityZh: "台北", countryCode: "TW", latitude: 25.0797, longitude: 121.2342 },
  { iata: "SIN", name: "Singapore Changi", nameZh: "樟宜机场", city: "Singapore", cityZh: "新加坡", countryCode: "SG", latitude: 1.3644, longitude: 103.9915, isHub: true },
  { iata: "NRT", name: "Tokyo Narita", nameZh: "成田国际机场", city: "Tokyo", cityZh: "东京", countryCode: "JP", latitude: 35.7720, longitude: 140.3929 },
  { iata: "ICN", name: "Seoul Incheon", nameZh: "仁川国际机场", city: "Seoul", cityZh: "首尔", countryCode: "KR", latitude: 37.4602, longitude: 126.4407 },
  { iata: "DXB", name: "Dubai International", nameZh: "迪拜国际机场", city: "Dubai", cityZh: "迪拜", countryCode: "AE", latitude: 25.2532, longitude: 55.3657, isHub: true },
  { iata: "DOH", name: "Hamad International", nameZh: "哈马德国际机场", city: "Doha", cityZh: "多哈", countryCode: "QA", latitude: 25.2609, longitude: 51.6138, isHub: true },
  { iata: "LHR", name: "London Heathrow", nameZh: "希思罗机场", city: "London", cityZh: "伦敦", countryCode: "GB", latitude: 51.4700, longitude: -0.4543, isHub: true },
  { iata: "CDG", name: "Paris Charles de Gaulle", nameZh: "戴高乐机场", city: "Paris", cityZh: "巴黎", countryCode: "FR", latitude: 49.0097, longitude: 2.5479, isHub: true },
  { iata: "JFK", name: "New York JFK", nameZh: "肯尼迪机场", city: "New York", cityZh: "纽约", countryCode: "US", latitude: 40.6413, longitude: -73.7781, isHub: true },
  { iata: "LAX", name: "Los Angeles", nameZh: "洛杉矶机场", city: "Los Angeles", cityZh: "洛杉矶", countryCode: "US", latitude: 33.9425, longitude: -118.4081 },
];

/** Destination / resort airports worldwide */
export const DESTINATION_AIRPORTS: Airport[] = [
  { iata: "MLE", name: "Malé Velana", nameZh: "马累维拉纳", city: "Malé", cityZh: "马累", countryCode: "MV", latitude: 4.1918, longitude: 73.5291 },
  { iata: "PPT", name: "Faa'a International", nameZh: "法阿机场", city: "Papeete", cityZh: "帕皮提", countryCode: "PF", latitude: -17.5537, longitude: -149.6068 },
  { iata: "BOB", name: "Bora Bora", nameZh: "波拉波拉机场", city: "Bora Bora", cityZh: "波拉波拉", countryCode: "PF", latitude: -16.4443, longitude: -151.7513 },
  { iata: "DPS", name: "Ngurah Rai", nameZh: "努沙杜瓦机场", city: "Bali", cityZh: "巴厘岛", countryCode: "ID", latitude: -8.7482, longitude: 115.1672 },
  { iata: "HKT", name: "Phuket International", nameZh: "普吉国际机场", city: "Phuket", cityZh: "普吉岛", countryCode: "TH", latitude: 8.1132, longitude: 98.3169 },
  { iata: "USM", name: "Koh Samui", nameZh: "苏梅岛机场", city: "Koh Samui", cityZh: "苏梅岛", countryCode: "TH", latitude: 9.5478, longitude: 100.0623 },
  { iata: "PQC", name: "Phu Quoc", nameZh: "富国岛机场", city: "Phu Quoc", cityZh: "富国岛", countryCode: "VN", latitude: 10.2270, longitude: 103.9672 },
  { iata: "BJV", name: "Milas-Bodrum", nameZh: "博德鲁姆机场", city: "Bodrum", cityZh: "博德鲁姆", countryCode: "TR", latitude: 37.2506, longitude: 27.6643 },
  { iata: "NBO", name: "Jomo Kenyatta", nameZh: "乔莫·肯雅塔机场", city: "Nairobi", cityZh: "内罗毕", countryCode: "KE", latitude: -1.3192, longitude: 36.9278 },
  { iata: "CPT", name: "Cape Town International", nameZh: "开普敦机场", city: "Cape Town", cityZh: "开普敦", countryCode: "ZA", latitude: -33.9648, longitude: 18.6017 },
  { iata: "SEZ", name: "Seychelles International", nameZh: "塞舌尔机场", city: "Mahé", cityZh: "马埃岛", countryCode: "SC", latitude: -4.6743, longitude: 55.5218 },
  { iata: "MRU", name: "Sir Seewoosagur Ramgoolam", nameZh: "毛里求斯机场", city: "Mauritius", cityZh: "毛里求斯", countryCode: "MU", latitude: -20.4302, longitude: 57.6836 },
  { iata: "NAN", name: "Nadi International", nameZh: "楠迪机场", city: "Nadi", cityZh: "楠迪", countryCode: "FJ", latitude: -17.7554, longitude: 177.4434 },
  { iata: "HNL", name: "Honolulu", nameZh: "檀香山机场", city: "Honolulu", cityZh: "檀香山", countryCode: "US", latitude: 21.3187, longitude: -157.9225 },
  { iata: "OGG", name: "Kahului", nameZh: "卡胡卢伊机场", city: "Maui", cityZh: "茂宜岛", countryCode: "US", latitude: 20.8986, longitude: -156.4305 },
  { iata: "MIA", name: "Miami International", nameZh: "迈阿密机场", city: "Miami", cityZh: "迈阿密", countryCode: "US", latitude: 25.7959, longitude: -80.2870 },
  { iata: "SXM", name: "Princess Juliana", nameZh: "圣马丁机场", city: "St. Maarten", cityZh: "圣马丁", countryCode: "SX", latitude: 18.0410, longitude: -63.1089 },
  { iata: "ATH", name: "Athens International", nameZh: "雅典机场", city: "Athens", cityZh: "雅典", countryCode: "GR", latitude: 37.9364, longitude: 23.9445 },
  { iata: "JTR", name: "Santorini", nameZh: "圣托里尼机场", city: "Santorini", cityZh: "圣托里尼", countryCode: "GR", latitude: 36.3992, longitude: 25.4793 },
  { iata: "DXB", name: "Dubai International", nameZh: "迪拜机场", city: "Dubai", cityZh: "迪拜", countryCode: "AE", latitude: 25.2532, longitude: 55.3657 },
  { iata: "PEK", name: "Beijing Capital", nameZh: "首都机场", city: "Beijing", cityZh: "北京", countryCode: "CN", latitude: 40.0799, longitude: 116.6031 },
  { iata: "PVG", name: "Shanghai Pudong", nameZh: "浦东机场", city: "Shanghai", cityZh: "上海", countryCode: "CN", latitude: 31.1443, longitude: 121.8083 },
  { iata: "CAN", name: "Guangzhou Baiyun", nameZh: "白云机场", city: "Guangzhou", cityZh: "广州", countryCode: "CN", latitude: 23.3924, longitude: 113.2988 },
  { iata: "HKG", name: "Hong Kong International", nameZh: "香港机场", city: "Hong Kong", cityZh: "香港", countryCode: "HK", latitude: 22.3080, longitude: 113.9185 },
];

export const ALL_AIRPORTS: Airport[] = [
  ...DEPARTURE_AIRPORTS,
  ...DESTINATION_AIRPORTS.filter(
    (a) => !DEPARTURE_AIRPORTS.some((d) => d.iata === a.iata)
  ),
];

export function getAirportByIata(iata: string): Airport | undefined {
  return ALL_AIRPORTS.find((a) => a.iata === iata);
}