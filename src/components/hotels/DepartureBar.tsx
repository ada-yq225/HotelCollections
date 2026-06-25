"use client";

import { useState } from "react";
import { MapPin, ChevronRight, Navigation } from "lucide-react";
import { useDepartureAirport } from "@/hooks/useDepartureAirport";
import { DepartureAirportPicker } from "./DepartureAirportPicker";

export function DepartureBar() {
  const { departure, ready } = useDepartureAirport();
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!ready) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-[#e8e8e8] bg-gradient-to-r from-[#fafafa] to-white px-4 py-3 text-left transition hover:border-[#b8956b]/50"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a]">
          {departure ? (
            <MapPin className="h-4 w-4 text-[#b8956b]" />
          ) : (
            <Navigation className="h-4 w-4 text-[#b8956b]" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          {departure ? (
            <>
              <p className="text-[10px] text-[#9ca3af]">当前出发地</p>
              <p className="truncate text-sm font-medium text-[#1a1a1a]">
                {departure.cityZh} · {departure.nameZh}
                <span className="ml-1.5 font-mono text-xs text-[#9ca3af]">{departure.iata}</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-[#374151]">设置出发地</p>
              <p className="text-xs text-[#9ca3af]">查看酒店距离与航班方案（直飞优先）</p>
            </>
          )}
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-[#d4d4d4]" />
      </button>

      <DepartureAirportPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}