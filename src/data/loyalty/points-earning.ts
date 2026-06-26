/** Points earning rates for hotel groups & airline programs */
export type EarningRate = {
  basePointsPerCNY: number;
  eliteBonus: Record<string, number>; // tierSlug -> bonus multiplier (e.g. 0.5 = 50%)
  milestoneBonuses?: { nights: number; bonusPoints: number }[];
  milestoneNights?: number[]; // nights thresholds triggering milestone choice
};

export type ProgramEarning = {
  programSlug: string;
  name: string;
  nameZh: string;
  type: "hotel" | "airline";
  currency: string; // "CNY" | "USD" etc
  rate: EarningRate;
  /** Credit cards that earn extra in this program */
  recommendedCards?: { name: string; rate: number; desc: string }[];
};

export const HOTEL_EARNING_RATES: ProgramEarning[] = [
  {
    programSlug: "marriott-bonvoy",
    name: "Marriott Bonvoy",
    nameZh: "万豪旅享家",
    type: "hotel",
    currency: "CNY",
    rate: {
      basePointsPerCNY: 0.7,
      eliteBonus: { silver: 0.1, gold: 0.25, platinum: 0.5, titanium: 0.75, ambassador: 0.75 },
      milestoneBonuses: [
        { nights: 50, bonusPoints: 5000 },
        { nights: 75, bonusPoints: 7500 },
      ],
      milestoneNights: [50, 75],
    },
    recommendedCards: [
      { name: "中信万豪联名卡 精逸白", rate: 6, desc: "万豪消费每 CNY 6 积 10 分，赠 1 定级房晚/年" },
      { name: "中信万豪联名卡 白金卡", rate: 10, desc: "万豪消费每 CNY 10 积 10 分，赠 15 定级房晚/年" },
      { name: "招行运通百夫长", rate: 3, desc: "积分兑换万豪 3:1" },
    ],
  },
  {
    programSlug: "world-of-hyatt",
    name: "World of Hyatt",
    nameZh: "凯悦天地",
    type: "hotel",
    currency: "CNY",
    rate: {
      basePointsPerCNY: 0.7,
      eliteBonus: { discoverist: 0.05, explorist: 0.2, globalist: 0.3 },
      milestoneBonuses: [
        { nights: 20, bonusPoints: 2000 },
        { nights: 30, bonusPoints: 3000 },
        { nights: 40, bonusPoints: 4000 },
        { nights: 50, bonusPoints: 5000 },
        { nights: 60, bonusPoints: 6000 },
      ],
      milestoneNights: [20, 30, 40, 50, 60, 70, 80, 90, 100],
    },
    recommendedCards: [
      { name: "招行运通百夫长", rate: 3, desc: "积分兑换凯悦 3:1" },
      { name: "平安万里通", rate: 2, desc: "积分兑换 Hyatt 2:1" },
    ],
  },
  {
    programSlug: "ihg-one-rewards",
    name: "IHG One Rewards",
    nameZh: "洲际优悦会",
    type: "hotel",
    currency: "CNY",
    rate: {
      basePointsPerCNY: 0.7,
      eliteBonus: { silver: 0.2, gold: 0.4, platinum: 0.6, diamond: 1.0 },
      milestoneNights: [20, 30, 40, 50, 60, 70],
    },
    recommendedCards: [
      { name: "中信IHG联名卡 优悦白金", rate: 5, desc: "IHG 消费每 CNY 5 积 10 分，赠白金会籍" },
      { name: "招行运通百夫长", rate: 3, desc: "积分兑换 IHG 3:1" },
    ],
  },
  {
    programSlug: "hilton-honors",
    name: "Hilton Honors",
    nameZh: "希尔顿荣誉客会",
    type: "hotel",
    currency: "CNY",
    rate: {
      basePointsPerCNY: 1.0,
      eliteBonus: { silver: 0.2, gold: 0.8, diamond: 1.0 },
      milestoneNights: [20, 30, 40, 50, 60],
    },
    recommendedCards: [
      { name: "招行运通百夫长", rate: 3, desc: "积分兑换希尔顿 3:2" },
      { name: "浦发运通超白", rate: 2, desc: "积分兑换希尔顿 2:1" },
    ],
  },
  {
    programSlug: "accor-all",
    name: "ALL – Accor Live Limitless",
    nameZh: "雅高心悦界",
    type: "hotel",
    currency: "CNY",
    rate: {
      basePointsPerCNY: 0.4,
      eliteBonus: { silver: 0.1, gold: 0.2, platinum: 0.3, diamond: 0.4 },
      milestoneNights: [20, 30, 40, 50, 60],
    },
    recommendedCards: [
      { name: "招行运通百夫长", rate: 5, desc: "积分兑换雅高 5:1" },
    ],
  },
];

