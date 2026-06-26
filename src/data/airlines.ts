export type AirlineAllianceSlug = "star-alliance" | "skyteam" | "oneworld";

export type AirlineInfo = {
  iata: string;
  name: string;
  nameZh: string;
  alliance: AirlineAllianceSlug | null;
  /** Kiwi.com public airline logo CDN */
  logoUrl: string;
};

export const ALLIANCE_LABELS: Record<AirlineAllianceSlug, string> = {
  "star-alliance": "星空联盟",
  skyteam: "天合联盟",
  oneworld: "寰宇一家",
};

export const AIRLINES: Record<string, AirlineInfo> = {
  // 中国
  CA: { iata: "CA", name: "Air China", nameZh: "中国国际航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/CA.png" },
  MU: { iata: "MU", name: "China Eastern", nameZh: "中国东方航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/MU.png" },
  CZ: { iata: "CZ", name: "China Southern", nameZh: "中国南方航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/CZ.png" },
  HU: { iata: "HU", name: "Hainan Airlines", nameZh: "海南航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/HU.png" },
  ZH: { iata: "ZH", name: "Shenzhen Airlines", nameZh: "深圳航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/ZH.png" },
  MF: { iata: "MF", name: "Xiamen Airlines", nameZh: "厦门航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/MF.png" },
  "3U": { iata: "3U", name: "Sichuan Airlines", nameZh: "四川航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/3U.png" },
  SC: { iata: "SC", name: "Shandong Airlines", nameZh: "山东航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/SC.png" },
  "9C": { iata: "9C", name: "Spring Airlines", nameZh: "春秋航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/9C.png" },
  // 香港/台湾/澳门
  CX: { iata: "CX", name: "Cathay Pacific", nameZh: "国泰航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/CX.png" },
  CI: { iata: "CI", name: "China Airlines", nameZh: "中华航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/CI.png" },
  BR: { iata: "BR", name: "EVA Air", nameZh: "长荣航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/BR.png" },
  NX: { iata: "NX", name: "Air Macau", nameZh: "澳门航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/NX.png" },
  UO: { iata: "UO", name: "HK Express", nameZh: "香港快运", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/UO.png" },
  // 日本
  NH: { iata: "NH", name: "ANA", nameZh: "全日空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/NH.png" },
  JL: { iata: "JL", name: "Japan Airlines", nameZh: "日本航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/JL.png" },
  MM: { iata: "MM", name: "Peach Aviation", nameZh: "乐桃航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/MM.png" },
  // 韩国
  KE: { iata: "KE", name: "Korean Air", nameZh: "大韩航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/KE.png" },
  OZ: { iata: "OZ", name: "Asiana Airlines", nameZh: "韩亚航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/OZ.png" },
  // 东南亚
  SQ: { iata: "SQ", name: "Singapore Airlines", nameZh: "新加坡航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/SQ.png" },
  TG: { iata: "TG", name: "Thai Airways", nameZh: "泰国国际航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/TG.png" },
  MH: { iata: "MH", name: "Malaysia Airlines", nameZh: "马来西亚航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/MH.png" },
  GA: { iata: "GA", name: "Garuda Indonesia", nameZh: "印尼鹰航", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/GA.png" },
  VN: { iata: "VN", name: "Vietnam Airlines", nameZh: "越南航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/VN.png" },
  PR: { iata: "PR", name: "Philippine Airlines", nameZh: "菲律宾航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/PR.png" },
  AK: { iata: "AK", name: "AirAsia", nameZh: "亚洲航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/AK.png" },
  // 南亚/中亚
  AI: { iata: "AI", name: "Air India", nameZh: "印度航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/AI.png" },
  KC: { iata: "KC", name: "Air Astana", nameZh: "阿斯塔纳航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/KC.png" },
  HY: { iata: "HY", name: "Uzbekistan Airways", nameZh: "乌兹别克斯坦航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/HY.png" },
  // 中东
  EK: { iata: "EK", name: "Emirates", nameZh: "阿联酋航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/EK.png" },
  QR: { iata: "QR", name: "Qatar Airways", nameZh: "卡塔尔航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/QR.png" },
  EY: { iata: "EY", name: "Etihad Airways", nameZh: "阿提哈德航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/EY.png" },
  SV: { iata: "SV", name: "Saudia", nameZh: "沙特阿拉伯航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/SV.png" },
  GF: { iata: "GF", name: "Gulf Air", nameZh: "海湾航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/GF.png" },
  // 欧洲
  LH: { iata: "LH", name: "Lufthansa", nameZh: "汉莎航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/LH.png" },
  LX: { iata: "LX", name: "Swiss", nameZh: "瑞士国际航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/LX.png" },
  AF: { iata: "AF", name: "Air France", nameZh: "法国航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/AF.png" },
  KL: { iata: "KL", name: "KLM", nameZh: "荷兰皇家航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/KL.png" },
  BA: { iata: "BA", name: "British Airways", nameZh: "英国航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/BA.png" },
  IB: { iata: "IB", name: "Iberia", nameZh: "伊比利亚航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/IB.png" },
  AY: { iata: "AY", name: "Finnair", nameZh: "芬兰航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/AY.png" },
  EI: { iata: "EI", name: "Aer Lingus", nameZh: "爱尔兰航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/EI.png" },
  VS: { iata: "VS", name: "Virgin Atlantic", nameZh: "维珍航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/VS.png" },
  TK: { iata: "TK", name: "Turkish Airlines", nameZh: "土耳其航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/TK.png" },
  SU: { iata: "SU", name: "Aeroflot", nameZh: "俄罗斯航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/SU.png" },
  TP: { iata: "TP", name: "TAP Air Portugal", nameZh: "葡萄牙航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/TP.png" },
  SK: { iata: "SK", name: "SAS", nameZh: "北欧航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/SK.png" },
  LO: { iata: "LO", name: "LOT Polish Airlines", nameZh: "波兰航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/LO.png" },
  // 北美
  UA: { iata: "UA", name: "United Airlines", nameZh: "美联航", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/UA.png" },
  DL: { iata: "DL", name: "Delta Air Lines", nameZh: "达美航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/DL.png" },
  AA: { iata: "AA", name: "American Airlines", nameZh: "美国航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/AA.png" },
  AC: { iata: "AC", name: "Air Canada", nameZh: "加拿大航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/AC.png" },
  B6: { iata: "B6", name: "JetBlue", nameZh: "捷蓝航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/B6.png" },
  HA: { iata: "HA", name: "Hawaiian Airlines", nameZh: "夏威夷航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/HA.png" },
  // 大洋洲
  QF: { iata: "QF", name: "Qantas", nameZh: "澳洲航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/QF.png" },
  NZ: { iata: "NZ", name: "Air New Zealand", nameZh: "新西兰航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/NZ.png" },
  FJ: { iata: "FJ", name: "Fiji Airways", nameZh: "斐济航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/FJ.png" },
  // 非洲
  ET: { iata: "ET", name: "Ethiopian Airlines", nameZh: "埃塞俄比亚航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/ET.png" },
  SA: { iata: "SA", name: "South African Airways", nameZh: "南非航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/SA.png" },
  MS: { iata: "MS", name: "EgyptAir", nameZh: "埃及航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/MS.png" },
  // 拉美
  LA: { iata: "LA", name: "LATAM Airlines", nameZh: "拉美航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/LA.png" },
  AV: { iata: "AV", name: "Avianca", nameZh: "哥伦比亚航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/AV.png" },
  CM: { iata: "CM", name: "Copa Airlines", nameZh: "巴拿马航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/CM.png" },
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
  return (
    AIRLINES[iata] ?? {
      iata,
      name: iata,
      nameZh: iata,
      alliance: null,
      logoUrl: `https://images.kiwi.com/airlines/64/${iata}.png`,
    }
  );
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