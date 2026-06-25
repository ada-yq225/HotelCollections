import type { Prisma } from "@prisma/client";

export type FeaturedDestination = {
  slug: string;
  name: string;
  nameZh: string;
};

export const FEATURED_DESTINATIONS: FeaturedDestination[] = [
  { slug: "maldives", name: "Maldives", nameZh: "马尔代夫" },
  { slug: "tahiti", name: "French Polynesia", nameZh: "大溪地" },
  { slug: "bodrum", name: "Bodrum", nameZh: "博德鲁姆" },
  { slug: "phu-quoc", name: "Phu Quoc", nameZh: "富国岛" },
  { slug: "bali", name: "Bali", nameZh: "巴厘岛" },
  { slug: "phuket", name: "Phuket", nameZh: "普吉岛" },
  { slug: "samui", name: "Koh Samui", nameZh: "苏梅岛" },
  { slug: "caribbean", name: "Caribbean", nameZh: "加勒比" },
  { slug: "hawaii", name: "Hawaii", nameZh: "夏威夷" },
  { slug: "mediterranean", name: "Mediterranean", nameZh: "地中海" },
  { slug: "alps", name: "Alps", nameZh: "阿尔卑斯" },
  { slug: "indian-ocean", name: "Indian Ocean", nameZh: "印度洋岛屿" },
  { slug: "fiji", name: "Fiji", nameZh: "斐济" },
  { slug: "mexico-resort", name: "Mexico Resorts", nameZh: "墨西哥度假" },
  { slug: "safari", name: "Safari", nameZh: "非洲游猎" },
  { slug: "africa", name: "Africa", nameZh: "非洲" },
  { slug: "dubai", name: "Dubai", nameZh: "迪拜" },
  { slug: "china", name: "China", nameZh: "中国大陆" },
  { slug: "china-beijing", name: "Beijing", nameZh: "北京" },
  { slug: "china-shanghai", name: "Shanghai", nameZh: "上海" },
  { slug: "china-guangzhou", name: "Guangzhou", nameZh: "广州" },
  { slug: "china-shenzhen", name: "Shenzhen", nameZh: "深圳" },
  { slug: "china-chengdu", name: "Chengdu", nameZh: "成都" },
  { slug: "china-hangzhou", name: "Hangzhou", nameZh: "杭州" },
  { slug: "china-sanya", name: "Sanya", nameZh: "三亚" },
  { slug: "china-hongkong", name: "Hong Kong", nameZh: "香港" },
  { slug: "china-chongqing", name: "Chongqing", nameZh: "重庆" },
  { slug: "china-xian", name: "Xi'an", nameZh: "西安" },
  { slug: "china-nanjing", name: "Nanjing", nameZh: "南京" },
  { slug: "china-wuhan", name: "Wuhan", nameZh: "武汉" },
  { slug: "china-changsha", name: "Changsha", nameZh: "长沙" },
  { slug: "china-suzhou", name: "Suzhou", nameZh: "苏州" },
  { slug: "china-xiamen", name: "Xiamen", nameZh: "厦门" },
  { slug: "china-qingdao", name: "Qingdao", nameZh: "青岛" },
  { slug: "china-dalian", name: "Dalian", nameZh: "大连" },
  { slug: "china-macau", name: "Macau", nameZh: "澳门" },
  { slug: "japan", name: "Japan", nameZh: "日本" },
  { slug: "singapore", name: "Singapore", nameZh: "新加坡" },
];

/** Standalone luxury groups with dedicated collection pages */
export const SIGNATURE_GROUPS = [
  "four-seasons",
  "mandarin-oriental",
  "cheval-blanc",
] as const;

const CARIBBEAN_COUNTRIES = [
  "BS", "AI", "TC", "JM", "LC", "AG", "KN", "VC", "GD", "BB", "KY", "DO", "PR", "VI", "AW", "CW", "MF",
] as const;

