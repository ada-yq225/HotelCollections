import { Plane, ArrowRight, Clock, Ticket } from "lucide-react";
import { formatDuration } from "@/lib/travel";
import type { FlightOption } from "@/lib/travel";
import { AirlineBadge } from "@/components/flights/AirlineBadge";

export function FlightOptionCard({ flight, index }: { flight: FlightOption; index: number }) {
  const isDirect = flight.type === "direct";
  const primaryAirline = flight.legs[0]?.airline;

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
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1 text-lg font-semibold text-[#b8956b]">
            <Ticket className="h-4 w-4" />
            {flight.priceLabel}
          </p>
          <p className="text-[10px] text-[#9ca3af]">经济舱参考价</p>
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
    </div>
  );
}