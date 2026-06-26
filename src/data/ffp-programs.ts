/**
 * Frequent Flyer Programs (FFP) — comprehensive coverage of global airlines.
 * Covers all Star Alliance, SkyTeam, oneworld members + major non-alliance carriers.
 * Includes alliance mapping, elite tiers, qualification criteria, and key perks.
 */

export type FFPAlliance = "star-alliance" | "skyteam" | "oneworld";

export type FFPTier = {
  slug: string;
  name: string;
  nameZh: string;
  level: number;
  allianceTier: "silver" | "gold" | "platinum" | null;
  /** Qualifying miles or segments */
  milesToEarn?: number;
  segmentsToEarn?: number;
  /** Benefits summary */
  benefits: { icon: string; title: string; desc: string }[];
};

export type FFPProgram = {
  slug: string;
  name: string;
  nameZh: string;
  airlineIata: string;
  alliance: FFPAlliance | null;
  color: string;
  /** URL to program info */
  websiteUrl: string;
  /** Miles never expire if true */
  milesNoExpiry: boolean;
  /** Key selling points for Chinese travellers */
  highlights: string[];
  tiers: FFPTier[];
};

const B = {
  lounge: (title: string, desc: string) => ({ icon: "lounge", title, desc }),
  upgrade: (title: string, desc: string) => ({ icon: "upgrade", title, desc }),
  baggage: (title: string, desc: string) => ({ icon: "baggage", title, desc }),
  priority: (title: string, desc: string) => ({ icon: "priority", title, desc }),
  miles: (title: string, desc: string) => ({ icon: "miles", title, desc }),
  seat: (title: string, desc: string) => ({ icon: "seat", title, desc }),
  service: (title: string, desc: string) => ({ icon: "service", title, desc }),
};

// ── Helper: standard 4-tier Star Alliance / SkyTeam program ──
function saTiers(airline: string, baseSlug: string, color: string, highlights: string[], website: string, noExpiry = false): FFPProgram {
  return {
    slug: baseSlug,
    name: `${airline} Miles`,
    nameZh: `${airline}常旅客`,
    airlineIata: baseSlug.split("-")[0].toUpperCase(),
    alliance: "star-alliance",
    color,
    websiteUrl: website,
    milesNoExpiry: noExpiry,
    highlights,
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐成员航司累积里程")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "星空联盟金卡行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱礼遇"), B.lounge("头等舱贵宾室", "旗舰贵宾室"), B.service("专属客服", "高卡专线"), B.miles("里程加速", "额外累积率")] },
    ],
  };
}

function stTiers(airline: string, baseSlug: string, color: string, highlights: string[], website: string, noExpiry = false): FFPProgram {
  return {
    slug: baseSlug,
    name: `${airline} Club`,
    nameZh: `${airline}常旅客`,
    airlineIata: baseSlug.split("-")[0].toUpperCase(),
    alliance: "skyteam",
    color,
    websiteUrl: website,
    milesNoExpiry: noExpiry,
    highlights,
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐成员航司累积里程")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "天合联盟 Elite Plus"), B.baggage("额外行李", "天合联盟金卡行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱礼遇"), B.lounge("头等舱贵宾室", "旗舰贵宾室"), B.service("专属客服", "高卡专线"), B.miles("里程加速", "额外累积率")] },
    ],
  };
}

