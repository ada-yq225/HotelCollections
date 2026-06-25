import { prisma } from "./prisma";

type StayWithHotel = {
  nights: number;
  hotel: {
    brandId: string;
    region: string;
    brand: { slug: string; groupId: string; group: { slug: string } };
  };
};

export async function evaluateAndAwardBadges(userId: string) {
  const stays = await prisma.stay.findMany({
    where: { userId },
    include: {
      hotel: {
        include: { brand: { include: { group: true } } },
      },
    },
  });

  const totalNights = stays.reduce((sum, s) => sum + s.nights, 0);
  const uniqueBrands = new Set(stays.map((s) => s.hotel.brandId));
  const uniqueBrandCount = uniqueBrands.size;
  const regions = new Set(stays.map((s) => s.hotel.region));
  const groupCounts = countByGroup(stays);

  const badges = await prisma.badge.findMany();
  const earned = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  const earnedSet = new Set(earned.map((e) => e.badgeId));

  const toAward: string[] = [];

  for (const badge of badges) {
    if (earnedSet.has(badge.id)) continue;

    let qualifies = false;
    switch (badge.category) {
      case "nights":
        qualifies = totalNights >= badge.threshold;
        break;
      case "brands":
        qualifies = uniqueBrandCount >= badge.threshold;
        break;
      case "groups":
        qualifies = (groupCounts[badge.slug.replace("group-", "")] ?? 0) >= badge.threshold;
        break;
      case "regions":
        if (badge.slug === "region-global") {
          qualifies = regions.size >= 4;
        } else {
          const regionKey = badge.slug.replace("region-", "");
          qualifies = regions.has(regionKey);
        }
        break;
      case "special":
        qualifies = checkSpecialBadge(badge.slug, stays);
        break;
    }

    if (qualifies) toAward.push(badge.id);
  }

  if (toAward.length > 0) {
    await prisma.userBadge.createMany({
      data: toAward.map((badgeId) => ({ userId, badgeId })),
    });
  }

  return toAward.length;
}

function countByGroup(stays: StayWithHotel[]): Record<string, number> {
  const counts: Record<string, number> = {};
  const seen = new Map<string, Set<string>>();

  for (const stay of stays) {
    const groupSlug = stay.hotel.brand.group.slug;
    if (!seen.has(groupSlug)) seen.set(groupSlug, new Set());
    seen.get(groupSlug)!.add(stay.hotel.brandId);
  }

  for (const [group, brandSet] of seen) {
    counts[group] = brandSet.size;
  }
  return counts;
}

function checkSpecialBadge(slug: string, stays: StayWithHotel[]): boolean {
  const brandSlugs = new Set(stays.map((s) => s.hotel.brand.slug));
  switch (slug) {
    case "ritz-lover":
      return brandSlugs.has("ritz-carlton") || brandSlugs.has("ritz-carlton-reserve");
    case "aman-devotee":
      return brandSlugs.has("aman");
    case "fs-connoisseur":
      return brandSlugs.has("four-seasons");
    case "mo-connoisseur":
      return brandSlugs.has("mandarin-oriental");
    default:
      return false;
  }
}

export async function getUserStats(userId: string) {
  const stays = await prisma.stay.findMany({
    where: { userId },
    include: {
      hotel: {
        include: {
          brand: { include: { group: true } },
        },
      },
    },
  });

  const totalNights = stays.reduce((sum, s) => sum + s.nights, 0);
  const uniqueHotels = new Set(stays.map((s) => s.hotelId)).size;
  const uniqueBrands = new Set(stays.map((s) => s.hotel.brandId)).size;
  const uniqueCities = new Set(stays.map((s) => `${s.hotel.city}-${s.hotel.countryCode}`)).size;
  const uniqueCountries = new Set(stays.map((s) => s.hotel.countryCode)).size;

  const groupStats: Record<string, { hotels: number; nights: number; cities: string[] }> = {};
  for (const stay of stays) {
    const groupSlug = stay.hotel.brand.group.slug;
    if (!groupStats[groupSlug]) {
      groupStats[groupSlug] = { hotels: 0, nights: 0, cities: [] };
    }
    groupStats[groupSlug].nights += stay.nights;
  }

  const groupHotelSets: Record<string, Set<string>> = {};
  const groupCitySets: Record<string, Set<string>> = {};
  for (const stay of stays) {
    const g = stay.hotel.brand.group.slug;
    if (!groupHotelSets[g]) groupHotelSets[g] = new Set();
    if (!groupCitySets[g]) groupCitySets[g] = new Set();
    groupHotelSets[g].add(stay.hotelId);
    groupCitySets[g].add(stay.hotel.cityZh || stay.hotel.city);
  }

  for (const g of Object.keys(groupStats)) {
    groupStats[g].hotels = groupHotelSets[g]?.size ?? 0;
    groupStats[g].cities = [...(groupCitySets[g] ?? [])];
  }

  return {
    totalStays: stays.length,
    totalNights,
    uniqueHotels,
    uniqueBrands,
    uniqueCities,
    uniqueCountries,
    groupStats,
    stays,
  };
}