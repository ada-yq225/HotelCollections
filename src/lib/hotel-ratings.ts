import type { HotelEntry } from "@/data/hotels/types";

export const TRAVELER_RATING_DIMENSIONS = [
  { key: "scoreLocation", label: "位置与环境", hint: "地段、景观、周边环境" },
  { key: "scoreDesign", label: "设计美学", hint: "建筑、室内、艺术氛围" },
  { key: "scoreService", label: "服务水准", hint: "管家式服务、响应与细节" },
  { key: "scoreDining", label: "餐饮酒廊", hint: "餐厅、早餐、行政酒廊" },
  { key: "scoreHardware", label: "客房硬件", hint: "床品、卫浴、科技配置" },
] as const;

export type TravelerRatingDimensions = {
  scoreLocation: number;
  scoreDesign: number;
  scoreService: number;
  scoreDining: number;
  scoreHardware: number;
};

export type TravelerRatingEstimate = TravelerRatingDimensions & {
  travelerScore: number;
  travelerRatingCount: number;
  travelerReviewSummary: string;
};

const BRAND_BASE_SCORE: Record<string, number> = {
  "cheval-blanc": 9.5,
  aman: 9.6,
  soneva: 9.5,
  joali: 9.4,
  singita: 9.5,
  "one-and-only": 9.3,
  "the-brando": 9.4,
  "north-island": 9.7,
  "four-seasons": 9.2,
  "mandarin-oriental": 9.3,
  rosewood: 9.1,
  peninsula: 9.2,
  capella: 9.2,
  como: 9.0,
  belmond: 9.1,
  "ritz-carlton-reserve": 9.4,
  "ritz-carlton": 8.9,
  "st-regis": 8.9,
  "park-hyatt": 8.8,
  "waldorf-astoria": 8.9,
  edition: 9.0,
  conrad: 8.5,
  andaz: 8.4,
  alila: 9.0,
  "six-senses": 9.2,
  intercontinental: 8.3,
  regent: 8.9,
  fairmont: 8.4,
  raffles: 9.0,
  "sofitel-legend": 8.7,
  "banyan-tree": 8.8,
  "luxury-collection": 8.5,
  patina: 9.1,
  anantara: 8.7,
  oberoi: 9.1,
  "shangri-la": 8.4,
  kempinski: 8.3,
  gili: 9.3,
  velaa: 9.4,
  milaidhoo: 9.2,
  qualia: 9.3,
  likuliku: 9.0,
  vignette: 8.6,
};

const BRAND_DIM_BIAS: Record<string, Partial<TravelerRatingDimensions>> = {
  aman: { scoreDesign: 0.3, scoreService: 0.2, scoreHardware: 0.2 },
  "mandarin-oriental": { scoreService: 0.3, scoreDining: 0.2 },
  "four-seasons": { scoreService: 0.2, scoreHardware: 0.15 },
  rosewood: { scoreDesign: 0.25, scoreDining: 0.1 },
  "park-hyatt": { scoreDesign: 0.2, scoreLocation: 0.1 },
  "six-senses": { scoreDesign: 0.2, scoreLocation: 0.25 },
  "ritz-carlton": { scoreService: 0.15, scoreHardware: 0.1 },
  "banyan-tree": { scoreDesign: 0.15, scoreLocation: 0.2 },
};

const RESORT_REGIONS = new Set([
  "maldives",
  "tahiti",
  "fiji",
  "caribbean",
  "bodrum",
  "bali",
  "phuket",
  "samui",
  "phu-quoc",
  "safari",
  "indian-ocean",
  "southeast-asia-island",
  "hawaii",
  "mexico-resort",
  "mediterranean",
]);

function stableHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

function clampScore(n: number): number {
  return Math.min(9.9, Math.max(7.2, Math.round(n * 10) / 10));
}

function getRegionBoost(hotel: Pick<HotelEntry, "region" | "countryCode" | "cityZh">): number {
  if (hotel.region === "maldives" || hotel.countryCode === "MV") return 0.15;
  if (hotel.region === "safari") return 0.2;
  if (RESORT_REGIONS.has(hotel.region)) return 0.1;
  if (["北京", "上海", "香港", "东京", "巴黎", "伦敦", "纽约"].includes(hotel.cityZh)) return 0.05;
  return 0;
}

