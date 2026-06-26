"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ChevronRight, Navigation, Plane, Search, CheckCircle2 } from "lucide-react";
import { getAirportByIata } from "@/data/airports";
import { useDepartureAirport } from "@/hooks/useDepartureAirport";
import { DepartureAirportPicker } from "./DepartureAirportPicker";
import { FlightSearchPanel } from "./FlightSearchPanel";

export function DepartureBar() {
  const { departure, ready } = useDepartureAirport();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [flightSearchOpen, setFlightSearchOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  if (!ready) return null;

  const handleAirportConfirmed = (iata: string) => {
    setPickerOpen(false);
    setFlightSearchOpen(true);
    setFeedback(iata);
  };

  const feedbackAirport = feedback ? getAirportByIata(feedback) : null;

  return (
    <>
      {feedbackAirport && (
        <div className="flex items-center gap-2 rounded-xl border border-[#b8956b]/30 bg-[#faf6f0] px-4 py-2.5 text-sm text-[#374151]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#b8956b]" />
          <span>
            已设置出发地 <span className="font-medium">{feedbackAirport.cityZh}</span>
            （{feedbackAirport.iata}），酒店距离已更新，可继续搜机票
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex flex-1 items-center gap-3 rounded-xl border border-[#e8e8e8] bg-gradient-to-r from-[#fafafa] to-white px-4 py-3 text-left transition hover:border-[#b8956b]/50"
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

        <div className="flex gap-2 sm:shrink-0">
          <button
            type="button"
            onClick={() => {
              if (!departure) setPickerOpen(true);
              else setFlightSearchOpen(true);
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#b8956b]/40 bg-[#faf6f0] px-4 py-3 text-sm font-medium text-[#b8956b] transition hover:border-[#b8956b] sm:flex-none sm:px-5"
          >
            {departure ? (
              <>
                <Search className="h-4 w-4" />
                快速搜
              </>
            ) : (
              <>
                <Plane className="h-4 w-4" />
                先选出发地
              </>
            )}
          </button>
          <Link
            href="/flights"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm font-medium text-[#374151] transition hover:border-[#b8956b] sm:px-5"
          >
            <Plane className="h-4 w-4" />
            机票页
          </Link>
        </div>
      </div>

      <DepartureAirportPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onConfirm={handleAirportConfirmed}
      />
      <FlightSearchPanel open={flightSearchOpen} onClose={() => setFlightSearchOpen(false)} />
    </>
  );
}