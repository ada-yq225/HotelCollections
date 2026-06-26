export type BenefitPolicyItem = {
  title: string;
  detail: string;
  appliesTo?: string;
};

export type BrandBenefitPolicy = {
  brandSlug: string;
  groupSlug: string;
  brandNameZh: string;
  eliteBenefits: BenefitPolicyItem[];
  channelNotes: string;
  upgradePolicy: string;
  breakfastPolicy: string;
  loungePolicy: string;
};

const LUXURY_DEFAULT: Omit<BrandBenefitPolicy, "brandSlug" | "brandNameZh" | "groupSlug"> = {
  eliteBenefits: [
    { title: "客房升级", detail: "视房态优先升级，高等级会员可升至套房", appliesTo: "金卡及以上" },
    { title: "行政酒廊", detail: "含双人早餐、下午茶、晚间鸡尾酒", appliesTo: "白金及以上" },
    { title: "欢迎礼品", detail: "积分或餐饮额度二选一（视品牌政策）", appliesTo: "白金及以上" },
    { title: "延迟退房", detail: "14:00–16:00，高等级可保证", appliesTo: "视等级" },
  ],
  channelNotes: "Virtuoso / FHR 等渠道礼遇可与会员待遇叠加，以酒店前台政策为准",
  upgradePolicy: "入住时前台确认，旺季套房紧张，建议提前备注会员号",
  breakfastPolicy: "行政酒廊或主餐厅，部分度假村仅酒廊提供",
  loungePolicy: "奢华品牌普遍设行政酒廊；度假村可能以别墅内早餐替代",
};

export const BRAND_BENEFIT_POLICIES: BrandBenefitPolicy[] = [
  {
    brandSlug: "ritz-carlton",
    groupSlug: "marriott",
    brandNameZh: "丽思卡尔顿",
    ...LUXURY_DEFAULT,
    eliteBenefits: [
      { title: "Club Level 升级", detail: "钛金/大使优先升至 Club 楼层，含酒廊全套待遇", appliesTo: "钛金及以上" },
      { title: "套房升级券", detail: "年度套房升级礼遇，可用于旗舰酒店", appliesTo: "白金及以上" },
      { title: "个性化服务", detail: "丽思传奇管家式服务，记住客人偏好", appliesTo: "全等级" },
      { title: "延迟退房", detail: "白金 16:00，钛金保证 16:00", appliesTo: "白金及以上" },
    ],
    upgradePolicy: "丽思升级率因酒店而异，旗舰店（香港/东京）套房紧张",
    breakfastPolicy: "Club Lounge 自助早餐品质高，部分酒店可改主餐厅",
    loungePolicy: "Club Level 为丽思核心体验，含三餐时段轻食",
  },
  {
    brandSlug: "st-regis",
    groupSlug: "marriott",
    brandNameZh: "瑞吉",
    ...LUXURY_DEFAULT,
    eliteBenefits: [
      { title: "Butler 管家", detail: "24 小时管家_unpack、熨烫、行程协助", appliesTo: "全等级" },
      { title: "香槟礼遇", detail: "入住欢迎香槟与晚间仪式", appliesTo: "全等级" },
      { title: "套房升级", detail: "钛金优先升套房，白金升行政房", appliesTo: "白金及以上" },
      { title: "延迟退房", detail: "白金 16:00，钛金可申请至 18:00", appliesTo: "白金及以上" },
    ],
    channelNotes: "Virtuoso 在瑞吉度假村（巴厘岛/马尔代夫）待遇稳定",
    upgradePolicy: "管家可协助沟通升级，度假村水上别墅需视房态",
    breakfastPolicy: "主餐厅或酒廊，部分度假村含漂浮早餐",
    loungePolicy: "瑞吉部分酒店无传统酒廊，以管家服务替代",
  },
  {
    brandSlug: "park-hyatt",
    groupSlug: "hyatt",
    brandNameZh: "柏悦",
    ...LUXURY_DEFAULT,
    eliteBenefits: [
      { title: "环球客套房升级", detail: "入住时优先升至套房，景观房保底", appliesTo: "环球客" },
      { title: "嘉宾礼遇", detail: "客房欢迎礼品 + 每日瓶装水补充", appliesTo: "环球客" },
      { title: "免费早餐", detail: "主餐厅或酒廊双人早餐", appliesTo: "环球客" },
      { title: "保证 16:00 退房", detail: "环球客延迟退房保证", appliesTo: "环球客" },
    ],
    channelNotes: "STARS 与环球客可叠加，STARS 提供 $100 抵扣",
    upgradePolicy: "柏悦升级率较高，上海/北京/东京旗舰店体验好",
    breakfastPolicy: "柏悦餐饮品质突出，早餐为品牌亮点",
    loungePolicy: "部分柏悦设嘉宾轩，与酒廊待遇等同",
  },
  {
    brandSlug: "four-seasons",
    groupSlug: "four-seasons",
    brandNameZh: "四季",
    ...LUXURY_DEFAULT,
    eliteBenefits: [
      { title: "房型升级", detail: "无官方会员体系，渠道预订可享升级", appliesTo: "Virtuoso/FHR" },
      { title: "双人早餐", detail: "Virtuoso/FHR 标准含早", appliesTo: "渠道预订" },
      { title: "消费抵扣", detail: "$100 餐饮/SPA 额度", appliesTo: "Virtuoso/FHR" },
      { title: "弹性入退", detail: "提前入住与延迟退房视房态", appliesTo: "渠道预订" },
    ],
    channelNotes: "四季无会员计划，Virtuoso/FHR 是获取待遇的主要途径",
    upgradePolicy: "度假村旺季升级难，建议通过顾问备注纪念日",
    breakfastPolicy: "四季早餐口碑极佳，部分酒店可客房送餐",
    loungePolicy: "四季一般不设行政酒廊，以全服务替代",
  },
  {
    brandSlug: "mandarin-oriental",
    groupSlug: "mandarin-oriental",
    brandNameZh: "文华东方",
    ...LUXURY_DEFAULT,
    eliteBenefits: [
      { title: "Fans of MO", detail: "会员积分 + 优先升级（视房态）", appliesTo: "MO 会员" },
      { title: "渠道升级", detail: "STARS/Virtuoso 优先升行政房", appliesTo: "渠道预订" },
      { title: "SPA 抵扣", detail: "部分酒店 $100 SPA 或餐饮额度", appliesTo: "Virtuoso" },
      { title: "延迟退房", detail: "16:00 延迟退房（渠道预订）", appliesTo: "渠道预订" },
    ],
    channelNotes: "文华东方 STARS 待遇在亚洲酒店稳定",
    upgradePolicy: "旗舰店（香港/东京/曼谷）升级率较好",
    breakfastPolicy: "行政酒廊或主餐厅，亚洲酒店早餐品质高",
    loungePolicy: "多数城市酒店设行政酒廊",
  },
];