export const AIRLINE_EARNING_RATES: ProgramEarning[] = [
  {
    programSlug: "phoenix-miles",
    name: "PhoenixMiles",
    nameZh: "国航凤凰知音",
    type: "airline",
    currency: "CNY",
    rate: {
      basePointsPerCNY: 0.15,
      eliteBonus: { silver: 0.15, gold: 0.3, platinum: 0.5, "lifetime-platinum": 0.5 },
    },
    recommendedCards: [
      { name: "中信国航联名卡 世界卡", rate: 8, desc: "消费 CNY 8 积 1 里程" },
      { name: "招行经典白金卡", rate: 2, desc: "积分兑换国航 2:1" },
    ],
  },
  {
    programSlug: "eastern-miles",
    name: "Eastern Miles",
    nameZh: "东航东方万里行",
    type: "airline",
    currency: "CNY",
    rate: {
      basePointsPerCNY: 0.12,
      eliteBonus: { silver: 0.15, gold: 0.3, platinum: 0.5 },
    },
    recommendedCards: [
      { name: "中信东航联名卡 白金卡", rate: 10, desc: "消费 CNY 10 积 1 里程" },
      { name: "招行经典白金卡", rate: 2, desc: "积分兑换东航 2:1" },
    ],
  },
  {
    programSlug: "sky-pearl-club",
    name: "Sky Pearl Club",
    nameZh: "南航明珠俱乐部",
    type: "airline",
    currency: "CNY",
    rate: {
      basePointsPerCNY: 0.12,
      eliteBonus: { silver: 0.15, gold: 0.3, platinum: 0.5 },
    },
    recommendedCards: [
      { name: "中信南航联名卡 白金卡", rate: 10, desc: "消费 CNY 10 积 1 里程" },
      { name: "浦发运通超白", rate: 2, desc: "积分兑换南航 2:1" },
    ],
  },
  {
    programSlug: "fortune-wings-club",
    name: "Fortune Wings Club",
    nameZh: "海航金鹏俱乐部",
    type: "airline",
    currency: "CNY",
    rate: {
      basePointsPerCNY: 0.12,
      eliteBonus: { silver: 0.15, gold: 0.3, platinum: 0.5 },
    },
  },
];

export const PROGRAM_EARNING_BY_SLUG: Record<string, ProgramEarning> = Object.fromEntries(
  [...HOTEL_EARNING_RATES, ...AIRLINE_EARNING_RATES].map((p) => [p.programSlug, p])
);

/** Hotel↔Airline points transfer ratios */
export type PointsTransfer = {
  from: "hotel" | "airline" | "credit-card";
  fromProgram: string;
  fromName: string;
  toProgram: string;
  toName: string;
  ratio: string; // e.g. "3:1"
  note?: string;
};

export const POINTS_TRANSFERS: PointsTransfer[] = [
  // Marriott → Airlines (industry-best transfer partner)
  { from: "hotel", fromProgram: "marriott-bonvoy", fromName: "万豪旅享家", toProgram: "phoenix-miles", toName: "国航凤凰知音", ratio: "3:1", note: "每转 60,000 万豪积分赠 5,000 里程" },
  { from: "hotel", fromProgram: "marriott-bonvoy", fromName: "万豪旅享家", toProgram: "eastern-miles", toName: "东航东方万里行", ratio: "3:1", note: "每转 60,000 万豪积分赠 5,000 里程" },
  { from: "hotel", fromProgram: "marriott-bonvoy", fromName: "万豪旅享家", toProgram: "sky-pearl-club", toName: "南航明珠俱乐部", ratio: "3:1", note: "每转 60,000 万豪积分赠 5,000 里程" },
  { from: "hotel", fromProgram: "marriott-bonvoy", fromName: "万豪旅享家", toProgram: "krisflyer", toName: "新航 KrisFlyer", ratio: "3:1", note: "每转 60,000 万豪积分赠 5,000 里程" },
  { from: "hotel", fromProgram: "hilton-honors", fromName: "希尔顿荣誉客会", toProgram: "eastern-miles", toName: "东航东方万里行", ratio: "10:1" },
  { from: "hotel", fromProgram: "accor-all", fromName: "雅高心悦界", toProgram: "krisflyer", toName: "新航 KrisFlyer", ratio: "2:1" },
  { from: "credit-card", fromProgram: "cmb-centurion", fromName: "招行运通百夫长", toProgram: "marriott-bonvoy", toName: "万豪旅享家", ratio: "3:1" },
  { from: "credit-card", fromProgram: "cmb-centurion", fromName: "招行运通百夫长", toProgram: "world-of-hyatt", toName: "凯悦天地", ratio: "3:1" },
  { from: "credit-card", fromProgram: "cmb-centurion", fromName: "招行运通百夫长", toProgram: "hilton-honors", toName: "希尔顿荣誉客会", ratio: "3:2" },
  { from: "credit-card", fromProgram: "cmb-centurion", fromName: "招行运通百夫长", toProgram: "phoenix-miles", toName: "国航凤凰知音", ratio: "2:1" },
];

export function calculatePoints(
  spendingCNY: number,
  programSlug: string,
  eliteTier: string
): { basePoints: number; eliteBonus: number; total: number; milestoneReached: { nights: number; bonus: number }[] } {
  const prog = PROGRAM_EARNING_BY_SLUG[programSlug];
  if (!prog) return { basePoints: 0, eliteBonus: 0, total: 0, milestoneReached: [] };

  const basePoints = Math.round(spendingCNY * prog.rate.basePointsPerCNY);
  const bonusMultiplier = prog.rate.eliteBonus[eliteTier] ?? 0;
  const eliteBonus = Math.round(basePoints * bonusMultiplier);
  const total = basePoints + eliteBonus;

  const milestoneReached: { nights: number; bonus: number }[] = [];
  if (prog.rate.milestoneBonuses) {
    prog.rate.milestoneBonuses.forEach((m) => {
      milestoneReached.push({ nights: m.nights, bonus: m.bonusPoints });
    });
  }

  return { basePoints, eliteBonus, total, milestoneReached };
}
