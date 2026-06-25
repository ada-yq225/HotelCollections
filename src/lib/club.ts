export const KEYCARD_TRADE_TYPES = [
  { value: "display", label: "展示", color: "#6b7280" },
  { value: "offer", label: "出让", color: "#b8956b" },
  { value: "wanted", label: "求换", color: "#1a1a1a" },
] as const;

export const DISCUSSION_CATEGORIES = [
  { value: "status-match", label: "保级攻略", desc: "各大集团会员保级经验" },
  { value: "promo", label: "季度活动", desc: "Q1/Q2 促销玩法与叠加" },
  { value: "benefits", label: "权益分享", desc: "合规的礼遇与权益互助" },
  { value: "compare", label: "礼遇对比", desc: "STARS/Luminous/Virtuoso 等对比" },
  { value: "general", label: "综合讨论", desc: "常旅客综合话题" },
] as const;

export const BOOKING_PERKS = [
  { icon: "upgrade", title: "视房态升级", desc: "基础房升行政房/套房" },
  { icon: "breakfast", title: "双人早餐", desc: "每日免费双人自助早餐" },
  { icon: "credit", title: "消费抵扣", desc: "50-100 美金餐饮/SPA 额度" },
  { icon: "checkout", title: "弹性入退", desc: "提前入住 & 延迟退房" },
] as const;

export function getTradeTypeLabel(type: string) {
  return KEYCARD_TRADE_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function getCategoryLabel(cat: string) {
  return DISCUSSION_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
}