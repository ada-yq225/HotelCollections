/**
 * Frequent Flyer Programs (FFP) — major airlines relevant to Chinese travellers.
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

export const FFP_PROGRAMS: FFPProgram[] = [
  // ── 中国航司 ──
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
      "天合联盟成员（2023 年起）",
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
  // ── 香港/台湾 ──
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
  // ── 亚洲关键航司 ──
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
  // ── 中东关键航司 ──
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
  // ── 欧美关键航司 ──
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
      "里程永不过期（唯一中美航司）",
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
    desc: "全球最大航空联盟，28 家成员航司覆盖 1,300+ 目的地。成员包括国航、新航、全日空、汉莎、美联航等。金卡享全球贵宾室+优先服务+额外行李。",
  },
  skyteam: {
    nameZh: "天合联盟",
    color: "#003580",
    desc: "19 家成员航司，覆盖 1,000+ 目的地。东航、南航、达美、法航、大韩等。Elite Plus 享全球贵宾室与优先服务。",
  },
  oneworld: {
    nameZh: "寰宇一家",
    color: "#006564",
    desc: "13 家精品航司联盟。国泰、卡航、英航、日航、澳航等。绿宝石等级享头等舱贵宾室与专属服务。",
  },
};
