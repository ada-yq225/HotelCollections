import Image from "next/image";
import { ALLIANCE_LABELS, type AirlineInfo } from "@/data/airlines";

export function AirlineBadge({ airline, flightNumber }: { airline: AirlineInfo; flightNumber: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-[#e8e8e8] bg-white">
        <Image
          src={airline.logoUrl}
          alt={airline.nameZh}
          width={32}
          height={32}
          className="h-full w-full object-contain p-0.5"
          unoptimized
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#1a1a1a]">{airline.nameZh}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-xs text-[#b8956b]">{flightNumber}</span>
          {airline.alliance && (
            <span className="rounded-full bg-[#f0f0f0] px-1.5 py-0.5 text-[10px] text-[#6b7280]">
              {ALLIANCE_LABELS[airline.alliance]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}