import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { GROUPS, ALLIANCES, BRANDS } from "../src/data/meta";
import { ALL_HOTELS } from "../src/data/hotels";
import { isHotelListed } from "../src/lib/hotel-visibility";
import { BADGES } from "../src/data/badges";
import { HOTEL_ENRICHMENT } from "../src/data/hotel-enrichment";
import { resolveOfficialUrl } from "../src/lib/hotel-official-url";
import { resolveHotelPrices } from "../src/lib/hotel-pricing";
import { resolveHotelCoverImage } from "../src/lib/hotel-cover-image";
import { estimateTravelerRating } from "../src/lib/hotel-ratings";

const prisma = new PrismaClient();

const PLACEHOLDER_KEYCARD =
  "https://placehold.co/600x380/faf6f0/b8956b?text=H%26C+Keycard&font=playfair-display";

async function main() {
  console.log("Seeding Hotel Collection database...");

  await prisma.priceAlert.deleteMany();
  await prisma.userLoyaltyStatus.deleteMany();
  await prisma.bookingInquiry.deleteMany();
  await prisma.keycardOffer.deleteMany();
  await prisma.keycard.deleteMany();
  await prisma.discussionReply.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.post.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.stay.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.brandAlliance.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.alliance.deleteMany();
  await prisma.hotelGroup.deleteMany();
  await prisma.user.deleteMany();

  const groupMap = new Map<string, string>();
  for (const g of GROUPS) {
    const created = await prisma.hotelGroup.create({
      data: {
        slug: g.slug,
        name: g.name,
        nameZh: g.nameZh,
        logoColor: g.logoColor,
        sortOrder: g.sortOrder,
      },
    });
    groupMap.set(g.slug, created.id);
  }
  console.log(`  Groups: ${GROUPS.length}`);

  const allianceMap = new Map<string, string>();
  for (const a of ALLIANCES) {
    const created = await prisma.alliance.create({
      data: {
        slug: a.slug,
        name: a.name,
        nameZh: a.nameZh,
        description: a.description,
      },
    });
    allianceMap.set(a.slug, created.id);
  }
  console.log(`  Alliances: ${ALLIANCES.length}`);

  const brandMap = new Map<string, string>();
  for (const b of BRANDS) {
    const created = await prisma.brand.create({
      data: {
        slug: b.slug,
        name: b.name,
        nameZh: b.nameZh,
        tier: "luxury",
        groupId: groupMap.get(b.groupSlug)!,
      },
    });
    brandMap.set(b.slug, created.id);

    for (const allianceSlug of b.allianceSlugs) {
      const allianceId = allianceMap.get(allianceSlug);
      if (allianceId) {
        await prisma.brandAlliance.create({
          data: { brandId: created.id, allianceId },
        });
      }
    }
  }
  console.log(`  Brands: ${BRANDS.length}`);

  const hotelIdBySlug = new Map<string, string>();
  let hotelCount = 0;
  for (const h of ALL_HOTELS) {
    const brandId = brandMap.get(h.brandSlug);
    if (!brandId) {
      console.warn(`  Skipping hotel ${h.slug}: unknown brand ${h.brandSlug}`);
      continue;
    }
    const cached = HOTEL_ENRICHMENT[h.slug];
    const websiteUrl =
      h.websiteUrl ?? cached?.websiteUrl ?? resolveOfficialUrl(h) ?? undefined;
    const gallery = h.galleryImages ?? cached?.galleryImages ?? [];
    const coverImage = resolveHotelCoverImage(
      h.heroImage ?? cached?.heroImage,
      gallery
    );
    const prices = resolveHotelPrices({
      ...h,
      scrapedBasePrice: cached?.avgBasePrice,
      scrapedSuitePrice: cached?.avgSuitePrice,
      priceSource: cached?.priceSource,
    });
    const ratings = estimateTravelerRating(h);

    const created = await prisma.hotel.create({
      data: {
        slug: h.slug,
        name: h.name,
        nameZh: h.nameZh,
        brandId,
        city: h.city,
        cityZh: h.cityZh,
        country: h.country,
        countryCode: h.countryCode,
        region: h.region,
        latitude: h.latitude,
        longitude: h.longitude,
        address: h.address,
        openedYear: h.openedYear,
        notes: h.notes,
        websiteUrl,
        description: h.description ?? cached?.description,
        descriptionZh: h.descriptionZh ?? cached?.descriptionZh,
        heroImage: coverImage ?? undefined,
        galleryImages: JSON.stringify(gallery),
        enrichedAt: cached?.description || cached?.heroImage ? new Date() : undefined,
        avgBasePrice: prices.avgBasePrice ?? undefined,
        avgSuitePrice: prices.avgSuitePrice ?? undefined,
        priceCurrency: prices.priceCurrency,
        travelerScore: ratings.travelerScore,
        travelerRatingCount: ratings.travelerRatingCount,
        travelerReviewSummary: ratings.travelerReviewSummary,
        scoreLocation: ratings.scoreLocation,
        scoreDesign: ratings.scoreDesign,
        scoreService: ratings.scoreService,
        scoreDining: ratings.scoreDining,
        scoreHardware: ratings.scoreHardware,
        isActive: isHotelListed(h),
      },
    });
    hotelIdBySlug.set(h.slug, created.id);
    hotelCount++;
  }
  console.log(`  Hotels: ${hotelCount}`);

  for (const badge of BADGES) {
    await prisma.badge.create({
      data: {
        slug: badge.slug,
        name: badge.name,
        nameZh: badge.nameZh,
        description: badge.description,
        icon: badge.icon,
        color: badge.color,
        category: badge.category,
        threshold: badge.threshold,
        sortOrder: badge.sortOrder,
      },
    });
  }
  console.log(`  Badges: ${BADGES.length}`);

  const demoUser = await prisma.user.create({
    data: {
      email: "demo@hc.com",
      name: "奢华旅人",
      passwordHash: await bcrypt.hash("demo123", 10),
      isPlus: true,
      plusSince: new Date(),
    },
  });

  const discussions = [
    {
      category: "status-match",
      groupSlug: "marriott",
      title: "2026 万豪钛金保级实战：50 晚 vs 75k 消费额",
      content: `分享我的钛金保级路径：

1. **50 晚路径**：适合高频出差党，配合 Q1 双倍房晚活动，3-4 次长途旅行即可达标
2. **75k 消费额**：适合住高端酒店（瑞吉、丽思），一晚 3000+ 很快达标
3. **联名卡**：Amex 高端卡赠送的 15 晚仍然有效，记得在年底前完成

注意：品牌费 $650 今年继续交，建议有 5 张以上房晚卡再考虑钛金。`,
      isPinned: true,
    },
    {
      category: "promo",
      groupSlug: "hyatt",
      title: "凯悦 2026 Q2：每 3 晚享 500 积分 — 值不值得冲？",
      content: `Q2 活动每 3 晚 500 分，折合每晚 166 分，约 $3 价值。

**适合冲的情况**：
- 已有环球客，需要保 30 晚
- 目的地有 Park Hyatt / Alila 且现金价合理

**不建议的情况**：
- 只为了刷分住低端凯悦
- 积分兑换房（不计入活动）

大家准备冲哪个目的地？`,
      isPinned: false,
    },
    {
      category: "compare",
      groupSlug: "independent",
      title: "STARS vs Luminous vs Virtuoso：文华东方怎么订最划算？",
      content: `对比三大奢华预订渠道的 MO 待遇：

| 渠道 | 升级 | 早餐 | 抵扣 | 备注 |
|------|------|------|------|------|
| STARS | 优先升级 | 双人早 | $100 | 需通过授权代理 |
| Luminous | 房型升级 | 含早 | $100 SPA | Amex FHR 叠加 |
| Virtuoso | 视房态 | 含早 | $100 | 部分酒店独家 |

**结论**：如果已有 Amex 白金，优先 FHR；否则走 STARS 代理更稳定。H&C 平台预订可享受同等礼遇 + 人工跟进。`,
      isPinned: true,
    },
    {
      category: "benefits",
      groupSlug: "ihg",
      title: "洲际皇家大使 RA 真实体验：值得花 $200 买大使礼券吗？",
      content: `RA 核心权益：
- 每次入住确保升级（行政或套房）
- 下午 4 点延迟退房
- 专属欢迎礼（通常是香槟+水果）

$200 买 4 张大使周末礼券是否值？
- 如果你住 Regent / InterContinental 度假村：值
- 如果只住城市 IC：看升级率，上海 IC 升级率约 70%

欢迎分享你的 RA 体验数据。`,
      isPinned: false,
    },
  ];

  for (const d of discussions) {
    const created = await prisma.discussion.create({
      data: { userId: demoUser.id, ...d },
    });
    if (d.isPinned) {
      await prisma.discussionReply.create({
        data: {
          discussionId: created.id,
          userId: demoUser.id,
          content: "欢迎大家补充自己的实战数据，共建高质量攻略库。",
        },
      });
    }
  }
  console.log(`  Discussions: ${discussions.length}`);

  const keycardHotels = [
    { slug: "park-hyatt-shanghai", title: "上海柏悦酒店房卡", tradeType: "display", year: 2024 },
    { slug: "ritz-carlton-shanghai-pudong", title: "浦东丽思卡尔顿金属房卡", tradeType: "offer", year: 2023 },
    { slug: "mandarin-oriental-hong-kong", title: "香港文华东方经典房卡", tradeType: "wanted", year: null },
    { slug: "st-regis-bali", title: "巴厘岛瑞吉木质房卡", tradeType: "display", year: 2025 },
    { slug: "aman-tokyo", title: "安缦东京和纸房卡", tradeType: "offer", year: 2024 },
    { slug: "four-seasons-sydney", title: "悉尼四季复古房卡", tradeType: "display", year: 2022 },
  ];

  let keycardCount = 0;
  for (const k of keycardHotels) {
    const hotelId = hotelIdBySlug.get(k.slug);
    if (!hotelId) continue;
    await prisma.keycard.create({
      data: {
        userId: demoUser.id,
        hotelId,
        title: k.title,
        description:
          k.tradeType === "wanted"
            ? "求换同系列亚洲区房卡，品相不限"
            : k.tradeType === "offer"
              ? "品相 9 成新，可换万豪系或瑞吉系"
              : "个人收藏展示",
        imageUrl: PLACEHOLDER_KEYCARD,
        year: k.year ?? undefined,
        tradeType: k.tradeType,
      },
    });
    keycardCount++;
  }
  console.log(`  Keycards: ${keycardCount}`);

  await prisma.userLoyaltyStatus.createMany({
    data: [
      {
        userId: demoUser.id,
        programSlug: "marriott-bonvoy",
        tierSlug: "platinum",
        nightsYTD: 32,
        channelSlugs: JSON.stringify(["luminous", "virtuoso"]),
      },
      {
        userId: demoUser.id,
        programSlug: "world-of-hyatt",
        tierSlug: "globalist",
        nightsYTD: 18,
        channelSlugs: JSON.stringify(["stars"]),
      },
    ],
  });
  console.log("  Loyalty statuses: 2");

  console.log(`  Demo user: demo@hc.com / demo123`);
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());