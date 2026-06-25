export type ReviewScores = {
  upgradeRate?: string | null;
  loungeDining?: number | null;
  loungeNote?: string | null;
  amenities?: number | null;
  amenitiesNote?: string | null;
  service?: number | null;
  serviceNote?: string | null;
};

export const REVIEW_DIMENSIONS = [
  {
    key: "upgradeRate" as const,
    label: "升房率",
    type: "text" as const,
    placeholder: "如：钛金卡升套房、白金卡升行政房",
    hint: "常旅客最看重的硬核指标",
  },
  {
    key: "loungeDining" as const,
    label: "酒廊与餐饮",
    type: "score" as const,
    noteKey: "loungeNote" as const,
    placeholder: "HH 质量、早餐丰富度、酒廊出品",
  },
  {
    key: "amenities" as const,
    label: "备品与硬件",
    type: "score" as const,
    noteKey: "amenitiesNote" as const,
    placeholder: "戴森吹风机、Le Labo 洗护、床品",
  },
  {
    key: "service" as const,
    label: "服务细节",
    type: "score" as const,
    noteKey: "serviceNote" as const,
    placeholder: "夜床服务、欢迎礼、响应速度",
  },
];

export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function avgScore(scores: ReviewScores): number | null {
  const vals = [scores.loungeDining, scores.amenities, scores.service].filter(
    (v): v is number => typeof v === "number"
  );
  if (vals.length === 0) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}