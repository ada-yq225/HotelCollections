import { prisma } from "@/lib/prisma";
import { enrichHotelFromWeb, parseGalleryImages } from "@/lib/hotel-enrichment";
import { resolveOfficialUrl } from "@/lib/hotel-official-url";

export const hotelInclude = {
  brand: {
    include: {
      group: true,
      alliances: { include: { alliance: true } },
    },
  },
} as const;

export type HotelWithBrand = NonNullable<Awaited<ReturnType<typeof getHotelBySlug>>>;

export async function getHotelBySlug(slug: string) {
  return prisma.hotel.findUnique({
    where: { slug },
    include: hotelInclude,
  });
}

/** Lazy-fetch official intro & images when not yet cached in DB */
export async function ensureHotelEnriched(hotel: HotelWithBrand): Promise<HotelWithBrand> {
  if (hotel.description && hotel.heroImage) return hotel;
  if (hotel.enrichedAt && hotel.websiteUrl) return hotel;

  const websiteUrl = hotel.websiteUrl ?? resolveOfficialUrl({
    slug: hotel.slug,
    brandSlug: hotel.brand.slug,
    name: hotel.name,
    city: hotel.city,
  });
  if (!websiteUrl) return hotel;

  const enriched = await enrichHotelFromWeb({
    slug: hotel.slug,
    brandSlug: hotel.brand.slug,
    name: hotel.name,
    city: hotel.city,
    websiteUrl,
  });
  if (!enriched) {
    if (!hotel.websiteUrl) {
      return prisma.hotel.update({
        where: { id: hotel.id },
        data: { websiteUrl, enrichedAt: new Date() },
        include: hotelInclude,
      });
    }
    return hotel;
  }

  return prisma.hotel.update({
    where: { id: hotel.id },
    data: {
      websiteUrl: enriched.websiteUrl,
      description: enriched.description ?? hotel.description,
      descriptionZh: enriched.descriptionZh ?? hotel.descriptionZh,
      heroImage: enriched.heroImage ?? hotel.heroImage,
      galleryImages: JSON.stringify(
        enriched.galleryImages.length > 0
          ? enriched.galleryImages
          : parseGalleryImages(hotel.galleryImages)
      ),
      enrichedAt: new Date(),
    },
    include: hotelInclude,
  });
}

export async function getGroupBySlug(slug: string) {
  return prisma.hotelGroup.findUnique({
    where: { slug },
    include: {
      brands: {
        include: {
          _count: { select: { hotels: { where: { isActive: true } } } },
        },
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function getHotelsByGroupSlug(slug: string) {
  return prisma.hotel.findMany({
    where: {
      isActive: true,
      brand: { group: { slug } },
    },
    include: hotelInclude,
    orderBy: [{ country: "asc" }, { city: "asc" }, { name: "asc" }],
  });
}