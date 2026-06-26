export type SeasonInfo = {
  best: string[];
  good: string[];
  avoid: string[];
  tip: string;
};

export type VisaInfo = {
  policy: string;
  stay: string;
  note: string;
  evisa?: boolean;
};

const SEASON_BY_REGION: Record<string, SeasonInfo> = {
  maldives: {
    best: ["11月", "12月", "1月", "2月", "3月", "4月"],
    good: ["5月", "10月"],
    avoid: ["6月", "7月", "8月", "9月"],
    tip: "旱季海水清澈、适合浮潜；雨季风浪较大但价格更低",
  },
  tahiti: {
    best: ["5月", "6月", "7月", "8月", "9月", "10月"],
    good: ["4月", "11月"],
    avoid: ["12月", "1月", "2月", "3月"],
    tip: "南半球干季温暖少雨，适合跳岛与水上活动",
  },
  bali: {
    best: ["4月", "5月", "6月", "7月", "8月", "9月"],
    good: ["3月", "10月"],
    avoid: ["12月", "1月", "2月"],
    tip: "旱季阳光充足；雨季午后阵雨，乌布雨林别有风味",
  },
  safari: {
    best: ["6月", "7月", "8月", "9月", "10月"],
    good: ["5月", "11月"],
    avoid: ["3月", "4月"],
    tip: "旱季动物聚集水源，观兽最佳；雨季绿意盎然、鸟类活跃",
  },
  alps: {
    best: ["12月", "1月", "2月", "3月"],
    good: ["6月", "7月", "8月", "9月"],
    avoid: ["4月", "5月", "10月", "11月"],
    tip: "冬季滑雪旺季；夏季徒步与湖景度假同样精彩",
  },
  caribbean: {
    best: ["12月", "1月", "2月", "3月", "4月"],
    good: ["5月", "11月"],
    avoid: ["8月", "9月", "10月"],
    tip: "避开飓风季；圣诞至春季气候最宜人",
  },
  china: {
    best: ["3月", "4月", "5月", "9月", "10月", "11月"],
    good: ["6月", "12月"],
    avoid: ["1月", "2月", "7月", "8月"],
    tip: "春秋气候舒适；暑期亲子出行与春节年味各有特色",
  },
  japan: {
    best: ["3月", "4月", "10月", "11月"],
    good: ["5月", "9月"],
    avoid: ["6月", "7月", "8月"],
    tip: "樱花季与红叶季人气最高；梅雨季潮湿但温泉体验佳",
  },
  europe: {
    best: ["5月", "6月", "9月", "10月"],
    good: ["4月", "7月", "8月"],
    avoid: ["1月", "2月"],
    tip: " shoulder season 人少价优；夏季南欧海滨与北欧白昼长",
  },
};

const VISA_BY_COUNTRY: Record<string, VisaInfo> = {
  CN: { policy: "中国公民", stay: "—", note: "境内旅行无需签证" },
  HK: { policy: "港澳通行证", stay: "7-14 天", note: "持有效港澳通行证及签注" },
  MO: { policy: "港澳通行证", stay: "7 天", note: "持有效港澳通行证及签注" },
  TW: { policy: "入台证", stay: "15 天", note: "需办理入台证（自由行政策以官方为准）" },
  MV: { policy: "落地签", stay: "30 天", note: "抵达马累机场免费落地签，需返程机票与酒店订单", evisa: true },
  TH: { policy: "落地签/免签", stay: "30-60 天", note: "以当前中泰互免政策为准，出行前确认", evisa: true },
  SG: { policy: "免签", stay: "30 天", note: "持普通护照免签入境" },
  JP: { policy: "单次/多次签证", stay: "15-90 天", note: "需提前办理日本签证" },
  US: { policy: "B1/B2 签证", stay: "180 天", note: "需预约面签，EVUS 登记" },
  FR: { policy: "申根签证", stay: "90 天/180 天", note: "申根区短期停留签证" },
  GB: { policy: "英国签证", stay: "6 个月", note: "需提前在线申请" },
  AE: { policy: "免签", stay: "30 天", note: "持普通护照免签入境阿联酋" },
  SC: { policy: "落地签", stay: "30 天", note: "塞舌尔免费落地签", evisa: true },
  MU: { policy: "免签", stay: "30-60 天", note: "毛里求斯免签入境" },
  PF: { policy: "法属波利尼西亚签证", stay: "90 天", note: "通常需法签或专用签证（经旅行社办理）" },
  ID: { policy: "落地签/免签", stay: "30 天", note: "巴厘岛可落地签，政策以入境时为准", evisa: true },
  VN: { policy: "电子签/落地签", stay: "30 天", note: "可在线申请 e-Visa", evisa: true },
  KH: { policy: "落地签/电子签", stay: "30 天", note: "可提前办 e-Visa", evisa: true },
  LK: { policy: "电子签", stay: "30 天", note: "需提前申请 ETA", evisa: true },
  ZA: { policy: "签证", stay: "90 天", note: "游猎行程需提前办南非签证" },
  KE: { policy: "电子签", stay: "90 天", note: "eTA 电子旅行授权", evisa: true },
  TZ: { policy: "落地签/电子签", stay: "90 天", note: "塞伦盖蒂行程需黄热病疫苗证明（视航线）", evisa: true },
};

export function getSeasonInfo(region: string, countryCode: string): SeasonInfo {
  if (SEASON_BY_REGION[region]) return SEASON_BY_REGION[region];
  if (countryCode === "CN") return SEASON_BY_REGION.china;
  if (["JP", "KR"].includes(countryCode)) return SEASON_BY_REGION.japan;
  if (["FR", "IT", "ES", "CH", "AT", "DE", "GB"].includes(countryCode)) {
    return SEASON_BY_REGION.europe;
  }
  return {
    best: ["3月", "4月", "5月", "9月", "10月", "11月"],
    good: ["6月", "12月"],
    avoid: ["1月", "2月", "7月", "8月"],
    tip: "春秋两季通常气候宜人，出行前查阅当地节庆与天气",
  };
}

export function getVisaInfo(countryCode: string): VisaInfo {
  return (
    VISA_BY_COUNTRY[countryCode] ?? {
      policy: "请查询目的地签证",
      stay: "视政策而定",
      note: "出行前请通过外交部或目的地使馆确认最新签证政策",
    }
  );
}