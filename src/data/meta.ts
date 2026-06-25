export type HotelGroupMeta = {
  slug: string;
  name: string;
  nameZh: string;
  logoColor: string;
  sortOrder: number;
};

export type AllianceMeta = {
  slug: string;
  name: string;
  nameZh: string;
  description: string;
};

export type BrandMeta = {
  slug: string;
  name: string;
  nameZh: string;
  groupSlug: string;
  allianceSlugs: string[];
};

export const GROUPS: HotelGroupMeta[] = [
  { slug: "marriott", name: "Marriott International", nameZh: "万豪国际", logoColor: "#B41F3A", sortOrder: 1 },
  { slug: "hyatt", name: "Hyatt Hotels Corporation", nameZh: "凯悦酒店集团", logoColor: "#E2231A", sortOrder: 2 },
  { slug: "ihg", name: "IHG Hotels & Resorts", nameZh: "洲际酒店集团", logoColor: "#1E4D8C", sortOrder: 3 },
  { slug: "hilton", name: "Hilton", nameZh: "希尔顿", logoColor: "#003B71", sortOrder: 4 },
  { slug: "accor", name: "Accor", nameZh: "雅高", logoColor: "#1E1E1E", sortOrder: 5 },
  { slug: "four-seasons", name: "Four Seasons Hotels and Resorts", nameZh: "四季酒店", logoColor: "#1a1a1a", sortOrder: 6 },
  { slug: "mandarin-oriental", name: "Mandarin Oriental Hotel Group", nameZh: "文华东方", logoColor: "#8B2942", sortOrder: 7 },
  { slug: "cheval-blanc", name: "Cheval Blanc", nameZh: "白马庄园", logoColor: "#2c2c2c", sortOrder: 8 },
  { slug: "independent", name: "Independent", nameZh: "独立奢华", logoColor: "#C9A962", sortOrder: 9 },
];

export const ALLIANCES: AllianceMeta[] = [
  {
    slug: "lhw",
    name: "The Leading Hotels of the World",
    nameZh: "立鼎世酒店集团",
    description: "A collection of over 400 independent luxury hotels in more than 80 countries.",
  },
  {
    slug: "relais-chateaux",
    name: "Relais & Châteaux",
    nameZh: "罗莱夏朵",
    description: "An exclusive collection of luxury hotels and gourmet restaurants worldwide.",
  },
  {
    slug: "preferred",
    name: "Preferred Hotels & Resorts",
    nameZh: "璞富腾酒店及度假村",
    description: "A global collection of independent luxury hotels, resorts, and residences.",
  },
  {
    slug: "slh",
    name: "Small Luxury Hotels of the World",
    nameZh: "全球小型豪华酒店联盟",
    description: "A curated portfolio of over 500 independently owned boutique luxury hotels.",
  },
  {
    slug: "design-hotels",
    name: "Design Hotels",
    nameZh: "设计酒店联盟",
    description: "A collection of design-forward independent hotels with distinctive character.",
  },
];

