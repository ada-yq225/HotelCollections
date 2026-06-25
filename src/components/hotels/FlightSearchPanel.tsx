"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Plane, Loader2, Search, MapPin } from "lucide-react";
import { ALL_AIRPORTS } from "@/data/airports";
import { useDepartureAirport } from "@/hooks/useDepartureAirport";
import { DepartureAirportPicker } from "./DepartureAirportPicker";
import { FlightOptionCard } from "./FlightOptionCard";
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
];

type FlightSearchPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function FlightSearchPanel({ open, onClose }: FlightSearchPanelProps) {
  const { departure } = useDepartureAirport();
  const [departurePickerOpen, setDeparturePickerOpen] = useState(false);
  const [destinationIata, setDestinationIata] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSearched(false);
      setFlights([]);
      setDestination(null);
    }
  }, [open]);

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

  const filteredDestinations = ALL_AIRPORTS.filter((a) => {
    if (departure && a.iata === departure.iata) return false;
    if (!search) return true;
    return (
      a.cityZh.includes(search) ||
      a.nameZh.includes(search) ||
      a.iata.toLowerCase().includes(search.toLowerCase())
    );
  });

  const directFlights = flights.filter((f) => f.type === "direct");
  const connectingFlights = flights.filter((f) => f.type === "connecting");

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:inset-x-auto sm:top-1/2 sm:left-1/2 sm:max-h-[85vh] sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold">机票搜索</h2>
            <p className="mt-0.5 text-xs text-[#9ca3af]">直飞优先 · 基于常见航线估算</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-[#f5f5f5]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
          <div className="space-y-4 pt-4">
            <button
              type="button"
              onClick={() => setDeparturePickerOpen(true)}
              className="flex w-full items-center gap-3 rounded-xl border border-[#e8e8e8] p-3 text-left transition hover:border-[#b8956b]/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] font-mono text-xs font-bold text-white">
                {departure?.iata ?? "—"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#9ca3af]">出发机场</p>
                <p className="truncate text-sm font-medium">
                  {departure ? `${departure.cityZh} · ${departure.nameZh}` : "请先选择出发地"}
                </p>
              </div>
              <MapPin className="h-4 w-4 shrink-0 text-[#b8956b]" />
            </button>

            {!departure ? (
              <p className="rounded-xl bg-[#faf6f0] px-4 py-3 text-center text-sm text-[#6b7280]">
                设置出发机场后即可搜索航班
              </p>
            ) : (
              <>
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

                <div className="relative">
                  <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索目的地机场..."
                    className="w-full rounded-xl border border-[#e8e8e8] py-3 pr-4 pl-11 text-sm outline-none focus:border-[#b8956b]"
                  />
                </div>

                {search && (
                  <div className="max-h-40 space-y-1 overflow-y-auto">
                    {filteredDestinations.slice(0, 8).map((a) => (
                      <button
                        key={a.iata}
                        type="button"
                        onClick={() => {
                          setSearch("");
                          runSearch(a.iata);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg border border-[#f0f0f0] p-2.5 text-left text-sm hover:border-[#b8956b]/40"
                      >
                        <span className="font-mono text-xs font-bold text-[#b8956b]">{a.iata}</span>
                        <span>
                          {a.cityZh} · {a.nameZh}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {loading && (
                  <div className="flex items-center justify-center gap-2 py-10 text-sm text-[#6b7280]">
                    <Loader2 className="h-5 w-5 animate-spin text-[#b8956b]" />
                    正在搜索航班...
                  </div>
                )}

                {!loading && searched && destination && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 rounded-xl border border-[#e8e8e8] bg-[#fafafa] p-3 text-sm">
                      <Plane className="h-4 w-4 text-[#b8956b]" />
                      <span className="font-medium">{departure.cityZh}</span>
                      <span className="text-[#d4d4d4]">→</span>
                      <span className="font-medium">{destination.cityZh}</span>
                      <span className="ml-auto font-mono text-xs text-[#9ca3af]">
                        {departure.iata} → {destination.iata}
                      </span>
                    </div>

                    {directFlights.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-sm font-medium">直飞航班</h3>
                        <div className="space-y-3">
                          {directFlights.map((f, i) => (
                            <FlightOptionCard key={`d-${i}`} flight={f} index={i} />
                          ))}
                        </div>
                      </div>
                    )}

                    {connectingFlights.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-sm font-medium">转机航班</h3>
                        <div className="space-y-3">
                          {connectingFlights.map((f, i) => (
                            <FlightOptionCard key={`c-${i}`} flight={f} index={i} />
                          ))}
                        </div>
                      </div>
                    )}

                    {flights.length === 0 && (
                      <p className="py-6 text-center text-sm text-[#6b7280]">
                        暂无该航线数据，请尝试其他目的地
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <DepartureAirportPicker
        open={departurePickerOpen}
        onClose={() => setDeparturePickerOpen(false)}
        title="选择出发机场"
        subtitle="设置后将用于机票搜索与酒店距离"
      />
    </>
  );
}