function owTiers(airline: string, baseSlug: string, color: string, highlights: string[], website: string, noExpiry = false): FFPProgram {
  return {
    slug: baseSlug,
    name: `${airline} Club`,
    nameZh: `${airline}常旅客`,
    airlineIata: baseSlug.split("-")[0].toUpperCase(),
    alliance: "oneworld",
    color,
    websiteUrl: website,
    milesNoExpiry: noExpiry,
    highlights,
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐成员航司累积里程")] },
      { slug: "silver", name: "Ruby", nameZh: "红宝石", level: 2, allianceTier: "silver", milesToEarn: 300, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.seat("免费选座", "出发前 7 天免费选座")] },
      { slug: "gold", name: "Sapphire", nameZh: "蓝宝石", level: 3, allianceTier: "gold", milesToEarn: 600, benefits: [B.lounge("寰宇一家贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "寰宇一家蓝宝石"), B.baggage("额外行李", "额外行李额"), B.seat("免费选座", "随时免费选座")] },
      { slug: "platinum", name: "Emerald", nameZh: "绿宝石", level: 4, allianceTier: "platinum", milesToEarn: 1200, benefits: [B.lounge("头等舱贵宾室", "寰宇一家绿宝石"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "高卡专线"), B.miles("里程加速", "额外累积率")] },
    ],
  };
}

export const FFP_PROGRAMS: FFPProgram[] = [
  // ═══════════════════════════════════════════
  // 中国航司 (4)
  // ═══════════════════════════════════════════
  {
    slug: "phoenix-miles",
    name: "PhoenixMiles",
    nameZh: "国航凤凰知音",
    airlineIata: "CA",
    alliance: "star-alliance",
    color: "#C41E3A",
    websiteUrl: "https://ffp.airchina.com.cn",
    milesNoExpiry: false,
    highlights: [
      "星空联盟成员，覆盖全球 1,300+ 目的地",
      "中国最大航司常旅客计划，国内航线网络最广",
      "与中信/招商银行联名卡加速累积",
      "金卡及以上享星空联盟金卡待遇",
    ],
    tiers: [
      { slug: "ordinary", name: "Ordinary", nameZh: "普通卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐国航及星空联盟航班累积里程")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 40000, segmentsToEarn: 25, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.baggage("额外行李", "额外 10kg 或 1 件"), B.lounge("部分贵宾室", "国内自营贵宾室使用权")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 80000, segmentsToEarn: 40, benefits: [B.lounge("星空联盟贵宾室", "全球 1,000+ 贵宾室含携伴"), B.priority("优先登机/行李", "全球星空联盟优先服务"), B.baggage("额外 20kg/1 件", "星空联盟金卡行李额"), B.seat("优选座位", "免费选座含紧急出口排")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 160000, segmentsToEarn: 90, benefits: [B.upgrade("升舱券", "国内航线免费升舱券"), B.lounge("头等舱贵宾室", "国航头等舱贵宾室携伴"), B.service("专属客服", "白金卡专线"), B.miles("里程不过期", "会员期内里程不失效")] },
    ],
  },
  {
    slug: "eastern-miles",
    name: "Eastern Miles",
    nameZh: "东航东方万里行",
    airlineIata: "MU",
    alliance: "skyteam",
    color: "#003580",
    websiteUrl: "https://easternmiles.ceair.com",
    milesNoExpiry: false,
    highlights: [
      "天合联盟成员，上海枢纽辐射中日韩及欧美",
      "京沪/沪广快线高频次，升级容易",
      "东航联名卡 + 第三方消费加速积分",
      "白金卡享国际升舱券",
    ],
    tiers: [
      { slug: "star", name: "Star", nameZh: "星级会员", level: 1, allianceTier: null, benefits: [B.miles("积分累积", "乘坐东航及天合联盟航班累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 30000, segmentsToEarn: 20, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.baggage("额外行李", "额外 10kg"), B.lounge("国内贵宾室", "东航自营贵宾室")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 75000, segmentsToEarn: 40, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "天合联盟 Elite Plus"), B.baggage("额外行李", "天合联盟金卡行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 150000, segmentsToEarn: 75, benefits: [B.upgrade("国际升舱券", "国际航线升舱礼遇"), B.lounge("头等舱贵宾室", "东航旗舰贵宾室"), B.service("专属客服", "白金卡专线 + 快速安检"), B.miles("积分不过期", "会员有效期内积分不失效")] },
    ],
  },
  {
    slug: "sky-pearl-club",
    name: "Sky Pearl Club",
    nameZh: "南航明珠俱乐部",
    airlineIata: "CZ",
    alliance: "skyteam",
    color: "#005AAB",
    websiteUrl: "https://skypearl.csair.com",
    milesNoExpiry: false,
    highlights: [
      "中国南方最大航司，广州/深圳枢纽",
      "天合联盟成员",
      "国际航线覆盖澳新、东南亚、中东",
      "里程兑换 CZ 国内线性价比极高",
    ],
    tiers: [
      { slug: "ordinary", name: "Ordinary", nameZh: "明珠卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐南航及天合联盟航班累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 40000, segmentsToEarn: 20, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.baggage("额外行李", "额外 10kg"), B.lounge("国内贵宾室", "南航自营贵宾室")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 80000, segmentsToEarn: 40, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "天合联盟 Elite Plus"), B.baggage("额外行李", "天合联盟金卡行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "铂金卡", level: 4, allianceTier: "gold", milesToEarn: 160000, segmentsToEarn: 80, benefits: [B.upgrade("升舱券", "国内/国际升舱券"), B.lounge("头等舱贵宾室", "南航旗舰贵宾室"), B.service("专属客服", "铂金卡专线"), B.miles("积分加速", "额外 50% 累积率")] },
    ],
  },
  {
    slug: "fortune-wings",
    name: "Fortune Wings Club",
    nameZh: "海航金鹏俱乐部",
    airlineIata: "HU",
    alliance: null,
    color: "#E31E25",
    websiteUrl: "https://ffp.hnair.com",
    milesNoExpiry: false,
    highlights: [
      "Skytrax 五星航空，服务品质卓越",
      "无联盟限制，但合作航司广泛",
      "北京/海口/深圳多枢纽",
      "里程兑换灵活，含海航系 12 家航司",
    ],
    tiers: [
      { slug: "ordinary", name: "Ordinary", nameZh: "金鹏卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐海航及合作航司累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 30000, segmentsToEarn: 20, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.baggage("额外 10kg", "免费额外行李"), B.lounge("国内贵宾室", "海航自营贵宾室")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 50000, segmentsToEarn: 40, benefits: [B.lounge("贵宾室携伴", "海航自营贵宾室可携伴"), B.priority("优先登机/行李", "全流程优先"), B.baggage("额外 20kg", "免费额外行李"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: null, milesToEarn: 100000, segmentsToEarn: 80, benefits: [B.upgrade("升舱券", "国内线升舱券"), B.lounge("头等舱贵宾室", "海航旗舰贵宾室"), B.service("专属管家", "白金卡 24h 客服"), B.miles("积分加速", "额外 50% 累积率")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 香港/台湾/澳门 (5)
  // ═══════════════════════════════════════════
  {
    slug: "marco-polo",
    name: "Marco Polo Club",
    nameZh: "国泰会员计划",
    airlineIata: "CX",
    alliance: "oneworld",
    color: "#006564",
    websiteUrl: "https://www.cathaypacific.com/cx/en_HK/membership.html",
    milesNoExpiry: false,
    highlights: [
      "寰宇一家成员，香港枢纽连接全球",
      "国泰航空五星级服务 + 亚洲万里通里程",
      "银卡及以上享寰宇一家红宝石/蓝宝石/绿宝石",
      "中国内地经香港中转出国的首选计划",
    ],
    tiers: [
      { slug: "green", name: "Green", nameZh: "绿卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "累积亚洲万里通里程")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 30000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.lounge("商务舱贵宾室", "国泰自营贵宾室"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 60000, benefits: [B.lounge("寰宇一家贵宾室", "全球 650+ 贵宾室含携伴"), B.priority("优先登机/行李", "寰宇一家蓝宝石"), B.baggage("额外行李", "寰宇一家金卡行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "diamond", name: "Diamond", nameZh: "钻石卡", level: 4, allianceTier: "platinum", milesToEarn: 120000, benefits: [B.lounge("头等舱贵宾室", "寰宇一家绿宝石含携伴"), B.upgrade("升舱券", "年度升舱礼遇"), B.service("专属客服", "钻石卡专线"), B.miles("里程加速", "额外 50% 累积")] },
    ],
  },
  {
    slug: "dynasty-flyer",
    name: "Dynasty Flyer",
    nameZh: "华航华夏会员",
    airlineIata: "CI",
    alliance: "skyteam",
    color: "#D50032",
    websiteUrl: "https://www.china-airlines.com",
    milesNoExpiry: false,
    highlights: ["天合联盟成员，台北枢纽", "覆盖中日韩及东南亚", "与东航/南航深度合作", "台湾出发首选"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐华航及天合联盟累积")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 2, allianceTier: "silver", milesToEarn: 30000, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.lounge("华航贵宾室", "自营贵宾室"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "emerald", name: "Emerald", nameZh: "翡翠卡", level: 3, allianceTier: "gold", milesToEarn: 60000, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "天合联盟 Elite Plus"), B.baggage("额外行李", "额外 20kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "diamond", name: "Diamond", nameZh: "晶钻卡", level: 4, allianceTier: "gold", milesToEarn: 120000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("头等舱贵宾室", "华航旗舰贵宾室"), B.service("专属客服", "晶钻卡专线"), B.miles("里程加速", "额外 50% 累积")] },
    ],
  },
  {
    slug: "infinity-mileagelands",
    name: "Infinity MileageLands",
    nameZh: "长荣无限万里游",
    airlineIata: "BR",
    alliance: "star-alliance",
    color: "#007749",
    websiteUrl: "https://www.evaair.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，台北枢纽", "Skytrax 五星航空", "北美航线网络强", "Hello Kitty 彩绘机体验"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐长荣及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 30000, benefits: [B.priority("优先值机", "优先值机柜台"), B.lounge("长荣贵宾室", "自营贵宾室"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "diamond", name: "Diamond", nameZh: "钻石卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("头等舱贵宾室", "长荣旗舰贵宾室"), B.service("专属客服", "钻石卡专线"), B.miles("里程加速", "额外累积率")] },
    ],
  },
  {
    slug: "air-macao-fpf",
    name: "CIP Club",
    nameZh: "澳航凤凰知音",
    airlineIata: "NX",
    alliance: null,
    color: "#C41E3A",
    websiteUrl: "https://www.airmacau.com.mo",
    milesNoExpiry: false,
    highlights: ["澳门枢纽，覆盖内地及东南亚", "与国航凤凰知音互通", "澳门出发性价比高"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐澳航及国航航班累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 30000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 60000, benefits: [B.lounge("贵宾室", "澳航及国航贵宾室"), B.priority("优先登机/行李", "全流程优先"), B.seat("免费选座", "含优选座位")] },
    ],
  },
  {
    slug: "hk-express-rewards",
    name: "HK Express Rewards",
    nameZh: "香港快运奖励计划",
    airlineIata: "UO",
    alliance: null,
    color: "#7B2D8B",
    websiteUrl: "https://www.hkexpress.com",
    milesNoExpiry: false,
    highlights: ["香港廉航，国泰旗下", "覆盖日韩东南亚", "低成本累积里程", "适合短途频繁出行"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "会员", level: 1, allianceTier: null, benefits: [B.miles("积分累积", "消费累积积分")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, benefits: [B.priority("优先登机", "优先登机"), B.baggage("行李折扣", "行李费折扣")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 东北亚 — 日本 (3)
  // ═══════════════════════════════════════════
  {
    slug: "ana-mileage-club",
    name: "ANA Mileage Club",
    nameZh: "全日空里程俱乐部",
    airlineIata: "NH",
    alliance: "star-alliance",
    color: "#0066B3",
    websiteUrl: "https://www.ana.co.jp/en/jp/amc/",
    milesNoExpiry: false,
    highlights: [
      "星空联盟成员，日式服务全球最佳",
      "东京枢纽连接北美、欧洲",
      "The Suite / The Room 产品仅限高卡兑换",
      "中国经东京转机去北美首选",
    ],
    tiers: [
      { slug: "bronze", name: "Bronze", nameZh: "铜卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐全日空及星空联盟累积")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 2, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先值机/登机", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
      { slug: "diamond", name: "Diamond", nameZh: "钻石卡", level: 3, allianceTier: "gold", milesToEarn: 100000, benefits: [B.lounge("头等舱贵宾室", "ANA Suite Lounge"), B.upgrade("升舱券", "国际升舱券"), B.service("专属客服", "钻石卡 24h 专线"), B.seat("优先选座", "所有座位免费选")] },
    ],
  },
  {
    slug: "jal-mileage-bank",
    name: "JAL Mileage Bank",
    nameZh: "日航里程积累俱乐部",
    airlineIata: "JL",
    alliance: "oneworld",
    color: "#E60012",
    websiteUrl: "https://www.jal.co.jp/en/jalmile/",
    milesNoExpiry: false,
    highlights: ["寰宇一家成员，东京枢纽", "日式服务 + 寰宇一家网络", "JAL SKY SUITE 商务舱", "中国经东京转机去北美常用"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐日航及寰宇一家累积")] },
      { slug: "crystal", name: "Crystal", nameZh: "水晶卡", level: 2, allianceTier: "silver", milesToEarn: 30000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.seat("免费选座", "出发前选座")] },
      { slug: "sapphire", name: "Sapphire", nameZh: "蓝宝石", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("寰宇一家贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "寰宇一家蓝宝石"), B.baggage("额外行李", "额外行李额"), B.seat("免费选座", "随时免费选座")] },
      { slug: "diamond", name: "Diamond", nameZh: "钻石卡", level: 4, allianceTier: "platinum", milesToEarn: 100000, benefits: [B.lounge("头等舱贵宾室", "寰宇一家绿宝石"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "钻石卡专线"), B.miles("里程加速", "额外累积率")] },
    ],
  },
  {
    slug: "peach-points",
    name: "Peach Points",
    nameZh: "乐桃点数计划",
    airlineIata: "MM",
    alliance: null,
    color: "#FF6B81",
    websiteUrl: "https://www.flypeach.com",
    milesNoExpiry: false,
    highlights: ["日本最大廉航", "关西/成田基地", "覆盖中日韩及东南亚", "全日空旗下"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "会员", level: 1, allianceTier: null, benefits: [B.miles("积分累积", "消费累积积分")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 东北亚 — 韩国 (2)
  // ═══════════════════════════════════════════
  {
    slug: "skypass",
    name: "SKYPASS",
    nameZh: "大韩航空 SKYPASS",
    airlineIata: "KE",
    alliance: "skyteam",
    color: "#0066B3",
    websiteUrl: "https://www.koreanair.com",
    milesNoExpiry: false,
    highlights: ["天合联盟核心成员，仁川枢纽", "北美航线网络极强", "中国经首尔转机去北美常用", "里程兑换 KE 两舱性价比高"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐大韩及天合联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 30000, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.lounge("大韩贵宾室", "自营贵宾室"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "天合联盟 Elite Plus"), B.baggage("额外行李", "额外 20kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("头等舱贵宾室", "大韩旗舰贵宾室"), B.service("专属客服", "白金卡专线"), B.miles("里程加速", "额外累积率")] },
    ],
  },
  {
    slug: "asiana-club",
    name: "Asiana Club",
    nameZh: "韩亚俱乐部",
    airlineIata: "OZ",
    alliance: "star-alliance",
    color: "#A6192E",
    websiteUrl: "https://flyasiana.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员（即将并入大韩）", "仁川枢纽", "中美航线覆盖好", "里程兑换门槛低"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐韩亚及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 20000, benefits: [B.priority("优先值机", "优先值机柜台"), B.lounge("韩亚贵宾室", "自营贵宾室"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 40000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "diamond", name: "Diamond", nameZh: "钻石卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("头等舱贵宾室", "韩亚旗舰贵宾室"), B.service("专属客服", "钻石卡专线"), B.miles("里程加速", "额外累积率")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 东南亚 (7)
  // ═══════════════════════════════════════════
  {
    slug: "krisflyer",
    name: "KrisFlyer",
    nameZh: "新航 KrisFlyer",
    airlineIata: "SQ",
    alliance: "star-alliance",
    color: "#F0A500",
    websiteUrl: "https://www.singaporeair.com/en_UK/sg/krisflyer/",
    milesNoExpiry: false,
    highlights: [
      "星空联盟成员，连续多年评为全球最佳航司",
      "新加坡枢纽连接东南亚、澳新、欧洲",
      "里程兑换新航套房（A380 Suite）",
      "中国经新加坡转机去马代/巴厘岛首选",
    ],
    tiers: [
      { slug: "blue", name: "KrisFlyer", nameZh: "蓝卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐新航及星空联盟累积")] },
      { slug: "silver", name: "Elite Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额"), B.lounge("新航贵宾室", "自营贵宾室使用权")] },
      { slug: "gold", name: "Elite Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "星空联盟金卡行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "pps", name: "PPS Club", nameZh: "PPS 俱乐部", level: 4, allianceTier: "gold", milesToEarn: 25000, benefits: [B.lounge("头等舱贵宾室", "SilverKris 头等贵宾室"), B.service("专属客服", "PPS 24h 专线"), B.upgrade("优先升舱", "优先升舱候补"), B.seat("优先选座", "所有座位免费选")] },
    ],
  },
  {
    slug: "thaiairways-rop",
    name: "Royal Orchid Plus",
    nameZh: "泰航皇家风兰",
    airlineIata: "TG",
    alliance: "star-alliance",
    color: "#63227E",
    websiteUrl: "https://www.thaiairways.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，曼谷枢纽", "东南亚网络最广之一", "中国多地直飞曼谷", "里程兑换泰航商务舱体验好"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐泰航及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 10000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 80000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("头等舱贵宾室", "泰航旗舰贵宾室"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "malaysia-enrich",
    name: "Enrich",
    nameZh: "马航 Enrich",
    airlineIata: "MH",
    alliance: "oneworld",
    color: "#0033A0",
    websiteUrl: "https://www.malaysiaairlines.com",
    milesNoExpiry: false,
    highlights: ["寰宇一家成员，吉隆坡枢纽", "东南亚网络好", "中国多地直飞吉隆坡"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐马航及寰宇一家累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.seat("免费选座", "出发前选座")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("寰宇一家贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "寰宇一家蓝宝石"), B.baggage("额外行李", "额外行李额"), B.seat("免费选座", "随时选座")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "platinum", milesToEarn: 100000, benefits: [B.lounge("头等舱贵宾室", "寰宇一家绿宝石"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "garuda-garudamiles",
    name: "GarudaMiles",
    nameZh: "印尼鹰航常旅客",
    airlineIata: "GA",
    alliance: "skyteam",
    color: "#0033A0",
    websiteUrl: "https://www.garuda-indonesia.com",
    milesNoExpiry: false,
    highlights: ["天合联盟成员，雅加达枢纽", "巴厘岛出发首选", "中国多地直飞巴厘岛"],
    tiers: [
      { slug: "member", name: "Blue", nameZh: "蓝卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐鹰航及天合联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "Elite Plus"), B.baggage("额外行李", "额外 20kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("头等舱贵宾室", "鹰航旗舰贵宾室"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "vietnam-lotusmiles",
    name: "Lotusmiles",
    nameZh: "越航莲花里程",
    airlineIata: "VN",
    alliance: "skyteam",
    color: "#F5A623",
    websiteUrl: "https://www.vietnamairlines.com",
    milesNoExpiry: false,
    highlights: ["天合联盟成员，河内/胡志明枢纽", "越南及东南亚网络广", "中国南方多地直飞越南"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐越航及天合联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 15000, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 30000, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "Elite Plus"), B.baggage("额外行李", "额外行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 50000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "philippines-mabuhay",
    name: "Mabuhay Miles",
    nameZh: "菲航 Mabuhay Miles",
    airlineIata: "PR",
    alliance: null,
    color: "#0038A8",
    websiteUrl: "https://www.philippineairlines.com",
    milesNoExpiry: false,
    highlights: ["菲律宾旗舰航司，马尼拉枢纽", "覆盖北美/亚洲/澳新", "中国多地直飞马尼拉"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐菲航累积")] },
      { slug: "silver", name: "Premier Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "gold", name: "Premier Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 50000, benefits: [B.lounge("菲航贵宾室", "马尼拉贵宾室"), B.priority("优先登机/行李", "全流程优先"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Premier Platinum", nameZh: "白金卡", level: 4, allianceTier: null, milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "airasia-big",
    name: "airasia rewards",
    nameZh: "亚航奖励计划",
    airlineIata: "AK",
    alliance: null,
    color: "#E41E26",
    websiteUrl: "https://www.airasia.com",
    milesNoExpiry: false,
    highlights: ["亚洲最大廉航", "吉隆坡/曼谷多枢纽", "覆盖中国二三线城市直飞东南亚", "积分可用于机票+酒店"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "会员", level: 1, allianceTier: null, benefits: [B.miles("积分累积", "消费累积 airasia points")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, benefits: [B.priority("优先登机", "优先登机"), B.baggage("行李折扣", "行李费折扣")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, benefits: [B.lounge("亚航贵宾室", "KLIA2 贵宾室"), B.priority("优先服务", "全流程优先"), B.seat("免费选座", "免费标准座位")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 南亚/中亚 (3)
  // ═══════════════════════════════════════════
  {
    slug: "air-india-flying-returns",
    name: "Flying Returns",
    nameZh: "印航 Flying Returns",
    airlineIata: "AI",
    alliance: "star-alliance",
    color: "#D50032",
    websiteUrl: "https://www.airindia.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，德里/孟买枢纽", "覆盖印度/中东/欧美", "中国经印度转机去中东/非洲"],
    tiers: [
      { slug: "member", name: "Red", nameZh: "红卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐印航及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("头等舱贵宾室", "印航旗舰贵宾室"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "air-astana-nomad-club",
    name: "Nomad Club",
    nameZh: "阿斯塔纳游牧俱乐部",
    airlineIata: "KC",
    alliance: null,
    color: "#00B5E2",
    websiteUrl: "https://airastana.com",
    milesNoExpiry: false,
    highlights: ["哈萨克斯坦旗舰航司", "连接中亚与东亚/欧洲", "乌鲁木齐有直飞", "一带一路沿线常用"],
    tiers: [
      { slug: "member", name: "Blue", nameZh: "蓝卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐阿斯塔纳累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 20000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 40000, benefits: [B.lounge("贵宾室", "阿斯塔纳贵宾室"), B.priority("优先登机/行李", "全流程优先"), B.seat("免费选座", "含优选座位")] },
    ],
  },
  {
    slug: "uzbekistan-airways-club",
    name: "UzAir Plus",
    nameZh: "乌兹别克斯坦航空 Plus",
    airlineIata: "HY",
    alliance: null,
    color: "#009FE3",
    websiteUrl: "https://www.uzairways.com",
    milesNoExpiry: false,
    highlights: ["中亚重要航司，塔什干枢纽", "连接中亚与东亚/欧洲/中东", "一带一路沿线"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐乌兹别克航空累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 20000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外 10kg")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 中东 (5)
  // ═══════════════════════════════════════════
  {
    slug: "emirates-skywards",
    name: "Emirates Skywards",
    nameZh: "阿联酋航空 Skywards",
    airlineIata: "EK",
    alliance: null,
    color: "#C41230",
    websiteUrl: "https://www.emirates.com/skywards",
    milesNoExpiry: false,
    highlights: [
      "全球最大 A380/B777 机队",
      "头等舱淋浴水疗 + 空中酒吧",
      "迪拜中转覆盖中东/非洲/欧洲",
      "中国六大城市直飞迪拜",
    ],
    tiers: [
      { slug: "blue", name: "Blue", nameZh: "蓝卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐阿联酋航空累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 25000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.lounge("商务舱贵宾室", "迪拜商务贵宾室"), B.baggage("额外行李", "额外 12kg")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 50000, benefits: [B.lounge("头等舱贵宾室", "迪拜头等贵宾室含携伴"), B.priority("优先登机/行李", "全流程优先"), B.baggage("额外行李", "额外 16kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: null, milesToEarn: 150000, benefits: [B.upgrade("升舱券", "年度升舱礼遇"), B.lounge("头等舱贵宾室", "含携伴 + 按摩服务"), B.service("专属客服", "白金卡 24h 专线"), B.miles("里程不降级", "降级缓冲 12 个月")] },
    ],
  },
  {
    slug: "privilege-club",
    name: "Privilege Club",
    nameZh: "卡航贵宾俱乐部",
    airlineIata: "QR",
    alliance: "oneworld",
    color: "#800000",
    websiteUrl: "https://www.qatarairways.com/en/privilege-club.html",
    milesNoExpiry: false,
    highlights: [
      "寰宇一家成员，多哈枢纽全球连接",
      "Qsuite 全球最佳商务舱",
      "多哈转机可体验 Al Mourjan 贵宾室",
      "中国五大城市直飞多哈",
    ],
    tiers: [
      { slug: "burgundy", name: "Burgundy", nameZh: "酒红卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐卡航及寰宇一家累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 150, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.lounge("商务舱贵宾室", "卡航自营贵宾室"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 300, benefits: [B.lounge("寰宇一家贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "寰宇一家蓝宝石"), B.baggage("额外行李", "寰宇一家金卡行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "platinum", milesToEarn: 600, benefits: [B.lounge("头等舱贵宾室", "寰宇一家绿宝石"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "白金卡专线"), B.miles("里程加速", "额外 100% 累积")] },
    ],
  },
  {
    slug: "etihad-guest",
    name: "Etihad Guest",
    nameZh: "阿提哈德常旅客",
    airlineIata: "EY",
    alliance: null,
    color: "#B9984A",
    websiteUrl: "https://www.etihadguest.com",
    milesNoExpiry: false,
    highlights: ["阿布扎比枢纽，覆盖全球", "The Residence 空中套房", "中国三大城市直飞", "里程可兑换合作伙伴航班"],
    tiers: [
      { slug: "member", name: "Guest", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐阿提哈德累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 25000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.lounge("商务舱贵宾室", "阿布扎比贵宾室"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 50000, benefits: [B.lounge("头等舱贵宾室", "含携伴"), B.priority("优先登机/行李", "全流程优先"), B.baggage("额外行李", "额外 16kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: null, milesToEarn: 125000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("The Residence 休息室", "含携伴"), B.service("专属客服", "白金卡 24h 专线")] },
    ],
  },
  {
    slug: "saudia-alfursan",
    name: "AlFursan",
    nameZh: "沙特航空 AlFursan",
    airlineIata: "SV",
    alliance: "skyteam",
    color: "#007A33",
    websiteUrl: "https://www.saudia.com",
    milesNoExpiry: false,
    highlights: ["天合联盟成员，吉达/利雅得枢纽", "覆盖中东/非洲/亚洲", "朝觐航线重要"],
    tiers: [
      { slug: "member", name: "Blue", nameZh: "蓝卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐沙特航及天合联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "Elite Plus"), B.baggage("额外行李", "额外 20kg")] },
    ],
  },
  {
    slug: "gulfair-falconflyer",
    name: "Falconflyer",
    nameZh: "海湾航空猎鹰飞行",
    airlineIata: "GF",
    alliance: null,
    color: "#D4AF37",
    websiteUrl: "https://www.gulfair.com",
    milesNoExpiry: false,
    highlights: ["巴林枢纽，覆盖中东/南亚/欧洲", "商务舱性价比高"],
    tiers: [
      { slug: "member", name: "Blue", nameZh: "蓝卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐海湾航空累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 20000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 40000, benefits: [B.lounge("贵宾室", "海湾航空贵宾室"), B.priority("优先登机/行李", "全流程优先"), B.seat("免费选座", "含优选座位")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 欧洲 (14)
  // ═══════════════════════════════════════════
  {
    slug: "lufthansa-miles-and-more",
    name: "Miles & More",
    nameZh: "汉莎 Miles & More",
    airlineIata: "LH",
    alliance: "star-alliance",
    color: "#05164D",
    websiteUrl: "https://www.miles-and-more.com",
    milesNoExpiry: false,
    highlights: ["星空联盟创始成员，法兰克福/慕尼黑枢纽", "覆盖欧洲/北美/亚洲", "旗下含瑞航/奥航/布鲁塞尔航空", "中国多个城市直飞德国"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐汉莎集团及星空联盟累积")] },
      { slug: "ftl", name: "Frequent Traveller", nameZh: "常旅客", level: 2, allianceTier: "silver", milesToEarn: 35000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.lounge("商务舱贵宾室", "汉莎商务贵宾室"), B.baggage("额外行李", "额外行李额")] },
      { slug: "sen", name: "Senator", nameZh: "Senator", level: 3, allianceTier: "gold", milesToEarn: 100000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "hon", name: "HON Circle", nameZh: "HON Circle", level: 4, allianceTier: "gold", milesToEarn: 600000, benefits: [B.lounge("头等舱贵宾室", "First Class Terminal 法兰克福"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "HON 专线 + 专车接送"), B.miles("里程加速", "额外 50% 累积")] },
    ],
  },
  {
    slug: "swiss-miles-and-more",
    name: "Miles & More (Swiss)",
    nameZh: "瑞航 Miles & More",
    airlineIata: "LX",
    alliance: "star-alliance",
    color: "#E30613",
    websiteUrl: "https://www.swiss.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，苏黎世/日内瓦枢纽", "瑞士品质服务", "与汉莎共享 Miles & More", "中国直飞苏黎世"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐瑞航及星空联盟累积")] },
      { slug: "ftl", name: "Frequent Traveller", nameZh: "常旅客", level: 2, allianceTier: "silver", milesToEarn: 35000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.lounge("瑞航贵宾室", "苏黎世贵宾室"), B.baggage("额外行李", "额外行李额")] },
      { slug: "sen", name: "Senator", nameZh: "Senator", level: 3, allianceTier: "gold", milesToEarn: 100000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
      { slug: "hon", name: "HON Circle", nameZh: "HON Circle", level: 4, allianceTier: "gold", milesToEarn: 600000, benefits: [B.lounge("头等舱贵宾室", "瑞航头等贵宾室"), B.service("专属客服", "HON 专线"), B.miles("里程加速", "额外 50% 累积")] },
    ],
  },
  {
    slug: "airfrance-klm-flying-blue",
    name: "Flying Blue",
    nameZh: "法荷航蓝天飞行",
    airlineIata: "AF",
    alliance: "skyteam",
    color: "#002157",
    websiteUrl: "https://www.flyingblue.com",
    milesNoExpiry: false,
    highlights: ["天合联盟核心成员，巴黎/阿姆斯特丹枢纽", "法航+荷航共享计划", "里程兑换促销多（Promo Awards）", "中国直飞巴黎/阿姆斯特丹"],
    tiers: [
      { slug: "member", name: "Explorer", nameZh: "探索者", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐法航/荷航及天合联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 100, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.baggage("额外行李", "额外 1 件"), B.seat("免费选座", "标准座位免费")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 180, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "天合联盟 Elite Plus"), B.baggage("额外行李", "额外行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 300, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携多人"), B.service("专属客服", "白金卡专线"), B.miles("里程加速", "额外累积率")] },
    ],
  },
  {
    slug: "klm-flying-blue",
    name: "Flying Blue (KLM)",
    nameZh: "荷航蓝天飞行",
    airlineIata: "KL",
    alliance: "skyteam",
    color: "#00A1DE",
    websiteUrl: "https://www.klm.com",
    milesNoExpiry: false,
    highlights: ["天合联盟创始成员，阿姆斯特丹枢纽", "与法航共享 Flying Blue", "欧洲内部网络强", "中国直飞阿姆斯特丹"],
    tiers: [
      { slug: "member", name: "Explorer", nameZh: "探索者", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐荷航及天合联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 100, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.baggage("额外行李", "额外 1 件")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 180, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "天合联盟 Elite Plus"), B.baggage("额外行李", "额外行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 300, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携多人"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "executive-club",
    name: "Executive Club",
    nameZh: "英航 Executive Club",
    airlineIata: "BA",
    alliance: "oneworld",
    color: "#2E5A88",
    websiteUrl: "https://www.britishairways.com/en/executive-club",
    milesNoExpiry: false,
    highlights: [
      "寰宇一家创始成员",
      "伦敦枢纽连接欧洲/北美",
      "Avios 里程可跨 IB/AY 共享",
      "中国经伦敦转机去欧洲常用",
    ],
    tiers: [
      { slug: "blue", name: "Blue", nameZh: "蓝卡", level: 1, allianceTier: null, benefits: [B.miles("Avios 累积", "乘坐英航及寰宇一家累积")] },
      { slug: "bronze", name: "Bronze", nameZh: "铜卡", level: 2, allianceTier: "silver", milesToEarn: 300, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.seat("免费选座", "出发前 7 天免费选座")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 3, allianceTier: "gold", milesToEarn: 600, benefits: [B.lounge("寰宇一家贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "寰宇一家蓝宝石"), B.baggage("额外行李", "额外行李额"), B.seat("免费选座", "随时免费选座")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 4, allianceTier: "platinum", milesToEarn: 1500, benefits: [B.lounge("头等舱贵宾室", "寰宇一家绿宝石"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "金卡专线"), B.miles("里程加速", "额外 100% 累积")] },
    ],
  },
  {
    slug: "iberia-plus",
    name: "Iberia Plus",
    nameZh: "伊比利亚航空 Plus",
    airlineIata: "IB",
    alliance: "oneworld",
    color: "#D7192D",
    websiteUrl: "https://www.iberia.com",
    milesNoExpiry: false,
    highlights: ["寰宇一家成员，马德里枢纽", "拉美航线网络极强", "与英航 Avios 共享", "西班牙及拉美旅行首选"],
    tiers: [
      { slug: "member", name: "Clásica", nameZh: "经典卡", level: 1, allianceTier: null, benefits: [B.miles("Avios 累积", "乘坐伊比利亚及寰宇一家累积")] },
      { slug: "silver", name: "Plata", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 22500, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.seat("免费选座", "出发前选座")] },
      { slug: "gold", name: "Oro", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 55000, benefits: [B.lounge("寰宇一家贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "寰宇一家蓝宝石"), B.baggage("额外行李", "额外行李额")] },
      { slug: "platinum", name: "Platino", nameZh: "白金卡", level: 4, allianceTier: "platinum", milesToEarn: 125000, benefits: [B.lounge("头等舱贵宾室", "寰宇一家绿宝石"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "finnair-plus",
    name: "Finnair Plus",
    nameZh: "芬兰航空 Plus",
    airlineIata: "AY",
    alliance: "oneworld",
    color: "#003580",
    websiteUrl: "https://www.finnair.com",
    milesNoExpiry: false,
    highlights: ["寰宇一家成员，赫尔辛基枢纽", "欧亚最短航线（北极航线）", "中国直飞赫尔辛基", "北欧及波罗的海首选"],
    tiers: [
      { slug: "member", name: "Basic", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("Avios 累积", "乘坐芬航及寰宇一家累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 30000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.seat("免费选座", "出发前选座")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 80000, benefits: [B.lounge("寰宇一家贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "寰宇一家蓝宝石"), B.baggage("额外行李", "额外行李额")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "platinum", milesToEarn: 150000, benefits: [B.lounge("头等舱贵宾室", "寰宇一家绿宝石"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "aer-lingus-aerclub",
    name: "AerClub",
    nameZh: "爱尔兰航空 AerClub",
    airlineIata: "EI",
    alliance: null,
    color: "#008080",
    websiteUrl: "https://www.aerlingus.com",
    milesNoExpiry: false,
    highlights: ["都柏林枢纽，跨大西洋航线强", "美欧航线 US Preclearance", "Avios 里程计划"],
    tiers: [
      { slug: "member", name: "Green", nameZh: "绿卡", level: 1, allianceTier: null, benefits: [B.miles("Avios 累积", "乘坐爱尔兰航空累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 300, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 3, allianceTier: null, milesToEarn: 600, benefits: [B.lounge("贵宾室", "爱尔兰航空贵宾室"), B.priority("优先登机/行李", "全流程优先"), B.seat("免费选座", "含优选座位")] },
    ],
  },
  {
    slug: "virgin-atlantic-flying-club",
    name: "Flying Club",
    nameZh: "维珍航空飞行俱乐部",
    airlineIata: "VS",
    alliance: null,
    color: "#DA0530",
    websiteUrl: "https://flywith.virginatlantic.com",
    milesNoExpiry: false,
    highlights: ["伦敦/曼彻斯特枢纽", "跨大西洋精品航线", "与达美/法航深度合作", "Upper Class 商务舱体验好"],
    tiers: [
      { slug: "member", name: "Red", nameZh: "红卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐维珍航空累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 400, benefits: [B.priority("优先值机", "优先值机柜台"), B.lounge("维珍贵宾室", "Clubhouse 贵宾室"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 1000, benefits: [B.lounge("贵宾室携伴", "Clubhouse 可携伴"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "金卡专线"), B.seat("免费选座", "含优选座位")] },
    ],
  },
  {
    slug: "turkish-miles-and-smiles",
    name: "Miles&Smiles",
    nameZh: "土耳其航空 Miles&Smiles",
    airlineIata: "TK",
    alliance: "star-alliance",
    color: "#E81932",
    websiteUrl: "https://www.turkishairlines.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，伊斯坦布尔枢纽", "全球飞往最多国家的航司", "伊斯坦布尔转机体验好（免费城市游）", "中国多地直飞伊斯坦布尔"],
    tiers: [
      { slug: "member", name: "Classic", nameZh: "经典卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐土航及星空联盟累积")] },
      { slug: "classic-plus", name: "Classic Plus", nameZh: "经典 Plus", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "elite", name: "Elite", nameZh: "精英卡", level: 3, allianceTier: "gold", milesToEarn: 40000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "elite-plus", name: "Elite Plus", nameZh: "精英 Plus", level: 4, allianceTier: "gold", milesToEarn: 80000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("伊斯坦布尔旗舰贵宾室", "全球最大航司贵宾室"), B.service("专属客服", "Elite Plus 专线"), B.miles("里程加速", "额外累积率")] },
    ],
  },
  {
    slug: "aeroflot-bonus",
    name: "Aeroflot Bonus",
    nameZh: "俄航 Bonus",
    airlineIata: "SU",
    alliance: null,
    color: "#0033A0",
    websiteUrl: "https://www.aeroflot.com",
    milesNoExpiry: false,
    highlights: ["俄罗斯旗舰航司，莫斯科枢纽", "覆盖欧亚/北美", "中俄航线频繁"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐俄航累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 50000, benefits: [B.lounge("贵宾室", "俄航贵宾室"), B.priority("优先登机/行李", "全流程优先"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: null, milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "tap-miles-and-go",
    name: "TAP Miles&Go",
    nameZh: "葡萄牙航空 Miles&Go",
    airlineIata: "TP",
    alliance: "star-alliance",
    color: "#007A33",
    websiteUrl: "https://www.flytap.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，里斯本枢纽", "欧洲-南美航线极强", "葡萄牙及巴西旅行首选"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐 TAP 及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 30000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 70000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
    ],
  },
  {
    slug: "sas-eurobonus",
    name: "EuroBonus",
    nameZh: "北欧航空 EuroBonus",
    airlineIata: "SK",
    alliance: "skyteam",
    color: "#002D72",
    websiteUrl: "https://www.flysas.com",
    milesNoExpiry: false,
    highlights: ["天合联盟成员（2024年起），哥本哈根/斯德哥尔摩/奥斯陆枢纽", "北欧网络最广", "中国直飞哥本哈根"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐 SAS 及天合联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 45000, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "天合联盟 Elite Plus"), B.baggage("额外行李", "额外行李额")] },
      { slug: "diamond", name: "Diamond", nameZh: "钻石卡", level: 4, allianceTier: "gold", milesToEarn: 90000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "钻石卡专线")] },
    ],
  },
  {
    slug: "lot-polish-miles-and-more",
    name: "Miles & More (LOT)",
    nameZh: "波兰航空 Miles & More",
    airlineIata: "LO",
    alliance: "star-alliance",
    color: "#002D72",
    websiteUrl: "https://www.lot.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，华沙枢纽", "中欧-北美航线", "中国直飞华沙"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐波兰航空及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 35000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 100000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 北美 (6)
  // ═══════════════════════════════════════════
  {
    slug: "mileage-plus",
    name: "MileagePlus",
    nameZh: "美联航前程万里",
    airlineIata: "UA",
    alliance: "star-alliance",
    color: "#005DAA",
    websiteUrl: "https://www.united.com/ual/en/us/fly/mileageplus.html",
    milesNoExpiry: true,
    highlights: [
      "星空联盟创始成员，全球航线最多",
      "里程永不过期",
      "中美航线最多 + 美国国内网络最强",
      "中美往返里程兑换性价比高",
    ],
    tiers: [
      { slug: "member", name: "Member", nameZh: "会员", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "里程永不过期")] },
      { slug: "silver", name: "Premier Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("免费托运 1 件", "国内免费行李"), B.seat("优选座位", "免费经济舱优选座位")] },
      { slug: "gold", name: "Premier Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("免费 2 件托运", "额外行李额"), B.seat("Economy Plus", "免费经济舱加长座位")] },
      { slug: "platinum", name: "Premier Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 75000, benefits: [B.upgrade("PlusPoints", "灵活升舱点数"), B.lounge("贵宾室携伴", "可携多人"), B.service("专属客服", "白金卡专线"), B.miles("里程加速", "额外 100% 累积")] },
    ],
  },
  {
    slug: "skymiles",
    name: "SkyMiles",
    nameZh: "达美飞凡里程",
    airlineIata: "DL",
    alliance: "skyteam",
    color: "#003366",
    websiteUrl: "https://www.delta.com/skymiles",
    milesNoExpiry: true,
    highlights: [
      "天合联盟核心成员",
      "里程永不过期",
      "中美航线 + 美国国内网络",
      "中国出发经东京/首尔转机常用",
    ],
    tiers: [
      { slug: "member", name: "Member", nameZh: "会员", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "里程永不过期")] },
      { slug: "silver", name: "Silver Medallion", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.baggage("免费托运", "额外行李额"), B.seat("优选座位", "免费优选座位")] },
      { slug: "gold", name: "Gold Medallion", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("天合联盟贵宾室", "国际航班贵宾室"), B.priority("优先登机/行李", "天合联盟 Elite Plus"), B.baggage("免费 2 件托运", "额外行李额"), B.seat("Comfort+", "免费舒适经济舱")] },
      { slug: "platinum", name: "Platinum Medallion", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 75000, benefits: [B.upgrade("优先升舱", "美国国内自动升舱"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "白金卡专线"), B.miles("里程加速", "额外 100% 累积")] },
    ],
  },
  {
    slug: "aadvantage",
    name: "AAdvantage",
    nameZh: "美国航空 AAdvantage",
    airlineIata: "AA",
    alliance: "oneworld",
    color: "#0078D2",
    websiteUrl: "https://www.aa.com/aadvantage",
    milesNoExpiry: false,
    highlights: ["寰宇一家创始成员", "全球最大机队之一", "中美航线 + 美国国内网络极强", "里程兑换寰宇一家伙伴航班灵活"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "会员", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐美航及寰宇一家累积")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 2, allianceTier: "silver", milesToEarn: 40000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.seat("免费选座", "出发前 24 小时"), B.baggage("免费托运", "1 件免费托运")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 3, allianceTier: "gold", milesToEarn: 75000, benefits: [B.lounge("寰宇一家贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "寰宇一家蓝宝石"), B.baggage("免费 2 件托运", "额外行李额"), B.seat("Main Cabin Extra", "免费加长座位")] },
      { slug: "platpro", name: "Platinum Pro", nameZh: "优选白金", level: 4, allianceTier: "platinum", milesToEarn: 125000, benefits: [B.lounge("头等舱贵宾室", "寰宇一家绿宝石"), B.upgrade("优先升舱", "自动升舱候补"), B.service("专属客服", "优选白金专线"), B.miles("里程加速", "额外 80% 累积")] },
    ],
  },
  {
    slug: "air-canada-aeroplan",
    name: "Aeroplan",
    nameZh: "加航 Aeroplan",
    airlineIata: "AC",
    alliance: "star-alliance",
    color: "#F01428",
    websiteUrl: "https://www.aircanada.com/aeroplan",
    milesNoExpiry: false,
    highlights: ["星空联盟创始成员，多伦多/温哥华/蒙特利尔枢纽", "北美-亚洲航线强", "中国直飞加拿大", "里程永不过期（有活动）"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐加航及星空联盟累积")] },
      { slug: "25k", name: "25K", nameZh: "25K 银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("免费 1 件托运", "额外行李额")] },
      { slug: "50k", name: "50K", nameZh: "50K 金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("免费 2 件托运", "额外行李额"), B.seat("免费选座", "含优选座位")] },
      { slug: "75k", name: "75K", nameZh: "75K 白金卡", level: 4, allianceTier: "gold", milesToEarn: 75000, benefits: [B.upgrade("eUpgrade 升舱", "升舱点数"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "75K 专线"), B.miles("里程加速", "额外累积率")] },
    ],
  },
  {
    slug: "jetblue-trueblue",
    name: "TrueBlue",
    nameZh: "捷蓝航空 TrueBlue",
    airlineIata: "B6",
    alliance: null,
    color: "#003876",
    websiteUrl: "https://www.jetblue.com",
    milesNoExpiry: false,
    highlights: ["美国精品廉航", "跨大陆 Mint 商务舱", "与美航/卡航合作"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "会员", level: 1, allianceTier: null, benefits: [B.miles("积分累积", "消费累积 TrueBlue 积分")] },
      { slug: "mosaic1", name: "Mosaic 1", nameZh: "Mosaic 1", level: 2, allianceTier: null, benefits: [B.priority("优先登机", "优先登机"), B.baggage("免费托运", "2 件免费托运"), B.seat("免费选座", "含 Even More Space")] },
      { slug: "mosaic2", name: "Mosaic 2", nameZh: "Mosaic 2", level: 3, allianceTier: null, benefits: [B.lounge("贵宾室", "Mint 乘客贵宾室"), B.upgrade("优先升舱", "Mint 升舱候补"), B.service("专属客服", "Mosaic 专线")] },
    ],
  },
  {
    slug: "hawaiian-hawaiianmiles",
    name: "HawaiianMiles",
    nameZh: "夏威夷航空 HawaiianMiles",
    airlineIata: "HA",
    alliance: null,
    color: "#7B2D8B",
    websiteUrl: "https://www.hawaiianairlines.com",
    milesNoExpiry: false,
    highlights: ["夏威夷旗舰航司", "美国本土-夏威夷/亚太", "与阿拉斯加航空合并中", "亚洲-夏威夷航线"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐夏威夷航空累积")] },
      { slug: "gold", name: "Pualani Gold", nameZh: "金卡", level: 2, allianceTier: null, milesToEarn: 20000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("免费托运", "2 件免费托运")] },
      { slug: "platinum", name: "Pualani Platinum", nameZh: "白金卡", level: 3, allianceTier: null, milesToEarn: 40000, benefits: [B.lounge("贵宾室", "Plaza Premium 贵宾室"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "白金卡专线")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 大洋洲 (3)
  // ═══════════════════════════════════════════
  {
    slug: "qantas-frequent-flyer",
    name: "Qantas Frequent Flyer",
    nameZh: "澳航常旅客",
    airlineIata: "QF",
    alliance: "oneworld",
    color: "#E0001B",
    websiteUrl: "https://www.qantas.com/au/en/frequent-flyer.html",
    milesNoExpiry: false,
    highlights: ["寰宇一家创始成员，悉尼/墨尔本枢纽", "澳洲-亚洲/北美/欧洲", "中国直飞澳洲", "里程可兑换 Woolworths 等日常消费"],
    tiers: [
      { slug: "member", name: "Bronze", nameZh: "铜卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐澳航及寰宇一家累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 30000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.seat("免费选座", "出发前选座")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 60000, benefits: [B.lounge("寰宇一家贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "寰宇一家蓝宝石"), B.baggage("额外行李", "额外行李额")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "platinum", milesToEarn: 120000, benefits: [B.lounge("头等舱贵宾室", "寰宇一家绿宝石"), B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "air-nz-airpoints",
    name: "Airpoints",
    nameZh: "新西兰航空 Airpoints",
    airlineIata: "NZ",
    alliance: "star-alliance",
    color: "#000000",
    websiteUrl: "https://www.airnewzealand.co.nz",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，奥克兰枢纽", "亚太-新西兰-南美航线", "Skycouch 经济舱产品", "中国直飞奥克兰"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("Airpoints 累积", "乘坐新西兰航空及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 450, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 900, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
      { slug: "elite", name: "Elite", nameZh: "精英卡", level: 4, allianceTier: "gold", milesToEarn: 1500, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "精英卡专线")] },
    ],
  },
  {
    slug: "fiji-airways-tabua-club",
    name: "Tabua Club",
    nameZh: "斐济航空 Tabua Club",
    airlineIata: "FJ",
    alliance: null,
    color: "#00A3E0",
    websiteUrl: "https://www.fijiairways.com",
    milesNoExpiry: false,
    highlights: ["斐济旗舰航司，南太平洋枢纽", "连接澳新/美西/亚洲", "与澳航/国泰代码共享"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐斐济航空累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 50000, benefits: [B.lounge("贵宾室", "斐济航空贵宾室"), B.priority("优先登机/行李", "全流程优先")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 非洲 (3)
  // ═══════════════════════════════════════════
  {
    slug: "ethiopian-sheba-miles",
    name: "ShebaMiles",
    nameZh: "埃塞俄比亚航空 ShebaMiles",
    airlineIata: "ET",
    alliance: "star-alliance",
    color: "#007A33",
    websiteUrl: "https://www.ethiopianairlines.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，亚的斯亚贝巴枢纽", "非洲最大航司", "覆盖非洲/亚洲/欧洲/美洲", "中国直飞亚的斯亚贝巴"],
    tiers: [
      { slug: "member", name: "Blue", nameZh: "蓝卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐埃塞航及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "south-african-voyager",
    name: "Voyager",
    nameZh: "南非航空 Voyager",
    airlineIata: "SA",
    alliance: "star-alliance",
    color: "#002147",
    websiteUrl: "https://www.flysaa.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，约翰内斯堡枢纽", "非洲南部网络最广", "连接非洲与全球"],
    tiers: [
      { slug: "member", name: "Blue", nameZh: "蓝卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐南非航及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "egyptair-plus",
    name: "EgyptAir Plus",
    nameZh: "埃及航空 Plus",
    airlineIata: "MS",
    alliance: "star-alliance",
    color: "#C8102E",
    websiteUrl: "https://www.egyptair.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，开罗枢纽", "覆盖非洲/中东/亚洲/欧洲", "中国直飞开罗"],
    tiers: [
      { slug: "member", name: "Blue", nameZh: "蓝卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐埃及航及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "白金卡专线")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 拉美 (3)
  // ═══════════════════════════════════════════
  {
    slug: "latam-pass",
    name: "LATAM Pass",
    nameZh: "拉美航空 LATAM Pass",
    airlineIata: "LA",
    alliance: null,
    color: "#DA291C",
    websiteUrl: "https://www.latam.com",
    milesNoExpiry: false,
    highlights: ["南美最大航司", "圣地亚哥/圣保罗/利马多枢纽", "覆盖南美/北美/欧洲/大洋洲", "与达美代码共享"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐 LATAM 累积")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 2, allianceTier: null, milesToEarn: 20000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外 1 件"), B.lounge("LATAM 贵宾室", "自营贵宾室")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 3, allianceTier: null, milesToEarn: 40000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "白金卡专线")] },
      { slug: "black", name: "Black", nameZh: "黑卡", level: 4, allianceTier: null, milesToEarn: 100000, benefits: [B.upgrade("无限升舱", "无限升舱礼遇"), B.lounge("头等舱贵宾室", "含携伴"), B.service("专属管家", "黑卡 24h 专线")] },
    ],
  },
  {
    slug: "avianca-lifemiles",
    name: "LifeMiles",
    nameZh: "哥伦比亚航空 LifeMiles",
    airlineIata: "AV",
    alliance: "star-alliance",
    color: "#EE3A43",
    websiteUrl: "https://www.lifemiles.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，波哥大枢纽", "中美/南美航线", "里程经常促销购买", "里程兑换星空联盟航班性价比极高"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐 Avianca 及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
      { slug: "diamond", name: "Diamond", nameZh: "钻石卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "钻石卡专线")] },
    ],
  },
  {
    slug: "copa-connectmiles",
    name: "ConnectMiles",
    nameZh: "巴拿马航空 ConnectMiles",
    airlineIata: "CM",
    alliance: "star-alliance",
    color: "#0033A0",
    websiteUrl: "https://www.copaair.com",
    milesNoExpiry: false,
    highlights: ["星空联盟成员，巴拿马城枢纽", "美洲内部航线极强", "中美/南美全覆盖"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "普卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐 Copa 及星空联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 25000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 50000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.service("专属客服", "白金卡专线")] },
    ],
  },

  // ═══════════════════════════════════════════
  // 中国地区性航司 (5)
  // ═══════════════════════════════════════════
  {
    slug: "shenzhen-airlines-fpf",
    name: "凤凰知音 (深航)",
    nameZh: "深航凤凰知音",
    airlineIata: "ZH",
    alliance: "star-alliance",
    color: "#C41E3A",
    websiteUrl: "https://www.shenzhenair.com",
    milesNoExpiry: false,
    highlights: ["国航旗下，深圳枢纽", "共享凤凰知音计划", "国内航线网络广"],
    tiers: [
      { slug: "ordinary", name: "Ordinary", nameZh: "普通卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "与国航凤凰知音共享")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 40000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 80000, benefits: [B.lounge("星空联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "星空联盟金卡"), B.baggage("额外行李", "额外 20kg")] },
    ],
  },
  {
    slug: "xiamen-airlines-egret",
    name: "Egret Club",
    nameZh: "厦航白鹭俱乐部",
    airlineIata: "MF",
    alliance: "skyteam",
    color: "#003580",
    websiteUrl: "https://www.xiamenair.com",
    milesNoExpiry: false,
    highlights: ["天合联盟成员，厦门/福州枢纽", "国内航线网络广", "中国-东南亚航线多", "服务质量中国前列"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "白鹭卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐厦航及天合联盟累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: "silver", milesToEarn: 40000, benefits: [B.priority("优先值机", "天合联盟 Elite"), B.baggage("额外行李", "额外行李额"), B.lounge("厦航贵宾室", "自营贵宾室")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: "gold", milesToEarn: 80000, benefits: [B.lounge("天合联盟贵宾室", "全球贵宾室含携伴"), B.priority("优先登机/行李", "Elite Plus"), B.baggage("额外行李", "额外 20kg"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: "gold", milesToEarn: 160000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "sichuan-airlines-golden-panda",
    name: "Golden Panda",
    nameZh: "川航金熊猫俱乐部",
    airlineIata: "3U",
    alliance: null,
    color: "#D50032",
    websiteUrl: "https://www.sichuanair.com",
    milesNoExpiry: false,
    highlights: ["成都/重庆枢纽", "西南地区网络最广", "中国-东南亚/南亚航线多", "机上餐饮口碑好"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "金熊猫卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "乘坐川航累积")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 30000, benefits: [B.priority("优先值机", "优先值机柜台"), B.baggage("额外行李", "额外 10kg")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 50000, benefits: [B.lounge("川航贵宾室", "自营贵宾室"), B.priority("优先登机/行李", "全流程优先"), B.seat("免费选座", "含优选座位")] },
      { slug: "platinum", name: "Platinum", nameZh: "白金卡", level: 4, allianceTier: null, milesToEarn: 100000, benefits: [B.upgrade("升舱券", "年度升舱券"), B.lounge("贵宾室携伴", "可携伴"), B.service("专属客服", "白金卡专线")] },
    ],
  },
  {
    slug: "shandong-airlines-fpf",
    name: "凤凰知音 (山航)",
    nameZh: "山航凤凰知音",
    airlineIata: "SC",
    alliance: null,
    color: "#C41E3A",
    websiteUrl: "https://www.shandongair.com.cn",
    milesNoExpiry: false,
    highlights: ["国航旗下，济南/青岛枢纽", "共享凤凰知音计划", "山东及华东网络广"],
    tiers: [
      { slug: "ordinary", name: "Ordinary", nameZh: "普通卡", level: 1, allianceTier: null, benefits: [B.miles("里程累积", "与国航凤凰知音共享")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, milesToEarn: 40000, benefits: [B.priority("优先值机", "商务舱值机柜台"), B.baggage("额外行李", "额外行李额")] },
      { slug: "gold", name: "Gold", nameZh: "金卡", level: 3, allianceTier: null, milesToEarn: 80000, benefits: [B.lounge("贵宾室", "自营及星空联盟贵宾室"), B.priority("优先登机/行李", "全流程优先"), B.seat("免费选座", "含优选座位")] },
    ],
  },
  {
    slug: "spring-airlines-club",
    name: "Spring Club",
    nameZh: "春秋航空绿翼会员",
    airlineIata: "9C",
    alliance: null,
    color: "#00A651",
    websiteUrl: "https://www.ch.com",
    milesNoExpiry: false,
    highlights: ["中国最大廉航", "上海枢纽", "中日韩及东南亚航线", "票价低、累积门槛低"],
    tiers: [
      { slug: "member", name: "Member", nameZh: "绿翼会员", level: 1, allianceTier: null, benefits: [B.miles("积分累积", "消费累积积分")] },
      { slug: "silver", name: "Silver", nameZh: "银卡", level: 2, allianceTier: null, benefits: [B.priority("优先登机", "优先登机"), B.baggage("行李折扣", "行李费折扣")] },
    ],
  },
];

export const FFP_BY_SLUG = Object.fromEntries(
  FFP_PROGRAMS.map((p) => [p.slug, p])
) as Record<string, FFPProgram>;

export const FFP_BY_AIRLINE = Object.fromEntries(
  FFP_PROGRAMS.map((p) => [p.airlineIata, p])
) as Record<string, FFPProgram>;

export const ALLIANCE_FFP: Record<FFPAlliance, FFPProgram[]> = {
  "star-alliance": FFP_PROGRAMS.filter((p) => p.alliance === "star-alliance"),
  skyteam: FFP_PROGRAMS.filter((p) => p.alliance === "skyteam"),
  oneworld: FFP_PROGRAMS.filter((p) => p.alliance === "oneworld"),
};

export const ALLIANCE_DETAILS: Record<FFPAlliance, { nameZh: string; color: string; desc: string }> = {
  "star-alliance": {
    nameZh: "星空联盟",
    color: "#000000",
    desc: "全球最大航空联盟，26 家成员航司覆盖 1,200+ 目的地。成员包括国航、新航、全日空、汉莎、美联航、土航等。金卡享全球贵宾室+优先服务+额外行李。",
  },
  skyteam: {
    nameZh: "天合联盟",
    color: "#003580",
    desc: "19 家成员航司，覆盖 1,000+ 目的地。东航、南航、达美、法航、大韩、厦航等。Elite Plus 享全球贵宾室与优先服务。",
  },
  oneworld: {
    nameZh: "寰宇一家",
    color: "#006564",
    desc: "13 家精品航司联盟。国泰、卡航、英航、日航、澳航、美航等。绿宝石等级享头等舱贵宾室与专属服务。",
  },
};
