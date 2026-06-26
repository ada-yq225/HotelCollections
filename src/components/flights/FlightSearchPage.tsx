"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plane,
  Loader2,
  Search,
  MapPin,
  ArrowRight,
  Navigation,
  Clock,
  Route,
} from "lucide-react";
import { ALL_AIRPORTS, DEPARTURE_AIRPORTS } from "@/data/airports";
import { useDepartureAirport } from "@/hooks/useDepartureAirport";
import { DepartureAirportPicker } from "@/components/hotels/DepartureAirportPicker";
import { FlightOptionCard } from "@/components/hotels/FlightOptionCard";
import { formatDuration } from "@/lib/travel";
import type { FlightOption } from "@/lib/travel";
import type { Airport } from "@/data/airports";

const POPULAR_DESTINATIONS = [
  { iata: "MLE", label: "马尔代夫" },
  { iata: "DPS", label: "巴厘岛" },
  { iata: "HKT", label: "普吉岛" },
  { iata: "PPT", label: "大溪地" },
  { iata: "DXB", label: "迪拜" },
  { iata: "SIN", label: "新加坡" },
  { iata: "NRT", label: "东京" },
  { iata: "LHR", label: "伦敦" },
  { iata: "SYX", label: "三亚" },
  { iata: "HKG", label: "香港" },
  { iata: "BKK", label: "曼谷" },
  { iata: "CDG", label: "巴黎" },
];