export const BRANDS: BrandMeta[] = [
  // Marriott International
  { slug: "ritz-carlton", name: "The Ritz-Carlton", nameZh: "丽思卡尔顿", groupSlug: "marriott", allianceSlugs: ["lhw"] },
  { slug: "st-regis", name: "St. Regis", nameZh: "瑞吉", groupSlug: "marriott", allianceSlugs: ["lhw"] },
  { slug: "jw-marriott", name: "JW Marriott", nameZh: "JW万豪", groupSlug: "marriott", allianceSlugs: [] },
  { slug: "ritz-carlton-reserve", name: "Ritz-Carlton Reserve", nameZh: "丽思卡尔顿隐世", groupSlug: "marriott", allianceSlugs: ["lhw"] },
  { slug: "luxury-collection", name: "The Luxury Collection", nameZh: "豪华精选", groupSlug: "marriott", allianceSlugs: ["lhw", "preferred"] },
  { slug: "w-hotels", name: "W Hotels", nameZh: "W酒店", groupSlug: "marriott", allianceSlugs: ["design-hotels"] },
  { slug: "edition", name: "EDITION", nameZh: "艾迪逊", groupSlug: "marriott", allianceSlugs: ["design-hotels"] },

  // Hyatt
  { slug: "park-hyatt", name: "Park Hyatt", nameZh: "柏悦", groupSlug: "hyatt", allianceSlugs: ["lhw"] },
  { slug: "andaz", name: "Andaz", nameZh: "安达仕", groupSlug: "hyatt", allianceSlugs: ["design-hotels"] },
  { slug: "alila", name: "Alila", nameZh: "阿丽拉", groupSlug: "hyatt", allianceSlugs: ["design-hotels", "preferred"] },
  { slug: "miraval", name: "Miraval", nameZh: "米拉瓦尔", groupSlug: "hyatt", allianceSlugs: [] },

  // IHG
  { slug: "six-senses", name: "Six Senses", nameZh: "六善", groupSlug: "ihg", allianceSlugs: ["preferred"] },
  { slug: "intercontinental", name: "InterContinental", nameZh: "洲际", groupSlug: "ihg", allianceSlugs: [] },
  { slug: "regent", name: "Regent", nameZh: "丽晶", groupSlug: "ihg", allianceSlugs: ["lhw"] },
  { slug: "vignette", name: "Vignette Collection", nameZh: "洲至奢选", groupSlug: "ihg", allianceSlugs: ["preferred"] },

  // Hilton
  { slug: "waldorf-astoria", name: "Waldorf Astoria", nameZh: "华尔道夫", groupSlug: "hilton", allianceSlugs: ["lhw"] },
  { slug: "conrad", name: "Conrad", nameZh: "康莱德", groupSlug: "hilton", allianceSlugs: [] },
  { slug: "lxr", name: "LXR Hotels & Resorts", nameZh: "LXR", groupSlug: "hilton", allianceSlugs: ["preferred"] },

  // Accor
  { slug: "raffles", name: "Raffles", nameZh: "莱佛士", groupSlug: "accor", allianceSlugs: ["lhw"] },
  { slug: "fairmont", name: "Fairmont", nameZh: "费尔蒙", groupSlug: "accor", allianceSlugs: ["preferred"] },
  { slug: "sofitel-legend", name: "Sofitel Legend", nameZh: "索菲特传奇", groupSlug: "accor", allianceSlugs: ["lhw"] },
  { slug: "banyan-tree", name: "Banyan Tree", nameZh: "悦榕庄", groupSlug: "accor", allianceSlugs: ["preferred"] },

  // Four Seasons
  { slug: "four-seasons", name: "Four Seasons", nameZh: "四季", groupSlug: "four-seasons", allianceSlugs: ["lhw"] },

  // Mandarin Oriental
  { slug: "mandarin-oriental", name: "Mandarin Oriental", nameZh: "文华东方", groupSlug: "mandarin-oriental", allianceSlugs: ["lhw"] },

  // Cheval Blanc
  { slug: "cheval-blanc", name: "Cheval Blanc", nameZh: "白马庄园", groupSlug: "cheval-blanc", allianceSlugs: [] },

  // Independent
  { slug: "rosewood", name: "Rosewood", nameZh: "瑰丽", groupSlug: "independent", allianceSlugs: ["lhw", "preferred"] },
  { slug: "aman", name: "Aman", nameZh: "安缦", groupSlug: "independent", allianceSlugs: [] },
  { slug: "peninsula", name: "The Peninsula", nameZh: "半岛", groupSlug: "independent", allianceSlugs: ["lhw"] },
  { slug: "belmond", name: "Belmond", nameZh: "贝尔蒙德", groupSlug: "independent", allianceSlugs: ["lhw", "preferred"] },
  { slug: "oberoi", name: "The Oberoi", nameZh: "欧贝罗伊", groupSlug: "independent", allianceSlugs: ["lhw"] },
  { slug: "shangri-la", name: "Shangri-La", nameZh: "香格里拉", groupSlug: "independent", allianceSlugs: [] },
  { slug: "capella", name: "Capella", nameZh: "嘉佩乐", groupSlug: "independent", allianceSlugs: ["preferred", "slh"] },
  { slug: "one-and-only", name: "One&Only", nameZh: "唯逸", groupSlug: "independent", allianceSlugs: ["preferred"] },
  { slug: "como", name: "COMO", nameZh: "COMO", groupSlug: "independent", allianceSlugs: ["slh", "design-hotels"] },
  { slug: "patina", name: "Patina", nameZh: "柏嘉", groupSlug: "independent", allianceSlugs: [] },
  { slug: "soneva", name: "Soneva", nameZh: "索尼娃", groupSlug: "independent", allianceSlugs: [] },
  { slug: "joali", name: "JOALI", nameZh: "娇丽", groupSlug: "independent", allianceSlugs: [] },
  { slug: "anantara", name: "Anantara", nameZh: "安纳塔拉", groupSlug: "independent", allianceSlugs: ["preferred"] },
  { slug: "baglioni", name: "Baglioni", nameZh: "巴廖尼", groupSlug: "independent", allianceSlugs: [] },
  { slug: "gili", name: "Gili Lankanfushi", nameZh: "吉利兰坎富士", groupSlug: "independent", allianceSlugs: ["slh"] },
  { slug: "huvafen", name: "Huvafen Fushi", nameZh: "芙花芬", groupSlug: "independent", allianceSlugs: [] },
  { slug: "velaa", name: "Velaa Private Island", nameZh: "维拉私人岛", groupSlug: "independent", allianceSlugs: [] },
  { slug: "niyama", name: "Niyama Private Islands", nameZh: "尼亚玛", groupSlug: "independent", allianceSlugs: [] },
  { slug: "nautilus", name: "The Nautilus", nameZh: "鹦鹉螺", groupSlug: "independent", allianceSlugs: [] },
  { slug: "crown-champa", name: "Crown & Champa Resorts", nameZh: "皇冠CCR", groupSlug: "independent", allianceSlugs: [] },
  { slug: "milaidhoo", name: "Milaidhoo Island", nameZh: "米莱度", groupSlug: "independent", allianceSlugs: ["slh"] },
  { slug: "baros", name: "Baros Maldives", nameZh: "巴洛斯", groupSlug: "independent", allianceSlugs: ["slh"] },
  { slug: "vakkaru", name: "Vakkaru Maldives", nameZh: "瓦卡鲁", groupSlug: "independent", allianceSlugs: [] },
  { slug: "amilla", name: "Amilla Maldives", nameZh: "阿米拉", groupSlug: "independent", allianceSlugs: [] },
  { slug: "ayada", name: "Ayada Maldives", nameZh: "阿雅达", groupSlug: "independent", allianceSlugs: [] },
  { slug: "the-brando", name: "The Brando", nameZh: "布兰多", groupSlug: "independent", allianceSlugs: [] },
  { slug: "le-tahaa", name: "Le Taha'a Island Resort", nameZh: "塔哈岛度假村", groupSlug: "independent", allianceSlugs: ["relais-chateaux"] },
  { slug: "singita", name: "Singita", nameZh: "Singita", groupSlug: "independent", allianceSlugs: [] },
  { slug: "north-island", name: "North Island", nameZh: "北岛", groupSlug: "independent", allianceSlugs: [] },
  { slug: "qualia", name: "qualia", nameZh: "奎利亚", groupSlug: "independent", allianceSlugs: [] },
  { slug: "likuliku", name: "Likuliku Lagoon Resort", nameZh: "利库利库", groupSlug: "independent", allianceSlugs: [] },
  { slug: "the-datai", name: "The Datai", nameZh: "达泰", groupSlug: "independent", allianceSlugs: ["lhw"] },
  { slug: "kempinski", name: "Kempinski", nameZh: "凯宾斯基", groupSlug: "independent", allianceSlugs: ["lhw"] },
];