import type { AirlineInfo } from "@/data/airlines";
import { AllianceLogo } from "@/components/airlines/AllianceLogo";
import { AirlineLogo } from "@/components/airlines/AirlineLogo";

export function AirlineBadge({ airline, flightNumber }: { airline: AirlineInfo; flightNumber: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <AirlineLogo iata={airline.iata} nameZh={airline.nameZh} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#1a1a1a]">{airline.nameZh}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {flightNumber ? (
            <span className="font-mono text-xs text-[#b8956b]">{flightNumber}</span>
          ) : null}
          {airline.alliance && (
            <AllianceLogo alliance={airline.alliance} size="sm" showLabel={true} />
          )}
        </div>
      </div>
    </div>
  );
}