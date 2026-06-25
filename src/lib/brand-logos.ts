export type BrandVisual = {
  monogram: string;
  bg: string;
  fg: string;
  shape: "circle" | "square" | "rounded";
  border?: string;
};

const BRAND_VISUALS: Record<string, BrandVisual> = {
  "four-seasons": { monogram: "FS", bg: "#1a1a1a", fg: "#ffffff", shape: "square" },
  "mandarin-oriental": { monogram: "MO", bg: "#8B2942", fg: "#ffffff", shape: "circle" },
  "cheval-blanc": { monogram: "CB", bg: "#2c2c2c", fg: "#C9A962", shape: "square", border: "#C9A962" },
  "ritz-carlton": { monogram: "RC", bg: "#1a1a1a", fg: "#C9A962", shape: "circle" },
  "ritz-carlton-reserve": { monogram: "RR", bg: "#0d0d0d", fg: "#C9A962", shape: "square" },
  "st-regis": { monogram: "SR", bg: "#1a1a1a", fg: "#ffffff", shape: "square" },
  "park-hyatt": { monogram: "PH", bg: "#1a1a1a", fg: "#ffffff", shape: "rounded" },
  "waldorf-astoria": { monogram: "WA", bg: "#003B71", fg: "#ffffff", shape: "square" },
  "conrad": { monogram: "C", bg: "#003B71", fg: "#ffffff", shape: "circle" },
  "edition": { monogram: "ED", bg: "#1a1a1a", fg: "#ffffff", shape: "square" },
  "w-hotels": { monogram: "W", bg: "#1a1a1a", fg: "#ffffff", shape: "square" },
  "jw-marriott": { monogram: "JW", bg: "#B41F3A", fg: "#ffffff", shape: "rounded" },
  "luxury-collection": { monogram: "LC", bg: "#1a1a1a", fg: "#C9A962", shape: "circle" },
  "andaz": { monogram: "AZ", bg: "#E2231A", fg: "#ffffff", shape: "rounded" },
  alila: { monogram: "AL", bg: "#1a1a1a", fg: "#ffffff", shape: "circle" },
  "six-senses": { monogram: "6", bg: "#4a6741", fg: "#ffffff", shape: "circle" },
  intercontinental: { monogram: "IC", bg: "#1E4D8C", fg: "#ffffff", shape: "rounded" },
  regent: { monogram: "RG", bg: "#1E4D8C", fg: "#C9A962", shape: "square" },
  raffles: { monogram: "RF", bg: "#1a1a1a", fg: "#C9A962", shape: "square" },
  fairmont: { monogram: "F", bg: "#1a1a1a", fg: "#ffffff", shape: "circle" },
  "sofitel-legend": { monogram: "SL", bg: "#1a1a1a", fg: "#C9A962", shape: "rounded" },
  "banyan-tree": { monogram: "BT", bg: "#2d4a3e", fg: "#ffffff", shape: "circle" },
  rosewood: { monogram: "RW", bg: "#3d2b1f", fg: "#ffffff", shape: "square" },
  aman: { monogram: "A", bg: "#2c2c2c", fg: "#ffffff", shape: "square" },
  peninsula: { monogram: "P", bg: "#1a1a1a", fg: "#C9A962", shape: "circle" },
  belmond: { monogram: "B", bg: "#1a3d2e", fg: "#ffffff", shape: "circle" },
  capella: { monogram: "CP", bg: "#1a1a1a", fg: "#C9A962", shape: "rounded" },
  "one-and-only": { monogram: "O&O", bg: "#1a1a1a", fg: "#ffffff", shape: "rounded" },
  como: { monogram: "C", bg: "#ffffff", fg: "#1a1a1a", shape: "square", border: "#e8e8e8" },
  "shangri-la": { monogram: "SL", bg: "#8B2942", fg: "#ffffff", shape: "circle" },
  soneva: { monogram: "S", bg: "#4a6741", fg: "#ffffff", shape: "circle" },
  joali: { monogram: "J", bg: "#d4a5a5", fg: "#1a1a1a", shape: "circle" },
  patina: { monogram: "P", bg: "#1a1a1a", fg: "#ffffff", shape: "square" },
  anantara: { monogram: "AN", bg: "#5c4033", fg: "#ffffff", shape: "rounded" },
  kempinski: { monogram: "K", bg: "#8B0000", fg: "#C9A962", shape: "circle" },
  singita: { monogram: "S", bg: "#3d2b1f", fg: "#ffffff", shape: "circle" },
  vignette: { monogram: "V", bg: "#1E4D8C", fg: "#ffffff", shape: "rounded" },
  lxr: { monogram: "LXR", bg: "#003B71", fg: "#ffffff", shape: "rounded" },
  miraval: { monogram: "MV", bg: "#7d8471", fg: "#ffffff", shape: "circle" },
};

function deriveMonogram(slug: string): string {
  if (slug === "w-hotels") return "W";
  const parts = slug.split("-").filter(Boolean);
  if (parts.length >= 2) return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  return slug.slice(0, 2).toUpperCase();
}

export function getBrandVisual(brandSlug: string, groupColor = "#b8956b"): BrandVisual {
  const known = BRAND_VISUALS[brandSlug];
  if (known) return known;

  return {
    monogram: deriveMonogram(brandSlug),
    bg: groupColor,
    fg: "#ffffff",
    shape: "rounded",
  };
}

export function getGroupVisual(groupSlug: string, groupColor: string, nameZh: string): BrandVisual {
  const groupMarks: Record<string, string> = {
    marriott: "M",
    hyatt: "H",
    ihg: "IHG",
    hilton: "H",
    accor: "A",
    "four-seasons": "FS",
    "mandarin-oriental": "MO",
    "cheval-blanc": "CB",
    independent: nameZh.slice(0, 1),
  };

  return {
    monogram: groupMarks[groupSlug] ?? nameZh.slice(0, 2),
    bg: groupColor,
    fg: "#ffffff",
    shape: groupSlug === "four-seasons" || groupSlug === "cheval-blanc" ? "square" : "circle",
  };
}