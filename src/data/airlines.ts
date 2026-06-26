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
  CA: { iata: "CA", name: "Air China", nameZh: "中国国际航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/CA.png" },
  MU: { iata: "MU", name: "China Eastern", nameZh: "中国东方航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/MU.png" },
  CZ: { iata: "CZ", name: "China Southern", nameZh: "中国南方航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/CZ.png" },
  CX: { iata: "CX", name: "Cathay Pacific", nameZh: "国泰航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/CX.png" },
  SQ: { iata: "SQ", name: "Singapore Airlines", nameZh: "新加坡航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/SQ.png" },
  TG: { iata: "TG", name: "Thai Airways", nameZh: "泰国国际航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/TG.png" },
  EK: { iata: "EK", name: "Emirates", nameZh: "阿联酋航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/EK.png" },
  QR: { iata: "QR", name: "Qatar Airways", nameZh: "卡塔尔航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/QR.png" },
  EY: { iata: "EY", name: "Etihad Airways", nameZh: "阿提哈德航空", alliance: null, logoUrl: "https://images.kiwi.com/airlines/64/EY.png" },
  LH: { iata: "LH", name: "Lufthansa", nameZh: "汉莎航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/LH.png" },
  BA: { iata: "BA", name: "British Airways", nameZh: "英国航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/BA.png" },
  AF: { iata: "AF", name: "Air France", nameZh: "法国航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/AF.png" },
  KL: { iata: "KL", name: "KLM", nameZh: "荷兰皇家航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/KL.png" },
  JL: { iata: "JL", name: "Japan Airlines", nameZh: "日本航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/JL.png" },
  NH: { iata: "NH", name: "ANA", nameZh: "全日空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/NH.png" },
  KE: { iata: "KE", name: "Korean Air", nameZh: "大韩航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/KE.png" },
  OZ: { iata: "OZ", name: "Asiana Airlines", nameZh: "韩亚航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/OZ.png" },
  CI: { iata: "CI", name: "China Airlines", nameZh: "中华航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/CI.png" },
  BR: { iata: "BR", name: "EVA Air", nameZh: "长荣航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/BR.png" },
  AA: { iata: "AA", name: "American Airlines", nameZh: "美国航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/AA.png" },
  UA: { iata: "UA", name: "United Airlines", nameZh: "美联航", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/UA.png" },
  DL: { iata: "DL", name: "Delta Air Lines", nameZh: "达美航空", alliance: "skyteam", logoUrl: "https://images.kiwi.com/airlines/64/DL.png" },
  QF: { iata: "QF", name: "Qantas", nameZh: "澳洲航空", alliance: "oneworld", logoUrl: "https://images.kiwi.com/airlines/64/QF.png" },
  TK: { iata: "TK", name: "Turkish Airlines", nameZh: "土耳其航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/TK.png" },
  LX: { iata: "LX", name: "Swiss", nameZh: "瑞士国际航空", alliance: "star-alliance", logoUrl: "https://images.kiwi.com/airlines/64/LX.png" },
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