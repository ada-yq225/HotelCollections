import { getAirlineLogoPath } from "@/lib/airline-logos";

export type AirlineAllianceSlug = "star-alliance" | "skyteam" | "oneworld";

export type AirlineInfo = {
  iata: string;
  name: string;
  nameZh: string;
  alliance: AirlineAllianceSlug | null;
  /** Local official tail logo at public/airlines/{iata}.png */
  logoUrl: string;
};

export const ALLIANCE_LABELS: Record<AirlineAllianceSlug, string> = {
  "star-alliance": "星空联盟",
  skyteam: "天合联盟",
  oneworld: "寰宇一家",
};

export const AIRLINES: Record<string, AirlineInfo> = {
  // 中国
  CA: { iata: "CA", name: "Air China", nameZh: "中国国际航空", alliance: "star-alliance", logoUrl: "" },
  MU: { iata: "MU", name: "China Eastern", nameZh: "中国东方航空", alliance: "skyteam", logoUrl: "" },
  CZ: { iata: "CZ", name: "China Southern", nameZh: "中国南方航空", alliance: "skyteam", logoUrl: "" },
  HU: { iata: "HU", name: "Hainan Airlines", nameZh: "海南航空", alliance: null, logoUrl: "" },
  ZH: { iata: "ZH", name: "Shenzhen Airlines", nameZh: "深圳航空", alliance: "star-alliance", logoUrl: "" },
  MF: { iata: "MF", name: "Xiamen Airlines", nameZh: "厦门航空", alliance: "skyteam", logoUrl: "" },
  "3U": { iata: "3U", name: "Sichuan Airlines", nameZh: "四川航空", alliance: null, logoUrl: "" },
  SC: { iata: "SC", name: "Shandong Airlines", nameZh: "山东航空", alliance: null, logoUrl: "" },
  "9C": { iata: "9C", name: "Spring Airlines", nameZh: "春秋航空", alliance: null, logoUrl: "" },
  // 香港/台湾/澳门
  CX: { iata: "CX", name: "Cathay Pacific", nameZh: "国泰航空", alliance: "oneworld", logoUrl: "" },
  CI: { iata: "CI", name: "China Airlines", nameZh: "中华航空", alliance: "skyteam", logoUrl: "" },
  BR: { iata: "BR", name: "EVA Air", nameZh: "长荣航空", alliance: "star-alliance", logoUrl: "" },
  NX: { iata: "NX", name: "Air Macau", nameZh: "澳门航空", alliance: null, logoUrl: "" },
  UO: { iata: "UO", name: "HK Express", nameZh: "香港快运", alliance: null, logoUrl: "" },
  // 日本
  NH: { iata: "NH", name: "ANA", nameZh: "全日空", alliance: "star-alliance", logoUrl: "" },
  JL: { iata: "JL", name: "Japan Airlines", nameZh: "日本航空", alliance: "oneworld", logoUrl: "" },
  MM: { iata: "MM", name: "Peach Aviation", nameZh: "乐桃航空", alliance: null, logoUrl: "" },
  // 韩国
  KE: { iata: "KE", name: "Korean Air", nameZh: "大韩航空", alliance: "skyteam", logoUrl: "" },
  OZ: { iata: "OZ", name: "Asiana Airlines", nameZh: "韩亚航空", alliance: "star-alliance", logoUrl: "" },
  // 东南亚
  SQ: { iata: "SQ", name: "Singapore Airlines", nameZh: "新加坡航空", alliance: "star-alliance", logoUrl: "" },
  TG: { iata: "TG", name: "Thai Airways", nameZh: "泰国国际航空", alliance: "star-alliance", logoUrl: "" },
  MH: { iata: "MH", name: "Malaysia Airlines", nameZh: "马来西亚航空", alliance: "oneworld", logoUrl: "" },
  GA: { iata: "GA", name: "Garuda Indonesia", nameZh: "印尼鹰航", alliance: "skyteam", logoUrl: "" },
  VN: { iata: "VN", name: "Vietnam Airlines", nameZh: "越南航空", alliance: "skyteam", logoUrl: "" },
  PR: { iata: "PR", name: "Philippine Airlines", nameZh: "菲律宾航空", alliance: null, logoUrl: "" },
  AK: { iata: "AK", name: "AirAsia", nameZh: "亚洲航空", alliance: null, logoUrl: "" },
  // 南亚/中亚
  AI: { iata: "AI", name: "Air India", nameZh: "印度航空", alliance: "star-alliance", logoUrl: "" },
  KC: { iata: "KC", name: "Air Astana", nameZh: "阿斯塔纳航空", alliance: null, logoUrl: "" },
  HY: { iata: "HY", name: "Uzbekistan Airways", nameZh: "乌兹别克斯坦航空", alliance: null, logoUrl: "" },
  // 中东
  EK: { iata: "EK", name: "Emirates", nameZh: "阿联酋航空", alliance: null, logoUrl: "" },
  QR: { iata: "QR", name: "Qatar Airways", nameZh: "卡塔尔航空", alliance: "oneworld", logoUrl: "" },
  EY: { iata: "EY", name: "Etihad Airways", nameZh: "阿提哈德航空", alliance: null, logoUrl: "" },
  SV: { iata: "SV", name: "Saudia", nameZh: "沙特阿拉伯航空", alliance: "skyteam", logoUrl: "" },
  GF: { iata: "GF", name: "Gulf Air", nameZh: "海湾航空", alliance: null, logoUrl: "" },
  // 欧洲
  LH: { iata: "LH", name: "Lufthansa", nameZh: "汉莎航空", alliance: "star-alliance", logoUrl: "" },
  LX: { iata: "LX", name: "Swiss", nameZh: "瑞士国际航空", alliance: "star-alliance", logoUrl: "" },
  AF: { iata: "AF", name: "Air France", nameZh: "法国航空", alliance: "skyteam", logoUrl: "" },
  KL: { iata: "KL", name: "KLM", nameZh: "荷兰皇家航空", alliance: "skyteam", logoUrl: "" },
  BA: { iata: "BA", name: "British Airways", nameZh: "英国航空", alliance: "oneworld", logoUrl: "" },
  IB: { iata: "IB", name: "Iberia", nameZh: "伊比利亚航空", alliance: "oneworld", logoUrl: "" },
  AY: { iata: "AY", name: "Finnair", nameZh: "芬兰航空", alliance: "oneworld", logoUrl: "" },
  EI: { iata: "EI", name: "Aer Lingus", nameZh: "爱尔兰航空", alliance: null, logoUrl: "" },
  VS: { iata: "VS", name: "Virgin Atlantic", nameZh: "维珍航空", alliance: null, logoUrl: "" },
  TK: { iata: "TK", name: "Turkish Airlines", nameZh: "土耳其航空", alliance: "star-alliance", logoUrl: "" },
  SU: { iata: "SU", name: "Aeroflot", nameZh: "俄罗斯航空", alliance: null, logoUrl: "" },
  TP: { iata: "TP", name: "TAP Air Portugal", nameZh: "葡萄牙航空", alliance: "star-alliance", logoUrl: "" },
  SK: { iata: "SK", name: "SAS", nameZh: "北欧航空", alliance: "skyteam", logoUrl: "" },
  LO: { iata: "LO", name: "LOT Polish Airlines", nameZh: "波兰航空", alliance: "star-alliance", logoUrl: "" },
  // 北美
  UA: { iata: "UA", name: "United Airlines", nameZh: "美联航", alliance: "star-alliance", logoUrl: "" },
  DL: { iata: "DL", name: "Delta Air Lines", nameZh: "达美航空", alliance: "skyteam", logoUrl: "" },
  AA: { iata: "AA", name: "American Airlines", nameZh: "美国航空", alliance: "oneworld", logoUrl: "" },
  AC: { iata: "AC", name: "Air Canada", nameZh: "加拿大航空", alliance: "star-alliance", logoUrl: "" },
  B6: { iata: "B6", name: "JetBlue", nameZh: "捷蓝航空", alliance: null, logoUrl: "" },
  HA: { iata: "HA", name: "Hawaiian Airlines", nameZh: "夏威夷航空", alliance: null, logoUrl: "" },
  // 大洋洲
  QF: { iata: "QF", name: "Qantas", nameZh: "澳洲航空", alliance: "oneworld", logoUrl: "" },
  NZ: { iata: "NZ", name: "Air New Zealand", nameZh: "新西兰航空", alliance: "star-alliance", logoUrl: "" },
  FJ: { iata: "FJ", name: "Fiji Airways", nameZh: "斐济航空", alliance: null, logoUrl: "" },
  // 非洲
  ET: { iata: "ET", name: "Ethiopian Airlines", nameZh: "埃塞俄比亚航空", alliance: "star-alliance", logoUrl: "" },
  SA: { iata: "SA", name: "South African Airways", nameZh: "南非航空", alliance: "star-alliance", logoUrl: "" },
  MS: { iata: "MS", name: "EgyptAir", nameZh: "埃及航空", alliance: "star-alliance", logoUrl: "" },
  // 拉美
  LA: { iata: "LA", name: "LATAM Airlines", nameZh: "拉美航空", alliance: null, logoUrl: "" },
  AV: { iata: "AV", name: "Avianca", nameZh: "哥伦比亚航空", alliance: "star-alliance", logoUrl: "" },
  CM: { iata: "CM", name: "Copa Airlines", nameZh: "巴拿马航空", alliance: "star-alliance", logoUrl: "" },
};