function buildSummary(
  hotel: Pick<HotelEntry, "brandSlug" | "region" | "cityZh" | "nameZh" | "name">
): string {
  const name = hotel.nameZh || hotel.name;
  const templates: Record<string, string> = {
    aman: `${name}：静谧奢隐典范，宾客公认的服务与艺术感俱佳`,
    "four-seasons": `${name}：四季标准化之上的在地化表达，家庭与商务旅客口碑稳定`,
    "mandarin-oriental": `${name}：文华东方式管家服务亮眼，餐饮与景观表现突出`,
    rosewood: `${name}：瑰丽系现代奢华路线，设计感和城市度假感兼备`,
    "cheval-blanc": `${name}：LVMH 旗下顶奢定位，套房与餐饮体验一骑绝尘`,
    "ritz-carlton": `${name}：丽思经典服务礼仪到位，常旅客升房体验较好`,
    "park-hyatt": `${name}：柏悦系高空城市酒店，设计简洁、地段优势明显`,
    "six-senses": `${name}：六善式养生度假理念，环保与私密性备受推崇`,
  };

  if (hotel.region === "maldives") {
    return `${name}：马代度假标杆之一，水上别墅体验与海洋景观获高端旅客高频推荐`;
  }
  if (hotel.region === "safari") {
    return `${name}：非洲游猎顶级营地，向导专业度与野奢体验评分极高`;
  }

  return (
    templates[hotel.brandSlug] ??
    `${name}：H&C 高端旅客社群综合口碑良好，各维度表现均衡`
  );
}

function estimateRatingCount(
  hotel: Pick<HotelEntry, "slug" | "brandSlug" | "cityZh" | "region">
): number {
  const tier1 = new Set(["北京", "上海", "香港", "广州", "深圳", "东京", "巴黎", "伦敦", "纽约"]);
  const ultraLux = new Set([
    "aman",
    "cheval-blanc",
    "soneva",
    "joali",
    "singita",
    "one-and-only",
    "north-island",
  ]);

  let base = 18;
  if (ultraLux.has(hotel.brandSlug)) base += 35;
  else if (["four-seasons", "mandarin-oriental", "rosewood", "peninsula"].includes(hotel.brandSlug))
    base += 28;
  else if (["ritz-carlton", "st-regis", "park-hyatt"].includes(hotel.brandSlug)) base += 22;
  else base += 12;

  if (tier1.has(hotel.cityZh)) base += 20;
  if (RESORT_REGIONS.has(hotel.region)) base += 15;

  const jitter = Math.floor(stableHash(hotel.slug) * 24);
  return base + jitter;
}

/** Estimate H&C traveler ratings (10-point scale) */
export function estimateTravelerRating(
  hotel: Pick<
    HotelEntry,
    | "slug"
    | "brandSlug"
    | "region"
    | "countryCode"
    | "cityZh"
    | "nameZh"
    | "name"
    | "travelerScore"
    | "travelerRatingCount"
    | "travelerReviewSummary"
    | "scoreLocation"
    | "scoreDesign"
    | "scoreService"
    | "scoreDining"
    | "scoreHardware"
  >
): TravelerRatingEstimate {
  const manualDims =
    hotel.scoreLocation != null &&
    hotel.scoreDesign != null &&
    hotel.scoreService != null &&
    hotel.scoreDining != null &&
    hotel.scoreHardware != null;

  if (hotel.travelerScore != null && manualDims) {
    return {
      travelerScore: hotel.travelerScore,
      travelerRatingCount: hotel.travelerRatingCount ?? estimateRatingCount(hotel),
      travelerReviewSummary:
        hotel.travelerReviewSummary ?? buildSummary(hotel),
      scoreLocation: hotel.scoreLocation!,
      scoreDesign: hotel.scoreDesign!,
      scoreService: hotel.scoreService!,
      scoreDining: hotel.scoreDining!,
      scoreHardware: hotel.scoreHardware!,
    };
  }

  const base = (BRAND_BASE_SCORE[hotel.brandSlug] ?? 8.5) + getRegionBoost(hotel);
  const bias = BRAND_DIM_BIAS[hotel.brandSlug] ?? {};
  const jitter = (stableHash(hotel.slug) - 0.5) * 0.3;

  const dimensions: TravelerRatingDimensions = {
    scoreLocation: clampScore(base + (bias.scoreLocation ?? 0) + jitter * 0.5),
    scoreDesign: clampScore(base + (bias.scoreDesign ?? 0) + jitter * 0.3),
    scoreService: clampScore(base + (bias.scoreService ?? 0.1) + jitter * 0.2),
    scoreDining: clampScore(base + (bias.scoreDining ?? -0.05) + jitter * 0.4),
    scoreHardware: clampScore(base + (bias.scoreHardware ?? 0) + jitter * 0.3),
  };

  const travelerScore = clampScore(
    dimensions.scoreLocation * 0.2 +
      dimensions.scoreDesign * 0.2 +
      dimensions.scoreService * 0.25 +
      dimensions.scoreDining * 0.15 +
      dimensions.scoreHardware * 0.2
  );

  return {
    travelerScore: hotel.travelerScore ?? travelerScore,
    travelerRatingCount: hotel.travelerRatingCount ?? estimateRatingCount(hotel),
    travelerReviewSummary: hotel.travelerReviewSummary ?? buildSummary(hotel),
    ...dimensions,
  };
}

export function formatTravelerScore(score: number): string {
  return score.toFixed(1);
}

export function scoreLabel(score: number): string {
  if (score >= 9.5) return "卓越";
  if (score >= 9.0) return "出色";
  if (score >= 8.5) return "优秀";
  if (score >= 8.0) return "良好";
  return "尚可";
}