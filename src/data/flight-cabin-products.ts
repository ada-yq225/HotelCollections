/**
 * Iconic premium cabin products — market reference fares & marketing copy.
 * Images: airline official CDN / press assets.
 */
export type PremiumCabinProduct = {
  id: string;
  airlineIata: string;
  name: string;
  nameZh: string;
  cabinLabel: string;
  descriptionZh: string;
  imageUrl: string;
  /** Fallback image URLs tried when local imageUrl fails to load */
  fallbackImageUrls: string[];
  /** One-way market reference CNY */
  priceCny: number;
  /** Leg keys "DEP-DST" (either direction) where this product is sold */
  legRoutes: string[];
};

export const PREMIUM_CABIN_PRODUCTS: PremiumCabinProduct[] = [
  // ── 中国国内航线高端舱位 ──
  {
    id: "airchina-first-domestic",
    airlineIata: "CA",
    name: "Air China First Class (Domestic)",
    nameZh: "国航豪华头等舱（国内线）",
    cabinLabel: "头等舱",
    descriptionZh:
      "国航国内精品航线旗舰头等舱：180°全平躺座椅、独立隔间，北京—上海/广州/深圳等快线配备。享优先登机、专属值机与贵宾室。",
    imageUrl: "/flight-cabin/airchina-first.jpg",
    fallbackImageUrls: [
      "https://www.airchina.com.cn/cn/images/cabin/first-class-seat.jpg",
      "https://www.airchina.com.cn/cn/images/cabin/first-class-cabin.jpg",
    ],
    priceCny: 4800,
    legRoutes: ["PEK-PVG", "PEK-CAN", "PEK-SZX", "PEK-CTU", "PEK-SHA"],
  },
  {
    id: "airchina-business-domestic",
    airlineIata: "CA",
    name: "Air China Business Class (Domestic)",
    nameZh: "国航商务舱（国内线）",
    cabinLabel: "商务舱",
    descriptionZh:
      "国航国内精品线商务舱：宽体机 2-2-2 布局、160°斜躺座椅，北京出港覆盖全国主要城市。含优先值机、额外行李额与贵宾室。",
    imageUrl: "/flight-cabin/airchina-business.jpg",
    fallbackImageUrls: [
      "https://www.airchina.com.cn/cn/images/cabin/business-class-seat.jpg",
      "https://www.airchina.com.cn/cn/images/cabin/business-class-cabin.jpg",
    ],
    priceCny: 2800,
    legRoutes: ["PEK-PVG", "PEK-CAN", "PEK-SZX", "PEK-CTU", "PEK-SHA", "PEK-SYX", "PEK-XIY", "PEK-CKG", "PEK-HGH", "PEK-NKG", "PEK-WUH", "PVG-CTU", "PVG-CAN", "PVG-SZX"],
  },
  {
    id: "eastern-business-domestic",
    airlineIata: "MU",
    name: "China Eastern Business Class (Domestic)",
    nameZh: "东航商务舱（国内线）",
    cabinLabel: "商务舱",
    descriptionZh:
      "东航京沪/京广等精品快线商务舱：全平躺座椅、Nappa 真皮座椅、机上 Wi-Fi。上海浦东/虹桥枢纽辐射全国。",
    imageUrl: "/flight-cabin/eastern-business.jpg",
    fallbackImageUrls: [
      "https://www.ceair.com/global/images/cabin/business-class.jpg",
      "https://www.ceair.com/global/images/cabin/business-class-seat.jpg",
    ],
    priceCny: 2600,
    legRoutes: ["PVG-PEK", "SHA-PEK", "PVG-CAN", "PVG-SZX", "PVG-CTU", "PVG-SYX", "PVG-XIY", "PVG-CKG", "PVG-HGH", "PVG-NKG"],
  },
  {
    id: "southern-business-domestic",
    airlineIata: "CZ",
    name: "China Southern Business Class (Domestic)",
    nameZh: "南航商务舱（国内线）",
    cabinLabel: "商务舱",
    descriptionZh:
      "南航广州枢纽出发商务舱：A350/B787 执飞精品航线，全平躺座椅配 18 英寸触控屏。京广、沪深快线高频次运营。",
    imageUrl: "/flight-cabin/southern-business.jpg",
    fallbackImageUrls: [
      "https://www.csair.com/cn/images/cabin/business-class.jpg",
      "https://www.csair.com/cn/images/cabin/business-class-seat.jpg",
    ],
    priceCny: 2700,
    legRoutes: ["CAN-PEK", "CAN-PVG", "CAN-SHA", "CAN-CTU", "CAN-SYX", "CAN-XIY", "SZX-PEK", "SZX-PVG", "SZX-CTU"],
  },
  {
    id: "hainan-business-domestic",
    airlineIata: "HU",
    name: "Hainan Airlines Business Class (Domestic)",
    nameZh: "海航商务舱（国内线）",
    cabinLabel: "商务舱",
    descriptionZh:
      "海航 Skytrax 五星航空国内商务舱：B787 执飞北京—三亚/海口等精品旅游航线，全平躺座椅配 BOSE 降噪耳机与精选海南风味餐食。",
    imageUrl: "/flight-cabin/hainan-business.jpg",
    fallbackImageUrls: [
      "https://www.hainanairlines.com/global/images/cabin/business-class.jpg",
      "https://www.hainanairlines.com/global/images/cabin/business-class-seat.jpg",
    ],
    priceCny: 3200,
    legRoutes: ["PEK-SYX", "PEK-HAK", "PVG-SYX", "PVG-HAK", "PEK-CTU", "PEK-XIY", "SZX-SYX"],
  },
  // ── 国际特色舱位 ──
  {
    id: "etihad-residence",
    airlineIata: "EY",
    name: "The Residence",
    nameZh: "空中官邸",
    cabinLabel: "特色头等",
    descriptionZh:
      "阿提哈德 A380 上的三居室空中宫殿：独立客厅、双人卧室与淋浴套房，配私人管家。全球仅少数航线提供，是民航客舱的巅峰体验之一。",
    imageUrl: "/flight-cabin/etihad-residence.jpg",
    fallbackImageUrls: [
      "https://www.etihad.com/content/dam/eag/etihadairways/global/cabin-class/the-residence/the-residence-living-room.jpg",
      "https://www.etihad.com/content/dam/eag/etihadairways/global/cabin-class/the-residence/the-residence-bedroom.jpg",
      "https://resources.etihad.com/photo/the-residence-a380-cabin-01.jpg",
    ],
    priceCny: 128000,
    legRoutes: ["AUH-LHR", "AUH-JFK", "AUH-SYD", "AUH-MEL", "AUH-PVG", "AUH-PEK"],
  },
  {
    id: "etihad-residence-pek-lhr",
    airlineIata: "EY",
    name: "The Residence (Beijing - Abu Dhabi - London)",
    nameZh: "空中官邸（北京-阿布扎比-伦敦）",
    cabinLabel: "特色头等",
    descriptionZh:
      "北京出发经阿布扎比中转至伦敦，全程空中官邸体验。PEK-AUH 商务舱 + AUH-LHR 空中官邸，一次出行尽享阿提哈德旗舰服务。",
    imageUrl: "/flight-cabin/etihad-residence.jpg",
    fallbackImageUrls: [
      "https://www.etihad.com/content/dam/eag/etihadairways/global/cabin-class/the-residence/the-residence-living-room.jpg",
      "https://www.etihad.com/content/dam/eag/etihadairways/global/cabin-class/the-residence/the-residence-bedroom.jpg",
    ],
    priceCny: 168000,
    legRoutes: ["PEK-AUH", "PVG-AUH", "CAN-AUH", "CTU-AUH"],
  },
  {
    id: "singapore-suites",
    airlineIata: "SQ",
    name: "Singapore Airlines Suites",
    nameZh: "新加坡航空套房",
    cabinLabel: "特色头等",
    descriptionZh:
      "A380 双层前舱独立套房，可平躺双人床、皮革座椅与私密隔间。新加坡—伦敦/悉尼/香港等旗舰航线常年一票难求。",
    imageUrl: "/flight-cabin/singapore-suites.jpg",
    fallbackImageUrls: [
      "https://www.singaporeair.com/saar5/images/media-centre/press-release/images/2017/sia-new-a380-suites-01.jpg",
      "https://www.singaporeair.com/saar5/images/media-centre/press-release/images/2017/sia-new-a380-suites-02.jpg",
      "https://cdn.singaporeair.com/sites/default/files/2023-11/suites-hero.jpg",
    ],
    priceCny: 88000,
    legRoutes: ["SIN-LHR", "SIN-SYD", "SIN-HKG", "SIN-PEK", "SIN-PVG", "SIN-NRT", "SIN-FRA"],
  },
  {
    id: "singapore-suites-pvg-sin-lhr",
    airlineIata: "SQ",
    name: "Singapore Airlines Suites (Shanghai - Singapore - London)",
    nameZh: "新航套房（上海-新加坡-伦敦）",
    cabinLabel: "特色头等",
    descriptionZh:
      "上海出发经新加坡樟宜中转至伦敦，PVG-SIN 商务舱 + SIN-LHR 新航A380套房。全程享受新航旗舰服务，樟宜机场还可体验银刃贵宾室。",
    imageUrl: "/flight-cabin/singapore-suites.jpg",
    fallbackImageUrls: [
      "https://www.singaporeair.com/saar5/images/media-centre/press-release/images/2017/sia-new-a380-suites-01.jpg",
      "https://cdn.singaporeair.com/sites/default/files/2023-11/suites-hero.jpg",
    ],
    priceCny: 108000,
    legRoutes: ["PEK-SIN", "PVG-SIN", "CAN-SIN", "CTU-SIN"],
  },
  {
    id: "singapore-suites-pek-sin-syd",
    airlineIata: "SQ",
    name: "Singapore Airlines Suites (Beijing - Singapore - Sydney)",
    nameZh: "新航套房（北京-新加坡-悉尼）",
    cabinLabel: "特色头等",
    descriptionZh:
      "北京出发经新加坡中转至悉尼，PEK-SIN 商务舱 + SIN-SYD 新航A380套房。南半球的奢华飞行体验。",
    imageUrl: "/flight-cabin/singapore-suites.jpg",
    fallbackImageUrls: [
      "https://www.singaporeair.com/saar5/images/media-centre/press-release/images/2017/sia-new-a380-suites-01.jpg",
      "https://cdn.singaporeair.com/sites/default/files/2023-11/suites-hero.jpg",
    ],
    priceCny: 98000,
    legRoutes: ["PEK-SIN", "PVG-SIN"],
  },
  {
    id: "emirates-first",
    airlineIata: "EK",
    name: "Emirates First Class",
    nameZh: "阿联酋航空头等舱",
    cabinLabel: "特色头等",
    descriptionZh:
      "A380 全封闭私人包间，可关合滑门；部分机型配备空中酒吧与淋浴水疗。迪拜枢纽连接全球，长航线头等体验极具代表性。",
    imageUrl: "/flight-cabin/emirates-first.jpg",
    fallbackImageUrls: [
      "https://cdn.ek.aero/images/first-class/first-class-private-suite.jpg",
      "https://www.emirates.com/media/images/first-class-a380-shower-spa.jpg",
      "https://c.ekstatic.net/ecl/images/cabin-class/first-class/first-class-suite-1600x900.jpg",
    ],
    priceCny: 68000,
    legRoutes: [
      "DXB-LHR",
      "DXB-SYD",
      "DXB-MEL",
      "DXB-JFK",
      "DXB-PEK",
      "DXB-PVG",
      "DXB-HKG",
      "DXB-SIN",
      "DXB-BKK",
    ],
  },
  {
    id: "emirates-first-pek-dxb-mle",
    airlineIata: "EK",
    name: "Emirates First (Beijing - Dubai - Maldives)",
    nameZh: "阿联酋航空头等（北京-迪拜-马尔代夫）",
    cabinLabel: "特色头等",
    descriptionZh:
      "北京出发经迪拜中转至马尔代夫马累，PEK-DXB 商务舱 + DXB-MLE 阿联酋航空头等舱。迪拜转机可享受头等舱贵宾室与专属接送服务。",
    imageUrl: "/flight-cabin/emirates-first.jpg",
    fallbackImageUrls: [
      "https://cdn.ek.aero/images/first-class/first-class-private-suite.jpg",
      "https://www.emirates.com/media/images/first-class-a380-shower-spa.jpg",
    ],
    priceCny: 58000,
    legRoutes: ["PEK-DXB", "PVG-DXB", "CAN-DXB", "CTU-DXB"],
  },
  {
    id: "emirates-first-pvg-dxb-lhr",
    airlineIata: "EK",
    name: "Emirates First (Shanghai - Dubai - London)",
    nameZh: "阿联酋航空头等（上海-迪拜-伦敦）",
    cabinLabel: "特色头等",
    descriptionZh:
      "上海出发经迪拜中转至伦敦，PVG-DXB 商务舱 + DXB-LHR 阿联酋A380头等舱。可体验空中淋浴水疗与机上酒吧。",
    imageUrl: "/flight-cabin/emirates-first.jpg",
    fallbackImageUrls: [
      "https://cdn.ek.aero/images/first-class/first-class-private-suite.jpg",
      "https://www.emirates.com/media/images/first-class-a380-shower-spa.jpg",
    ],
    priceCny: 68000,
    legRoutes: ["PVG-DXB", "PEK-DXB"],
  },
  {
    id: "cathay-first",
    airlineIata: "CX",
    name: "Cathay Pacific First",
    nameZh: "国泰航空头等舱",
    cabinLabel: "特色头等",
    descriptionZh:
      "波音 777 上宽达 40 英寸的独立套房，皮革座椅可延伸为平躺睡床，配手工皮枕与高端备品。香港枢纽飞往伦敦、纽约等远程航线。",
    imageUrl: "/flight-cabin/cathay-first.jpg",
    fallbackImageUrls: [
      "https://www.cathaypacific.com/content/dam/focal-point/cx/cabin/first-class/first-class-seat-777.jpg",
      "https://www.cathaypacific.com/content/dam/focal-point/cx/cabin/first-class/first-class-dining.jpg",
      "https://cdn.cathaypacific.com/hong-kong/first-class-suite.jpg",
    ],
    priceCny: 72000,
    legRoutes: ["HKG-LHR", "HKG-JFK", "HKG-LAX", "HKG-SFO", "HKG-SYD"],
  },
  {
    id: "cathay-first-pek-hkg-jfk",
    airlineIata: "CX",
    name: "Cathay Pacific First (Beijing - Hong Kong - New York)",
    nameZh: "国泰航空头等（北京-香港-纽约）",
    cabinLabel: "特色头等",
    descriptionZh:
      "北京出发经香港中转至纽约，PEK-HKG 商务舱 + HKG-JFK 国泰航空头等舱。香港机场寰宇堂/玉衡堂头等贵宾室为转机增色。",
    imageUrl: "/flight-cabin/cathay-first.jpg",
    fallbackImageUrls: [
      "https://www.cathaypacific.com/content/dam/focal-point/cx/cabin/first-class/first-class-seat-777.jpg",
      "https://cdn.cathaypacific.com/hong-kong/first-class-suite.jpg",
    ],
    priceCny: 82000,
    legRoutes: ["PEK-HKG", "PVG-HKG", "CAN-HKG"],
  },
  {
    id: "air-france-premiere",
    airlineIata: "AF",
    name: "La Première",
    nameZh: "法航头等舱",
    cabinLabel: "特色头等",
    descriptionZh:
      "法航旗舰头等舱，四席私密隔间配全平躺睡床、Givenchy 寝具与米其林星级主厨菜单。巴黎戴高乐枢纽通往纽约、洛杉矶、新加坡等。",
    imageUrl: "/flight-cabin/air-france-premiere.jpg",
    fallbackImageUrls: [
      "https://wwws.airfrance.fr/common/image/cabin/la-premiere/la-premiere-suite.jpg",
      "https://wwws.airfrance.fr/common/image/cabin/la-premiere/la-premiere-bed.jpg",
      "https://cdn.airfrance.com/cms/sites/default/files/la-premiere-cabin-2024.jpg",
    ],
    priceCny: 95000,
    legRoutes: ["CDG-JFK", "CDG-LAX", "CDG-SIN", "CDG-HKG", "CDG-PEK", "CDG-PVG"],
  },
  {
    id: "air-france-premiere-pek-cdg-jfk",
    airlineIata: "AF",
    name: "La Premiere (Beijing - Paris - New York)",
    nameZh: "法航头等（北京-巴黎-纽约）",
    cabinLabel: "特色头等",
    descriptionZh:
      "北京出发经巴黎中转至纽约，PEK-CDG 商务舱 + CDG-JFK 法航 La Premiere。巴黎戴高乐机场专属头等贵宾室体验。",
    imageUrl: "/flight-cabin/air-france-premiere.jpg",
    fallbackImageUrls: [
      "https://wwws.airfrance.fr/common/image/cabin/la-premiere/la-premiere-suite.jpg",
      "https://cdn.airfrance.com/cms/sites/default/files/la-premiere-cabin-2024.jpg",
    ],
    priceCny: 105000,
    legRoutes: ["PEK-CDG", "PVG-CDG", "CAN-CDG", "CTU-CDG"],
  },
  {
    id: "ana-the-suite",
    airlineIata: "NH",
    name: "ANA The Suite",
    nameZh: "全日空头等套房",
    cabinLabel: "特色头等",
    descriptionZh:
      "波音 777 前舱仅 8 席，半开放套房配 26 英寸触控屏、日式美学内饰与顶级日式餐食。成田/羽田飞往伦敦、纽约、洛杉矶等。",
    imageUrl: "/flight-cabin/ana-the-suite.jpg",
    fallbackImageUrls: [
      "https://www.ana.co.jp/en/us/travel-information/inflight-guide/the-suite/the-suite-seat.jpg",
      "https://www.ana.co.jp/en/us/travel-information/inflight-guide/the-suite/the-suite-detail.jpg",
      "https://www.ana.co.jp/ja/jp/travel-information/inflight-guide/the-suite/the-suite-4k.jpg",
    ],
    priceCny: 78000,
    legRoutes: ["NRT-LHR", "HND-LHR", "NRT-JFK", "HND-JFK", "NRT-LAX", "PEK-NRT", "PVG-NRT"],
  },
  {
    id: "ana-the-suite-pek-nrt-jfk",
    airlineIata: "NH",
    name: "ANA The Suite (Beijing - Tokyo - New York)",
    nameZh: "全日空头等套房（北京-东京-纽约）",
    cabinLabel: "特色头等",
    descriptionZh:
      "北京出发经东京成田中转至纽约，PEK-NRT 商务舱 + NRT-JFK 全日空 The Suite。东京转机可体验全日空头等贵宾室与日式款待。",
    imageUrl: "/flight-cabin/ana-the-suite.jpg",
    fallbackImageUrls: [
      "https://www.ana.co.jp/en/us/travel-information/inflight-guide/the-suite/the-suite-seat.jpg",
      "https://www.ana.co.jp/ja/jp/travel-information/inflight-guide/the-suite/the-suite-4k.jpg",
    ],
    priceCny: 88000,
    legRoutes: ["PEK-NRT", "PVG-NRT", "CAN-NRT", "CTU-NRT", "PEK-HND", "PVG-HND"],
  },
  {
    id: "ana-the-suite-pvg-hnd-lhr",
    airlineIata: "NH",
    name: "ANA The Suite (Shanghai - Tokyo - London)",
    nameZh: "全日空头等套房（上海-东京-伦敦）",
    cabinLabel: "特色头等",
    descriptionZh:
      "上海出发经东京羽田中转至伦敦，PVG-HND 商务舱 + HND-LHR 全日空 The Suite。体验全日空最顶级的日式飞行服务。",
    imageUrl: "/flight-cabin/ana-the-suite.jpg",
    fallbackImageUrls: [
      "https://www.ana.co.jp/en/us/travel-information/inflight-guide/the-suite/the-suite-seat.jpg",
      "https://www.ana.co.jp/ja/jp/travel-information/inflight-guide/the-suite/the-suite-4k.jpg",
    ],
    priceCny: 88000,
    legRoutes: ["PVG-HND", "PEK-HND", "CAN-HND", "CTU-HND"],
  },
  {
    id: "qatar-qsuite",
    airlineIata: "QR",
    name: "Qsuite",
    nameZh: "卡航 Qsuite",
    cabinLabel: "特色商务",
    descriptionZh:
      "卡塔尔航空标志性商务舱：四向滑动隔门形成「双人套房」，部分座位可拼成双人床。多哈枢纽通往全球，常被评为全球最佳商务舱之一。",
    imageUrl: "/flight-cabin/qatar-qsuite.jpg",
    fallbackImageUrls: [
      "https://www.qatarairways.com/content/dam/hia/campaigns/qsuite/qsuite-double-bed.jpg",
      "https://www.qatarairways.com/content/dam/hia/campaigns/qsuite/qsuite-quad.jpg",
      "https://www.qatarairways.com/content/dam/hia/campaigns/qsuite/qsuite-private-suite.jpg",
    ],
    priceCny: 32000,
    legRoutes: [
      "DOH-LHR",
      "DOH-PVG",
      "DOH-PEK",
      "DOH-HKG",
      "DOH-SIN",
      "DOH-MLE",
      "DOH-SYD",
      "PEK-DOH",
      "PVG-DOH",
    ],
  },
  {
    id: "qatar-qsuite-pek-doh-mle",
    airlineIata: "QR",
    name: "Qsuite (Beijing - Doha - Maldives)",
    nameZh: "卡航 Qsuite（北京-多哈-马尔代夫）",
    cabinLabel: "特色商务",
    descriptionZh:
      "北京出发经多哈中转至马尔代夫马累，全程 Qsuite 商务舱。双人出行可拼接为双人床，多哈转机可体验 Al Mourjan 商务贵宾室。",
    imageUrl: "/flight-cabin/qatar-qsuite.jpg",
    fallbackImageUrls: [
      "https://www.qatarairways.com/content/dam/hia/campaigns/qsuite/qsuite-double-bed.jpg",
      "https://www.qatarairways.com/content/dam/hia/campaigns/qsuite/qsuite-private-suite.jpg",
    ],
    priceCny: 38000,
    legRoutes: ["PEK-DOH", "PVG-DOH", "CAN-DOH", "CTU-DOH"],
  },
  {
    id: "qatar-qsuite-pvg-doh-cdg",
    airlineIata: "QR",
    name: "Qsuite (Shanghai - Doha - Paris)",
    nameZh: "卡航 Qsuite（上海-多哈-巴黎）",
    cabinLabel: "特色商务",
    descriptionZh:
      "上海出发经多哈中转至巴黎，全程 Qsuite 商务舱。多哈机场作为全球最佳机场之一，转机体验极佳。",
    imageUrl: "/flight-cabin/qatar-qsuite.jpg",
    fallbackImageUrls: [
      "https://www.qatarairways.com/content/dam/hia/campaigns/qsuite/qsuite-double-bed.jpg",
      "https://www.qatarairways.com/content/dam/hia/campaigns/qsuite/qsuite-private-suite.jpg",
    ],
    priceCny: 36000,
    legRoutes: ["PVG-DOH", "PEK-DOH", "CAN-DOH"],
  },
];

