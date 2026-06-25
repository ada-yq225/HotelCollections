"use client";

import { useState } from "react";
import Link from "next/link";
import { Plane } from "lucide-react";
import { HotelDistanceBadge } from "./HotelDistanceBadge";
import { HotelTravelPlanner } from "./HotelTravelPlanner";

type HotelTravelTarget = {
  nameZh: string | null;
  name: string;
  cityZh: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};

export function HotelDetailTravel({ hotel }: { hotel: HotelTravelTarget }) {
  const [plannerOpen, setPlannerOpen] = useState(false);

  return (
    <>
      <HotelDistanceBadge
        latitude={hotel.latitude}
        longitude={hotel.longitude}
        onClick={() => setPlannerOpen(true)}
      />

      <HotelTravelPlanner
        open={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        hotel={hotel}
      />
    </>
  );
}

export function HotelDetailActions({
  hotel,
  hotelId,
}: {
  hotel: HotelTravelTarget;
  hotelId: string;
}) {
  const [plannerOpen, setPlannerOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Link href={`/checkin?hotel=${hotelId}`} className="hc-btn-primary">
          打卡入住
        </Link>
        <Link
          href={`/book?hotel=${hotelId}&source=detail`}
          className="rounded-full border border-[#e8e8e8] px-5 py-2.5 text-sm transition hover:border-[#b8956b]"
        >
          礼遇预订
        </Link>
        <button
          type="button"
          onClick={() => setPlannerOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-[#b8956b]/40 bg-[#faf6f0] px-5 py-2.5 text-sm text-[#b8956b] transition hover:border-[#b8956b]"
        >
          <Plane className="h-4 w-4" />
          规划出行
        </button>
        <Link
          href={`/map?focus=${hotelId}`}
          className="rounded-full border border-[#e8e8e8] px-5 py-2.5 text-sm text-[#6b7280] transition hover:border-[#b8956b]"
        >
          地图定位
        </Link>
      </div>

      <HotelTravelPlanner
        open={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        hotel={hotel}
      />
    </>
  );
}