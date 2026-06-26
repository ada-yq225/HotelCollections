import { prisma } from "@/lib/prisma";
import { hotelInclude, serializeHotelForList } from "@/lib/hotels";

export async function getSimilarHotels(
  hotel: {
    id: string;
    slug: string;
    brandId: string;
    region: string;
    countryCode: string;
    avgBasePrice: number | null;
    brand: { slug: string; group: { slug: string } };
  },
  limit = 4
) {
  const priceMin = hotel.avgBasePrice ? hotel.avgBasePrice * 0.6 : undefined;
  const priceMax = hotel.avgBasePrice ? hotel.avgBasePrice * 1.5 : undefined;

  const candidates = await prisma.hotel.findMany({
    where: {
      isActive: true,
      id: { not: hotel.id },
      OR: [
        { brandId: hotel.brandId },
        { region: hotel.region, brand: { group: { slug: hotel.brand.group.slug } } },
        { countryCode: hotel.countryCode, brand: { group: { slug: hotel.brand.group.slug } } },
      ],
      ...(priceMin != null && priceMax != null
        ? { avgBasePrice: { gte: priceMin, lte: priceMax } }
        : {}),
    },
    include: hotelInclude,
    take: limit * 3,
  });

  const scored = candidates.map((h) => {
    let score = 0;
    if (h.brandId === hotel.brandId) score += 40;
    if (h.region === hotel.region) score += 25;
    if (h.countryCode === hotel.countryCode) score += 15;
    if (h.brand.group.slug === hotel.brand.group.slug) score += 10;
    if (hotel.avgBasePrice && h.avgBasePrice) {
      const ratio = h.avgBasePrice / hotel.avgBasePrice;
      if (ratio >= 0.8 && ratio <= 1.2) score += 20;
      else if (ratio >= 0.6 && ratio <= 1.5) score += 10;
    }
    return { hotel: h, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => serializeHotelForList(s.hotel));
}