function legKey(a: string, b: string): string {
  return `${a}-${b}`;
}

/** Premium products available on any leg of this itinerary */
export function getPremiumProductsForLegs(
  legs: { from: string; to: string }[]
): PremiumCabinProduct[] {
  const found: PremiumCabinProduct[] = [];
  const seen = new Set<string>();

  for (const leg of legs) {
    const forward = legKey(leg.from, leg.to);
    const reverse = legKey(leg.to, leg.from);
    for (const product of PREMIUM_CABIN_PRODUCTS) {
      if (seen.has(product.id)) continue;
      const hit = product.legRoutes.some((r) => r === forward || r === reverse);
      if (hit) {
        seen.add(product.id);
        found.push(product);
      }
    }
  }

  return found.sort((a, b) => a.priceCny - b.priceCny);
}

import { getRoutingHubs } from "@/data/flight-routes";

/** Premium cabins sold on this city-pair (direct or via route-appropriate hubs only) */
export function getRoutePremiumHighlights(
  dep: string,
  dest: string,
  depCountry?: string,
  destCountry?: string
): PremiumCabinProduct[] {
  const legs: { from: string; to: string }[] = [{ from: dep, to: dest }];
  
  // Only use geographically appropriate hubs for this route
  const hubs = depCountry && destCountry
    ? getRoutingHubs(depCountry, destCountry)
    : ["AUH", "DXB", "DOH", "SIN", "HKG", "CDG", "LHR", "NRT", "ICN"] as readonly string[];
  
  for (const hub of hubs) {
    if (hub === dep || hub === dest) continue;
    legs.push({ from: dep, to: hub }, { from: hub, to: dest });
  }
  return getPremiumProductsForLegs(legs);
}