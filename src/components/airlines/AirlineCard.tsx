import Link from "next/link";
import { Star, MapPin, Users } from "lucide-react";
import { getAirline } from "@/data/airlines";
import type { AirlineEnrichment } from "@/data/airline-enrichment";
import { AllianceLogo } from "./AllianceLogo";
import { AirlineLogo } from "./AirlineLogo";

type AirlineCardProps = {
  enrichment: AirlineEnrichment;
};

export function AirlineCard({ enrichment }: AirlineCardProps) {
  const airline = getAirline(enrichment.iata);
  const hasSkytraxRank = enrichment.skytraxRank2024 != null;
  const isTop10 = hasSkytraxRank && (enrichment.skytraxRank2024 ?? 99) <= 10;

  return (
    <Link
      href={`/airlines/${enrichment.iata}`}
      className="group hc-card block overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Header area with logo and alliance */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#faf6f0] via-[#f5efe6] to-[#ebe3d6] p-5">
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full opacity-[0.06] bg-[#1a1a1a]" />

        <div className="relative flex items-start justify-between">
          {/* Airline logo */}
          <div className="flex items-center gap-3">
            <AirlineLogo iata={airline.iata} nameZh={airline.nameZh} size="lg" />
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a]">{airline.nameZh}</p>
              <p className="text-[10px] text-[#9ca3af] uppercase">{enrichment.iata} · {airline.name}</p>
            </div>
          </div>

          {/* Alliance badge */}
          {airline.alliance && (
            <AllianceLogo alliance={airline.alliance} size="sm" />
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6b7280]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0 text-[#b8956b]" />
            {enrichment.hub}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 shrink-0 text-[#b8956b]" />
            {enrichment.foundedYear} 年成立
          </span>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 text-xs">
          <div>
            <span className="font-semibold text-[#1a1a1a]">{enrichment.fleetSize}</span>
            <span className="text-[#9ca3af]"> 架飞机</span>
          </div>
          <div>
            <span className="font-semibold text-[#1a1a1a]">{enrichment.destinations}+</span>
            <span className="text-[#9ca3af]"> 目的地</span>
          </div>
          {hasSkytraxRank && (
            <div>
              <span className="inline-flex items-center gap-0.5 font-semibold text-[#b8956b]">
                <Star className="h-3 w-3 fill-[#b8956b]" />
                {enrichment.skytraxRating}
              </span>
              <span className="text-[#9ca3af]"> Skytrax</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-[#6b7280]">
          {enrichment.descriptionZh}
        </p>

        {/* Awards */}
        {enrichment.awards.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {enrichment.awards.slice(0, 3).map((award) => (
              <span
                key={award}
                className="rounded-full bg-[#faf6f0] px-2 py-0.5 text-[10px] text-[#b8956b]"
              >
                {award}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