const GROUP_POLICIES: Record<string, { title: string; policies: BenefitPolicyItem[] }> = {
  marriott: {
    title: "万豪旅享家精英待遇总则",
    policies: [
      { title: "积分累积", detail: "住宿与餐饮消费可累积积分与房晚" },
      { title: "白金及以上", detail: "行政酒廊、欢迎礼品、套房升级券" },
      { title: "钛金/大使", detail: "年度套房升级、保证延迟退房、Your24（大使）" },
      { title: "Luminous", detail: "官方顾问渠道，可叠加精英待遇" },
    ],
  },
  hyatt: {
    title: "凯悦天地环球客待遇总则",
    policies: [
      { title: "环球客核心", detail: "套房升级、免费早餐、行政酒廊、保证 16:00 退房" },
      { title: "嘉宾礼遇", detail: "欢迎礼品、优先客服" },
      { title: "STARS", detail: "凯悦官方顾问渠道，$100 抵扣 + 早餐" },
    ],
  },
  ihg: {
    title: "洲际优悦会精英待遇总则",
    policies: [
      { title: "钻石精英", detail: "套房升级、免费早餐、行政酒廊" },
      { title: "白金精英", detail: "客房升级、欢迎饮品、16:00 退房" },
      { title: "皇家大使", detail: "确保升级、专属礼券（付费项目）" },
    ],
  },
  hilton: {
    title: "希尔顿荣誉客会待遇总则",
    policies: [
      { title: "钻石会员", detail: "套房升级、免费早餐、行政酒廊、保证 16:00 退房" },
      { title: "金卡会员", detail: "客房升级、免费早餐、14:00 退房" },
      { title: "Hilton for Luxury", detail: "官方奢华预订渠道礼遇" },
    ],
  },
  accor: {
    title: "雅高心悦界待遇总则",
    policies: [
      { title: "钻石会员", detail: "套房升级、行政酒廊、免费早餐、保证 16:00 退房" },
      { title: "白金会员", detail: "客房升级、酒廊、16:00 退房" },
      { title: "Fairmont/Raffles", detail: "高端品牌待遇优于集团平均" },
    ],
  },
};

export function getBrandBenefitPolicy(brandSlug: string, groupSlug: string): BrandBenefitPolicy {
  const found = BRAND_BENEFIT_POLICIES.find((p) => p.brandSlug === brandSlug);
  if (found) return found;
  return {
    brandSlug,
    groupSlug,
    brandNameZh: brandSlug,
    ...LUXURY_DEFAULT,
  };
}

export function getGroupBenefitPolicy(groupSlug: string) {
  return GROUP_POLICIES[groupSlug] ?? null;
}