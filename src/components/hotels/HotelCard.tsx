"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { formatHotelPrice, getSuiteLabel } from "@/lib/hotel-pricing";
import { formatTravelerScore } from "@/lib/hotel-ratings";
import { HotelDistanceBadge } from "./HotelDistanceBadge";
import { HotelTravelPlanner } from "./HotelTravelPlanner";
import { hotelDisplayImageUrl } from "@/lib/hotel-display-image";

type HotelCardProps = {
  hotel: {
    id: string;
    slug: string;
    name: string;
    nameZh: string | null;
    city: string;
    cityZh: string;
    country: string;
    countryCode: string;
    region: string;
    latitude: number;
    longitude: number;
    heroImage: string | null;
    avgBasePrice: number | null;
    avgSuitePrice: number | null;
    travelerScore: number | null;
    travelerRatingCount: number | null;
    brand: {
      nameZh: string;
      slug: string;
      group: { nameZh: string; logoColor: string };
    };
  };
};

export function HotelCard({ hotel: h }: HotelCardProps) {
  const [plannerOpen, setPlannerOpen] = useState(false);
  const suiteLabel = getSuiteLabel({ region: h.region, countryCode: h.countryCode });
  const coverImage = hotelDisplayImageUrl(h.slug, h.heroImage);

  return (
    <>
      <Link
        href={`/hotels/${h.slug}`}
        className="group hc-card block overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f0eb]">
          {coverImage ? (
            <img
              src={coverImage}
              alt={h.nameZh || h.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#faf6f0] via-[#f5efe6] to-[#ebe3d6]"
              style={{ borderBottom: `3px solid ${h.brand.group.logoColor}` }}
            >
              <BrandLogo
                brandSlug={h.brand.slug}
                brandNameZh={h.brand.nameZh}
                groupColor={h.brand.group.logoColor}
                size="lg"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

          <div className="absolute top-3 left-3">
            <div className="rounded-xl bg-white/95 p-1.5 shadow-md backdrop-blur-sm">
              <BrandLogo
                brandSlug={h.brand.slug}
                brandNameZh={h.brand.nameZh}
                groupColor={h.brand.group.logoColor}
                size="sm"
              />
            </div>
          </div>

          {h.travelerScore != null && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 shadow-md backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-[#b8956b] text-[#b8956b]" />
              <span className="text-sm font-semibold text-[#1a1a1a]">
                {formatTravelerScore(h.travelerScore)}
              </span>
            </div>
          )}

          <div className="absolute right-3 bottom-3 left-3">
            <p className="text-[10px] font-medium tracking-wider text-white/80 uppercase">
              {h.brand.nameZh}
            </p>
            <h3 className="mt-0.5 font-serif text-lg leading-snug font-medium text-white drop-shadow-sm">
              {h.nameZh || h.name}
            </h3>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-[#6b7280]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#b8956b]" />
              <span>
                {h.cityZh || h.city} · {h.country}
              </span>
            </div>
            <HotelDistanceBadge
              latitude={h.latitude}
              longitude={h.longitude}
              onClick={() => setPlannerOpen(true)}
              compact
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#f3f0eb] pt-3">
            {h.avgBasePrice != null ? (
              <div>
                <p className="text-[10px] text-[#9ca3af]">官网起价</p>
                <p className="text-sm font-semibold text-[#b8956b]">
                  {formatHotelPrice(h.avgBasePrice)}
                  <span className="ml-0.5 text-[10px] font-normal text-[#9ca3af]">/晚</span>
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-[#9ca3af]">官网价格待同步</p>
            )}
            {h.avgSuitePrice != null && (
              <div className="text-right">
                <p className="text-[10px] text-[#9ca3af]">{suiteLabel}</p>
                <p className="text-sm font-medium text-[#374151]">
                  {formatHotelPrice(h.avgSuitePrice)}
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>

      <HotelTravelPlanner
        open={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        hotel={{
          nameZh: h.nameZh,
          name: h.name,
          cityZh: h.cityZh,
          countryCode: h.countryCode,
          latitude: h.latitude,
          longitude: h.longitude,
        }}
      />
    </>
  );
}