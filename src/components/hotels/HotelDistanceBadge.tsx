"use client";

import { useMemo } from "react";
import { Navigation } from "lucide-react";
import { useDepartureAirport } from "@/hooks/useDepartureAirport";
import { formatDistanceKm, haversineKm } from "@/lib/travel";

export function HotelDistanceBadge({
  latitude,
  longitude,
  onClick,
  compact = false,
}: {
  latitude: number;
  longitude: number;
  onClick?: () => void;
  compact?: boolean;
}) {
  const { departure, ready } = useDepartureAirport();

  const distanceKm = useMemo(() => {
    if (!departure) return null;
    return haversineKm(departure.latitude, departure.longitude, latitude, longitude);
  }, [departure, latitude, longitude]);

  if (!ready) return null;

  if (!departure) {
    if (compact) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick?.();
          }}
          className="inline-flex items-center gap-1 text-xs text-[#9ca3af] transition hover:text-[#b8956b]"
        >
          <Navigation className="h-3 w-3" />
          距出发地
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick?.();
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#d4d4d4] px-3 py-1 text-xs text-[#9ca3af] transition hover:border-[#b8956b] hover:text-[#b8956b]"
      >
        <Navigation className="h-3 w-3" />
        设置出发地查看距离
      </button>
    );
  }

  if (distanceKm == null) return null;

  const content = (
    <>
      <Navigation className="h-3.5 w-3.5 text-[#b8956b]" />
      <span>
        距 {departure.cityZh} <span className="font-medium text-[#374151]">{formatDistanceKm(distanceKm)}</span>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className={`inline-flex items-center gap-1.5 text-xs text-[#6b7280] transition hover:text-[#b8956b] ${
          compact ? "" : "rounded-full border border-[#e8e8e8] bg-[#fafafa] px-3 py-1.5"
        }`}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-[#6b7280] ${compact ? "" : "rounded-full bg-[#fafafa] px-3 py-1.5"}`}>
      {content}
    </span>
  );
}