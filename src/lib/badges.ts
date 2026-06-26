import { prisma } from "./prisma";

type StayWithHotel = {
  nights: number;
  roomType?: string | null;
  hotelId: string;
  hotel: {
    brandId: string;
    city: string;
    cityZh: string;
    countryCode: string;
    region: string;
    brand: { slug: string; groupId: string; group: { slug: string } };
  };
};

const ISLAND_REGIONS = new Set([
  "maldives",
  "caribbean",
  "fiji",
  "tahiti",
  "indian-ocean",
  "southeast-asia-island",
  "hawaii",
  "mexico-resort",
]);

const ALPINE_REGIONS = new Set(["alps", "rockies"]);

const MIDDLE_EAST = new Set(["AE", "QA", "SA", "BH", "OM", "KW"]);

const GREATER_CHINA = new Set(["CN", "HK", "MO", "TW"]);

export async function evaluateAndAwardBadges(userId: string) {
  const stays = await prisma.stay.findMany({
    where: { userId },
    include: {
      hotel: {
        include: { brand: { include: { group: true } } },
      },
    },
  });

  const keycardCount = await prisma.keycard.count({ where: { userId } });
  const reviewCount = await prisma.post.count({ where: { userId } });

  const totalNights = stays.reduce((sum, s) => sum + s.nights, 0);
  const uniqueBrands = new Set(stays.map((s) => s.hotel.brandId));
  const uniqueBrandCount = uniqueBrands.size;
  const uniqueHotels = new Set(stays.map((s) => s.hotelId)).size;
  const uniqueCities = new Set(stays.map((s) => `${s.hotel.city}-${s.hotel.countryCode}`)).size;
  const uniqueCountries = new Set(stays.map((s) => s.hotel.countryCode)).size;
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
      case "milestones":
        qualifies = checkMilestoneBadge(badge.slug, {
          uniqueHotels,
          uniqueCities,
          uniqueCountries,
        });
        break;
      case "groups":
        qualifies = checkGroupBadge(badge.slug, stays, groupCounts);
        break;
      case "regions":
        qualifies = checkRegionBadge(badge.slug, stays);
        break;
      case "special":
        qualifies = checkSpecialBadge(badge.slug, stays, {
          totalNights,
          keycardCount,
          reviewCount,
        });
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

function checkMilestoneBadge(
  slug: string,
  stats: { uniqueHotels: number; uniqueCities: number; uniqueCountries: number }
): boolean {
  const n = parseInt(slug.split("-").pop() ?? "0", 10);
  if (slug.startsWith("hotels-")) return stats.uniqueHotels >= n;
  if (slug.startsWith("cities-")) return stats.uniqueCities >= n;
  if (slug.startsWith("countries-")) return stats.uniqueCountries >= n;
  return false;
}

function checkGroupBadge(
  slug: string,
  stays: StayWithHotel[],
  groupCounts: Record<string, number>
): boolean {
  const group = slug.replace("group-", "");
  if (group === "four-seasons") {
    return countUniqueHotelsByBrand(stays, "four-seasons") >= 3;
  }
  if (group === "mandarin-oriental") {
    return countUniqueHotelsByBrand(stays, "mandarin-oriental") >= 3;
  }
  return (groupCounts[group] ?? 0) >= badgeThresholdForGroup(slug);
}

function badgeThresholdForGroup(slug: string): number {
  const map: Record<string, number> = {
    "group-marriott": 3,
    "group-hyatt": 2,
    "group-independent": 5,
    "group-ihg": 3,
    "group-hilton": 2,
    "group-accor": 3,
  };
  return map[slug] ?? 2;
}

function checkRegionBadge(slug: string, stays: StayWithHotel[]): boolean {
  switch (slug) {
    case "region-global": {
      const macros = new Set(stays.map((s) => macroRegion(s.hotel.countryCode, s.hotel.region)));
      return macros.size >= 4;
    }
    case "region-asia-pacific":
      return countCountriesIn(stays, (cc) =>
        ["CN", "HK", "MO", "TW", "JP", "KR", "SG", "TH", "MY", "ID", "VN", "PH", "AU", "NZ"].includes(cc)
      ) >= 3;
    case "region-europe":
      return countCountriesIn(stays, (cc) =>
        ["GB", "FR", "DE", "IT", "ES", "CH", "AT", "NL", "PT", "GR", "CZ", "MC"].includes(cc)
      ) >= 3;
    case "region-americas":
      return countCountriesIn(stays, (cc) =>
        ["US", "CA", "MX", "BR", "AR", "CL", "PE", "CO"].includes(cc)
      ) >= 3;
    case "region-maldives":
      return countUniqueHotelsInRegion(stays, "maldives") >= 3;
    case "region-safari":
      return countUniqueHotelsInRegion(stays, "safari") >= 2;
    case "region-japan":
      return countUniqueCitiesInCountry(stays, "JP") >= 3;
    case "region-middle-east":
      return stays.some((s) => MIDDLE_EAST.has(s.hotel.countryCode));
    case "region-china":
      return countUniqueCitiesInCountries(stays, GREATER_CHINA) >= 5;
    default:
      return stays.some((s) => s.hotel.region === slug.replace("region-", ""));
  }
}

function macroRegion(countryCode: string, region: string): string {
  if (GREATER_CHINA.has(countryCode) || ["JP", "KR", "SG", "TH", "MY", "ID", "VN", "PH", "AU", "NZ"].includes(countryCode)) {
    return "asia-pacific";
  }
  if (["US", "CA", "MX", "BR", "AR", "CL"].includes(countryCode)) return "americas";
  if (["GB", "FR", "DE", "IT", "ES", "CH", "AT", "NL", "PT", "GR"].includes(countryCode)) return "europe";
  if (region === "safari" || ["ZA", "KE", "TZ", "BW", "NA"].includes(countryCode)) return "africa";
  return region;
}

function checkSpecialBadge(
  slug: string,
  stays: StayWithHotel[],
  extra: { totalNights: number; keycardCount: number; reviewCount: number }
): boolean {
  const brandHotels = (brand: string) => countUniqueHotelsByBrand(stays, brand);
  const brandSet = new Set(stays.map((s) => s.hotel.brand.slug));

  switch (slug) {
    case "ritz-carlton-fan":
      return brandHotels("ritz-carlton") + brandHotels("ritz-carlton-reserve") >= 5;
    case "aman-junkie":
      return brandHotels("aman") >= 3;
    case "four-seasons-elite":
      return brandHotels("four-seasons") >= 5;
    case "mandarin-oriental-devotee":
      return brandHotels("mandarin-oriental") >= 5;
    case "peninsula-royal":
      return brandHotels("peninsula") >= 3;
    case "rosewood-collector":
      return brandHotels("rosewood") >= 4;
    case "park-hyatt-zen":
      return brandHotels("park-hyatt") >= 3;
    case "st-regis-butler":
      return brandHotels("st-regis") >= 3;
    case "waldorf-aristocrat":
      return brandHotels("waldorf-astoria") >= 3;
    case "shangri-la-sage":
      return brandHotels("shangri-la") >= 5;
    case "capella-curator":
      return brandHotels("capella") >= 2;
    case "six-senses-harmony":
      return brandHotels("six-senses") >= 2;
    case "banyan-tree-serenity":
      return brandHotels("banyan-tree") >= 3;
    case "belmond-voyager":
      return brandHotels("belmond") >= 2;
    case "cheval-blanc-elite":
      return brandSet.has("cheval-blanc");
    case "soneva-dreamer":
      return brandSet.has("soneva");
    case "w-hotel-vibe":
      return brandHotels("w-hotels") >= 3;
    case "edition-minimalist":
      return brandHotels("edition") >= 2;
    case "ritz-reserve-pilgrim":
      return brandSet.has("ritz-carlton-reserve");
    case "maldives-hopper":
      return countUniqueHotelsInRegion(stays, "maldives") >= 5;
    case "long-stay-7":
      return stays.some((s) => s.nights >= 7);
    case "long-stay-14":
      return stays.some((s) => s.nights >= 14);
    case "suite-life":
      return stays.filter((s) => /suite|villa|pool|penthouse|总统|套房|别墅/i.test(s.roomType ?? "")).length >= 5;
    case "island-escapist":
      return countUniqueHotelsWhere(stays, (s) => ISLAND_REGIONS.has(s.hotel.region)) >= 5;
    case "alpine-chaser":
      return countUniqueHotelsWhere(stays, (s) => ALPINE_REGIONS.has(s.hotel.region)) >= 2;
    case "keycard-hunter":
      return extra.keycardCount >= 10;
    case "review-maestro":
      return extra.reviewCount >= 5;
    case "ultra-luxury-trio":
      return brandSet.has("aman") && brandSet.has("cheval-blanc") && brandSet.has("rosewood");
    case "night-owl":
      return extra.totalNights >= 30;
    case "grand-slam": {
      const groups = new Set(stays.map((s) => s.hotel.brand.group.slug));
      return groups.size >= 9;
    }
    default:
      return false;
  }
}

function countUniqueHotelsByBrand(stays: StayWithHotel[], brandSlug: string): number {
  return new Set(stays.filter((s) => s.hotel.brand.slug === brandSlug).map((s) => s.hotelId)).size;
}

function countUniqueHotelsInRegion(stays: StayWithHotel[], region: string): number {
  return new Set(stays.filter((s) => s.hotel.region === region).map((s) => s.hotelId)).size;
}

function countUniqueHotelsWhere(stays: StayWithHotel[], pred: (s: StayWithHotel) => boolean): number {
  return new Set(stays.filter(pred).map((s) => s.hotelId)).size;
}

function countUniqueCitiesInCountry(stays: StayWithHotel[], countryCode: string): number {
  return new Set(
    stays.filter((s) => s.hotel.countryCode === countryCode).map((s) => s.hotel.city)
  ).size;
}

function countUniqueCitiesInCountries(stays: StayWithHotel[], codes: Set<string>): number {
  return new Set(
    stays.filter((s) => codes.has(s.hotel.countryCode)).map((s) => `${s.hotel.city}-${s.hotel.countryCode}`)
  ).size;
}

function countCountriesIn(stays: StayWithHotel[], pred: (cc: string) => boolean): number {
  return new Set(stays.filter((s) => pred(s.hotel.countryCode)).map((s) => s.hotel.countryCode)).size;
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