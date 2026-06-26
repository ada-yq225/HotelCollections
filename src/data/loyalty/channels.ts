export type BookingChannel = {
  slug: string;
  name: string;
  nameZh: string;
  desc: string;
  color: string;
  /** Hotel group slugs this channel commonly covers */
  groupSlugs: string[];
  perks: { icon: string; title: string; desc: string }[];
  minStay?: string;
  stackable?: boolean;
};

export const BOOKING_CHANNELS: BookingChannel[] = [
  {
    slug: "virtuoso",
    name: "Virtuoso",
    nameZh: "Virtuoso",
    desc: "全球最大奢华旅行顾问网络，覆盖独立酒店与主流奢华品牌",
    color: "#2c4a6e",
    groupSlugs: ["marriott", "hyatt", "ihg", "hilton", "accor", "four-seasons", "mandarin-oriental", "independent"],
    perks: [
      { icon: "upgrade", title: "视房态升级", desc: "基础房升行政房或套房" },
      { icon: "breakfast", title: "每日双人早餐", desc: "主餐厅或酒廊自助早餐" },
      { icon: "credit", title: "$100 消费抵扣", desc: "餐饮 / SPA 额度（视酒店政策）" },
      { icon: "checkout", title: "弹性入退", desc: "提前入住 & 延迟退房（视房态）" },
      { icon: "gift", title: "欢迎礼品", desc: "客房内欢迎礼遇" },
    ],
    minStay: "通常 1 晚起",
    stackable: false,
  },
  {
    slug: "fhr",
    name: "Fine Hotels & Resorts",
    nameZh: "Amex FHR",
    desc: "美国运通百夫长卡专属，前台现付享固定礼遇包",
    color: "#006FCF",
    groupSlugs: ["marriott", "hyatt", "ihg", "hilton", "accor", "four-seasons", "mandarin-oriental"],
    perks: [
      { icon: "upgrade", title: "保证升级", desc: "入住时保证升级（视房态，通常升一级）" },
      { icon: "breakfast", title: "每日双人早餐", desc: "含小费的主餐厅早餐" },
      { icon: "credit", title: "$100 消费抵扣", desc: "餐饮 / SPA / 其他消费" },
      { icon: "checkout", title: "保证 16:00 退房", desc: "保证延迟退房" },
      { icon: "gift", title: "欢迎礼品", desc: "入住欢迎礼遇" },
      { icon: "suite", title: "第四晚免费", desc: "连住满 4 晚付 3 晚（促销期）" },
    ],
    minStay: "2 晚起（部分酒店）",
    stackable: false,
  },
  {
    slug: "stars",
    name: "Hyatt Prive / STARS",
    nameZh: "凯悦 STARS",
    desc: "凯悦官方旅行顾问计划，与会员待遇可叠加",
    color: "#E2231A",
    groupSlugs: ["hyatt", "mandarin-oriental"],
    perks: [
      { icon: "upgrade", title: "视房态升级", desc: "优先升级至更好房型" },
      { icon: "breakfast", title: "每日双人早餐", desc: "主餐厅或酒廊早餐" },
      { icon: "credit", title: "$100 消费抵扣", desc: "餐饮 / SPA 额度" },
      { icon: "checkout", title: "16:00 退房", desc: "延迟退房（视房态）" },
      { icon: "gift", title: "欢迎礼品", desc: "入住欢迎饮品或礼品" },
    ],
    stackable: true,
  },
  {
    slug: "luminous",
    name: "Marriott Luminous",
    nameZh: "万豪 Luminous",
    desc: "万豪官方旅行顾问计划，可与 Bonvoy 精英待遇叠加",
    color: "#B41F3A",
    groupSlugs: ["marriott"],
    perks: [
      { icon: "upgrade", title: "视房态升级", desc: "优先升级至行政房或套房" },
      { icon: "breakfast", title: "每日双人早餐", desc: "主餐厅或酒廊早餐" },
      { icon: "credit", title: "$100 消费抵扣", desc: "餐饮 / SPA 额度" },
      { icon: "checkout", title: "16:00 退房", desc: "延迟退房（视房态）" },
      { icon: "gift", title: "欢迎礼品", desc: "入住欢迎礼遇" },
    ],
    stackable: true,
  },
  {
    slug: "hilton-for-luxury",
    name: "Hilton for Luxury",
    nameZh: "希尔顿奢华预订",
    desc: "希尔顿官方奢华旅行顾问渠道",
    color: "#003B71",
    groupSlugs: ["hilton"],
    perks: [
      { icon: "upgrade", title: "视房态升级", desc: "优先升级（视房态）" },
      { icon: "breakfast", title: "每日双人早餐", desc: "主餐厅早餐" },
      { icon: "credit", title: "$100 消费抵扣", desc: "餐饮 / SPA 额度" },
      { icon: "checkout", title: "弹性入退", desc: "提前入住 & 延迟退房" },
    ],
    stackable: true,
  },
  {
    slug: "tablet-plus",
    name: "Tablet Plus",
    nameZh: "Tablet Plus",
    desc: "精品独立酒店预订平台，覆盖设计酒店与小型奢华品牌",
    color: "#1a1a1a",
    groupSlugs: ["independent"],
    perks: [
      { icon: "upgrade", title: "视房态升级", desc: "优先升级（视房态）" },
      { icon: "breakfast", title: "每日早餐", desc: "含早餐（视酒店政策）" },
      { icon: "credit", title: "消费抵扣", desc: "餐饮或 SPA 额度" },
      { icon: "checkout", title: "弹性入退", desc: "提前入住 & 延迟退房" },
    ],
    stackable: false,
  },
];

export const CHANNEL_BY_SLUG = Object.fromEntries(
  BOOKING_CHANNELS.map((c) => [c.slug, c])
) as Record<string, BookingChannel>;