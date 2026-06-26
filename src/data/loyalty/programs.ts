export type LoyaltyTier = {
  slug: string;
  name: string;
  nameZh: string;
  level: number;
  nightsToEarn?: number;
  nightsToRenew?: number;
  benefits: { icon: string; title: string; desc: string }[];
};

export type LoyaltyProgram = {
  slug: string;
  name: string;
  nameZh: string;
  groupSlug: string;
  color: string;
  tiers: LoyaltyTier[];
};

const B = {
  points: (title: string, desc: string) => ({ icon: "points", title, desc }),
  upgrade: (title: string, desc: string) => ({ icon: "upgrade", title, desc }),
  breakfast: (title: string, desc: string) => ({ icon: "breakfast", title, desc }),
  lounge: (title: string, desc: string) => ({ icon: "lounge", title, desc }),
  checkout: (title: string, desc: string) => ({ icon: "checkout", title, desc }),
  credit: (title: string, desc: string) => ({ icon: "credit", title, desc }),
  suite: (title: string, desc: string) => ({ icon: "suite", title, desc }),
  gift: (title: string, desc: string) => ({ icon: "gift", title, desc }),
};

export const LOYALTY_PROGRAMS: LoyaltyProgram[] = [
  {
    slug: "marriott-bonvoy",
    name: "Marriott Bonvoy",
    nameZh: "万豪旅享家",
    groupSlug: "marriott",
    color: "#B41F3A",
    tiers: [
      { slug: "member", name: "Member", nameZh: "会员", level: 1, benefits: [B.points("积分累积", "消费可累积积分与房晚")] },
      {
        slug: "silver",
        name: "Silver Elite",
        nameZh: "银卡精英",
        level: 2,
        nightsToEarn: 10,
        nightsToRenew: 10,
        benefits: [B.points("积分加成 10%", "住宿积分额外 10%"), B.checkout("优先退房", "视房态延迟退房")],
      },
      {
        slug: "gold",
        name: "Gold Elite",
        nameZh: "金卡精英",
        level: 3,
        nightsToEarn: 25,
        nightsToRenew: 25,
        benefits: [
          B.points("积分加成 25%", "住宿积分额外 25%"),
          B.upgrade("客房升级", "入住时优先升级（视房态）"),
          B.checkout("延迟退房", "至 14:00（视房态）"),
        ],
      },
      {
        slug: "platinum",
        name: "Platinum Elite",
        nameZh: "白金精英",
        level: 4,
        nightsToEarn: 50,
        nightsToRenew: 50,
        benefits: [
          B.points("积分加成 50%", "住宿积分额外 50%"),
          B.upgrade("套房升级券", "年度套房升级礼遇"),
          B.lounge("行政酒廊", "含早餐的行政酒廊使用权"),
          B.breakfast("欢迎礼品", "积分或餐饮额度二选一"),
          B.checkout("延迟退房", "至 16:00（视房态）"),
        ],
      },
      {
        slug: "titanium",
        name: "Titanium Elite",
        nameZh: "钛金精英",
        level: 5,
        nightsToEarn: 75,
        nightsToRenew: 75,
        benefits: [
          B.points("积分加成 75%", "住宿积分额外 75%"),
          B.suite("年度套房升级", "最高可升至套房"),
          B.lounge("行政酒廊", "含双人早餐"),
          B.gift("年度礼品", "精选品牌礼遇"),
          B.checkout("保证 16:00 退房", "保证延迟退房"),
        ],
      },
      {
        slug: "ambassador",
        name: "Ambassador Elite",
        nameZh: "大使精英",
        level: 6,
        nightsToEarn: 100,
        nightsToRenew: 100,
        benefits: [
          B.points("积分加成 75%", "同钛金加成"),
          B.suite("Your24", "灵活入住 24 小时"),
          B.lounge("行政酒廊", "含双人早餐"),
          B.gift("大使专属服务", "专属客服与年度礼品"),
        ],
      },
    ],
  },
  {
    slug: "world-of-hyatt",
    name: "World of Hyatt",
    nameZh: "凯悦天地",
    groupSlug: "hyatt",
    color: "#E2231A",
    tiers: [
      { slug: "member", name: "Member", nameZh: "会员", level: 1, benefits: [B.points("积分累积", "消费可累积积分")] },
      {
        slug: "discoverist",
        name: "Discoverist",
        nameZh: "探索者",
        level: 2,
        nightsToEarn: 10,
        nightsToRenew: 10,
        benefits: [B.points("积分加成", "额外积分奖励"), B.checkout("优先退房", "视房态延迟退房")],
      },
      {
        slug: "explorist",
        name: "Explorist",
        nameZh: "探险家",
        level: 3,
        nightsToEarn: 30,
        nightsToRenew: 30,
        benefits: [
          B.upgrade("客房升级", "优先升级至更好景观房"),
          B.checkout("延迟退房", "至 14:00（视房态）"),
          B.gift("欢迎饮品", "入住欢迎饮品或小食"),
        ],
      },
      {
        slug: "globalist",
        name: "Globalist",
        nameZh: "环球客",
        level: 4,
        nightsToEarn: 60,
        nightsToRenew: 60,
        benefits: [
          B.suite("套房升级", "入住时优先升至套房（视房态）"),
          B.lounge("行政酒廊", "含早餐的行政酒廊"),
          B.breakfast("免费早餐", "主餐厅或酒廊双人早餐"),
          B.checkout("保证 16:00 退房", "保证延迟退房"),
          B.gift("嘉宾礼遇", "客房内欢迎礼品"),
        ],
      },
    ],
  },
  {
    slug: "ihg-one-rewards",
    name: "IHG One Rewards",
    nameZh: "洲际优悦会",
    groupSlug: "ihg",
    color: "#1E4D8C",
    tiers: [
      { slug: "club", name: "Club", nameZh: "俱乐部", level: 1, benefits: [B.points("积分累积", "消费可累积积分")] },
      {
        slug: "silver",
        name: "Silver Elite",
        nameZh: "银卡精英",
        level: 2,
        nightsToEarn: 10,
        nightsToRenew: 10,
        benefits: [B.points("积分加成 20%", "住宿积分额外 20%"), B.checkout("延迟退房", "视房态")],
      },
      {
        slug: "gold",
        name: "Gold Elite",
        nameZh: "金卡精英",
        level: 3,
        nightsToEarn: 20,
        nightsToRenew: 20,
        benefits: [
          B.points("积分加成 40%", "住宿积分额外 40%"),
          B.upgrade("客房升级", "优先升级（视房态）"),
          B.checkout("延迟退房", "至 14:00"),
        ],
      },
      {
        slug: "platinum",
        name: "Platinum Elite",
        nameZh: "白金精英",
        level: 4,
        nightsToEarn: 40,
        nightsToRenew: 40,
        benefits: [
          B.points("积分加成 60%", "住宿积分额外 60%"),
          B.upgrade("客房升级", "优先升级（视房态）"),
          B.breakfast("欢迎饮品", "入住欢迎饮品"),
          B.checkout("延迟退房", "至 16:00"),
        ],
      },
      {
        slug: "diamond",
        name: "Diamond Elite",
        nameZh: "钻石精英",
        level: 5,
        nightsToEarn: 70,
        nightsToRenew: 70,
        benefits: [
          B.points("积分加成 100%", "住宿积分额外 100%"),
          B.suite("套房升级", "优先升至套房（视房态）"),
          B.breakfast("免费早餐", "主餐厅双人早餐"),
          B.lounge("行政酒廊", "含早餐的酒廊使用权"),
          B.checkout("保证 16:00 退房", "保证延迟退房"),
        ],
      },
    ],
  },
  {
    slug: "hilton-honors",
    name: "Hilton Honors",
    nameZh: "希尔顿荣誉客会",
    groupSlug: "hilton",
    color: "#003B71",
    tiers: [
      { slug: "member", name: "Member", nameZh: "会员", level: 1, benefits: [B.points("积分累积", "消费可累积积分")] },
      {
        slug: "silver",
        name: "Silver",
        nameZh: "银卡",
        level: 2,
        nightsToEarn: 10,
        nightsToRenew: 10,
        benefits: [B.points("积分加成 20%", "住宿积分额外 20%"), B.checkout("第五晚免费", "积分兑换第五晚免费")],
      },
      {
        slug: "gold",
        name: "Gold",
        nameZh: "金卡",
        level: 3,
        nightsToEarn: 20,
        nightsToRenew: 20,
        benefits: [
          B.points("积分加成 80%", "住宿积分额外 80%"),
          B.upgrade("客房升级", "优先升级（视房态）"),
          B.breakfast("免费早餐", "主餐厅或酒廊早餐"),
          B.checkout("延迟退房", "至 14:00"),
        ],
      },
      {
        slug: "diamond",
        name: "Diamond",
        nameZh: "钻石",
        level: 4,
        nightsToEarn: 30,
        nightsToRenew: 30,
        benefits: [
          B.points("积分加成 100%", "住宿积分额外 100%"),
          B.suite("套房升级", "优先升至套房（视房态）"),
          B.lounge("行政酒廊", "含早餐的酒廊"),
          B.breakfast("免费早餐", "主餐厅双人早餐"),
          B.checkout("保证 16:00 退房", "保证延迟退房"),
        ],
      },
    ],
  },
  {
    slug: "accor-all",
    name: "ALL – Accor Live Limitless",
    nameZh: "雅高心悦界",
    groupSlug: "accor",
    color: "#1E1E1E",
    tiers: [
      { slug: "classic", name: "Classic", nameZh: "经典", level: 1, benefits: [B.points("积分累积", "消费可累积积分")] },
      {
        slug: "silver",
        name: "Silver",
        nameZh: "银卡",
        level: 2,
        nightsToEarn: 10,
        nightsToRenew: 10,
        benefits: [B.points("积分加成", "额外积分奖励"), B.checkout("延迟退房", "视房态")],
      },
      {
        slug: "gold",
        name: "Gold",
        nameZh: "金卡",
        level: 3,
        nightsToEarn: 30,
        nightsToRenew: 30,
        benefits: [
          B.upgrade("客房升级", "优先升级（视房态）"),
          B.breakfast("欢迎饮品", "入住欢迎饮品"),
          B.checkout("延迟退房", "至 14:00"),
        ],
      },
      {
        slug: "platinum",
        name: "Platinum",
        nameZh: "白金",
        level: 4,
        nightsToEarn: 60,
        nightsToRenew: 60,
        benefits: [
          B.upgrade("客房升级", "优先升级（视房态）"),
          B.lounge("行政酒廊", "含早餐的酒廊"),
          B.breakfast("免费早餐", "主餐厅早餐"),
          B.checkout("延迟退房", "至 16:00"),
        ],
      },
      {
        slug: "diamond",
        name: "Diamond",
        nameZh: "钻石",
        level: 5,
        nightsToEarn: 100,
        nightsToRenew: 100,
        benefits: [
          B.suite("套房升级", "优先升至套房（视房态）"),
          B.lounge("行政酒廊", "含早餐的酒廊"),
          B.breakfast("免费早餐", "主餐厅双人早餐"),
          B.checkout("保证 16:00 退房", "保证延迟退房"),
          B.gift("专属礼遇", "客房内欢迎礼品"),
        ],
      },
    ],
  },
];

export const PROGRAM_BY_SLUG = Object.fromEntries(
  LOYALTY_PROGRAMS.map((p) => [p.slug, p])
) as Record<string, LoyaltyProgram>;

export const PROGRAM_BY_GROUP = Object.fromEntries(
  LOYALTY_PROGRAMS.map((p) => [p.groupSlug, p])
) as Record<string, LoyaltyProgram>;