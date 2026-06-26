/** Hotel group promotions calendar for Chinese frequent travelers */
export type PromoEvent = {
  id: string;
  groupSlug: string;
  groupName: string;
  groupNameZh: string;
  programName: string;
  title: string;
  titleZh: string;
  description: string;
  registrationStart: string; // ISO date
  registrationEnd: string;
  stayStart: string;
  stayEnd: string;
  promoType: "double-points" | "bonus-nights" | "flash-sale" | "status-boost" | "points-buy" | "other";
  bonusDetail: string;
  minNights?: number;
  maxBonus?: string;
  link?: string;
  tips: string[];
  color: string;
};

export const PROMOTIONS_2026: PromoEvent[] = [
  // Q2 Promotions (active or upcoming)
  {
    id: "marriott-q2-2026",
    groupSlug: "marriott",
    groupName: "Marriott Bonvoy",
    groupNameZh: "万豪旅享家",
    programName: "Marriott Bonvoy",
    title: "Q2 全球促销",
    titleZh: "每次入住赚取双倍积分 + 双倍房晚",
    description: "登记后每次入住获双倍积分与双倍定级房晚，加速升级与保级。",
    registrationStart: "2026-04-15",
    registrationEnd: "2026-07-15",
    stayStart: "2026-05-01",
    stayEnd: "2026-08-15",
    promoType: "double-points",
    bonusDetail: "双倍积分 + 双倍定级房晚",
    link: "https://marriott.com/offers",
    tips: ["入住品牌不限，丽思卡尔顿/瑞吉/艾迪逊均参与", "与白金挑战可叠加（挑战房晚 = 实际房晚 × 2）", "积分兑换住宿不参与"],
    color: "#B41F3A",
  },
  {
    id: "hyatt-q2-2026",
    groupSlug: "hyatt",
    groupName: "World of Hyatt",
    groupNameZh: "凯悦天地",
    programName: "World of Hyatt",
    title: "Q2 Bonus Journeys",
    titleZh: "每 3 晚额外 3,000 积分",
    description: "全球凯悦酒店每累计 3 个认可房晚，即获 3,000 奖励积分。",
    registrationStart: "2026-04-01",
    registrationEnd: "2026-06-30",
    stayStart: "2026-04-15",
    stayEnd: "2026-07-31",
    promoType: "bonus-nights",
    bonusDetail: "每 3 晚 × 3,000 积分（上限 45,000）",
    link: "https://world.hyatt.com/content/gp/en/offers.html",
    tips: ["全品牌参加（含柏悦/安达仕/Alila）", "积分兑换住宿也算认可房晚", "叠加环球客挑战效率翻倍"],
    color: "#E2231A",
  },
  {
    id: "ihg-q2-2026",
    groupSlug: "ihg",
    groupName: "IHG One Rewards",
    groupNameZh: "洲际优悦会",
    programName: "IHG One Rewards",
    title: "Q2 双倍积分",
    titleZh: "每 2 晚双倍积分 + 里程碑加速",
    description: "登记后每入住 2 晚即获双倍积分，叠加里程碑奖励。",
    registrationStart: "2026-05-01",
    registrationEnd: "2026-08-31",
    stayStart: "2026-05-15",
    stayEnd: "2026-08-31",
    promoType: "double-points",
    bonusDetail: "双倍积分（从第 2 晚起）",
    link: "https://www.ihg.com/hotels/us/en/offers",
    tips: ["六善/丽晶/洲际品牌均参与", "结合中信 IHG 联名卡再叠加 5x", "定向offer可能更高（三倍积分）"],
    color: "#1E4D8C",
  },
  {
    id: "hilton-q2-2026",
    groupSlug: "hilton",
    groupName: "Hilton Honors",
    groupNameZh: "希尔顿荣誉客会",
    programName: "Hilton Honors",
    title: "Q2 双倍积分 + 双倍房晚",
    titleZh: "每次入住双倍积分与双倍房晚",
    description: "希尔顿 Power Up 促销：登记后所有入住双倍积分 + 双倍定级房晚，钻石仅需 15 晚。",
    registrationStart: "2026-05-01",
    registrationEnd: "2026-08-31",
    stayStart: "2026-05-01",
    stayEnd: "2026-08-31",
    promoType: "bonus-nights",
    bonusDetail: "双倍积分 + 双倍定级房晚（钻石挑战仅需 15 晚）",
    link: "https://www.hilton.com/en/offers/",
    tips: ["华尔道夫/康莱德/LXR 全部品牌参与", "双倍房晚可与钻石挑战叠加", "美运 Aspire 持卡人尤其受益"],
    color: "#003B71",
  },
  {
    id: "accor-q2-2026",
    groupSlug: "accor",
    groupName: "ALL – Accor Live Limitless",
    groupNameZh: "雅高心悦界",
    programName: "ALL",
    title: "Q2 加速升级",
    titleZh: "双倍定级房晚 + 积分加赠",
    description: "雅高会员加速活动：双倍定级房晚 + 额外积分奖励。",
    registrationStart: "2026-04-01",
    registrationEnd: "2026-06-30",
    stayStart: "2026-04-15",
    stayEnd: "2026-07-15",
    promoType: "bonus-nights",
    bonusDetail: "双倍定级房晚 + 额外 20% 积分",
    link: "https://all.accor.com/loyalty-program/offers/",
    tips: ["费尔蒙/莱佛士/索菲特等全品牌参与", "Accor Plus 会员叠加额外积分", "积分可直接抵扣房费（€20/1000分）"],
    color: "#1E1E1E",
  },
  // Points Purchase Promos
  {
    id: "marriott-points-buy-2026",
    groupSlug: "marriott",
    groupName: "Marriott Bonvoy",
    groupNameZh: "万豪旅享家",
    programName: "Marriott Bonvoy",
    title: "积分闪购",
    titleZh: "购买万豪积分享最高 50% 加赠",
    description: "年度积分促销，购买积分获 40-50% 加赠。每年购买上限 100,000 积分。",
    registrationStart: "2026-06-01",
    registrationEnd: "2026-07-15",
    stayStart: "2026-06-01",
    stayEnd: "2026-07-15",
    promoType: "points-buy",
    bonusDetail: "最高加赠 50%",
    link: "https://storefront.points.com/marriott/en-US/buy",
    tips: ["购买积分不产生定级房晚", "5 连住积分兑换最划算（第五晚免费）", "建议在确定出行计划后再购买"],
    color: "#B41F3A",
  },
  {
    id: "hilton-points-buy-2026",
    groupSlug: "hilton",
    groupName: "Hilton Honors",
    groupNameZh: "希尔顿荣誉客会",
    programName: "Hilton Honors",
    title: "积分闪购",
    titleZh: "购买希尔顿积分 100% 加赠",
    description: "希尔顿积分促销，通常可获 100% 加赠（即双倍）。年购买上限 160,000 积分。",
    registrationStart: "2026-06-01",
    registrationEnd: "2026-07-31",
    stayStart: "2026-06-01",
    stayEnd: "2026-07-31",
    promoType: "points-buy",
    bonusDetail: "100% 加赠（$0.005/积分）",
    link: "https://www.hiltonhonors.com/en_US/ways-to-earn/buy-points/",
    tips: ["适合兑换马尔代夫/大溪地等高价度假酒店", "积分兑换第五晚免费", "比万豪积分购买性价比低"],
    color: "#003B71",
  },
  // Flash Sale / Status Boost
  {
    id: "ihg-status-boost-2026",
    groupSlug: "ihg",
    groupName: "IHG One Rewards",
    groupNameZh: "洲际优悦会",
    programName: "IHG One Rewards",
    title: "洲际大使促销",
    titleZh: "购买洲际大使享会籍升级 + 免费住宿券",
    description: "洲际大使（InterContinental Ambassador）年费促销，含白金会籍 + 周末住一送一券 + 餐饮折扣。",
    registrationStart: "2026-01-01",
    registrationEnd: "2026-12-31",
    stayStart: "2026-01-01",
    stayEnd: "2027-12-31",
    promoType: "status-boost",
    bonusDetail: "白金会籍 + 周末免费住宿券 + 餐饮 20% 折扣",
    link: "https://www.ihg.com/intercontinental/hotels/us/en/ambassador",
    tips: ["仅覆盖洲际品牌（六善/丽晶不适用）", "白金会籍提供双早 + 升房 + 延迟退房", "年费 $200（促销期可能降至 $150）"],
    color: "#1E4D8C",
  },
];

/** Get active promotions for a group */
export function getActivePromos(groupSlug?: string): PromoEvent[] {
  const now = new Date();
  return PROMOTIONS_2026.filter((p) => {
    const regEnd = new Date(p.registrationEnd);
    if (groupSlug && p.groupSlug !== groupSlug) return false;
    return regEnd >= now;
  });
}

/** Group promotions by calendar quarter */
export function getPromosByQuarter(): Record<string, PromoEvent[]> {
  const quarters: Record<string, PromoEvent[]> = { Q1: [], Q2: [], Q3: [], Q4: [] };
  PROMOTIONS_2026.forEach((p) => {
    const m = new Date(p.stayStart).getMonth();
    if (m <= 2) quarters.Q1.push(p);
    else if (m <= 5) quarters.Q2.push(p);
    else if (m <= 8) quarters.Q3.push(p);
    else quarters.Q4.push(p);
  });
  return quarters;
}