/** Resolve destination slug to Prisma where clause (server-side) */
export function getDestinationWhere(slug: string): Prisma.HotelWhereInput | null {
  switch (slug) {
    case "maldives":
      return { countryCode: "MV" };
    case "tahiti":
      return { countryCode: "PF" };
    case "bali":
      return {
        countryCode: "ID",
        OR: [
          { cityZh: { contains: "乌布" } },
          { cityZh: { contains: "金巴兰" } },
          { cityZh: { contains: "努沙杜瓦" } },
          { cityZh: { contains: "水明漾" } },
          { cityZh: { contains: "乌鲁瓦图" } },
          { cityZh: { contains: "仓古" } },
          { cityZh: { contains: "曼格斯" } },
          { region: "bali" },
        ],
      };
    case "bodrum":
      return {
        OR: [{ region: "bodrum" }, { cityZh: { contains: "博德鲁姆" } }],
      };
    case "phu-quoc":
      return {
        OR: [{ region: "phu-quoc" }, { cityZh: { contains: "富国岛" } }],
      };
    case "phuket":
      return {
        OR: [{ region: "phuket" }, { cityZh: { contains: "普吉" } }],
      };
    case "samui":
      return {
        OR: [{ region: "samui" }, { cityZh: { contains: "苏梅" } }],
      };
    case "caribbean":
      return {
        OR: [
          { region: "caribbean" },
          { countryCode: { in: [...CARIBBEAN_COUNTRIES] } },
        ],
      };
    case "hawaii":
      return {
        OR: [
          { region: "hawaii" },
          { cityZh: { in: ["威雷亚", "卡帕鲁亚", "凯卢阿", "拉奈岛", "檀香山"] } },
        ],
      };
    case "mediterranean":
      return { region: "mediterranean" };
    case "alps":
      return { region: "alps" };
    case "indian-ocean":
      return {
        OR: [
          { region: "indian-ocean" },
          { countryCode: { in: ["SC", "MU", "RE", "MG"] } },
        ],
      };
    case "fiji":
      return {
        OR: [{ countryCode: "FJ" }, { region: "fiji" }],
      };
    case "mexico-resort":
      return { region: "mexico-resort" };
    case "safari":
      return { region: "safari" };
    case "africa":
      return {
        OR: [
          { region: "safari" },
          { countryCode: { in: ["ZA", "KE", "TZ", "RW", "BW", "MZ", "MA", "EG", "SC", "MU", "UG", "NA", "ZM", "MG"] } },
        ],
      };
    case "dubai":
      return { cityZh: { contains: "迪拜" } };
    case "china":
      return { countryCode: "CN" };
    case "china-beijing":
      return { OR: [{ cityZh: "北京" }, { region: "china-beijing" }] };
    case "china-shanghai":
      return { OR: [{ cityZh: "上海" }, { region: "china-shanghai" }] };
    case "china-guangzhou":
      return { OR: [{ cityZh: "广州" }, { region: "china-guangzhou" }] };
    case "china-shenzhen":
      return { OR: [{ cityZh: "深圳" }, { region: "china-shenzhen" }] };
    case "china-chengdu":
      return { OR: [{ cityZh: "成都" }, { region: "china-chengdu" }] };
    case "china-hangzhou":
      return { OR: [{ cityZh: "杭州" }, { region: "china-hangzhou" }] };
    case "china-sanya":
      return { OR: [{ cityZh: "三亚" }, { region: "china-sanya" }] };
    case "china-hongkong":
      return {
        OR: [
          { countryCode: "HK" },
          { region: "china-hongkong" },
        ],
      };
    case "china-chongqing":
      return { OR: [{ cityZh: "重庆" }, { region: "china-chongqing" }] };
    case "china-xian":
      return { OR: [{ cityZh: "西安" }, { region: "china-xian" }] };
    case "china-nanjing":
      return { OR: [{ cityZh: "南京" }, { region: "china-nanjing" }] };
    case "china-wuhan":
      return { OR: [{ cityZh: "武汉" }, { region: "china-wuhan" }] };
    case "china-changsha":
      return { OR: [{ cityZh: "长沙" }, { region: "china-changsha" }] };
    case "china-suzhou":
      return { OR: [{ cityZh: "苏州" }, { region: "china-suzhou" }] };
    case "china-xiamen":
      return { OR: [{ cityZh: "厦门" }, { region: "china-xiamen" }] };
    case "china-qingdao":
      return { OR: [{ cityZh: "青岛" }, { region: "china-qingdao" }] };
    case "china-dalian":
      return { OR: [{ cityZh: "大连" }, { region: "china-dalian" }] };
    case "china-macau":
      return {
        OR: [
          { countryCode: "MO" },
          { region: "china-macau" },
        ],
      };
    case "japan":
      return { countryCode: "JP" };
    case "singapore":
      return { countryCode: "SG" };
    default:
      return null;
  }
}