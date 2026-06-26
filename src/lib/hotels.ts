import { prisma } from "@/lib/prisma";
import { enrichHotelFromWeb, parseGalleryImages } from "@/lib/hotel-enrichment";
import { resolveHotelCoverImage } from "@/lib/hotel-cover-image";
import { hotelDisplayImageUrl, hotelGalleryDisplayUrls } from "@/lib/hotel-display-image";
import { resolveHotelPrices } from "@/lib/hotel-pricing";
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
    country: hotel.country,
    countryCode: hotel.countryCode,
  });
  if (!websiteUrl) return hotel;

  const enriched = await enrichHotelFromWeb({
    slug: hotel.slug,
    brandSlug: hotel.brand.slug,
    name: hotel.name,
    nameZh: hotel.nameZh,
    city: hotel.city,
    cityZh: hotel.cityZh,
    country: hotel.country,
    countryCode: hotel.countryCode,
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

  const gallery =
    enriched.galleryImages.length > 0
      ? enriched.galleryImages
      : parseGalleryImages(hotel.galleryImages);
  const cover = resolveHotelCoverImage(enriched.heroImage ?? hotel.heroImage, gallery);

  const pricePatch =
    enriched.avgBasePrice != null && enriched.priceSource === "scraped"
      ? resolveHotelPrices({
          slug: hotel.slug,
          brandSlug: hotel.brand.slug,
          region: hotel.region,
          countryCode: hotel.countryCode,
          cityZh: hotel.cityZh,
          scrapedBasePrice: enriched.avgBasePrice,
          scrapedSuitePrice: enriched.avgSuitePrice,
          priceSource: "scraped",
        })
      : null;

  return prisma.hotel.update({
    where: { id: hotel.id },
    data: {
      websiteUrl: enriched.websiteUrl,
      description: enriched.description ?? hotel.description,
      descriptionZh: enriched.descriptionZh ?? hotel.descriptionZh,
      heroImage: cover ?? undefined,
      galleryImages: JSON.stringify(gallery),
      enrichedAt: new Date(),
      ...(pricePatch?.fromOfficial
        ? {
            avgBasePrice: pricePatch.avgBasePrice,
            avgSuitePrice: pricePatch.avgSuitePrice,
            priceCurrency: pricePatch.priceCurrency,
          }
        : {}),
    },
    include: hotelInclude,
  });
}

/** Serialize hotel for list cards with resolved cover image */
export function serializeHotelForList<T extends {
  slug: string;
  heroImage: string | null;
  galleryImages: string;
}>(hotel: T) {
  const gallery = parseGalleryImages(hotel.galleryImages);
  const cover = resolveHotelCoverImage(hotel.heroImage, gallery);
  return {
    ...hotel,
    heroImage: hotelDisplayImageUrl(hotel.slug, cover),
    galleryImages: hotelGalleryDisplayUrls(hotel.slug, gallery),
  };
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