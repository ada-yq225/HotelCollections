"use client";

import { useState } from "react";
import { Plane, ArrowRight, Clock, Ticket, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { formatDuration } from "@/lib/travel";
import type { FlightOption } from "@/lib/travel";
import type { CabinFareTier } from "@/data/flight-prices";
import { AirlineBadge } from "@/components/flights/AirlineBadge";
import { CabinImage } from "@/components/flights/CabinImage";
import { getAirline } from "@/data/airlines";

function CabinTierRow({ tier }: { tier: CabinFareTier }) {
  const isPremium = tier.cabin === "premium";

  return (
    <div
      className={`rounded-lg border p-3 ${
        isPremium ? "border-[#b8956b]/50 bg-gradient-to-br from-[#faf6f0] to-white" : "border-[#f0f0f0] bg-[#fafafa]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#1a1a1a]">
            {isPremium && tier.productNameZh ? (
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#b8956b]" />
                {tier.productNameZh}
              </span>
            ) : (
              tier.label
            )}
          </p>
          {isPremium && tier.productName && tier.productName !== tier.productNameZh && (
            <p className="text-[10px] text-[#9ca3af]">{tier.productName}</p>
          )}
          {!isPremium && (
            <p className="text-[10px] text-[#9ca3af]">单程市场参考价</p>
          )}
        </div>
        <p className="shrink-0 text-base font-semibold text-[#b8956b]">{tier.priceLabel}</p>
      </div>

      {isPremium && tier.imageUrl && (
        <div className="relative mt-3 aspect-[16/9] overflow-hidden rounded-md bg-[#f0f0f0]">
          <CabinImage
            src={tier.imageUrl}
            alt={tier.productNameZh ?? tier.label}
            fallbackUrls={tier.fallbackImageUrls ?? []}
          />
        </div>
      )}

      {isPremium && tier.descriptionZh && (
        <p className="mt-2 text-xs leading-relaxed text-[#6b7280]">{tier.descriptionZh}</p>
      )}

      {isPremium && tier.airlineIata && (
        <div className="mt-2">
          <AirlineBadge airline={getAirline(tier.airlineIata)} flightNumber="" />
        </div>
      )}
    </div>
  );
}

export function FlightOptionCard({ flight, index }: { flight: FlightOption; index: number }) {
  const [cabinsOpen, setCabinsOpen] = useState(false);
  const isDirect = flight.type === "direct";
  const primaryAirline = flight.legs[0]?.airline;
  const premiumTiers = flight.cabinTiers.filter((t) => t.cabin === "premium");
  const hasPremium = premiumTiers.length > 0;

  return (
    <div
      className={`rounded-xl border p-4 ${
        isDirect
          ? "border-[#b8956b]/40 bg-gradient-to-br from-[#faf6f0] to-white"
          : "border-[#e8e8e8] bg-white"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {isDirect ? (
            <span className="rounded-full bg-[#b8956b] px-2.5 py-0.5 text-[10px] font-medium text-white">
              直飞
            </span>
          ) : (
            <span className="rounded-full bg-[#f0f0f0] px-2.5 py-0.5 text-[10px] font-medium text-[#6b7280]">
              转机 · {flight.hubZh}
            </span>
          )}
          <span className="text-xs text-[#9ca3af]">方案 {index + 1}</span>
          {hasPremium && (
            <span className="rounded-full bg-[#b8956b]/15 px-2 py-0.5 text-[10px] font-medium text-[#b8956b]">
              含特色舱位
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1 text-lg font-semibold text-[#b8956b]">
            <Ticket className="h-4 w-4" />
            {flight.priceLabel}
          </p>
          <p className="text-[10px] text-[#9ca3af]">经济舱</p>
          <p className="text-xs text-[#6b7280]">商务 {flight.businessPriceLabel}</p>
        </div>
      </div>

      {primaryAirline && flight.legs[0] && (
        <div className="mb-3 rounded-lg border border-[#f0f0f0] bg-[#fafafa] px-3 py-2.5">
          <AirlineBadge airline={primaryAirline} flightNumber={flight.legs[0].flightNumber} />
        </div>
      )}

      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 font-medium text-[#374151]">
          <Clock className="h-3.5 w-3.5 text-[#b8956b]" />
          {formatDuration(flight.totalDurationMin)}
        </span>
        {flight.stops > 0 && (
          <span className="text-xs text-[#9ca3af]">{flight.stops} 次中转</span>
        )}
      </div>

      <div className="space-y-3">
        {flight.legs.map((leg, i) => (
          <div key={i}>
            {i > 0 && (
              <p className="my-2 pl-1 text-[10px] text-[#9ca3af]">
                中转等待约 {formatDuration(flight.layoverMin ?? 90)}
              </p>
            )}
            {i > 0 && (
              <div className="mb-2">
                <AirlineBadge airline={leg.airline} flightNumber={leg.flightNumber} />
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Plane className="h-3.5 w-3.5 shrink-0 text-[#b8956b]" />
              <span className="font-medium text-[#1a1a1a]">{leg.from}</span>
              <ArrowRight className="h-3 w-3 text-[#d4d4d4]" />
              <span className="font-medium text-[#1a1a1a]">{leg.to}</span>
              <span className="ml-auto text-xs text-[#9ca3af]">
                {formatDuration(leg.durationMin)}
              </span>
            </div>
            <p className="mt-0.5 pl-6 text-xs text-[#6b7280]">
              {leg.fromZh} → {leg.toZh}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCabinsOpen((o) => !o)}
        className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-[#e8e8e8] py-2 text-xs font-medium text-[#6b7280] transition hover:border-[#b8956b]/40 hover:text-[#b8956b]"
      >
        {cabinsOpen ? (
          <>
            收起舱位详情 <ChevronUp className="h-3.5 w-3.5" />
          </>
        ) : (
          <>
            查看各舱位参考价
            {hasPremium ? " · 含特色头等" : ""}
            <ChevronDown className="h-3.5 w-3.5" />
          </>
        )}
      </button>

      {cabinsOpen && (
        <div className="mt-3 space-y-2">
          {flight.cabinTiers.map((tier) => (
            <CabinTierRow key={`${tier.cabin}-${tier.productNameZh ?? tier.label}`} tier={tier} />
          ))}
        </div>
      )}
    </div>
  );
}