/** Preferred carriers by departure country / hub */
const ROUTE_CARRIER_HINTS: Record<string, string[]> = {
  CN: ["CA", "MU", "CZ"],
  HK: ["CX", "CA"],
  SG: ["SQ", "CX"],
  TH: ["TG", "SQ"],
  AE: ["EK", "EY"],
  AUH: ["EY", "EK"],
  QA: ["QR"],
  JP: ["NH", "JL"],
  KR: ["KE", "OZ"],
  GB: ["BA", "LH"],
  FR: ["AF", "KL"],
  US: ["AA", "UA", "DL"],
  AU: ["QF", "SQ"],
};

export function getAirline(iata: string): AirlineInfo {
  const logoUrl = getAirlineLogoPath(iata);
  const entry = AIRLINES[iata];
  if (entry) return { ...entry, logoUrl };
  return { iata, name: iata, nameZh: iata, alliance: null, logoUrl };
}

export function pickCarrierForLeg(
  fromCountry: string,
  toCountry: string,
  hubCountry?: string,
  legIndex = 0
): AirlineInfo {
  const pool =
    ROUTE_CARRIER_HINTS[hubCountry ?? ""] ??
    ROUTE_CARRIER_HINTS[fromCountry] ??
    ROUTE_CARRIER_HINTS[toCountry] ??
    ["SQ", "CX", "EK"];
  const iata = pool[legIndex % pool.length];
  return getAirline(iata);
}

export function flightNumberFor(airlineIata: string, from: string, to: string, salt = 0): string {
  let h = 0;
  const s = `${airlineIata}${from}${to}${salt}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 900;
  const num = 100 + h;
  return `${airlineIata}${num}`;
}

export function estimateEconomyPriceCny(
  distanceKm: number,
  stops: number,
  durationMin: number
): number {
  let price = distanceKm * 1.35 + 600;
  if (distanceKm > 6000) price *= 1.15;
  if (distanceKm < 800) price *= 0.75;
  if (stops > 0) price *= 0.88;
  if (durationMin > 720) price *= 1.08;
  return Math.round(price / 50) * 50;
}