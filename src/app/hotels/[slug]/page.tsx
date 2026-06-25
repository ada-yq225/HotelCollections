import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import { getHotelBySlug, ensureHotelEnriched } from "@/lib/hotels";
import { prisma } from "@/lib/prisma";
import { HotelTravelerRating } from "@/components/hotels/HotelTravelerRating";

import { parseGalleryImages } from "@/lib/hotel-enrichment";
import { SIGNATURE_GROUPS } from "@/data/destinations";
import { HotelProfile } from "@/components/hotels/HotelProfile";
import { getSuiteLabel } from "@/lib/hotel-pricing";
import { BrandLogo } from "@/components/hotels/BrandLogo";
import {
  HotelDetailTravel,
  HotelDetailActions,
} from "@/components/hotels/HotelDetailTravel";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = await getHotelBySlug(slug);
  if (!raw || !raw.isActive) notFound();

  const [hotel, communityReviews] = await Promise.all([
    ensureHotelEnriched(raw),
    prisma.post.findMany({
      where: { hotelId: raw.id, isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        loungeDining: true,
        amenities: true,
        service: true,
        user: { select: { name: true, isPlus: true } },
      },
    }),
  ]);
  const galleryImages = parseGalleryImages(hotel.galleryImages);

  const groupSlug = hotel.brand.group.slug;
  const isSignature = SIGNATURE_GROUPS.includes(
    groupSlug as (typeof SIGNATURE_GROUPS)[number]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/hotels"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#b8956b]"
      >
        <ArrowLeft className="h-4 w-4" />
        返回酒店库
      </Link>

      <div className="hc-card overflow-hidden">
        <div className="p-8 pb-0">
          <div className="mb-5 flex items-start gap-4">
            <BrandLogo
              brandSlug={hotel.brand.slug}
              brandNameZh={hotel.brand.nameZh}
              groupColor={hotel.brand.group.logoColor ?? "#b8956b"}
              size="md"
            />
            <div className="min-w-0 flex-1">
              {isSignature ? (
                <Link
                  href={`/groups/${groupSlug}`}
                  className="text-xs font-medium tracking-wide text-[#b8956b] hover:underline uppercase"
                >
                  {hotel.brand.group.nameZh}
                </Link>
              ) : (
                <p className="text-xs font-medium tracking-wide text-[#9ca3af] uppercase">
                  {hotel.brand.group.nameZh}
                </p>
              )}
              <p className="mt-0.5 text-sm font-medium text-[#374151]">{hotel.brand.nameZh}</p>
            </div>
          </div>

          <h1 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
            {hotel.nameZh || hotel.name}
          </h1>
          {hotel.nameZh && (
            <p className="mt-2 text-[#6b7280]">{hotel.name}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#6b7280]">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#b8956b]" />
              {hotel.cityZh || hotel.city} · {hotel.country}
            </span>
            {hotel.openedYear && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#b8956b]" />
                {hotel.openedYear} 年开业
              </span>
            )}
            {hotel.travelerScore != null && hotel.travelerRatingCount != null && (
              <HotelTravelerRating
                travelerScore={hotel.travelerScore}
                travelerRatingCount={hotel.travelerRatingCount}
                scoreLocation={hotel.scoreLocation ?? 0}
                scoreDesign={hotel.scoreDesign ?? 0}
                scoreService={hotel.scoreService ?? 0}
                scoreDining={hotel.scoreDining ?? 0}
                scoreHardware={hotel.scoreHardware ?? 0}
                compact
              />
            )}
            <HotelDetailTravel
              hotel={{
                nameZh: hotel.nameZh,
                name: hotel.name,
                cityZh: hotel.cityZh,
                countryCode: hotel.countryCode,
                latitude: hotel.latitude,
                longitude: hotel.longitude,
              }}
            />
          </div>
        </div>

        <div className="p-8">
          <HotelProfile
            nameZh={hotel.nameZh || hotel.name}
            name={hotel.name}
            descriptionZh={hotel.descriptionZh}
            description={hotel.description}
            notes={hotel.notes}
            heroImage={hotel.heroImage}
            galleryImages={galleryImages}
            websiteUrl={hotel.websiteUrl}
            avgBasePrice={hotel.avgBasePrice}
            avgSuitePrice={hotel.avgSuitePrice}
            suiteLabel={getSuiteLabel(hotel)}
            travelerScore={hotel.travelerScore}
            travelerRatingCount={hotel.travelerRatingCount}
            travelerReviewSummary={hotel.travelerReviewSummary}
            scoreLocation={hotel.scoreLocation}
            scoreDesign={hotel.scoreDesign}
            scoreService={hotel.scoreService}
            scoreDining={hotel.scoreDining}
            scoreHardware={hotel.scoreHardware}
            hotelId={hotel.id}
            communityReviews={communityReviews}
          />
        </div>

        <div className="border-t border-[#e8e8e8] px-8 py-6">
          <HotelDetailActions
            hotelId={hotel.id}
            hotel={{
              nameZh: hotel.nameZh,
              name: hotel.name,
              cityZh: hotel.cityZh,
              countryCode: hotel.countryCode,
              latitude: hotel.latitude,
              longitude: hotel.longitude,
            }}
          />
        </div>
      </div>
    </div>
  );
}