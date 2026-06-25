import { Plane, ArrowRight, Clock } from "lucide-react";
import { formatDuration } from "@/lib/travel";
import type { FlightOption } from "@/lib/travel";

export function FlightOptionCard({ flight, index }: { flight: FlightOption; index: number }) {
  const isDirect = flight.type === "direct";
  return (
    <div
      className={`rounded-xl border p-4 ${
        isDirect
          ? "border-[#b8956b]/40 bg-gradient-to-br from-[#faf6f0] to-white"
          : "border-[#e8e8e8] bg-white"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
        <span className="flex items-center gap-1 text-sm font-medium text-[#374151]">
          <Clock className="h-3.5 w-3.5 text-[#b8956b]" />
          {formatDuration(flight.totalDurationMin)}
        </span>
      </div>

      <div className="space-y-2">
        {flight.legs.map((leg, i) => (
          <div key={i}>
            {i > 0 && (
              <p className="my-1.5 pl-6 text-[10px] text-[#9ca3af]">
                中转等待约 {formatDuration(flight.layoverMin ?? 90)}
              </p>
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