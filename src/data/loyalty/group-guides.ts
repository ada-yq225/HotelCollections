/** Groups without a major points program — channel-first booking guide */
export type GroupChannelGuide = {
  groupSlug: string;
  hasLoyaltyProgram: boolean;
  programLabel?: string;
  summary: string;
  tips: string[];
  recommendedChannelSlugs: string[];
};

export const GROUP_CHANNEL_GUIDES: Record<string, GroupChannelGuide> = {
  "four-seasons": {
    groupSlug: "four-seasons",
    hasLoyaltyProgram: false,
    summary: "四季酒店无官方会员积分计划，礼遇主要通过 Virtuoso、Amex FHR 等奢华预订渠道获取",
    tips: [
      "Amex 百夫长 FHR 在四季城市酒店待遇稳定（含早 + $100 抵扣）",
      "度假村旺季建议提前 2-3 个月通过顾问备注特殊 occasion",
      "可与信用卡旅行保险、酒店住三付二等促销叠加（视政策）",
    ],
    recommendedChannelSlugs: ["virtuoso", "fhr"],
  },
  "mandarin-oriental": {
    groupSlug: "mandarin-oriental",
    hasLoyaltyProgram: false,
    programLabel: "Fans of MO",
    summary: "文华东方有 Fans of MO 会员（积分 + 优先升级），奢华待遇推荐 STARS / Virtuoso 渠道预订",
    tips: [
      "STARS 在亚洲文华（香港/东京/曼谷）升级率与早餐稳定",
      "Fans of MO 可与 STARS 部分礼遇叠加，入住时出示会员号",
      "度假村（马拉喀什/巴厘岛）优先走 Virtuoso 备注蜜月/纪念日",
    ],
    recommendedChannelSlugs: ["stars", "virtuoso", "fhr"],
  },
  "cheval-blanc": {
    groupSlug: "cheval-blanc",
    hasLoyaltyProgram: false,
    summary: "白马庄园为 LVMH 独立奢华品牌，无集团会员体系，Virtuoso 是主要礼遇渠道",
    tips: [
      "马尔代夫/圣巴特等度假村通过 Virtuoso 预订可享升级与抵扣",
      "连住 3 晚以上可尝试备注房型偏好，水上别墅视房态安排",
      "可与雅高心悦界积分换房（部分合作酒店）分开规划",
    ],
    recommendedChannelSlugs: ["virtuoso"],
  },
  independent: {
    groupSlug: "independent",
    hasLoyaltyProgram: false,
    summary: "独立奢华品牌（安缦、瑰丽、半岛等）各自为政，Virtuoso / Tablet Plus / FHR 是通用礼遇入口",
    tips: [
      "安缦、半岛等多仅支持 Virtuoso 或官方直销",
      "设计酒店联盟品牌可试 Tablet Plus",
      "入住多家独立品牌建议分别建立顾问档案备注偏好",
    ],
    recommendedChannelSlugs: ["virtuoso", "tablet-plus", "fhr"],
  },
};

export const LOYALTY_GROUP_SLUGS = [
  "marriott",
  "hyatt",
  "ihg",
  "hilton",
  "accor",
] as const;

export const GROUP_TOPIC_SLUGS = [
  ...LOYALTY_GROUP_SLUGS,
  "four-seasons",
  "mandarin-oriental",
  "cheval-blanc",
  "independent",
] as const;

export type GroupTopicSlug = (typeof GROUP_TOPIC_SLUGS)[number];

export function isGroupTopicSlug(slug: string): slug is GroupTopicSlug {
  return (GROUP_TOPIC_SLUGS as readonly string[]).includes(slug);
}

export function getGroupChannelGuide(groupSlug: string): GroupChannelGuide | null {
  return GROUP_CHANNEL_GUIDES[groupSlug] ?? null;
}