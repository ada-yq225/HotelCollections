"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Plane, MapPin, Navigation, Loader2, LocateFixed } from "lucide-react";
import { DEPARTURE_AIRPORTS } from "@/data/airports";
import { useDepartureAirport } from "@/hooks/useDepartureAirport";
import { formatDistanceKm } from "@/lib/travel";
import type { TravelPlanResult } from "@/lib/travel";
import { FlightOptionCard } from "./FlightOptionCard";
import { getSeasonInfo, getVisaInfo } from "@/data/travel/season-visa";

type HotelTravelPlannerProps = {
  open: boolean;
  onClose: () => void;
  hotel: {
    nameZh: string | null;
    name: string;
    cityZh: string;
    countryCode: string;
    region: string;
    latitude: number;
    longitude: number;
  };
};

export function HotelTravelPlanner({ open, onClose, hotel }: HotelTravelPlannerProps) {
  const { departure, setDeparture, detectLocation } = useDepartureAirport();
  const [selectedIata, setSelectedIata] = useState("");
  const [plan, setPlan] = useState<TravelPlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<"departure" | "flights">("departure");

  useEffect(() => {
    if (departure) setSelectedIata(departure.iata);
  }, [departure]);

  const fetchPlan = useCallback(
    async (iata: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/travel/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            departureIata: iata,
            latitude: hotel.latitude,
            longitude: hotel.longitude,
            countryCode: hotel.countryCode,
            cityZh: hotel.cityZh,
          }),
        });
        const data = await res.json();
        if (data.plan) {
          setPlan(data.plan);
          setStep("flights");
        }
      } finally {
        setLoading(false);
      }
    },
    [hotel]
  );

  useEffect(() => {
    if (!open) {
      setStep("departure");
      setPlan(null);
      return;
    }
    if (departure) {
      setSelectedIata(departure.iata);
      setStep("flights");
      setPlan(null);
      fetchPlan(departure.iata);
    }
    // Only auto-load when the panel opens; airport picks call fetchPlan directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSelectAirport = (iata: string) => {
    setSelectedIata(iata);
    setDeparture(iata);
    setStep("flights");
    setPlan(null);
    fetchPlan(iata);
  };

  const handleConfirmDeparture = () => {
    if (!selectedIata) return;
    handleSelectAirport(selectedIata);
  };

  const handleGeo = async () => {
    setGeoLoading(true);
    const ap = await detectLocation();
    if (ap) handleSelectAirport(ap.iata);
    setGeoLoading(false);
  };

  const filteredAirports = DEPARTURE_AIRPORTS.filter(
    (a) =>
      !search ||
      a.cityZh.includes(search) ||
      a.nameZh.includes(search) ||
      a.iata.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  const directFlights = plan?.flights.filter((f) => f.type === "direct") ?? [];
  const connectingFlights = plan?.flights.filter((f) => f.type === "connecting") ?? [];
  const season = getSeasonInfo(hotel.region, hotel.countryCode);
  const visa = getVisaInfo(hotel.countryCode);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:inset-x-auto sm:top-1/2 sm:left-1/2 sm:max-h-[85vh] sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold">出行规划</h2>
            <p className="mt-0.5 text-xs text-[#9ca3af]">
              {hotel.nameZh || hotel.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#f5f5f5]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-6" style={{ maxHeight: "calc(90vh - 80px)" }}>
          {step === "departure" && !loading && (
            <div className="space-y-4 pt-4">
              <p className="text-sm text-[#6b7280]">选择您的出发机场，查看前往酒店的距离与航班方案</p>

              <button
                type="button"
                onClick={handleGeo}
                disabled={geoLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#b8956b]/50 bg-[#faf6f0] py-3 text-sm text-[#b8956b] transition hover:border-[#b8956b]"
              >
                {geoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LocateFixed className="h-4 w-4" />
                )}
                使用当前位置（自动匹配最近机场）
              </button>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索城市或机场..."
                className="w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
              />

              <div className="max-h-64 space-y-1.5 overflow-y-auto">
                {filteredAirports.map((a) => (
                  <button
                    key={a.iata}
                    type="button"
                    onClick={() => handleSelectAirport(a.iata)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selectedIata === a.iata
                        ? "border-[#b8956b] bg-[#faf6f0]"
                        : "border-[#e8e8e8] hover:border-[#d4d4d4]"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] font-mono text-xs font-bold text-white">
                      {a.iata}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{a.cityZh} · {a.nameZh}</p>
                      <p className="text-xs text-[#9ca3af]">{a.name}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleConfirmDeparture}
                disabled={!selectedIata || loading}
                className="hc-btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plane className="h-4 w-4" />}
                查看航班方案
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-[#6b7280]">
              <Loader2 className="h-8 w-8 animate-spin text-[#b8956b]" />
              正在查询航班方案...
            </div>
          )}

          {step === "flights" && plan && !loading && (
            <div className="space-y-5 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#fafafa] p-3">
                  <p className="text-[10px] text-[#9ca3af]">直线距离</p>
                  <p className="mt-1 font-serif text-xl font-semibold">
                    {formatDistanceKm(plan.straightLineKm)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#fafafa] p-3">
                  <p className="text-[10px] text-[#9ca3af]">机场→酒店</p>
                  <p className="mt-1 font-serif text-xl font-semibold">
                    {formatDistanceKm(plan.airportToHotelKm)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#e8e8e8] bg-[#fafafa] p-3 text-xs">
                <p className="font-medium text-[#374151]">最佳出行：{season.best.slice(0, 4).join("、")}</p>
                <p className="mt-1 text-[#6b7280]">签证：{visa.policy} · {visa.stay}</p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[#e8e8e8] p-3 text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-[#b8956b]" />
                <div>
                  <p className="text-xs text-[#9ca3af]">出发 · {plan.departure.cityZh}</p>
                  <p className="font-medium">{plan.departure.nameZh}</p>
                </div>
                <Navigation className="mx-2 h-4 w-4 rotate-90 text-[#d4d4d4]" />
                <div className="text-right">
                  <p className="text-xs text-[#9ca3af]">抵达 · {plan.destinationAirport.cityZh}</p>
                  <p className="font-medium">{plan.destinationAirport.nameZh}</p>
                </div>
              </div>

              {directFlights.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b8956b]" />
                    直飞航班
                    <span className="text-xs font-normal text-[#9ca3af]">优先推荐</span>
                  </h3>
                  <div className="space-y-3">
                    {directFlights.map((f, i) => (
                      <FlightOptionCard key={`d-${i}`} flight={f} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {connectingFlights.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9ca3af]" />
                    转机航班
                  </h3>
                  <div className="space-y-3">
                    {connectingFlights.map((f, i) => (
                      <FlightOptionCard key={`c-${i}`} flight={f} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {plan.flights.length === 0 && (
                <p className="py-8 text-center text-sm text-[#6b7280]">
                  暂无可用航线数据，请尝试其他出发机场
                </p>
              )}

              <button
                type="button"
                onClick={() => setStep("departure")}
                className="w-full rounded-full border border-[#e8e8e8] py-2.5 text-sm text-[#6b7280] hover:border-[#b8956b]"
              >
                更换出发地
              </button>

              <p className="text-[10px] leading-relaxed text-[#9ca3af]">
                航班时长基于常见航线估算，仅供参考。实际班次与时刻请以航空公司及 OTA 平台为准。
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}