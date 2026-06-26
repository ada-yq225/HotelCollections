import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import { getHotelBySlug, ensureHotelEnriched } from "@/lib/hotels";
import { prisma } from "@/lib/prisma";
import { HotelTravelerRating } from "@/components/hotels/HotelTravelerRating";

import { parseGalleryImages } from "@/lib/hotel-enrichment";
import { isGroupTopicSlug } from "@/data/loyalty/group-guides";
import { HotelProfile } from "@/components/hotels/HotelProfile";
import { getSuiteLabel } from "@/lib/hotel-pricing";
import { BrandLogo } from "@/components/hotels/BrandLogo";
import { ShareButton } from "@/components/hotels/ShareButton";
import { WishlistHeartButton } from "@/components/hotels/WishlistHeartButton";
import {
  HotelDetailTravel,
  HotelDetailActions,
} from "@/components/hotels/HotelDetailTravel";
import { HotelBenefitsSection } from "@/components/loyalty/HotelBenefitsSection";
import { HotelCredibilityBadges } from "@/components/hotels/HotelCredibilityBadges";
import { ExperienceTags } from "@/components/hotels/ExperienceTags";
import { PriceCredibilityPanel } from "@/components/hotels/PriceCredibilityPanel";
import { HotelPriceComparison } from "@/components/hotels/HotelPriceComparison";
import { SimilarHotels } from "@/components/hotels/SimilarHotels";
import { SeasonVisaPanel } from "@/components/hotels/SeasonVisaPanel";
import { inferExperienceTags } from "@/lib/hotel-experience-tags";
import { getHotelCredibilityBadges } from "@/lib/hotel-credibility";
import { getSimilarHotels } from "@/lib/similar-hotels";
import { HOTEL_ENRICHMENT } from "@/data/hotel-enrichment";
import { resolveHotelPrices } from "@/lib/hotel-pricing";
import { FlightHotelNarrative } from "@/components/hotels/FlightHotelNarrative";
import { HotelBenefitPolicy } from "@/components/loyalty/HotelBenefitPolicy";
import { HotelPriceAlertButton } from "@/components/hotels/HotelPriceAlertButton";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = await getHotelBySlug(slug);
  if (!raw || !raw.isActive) notFound();

  const [hotel, communityReviews, verifiedStayCount, similarHotels] = await Promise.all([
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
    prisma.stay.count({ where: { hotelId: raw.id, status: "verified" } }),
    getSimilarHotels(raw),
  ]);

  const enrichment = HOTEL_ENRICHMENT[hotel.slug];
  const prices = resolveHotelPrices({
    slug: hotel.slug,
    brandSlug: hotel.brand.slug,
    region: hotel.region,
    countryCode: hotel.countryCode,
    cityZh: hotel.cityZh,
    avgBasePrice: hotel.avgBasePrice ?? undefined,
    avgSuitePrice: hotel.avgSuitePrice ?? undefined,
    scrapedBasePrice: enrichment?.avgBasePrice,
    scrapedSuitePrice: enrichment?.avgSuitePrice,
    priceSource: enrichment?.priceSource,
  });
  const experienceTags = inferExperienceTags({
    region: hotel.region,
    countryCode: hotel.countryCode,
    brandSlug: hotel.brand.slug,
    city: hotel.city,
    cityZh: hotel.cityZh,
  });
  const credibilityBadges = getHotelCredibilityBadges({
    slug: hotel.slug,
    openedYear: hotel.openedYear,
    enrichedAt: hotel.enrichedAt,
    heroImage: hotel.heroImage,
    description: hotel.description,
    avgBasePrice: prices.avgBasePrice ?? hotel.avgBasePrice,
    travelerRatingCount: hotel.travelerRatingCount,
    staysVerified: verifiedStayCount,
  });
  const galleryImages = parseGalleryImages(hotel.galleryImages);

  const groupSlug = hotel.brand.group.slug;
  const hasGroupTopic = isGroupTopicSlug(groupSlug);

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
              {hasGroupTopic ? (
                <Link
                  href={`/groups/${groupSlug}`}
                  className="text-xs font-medium tracking-wide text-[#b8956b] hover:underline uppercase"
                >
                  {hotel.brand.group.nameZh} · 会籍对照 →
                </Link>
              ) : (
                <p className="text-xs font-medium tracking-wide text-[#9ca3af] uppercase">
                  {hotel.brand.group.nameZh}
                </p>
              )}
              <p className="mt-0.5 text-sm font-medium text-[#374151]">{hotel.brand.nameZh}</p>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
                {hotel.nameZh || hotel.name}
              </h1>
              {hotel.nameZh && (
                <p className="mt-2 text-[#6b7280]">{hotel.name}</p>
              )}
            </div>
            <ShareButton
              hotelName={hotel.name}
              hotelNameZh={hotel.nameZh}
              hotelCity={hotel.cityZh || hotel.city}
              hotelSlug={hotel.slug}
              className="shrink-0"
            />
            <WishlistHeartButton hotelId={hotel.id} hotelSlug={hotel.slug} size="lg" />
          </div>

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
                region: hotel.region,
                latitude: hotel.latitude,
                longitude: hotel.longitude,
              }}
            />
          </div>

          <div className="mt-4 space-y-3">
            <HotelCredibilityBadges badges={credibilityBadges} />
            <ExperienceTags tags={experienceTags} />
          </div>
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
          <HotelProfile
            slug={hotel.slug}
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
            brandSlug={hotel.brand.slug}
            cityZh={hotel.cityZh || hotel.city}
            communityReviews={communityReviews}
          />

          <section className="mt-10">
            <HotelBenefitPolicy
              brandSlug={hotel.brand.slug}
              groupSlug={hotel.brand.group.slug}
              brandNameZh={hotel.brand.nameZh}
            />
          </section>

          <section className="mt-10">
            <FlightHotelNarrative
              region={hotel.region}
              hotelName={hotel.nameZh || hotel.name}
              cityZh={hotel.cityZh || hotel.city}
            />
          </section>

          <section className="mt-10">
            <h2 className="mb-4 font-serif text-xl font-semibold">季节与签证</h2>
            <SeasonVisaPanel
              region={hotel.region}
              countryCode={hotel.countryCode}
              country={hotel.country}
            />
          </section>

          <section className="mt-10">
            <SimilarHotels hotels={similarHotels} />
          </section>
          </div>

          <aside className="space-y-6 lg:col-span-2">
            <HotelBenefitsSection
              hotelId={hotel.id}
              hotelName={hotel.nameZh || hotel.name}
              groupSlug={hotel.brand.group.slug}
              groupNameZh={hotel.brand.group.nameZh}
              brandSlug={hotel.brand.slug}
              region={hotel.region}
              countryCode={hotel.countryCode}
            />
            <PriceCredibilityPanel
              slug={hotel.slug}
              avgBasePrice={prices.avgBasePrice ?? hotel.avgBasePrice}
              enrichedAt={hotel.enrichedAt}
            />
            <HotelPriceComparison
              slug={hotel.slug}
              brandSlug={hotel.brand.slug}
              cityZh={hotel.cityZh || hotel.city}
              avgBasePrice={prices.avgBasePrice ?? hotel.avgBasePrice}
              avgSuitePrice={prices.avgSuitePrice ?? hotel.avgSuitePrice}
            />
            <HotelPriceAlertButton
              hotelSlug={hotel.slug}
              hotelName={hotel.nameZh || hotel.name}
              currentPrice={prices.avgBasePrice ?? hotel.avgBasePrice}
            />
          </aside>
        </div>

        <div className="border-t border-[#e8e8e8] px-8 py-6">
          <HotelDetailActions
            hotelId={hotel.id}
            hotel={{
              nameZh: hotel.nameZh,
              name: hotel.name,
              cityZh: hotel.cityZh,
              countryCode: hotel.countryCode,
              region: hotel.region,
              latitude: hotel.latitude,
              longitude: hotel.longitude,
            }}
          />
        </div>
      </div>
    </div>
  );
}