export function FlightSearchPage() {
  const { departure, ready, setDeparture } = useDepartureAirport();
  const [departurePickerOpen, setDeparturePickerOpen] = useState(false);
  const [destinationIata, setDestinationIata] = useState("");
  const [destSearch, setDestSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (ready && !departure) setDeparturePickerOpen(true);
  }, [ready, departure]);

  const runSearch = useCallback(
    async (destIata: string) => {
      if (!departure || !destIata) return;
      setDestinationIata(destIata);
      setLoading(true);
      setSearched(true);
      try {
        const res = await fetch("/api/travel/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            departureIata: departure.iata,
            destinationIata: destIata,
          }),
        });
        const data = await res.json();
        if (data.flights) {
          setFlights(data.flights);
          setDestination(data.destination);
        } else {
          setFlights([]);
          setDestination(null);
        }
      } finally {
        setLoading(false);
      }
    },
    [departure]
  );

  const swapAndSearch = () => {
    if (!departure || !destination) return;
    setDeparture(destination.iata);
    runSearch(departure.iata);
  };

  const filteredDestinations = ALL_AIRPORTS.filter((a) => {
    if (departure && a.iata === departure.iata) return false;
    if (!destSearch) return false;
    return (
      a.cityZh.includes(destSearch) ||
      a.nameZh.includes(destSearch) ||
      a.iata.toLowerCase().includes(destSearch.toLowerCase())
    );
  });

  const directFlights = flights.filter((f) => f.type === "direct");
  const connectingFlights = flights.filter((f) => f.type === "connecting");
  const fastest = flights[0];

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#b8956b]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold">机票查询</h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          基于常见航线估算 · 直飞优先 · 支持全球出发地与度假目的地
        </p>
      </div>

      <div className="hc-card space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <button
            type="button"
            onClick={() => setDeparturePickerOpen(true)}
            className="flex items-center gap-3 rounded-xl border border-[#e8e8e8] p-4 text-left transition hover:border-[#b8956b]/50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] font-mono text-sm font-bold text-white">
              {departure?.iata ?? "—"}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] text-[#9ca3af]">出发</p>
              <p className="truncate font-medium">
                {departure ? `${departure.cityZh} · ${departure.nameZh}` : "选择出发机场"}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={swapAndSearch}
            disabled={!departure || !destination}
            title="交换出发与目的地"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#e8e8e8] text-[#6b7280] transition hover:border-[#b8956b] hover:text-[#b8956b] disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4 rotate-90 sm:rotate-0" />
          </button>

          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            <input
              value={destSearch}
              onChange={(e) => setDestSearch(e.target.value)}
              placeholder="搜索目的地机场..."
              className="w-full rounded-xl border border-[#e8e8e8] py-4 pr-4 pl-11 text-sm outline-none focus:border-[#b8956b]"
            />
            {destSearch && filteredDestinations.length > 0 && (
              <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-xl border border-[#e8e8e8] bg-white shadow-lg">
                {filteredDestinations.slice(0, 10).map((a) => (
                  <button
                    key={a.iata}
                    type="button"
                    onClick={() => {
                      setDestSearch("");
                      runSearch(a.iata);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-[#faf6f0]"
                  >
                    <span className="font-mono text-xs font-bold text-[#b8956b]">{a.iata}</span>
                    {a.cityZh} · {a.nameZh}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {!departure ? (
          <p className="rounded-xl bg-[#faf6f0] px-4 py-3 text-center text-sm text-[#6b7280]">
            请先选择出发机场
          </p>
        ) : (
          <div>
            <p className="mb-2 text-xs font-medium text-[#6b7280]">热门目的地</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_DESTINATIONS.filter((d) => d.iata !== departure.iata).map((d) => (
                <button
                  key={d.iata}
                  type="button"
                  onClick={() => runSearch(d.iata)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    destinationIata === d.iata
                      ? "bg-[#b8956b] text-white"
                      : "border border-[#e8e8e8] bg-white text-[#374151] hover:border-[#b8956b]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {departure && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="hc-card p-4">
            <p className="flex items-center gap-1.5 text-[10px] text-[#9ca3af]">
              <MapPin className="h-3 w-3" /> 可选出发地
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold">{DEPARTURE_AIRPORTS.length}</p>
            <p className="text-xs text-[#6b7280]">全球枢纽机场</p>
          </div>
          <div className="hc-card p-4">
            <p className="flex items-center gap-1.5 text-[10px] text-[#9ca3af]">
              <Route className="h-3 w-3" /> 目的地
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold">{ALL_AIRPORTS.length}</p>
            <p className="text-xs text-[#6b7280]">含度假岛机场</p>
          </div>
          <div className="hc-card p-4">
            <p className="flex items-center gap-1.5 text-[10px] text-[#9ca3af]">
              <Clock className="h-3 w-3" /> 最快方案
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold">
              {fastest ? formatDuration(fastest.totalDurationMin) : "—"}
            </p>
            <p className="text-xs text-[#6b7280]">估算飞行时长</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#6b7280]">
          <Loader2 className="h-6 w-6 animate-spin text-[#b8956b]" />
          正在搜索航班...
        </div>
      )}

      {!loading && searched && destination && departure && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 rounded-xl border border-[#e8e8e8] bg-[#fafafa] p-4 text-sm">
            <Plane className="h-5 w-5 text-[#b8956b]" />
            <span className="font-medium">{departure.cityZh}</span>
            <Navigation className="h-4 w-4 text-[#d4d4d4]" />
            <span className="font-medium">{destination.cityZh}</span>
            <span className="ml-auto font-mono text-xs text-[#9ca3af]">
              {departure.iata} → {destination.iata}
            </span>
          </div>

          {directFlights.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-medium">直飞航班</h2>
              <div className="space-y-3">
                {directFlights.map((f, i) => (
                  <FlightOptionCard key={`d-${i}`} flight={f} index={i} />
                ))}
              </div>
            </div>
          )}

          {connectingFlights.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-medium">转机航班</h2>
              <div className="space-y-3">
                {connectingFlights.map((f, i) => (
                  <FlightOptionCard key={`c-${i}`} flight={f} index={i} />
                ))}
              </div>
            </div>
          )}

          {flights.length === 0 && (
            <p className="py-8 text-center text-sm text-[#6b7280]">暂无该航线数据，请尝试其他目的地</p>
          )}

          <p className="text-[10px] leading-relaxed text-[#9ca3af]">
            航班时长基于常见航线与航司历史班次估算，仅供参考。实际票价、时刻与舱位请以航空公司及 OTA 为准。
          </p>
        </div>
      )}

      <DepartureAirportPicker
        open={departurePickerOpen}
        onClose={() => setDeparturePickerOpen(false)}
        title="选择出发机场"
        subtitle="设置后将用于机票搜索与酒店距离计算"
      />
    </div>
  );
}