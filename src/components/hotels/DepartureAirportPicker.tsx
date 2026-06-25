"use client";

import { useEffect, useState } from "react";
import { X, Loader2, LocateFixed } from "lucide-react";
import { DEPARTURE_AIRPORTS } from "@/data/airports";
import { useDepartureAirport } from "@/hooks/useDepartureAirport";

type DepartureAirportPickerProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: (iata: string) => void;
  title?: string;
  subtitle?: string;
};

export function DepartureAirportPicker({
  open,
  onClose,
  onConfirm,
  title = "选择出发地",
  subtitle = "设置后可在酒店列表与详情中查看直线距离",
}: DepartureAirportPickerProps) {
  const { departure, setDeparture, detectLocation } = useDepartureAirport();
  const [selectedIata, setSelectedIata] = useState("");
  const [search, setSearch] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (departure) setSelectedIata(departure.iata);
  }, [departure]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const handleConfirm = () => {
    if (!selectedIata) return;
    setDeparture(selectedIata);
    onConfirm?.(selectedIata);
    onClose();
  };

  const handleGeo = async () => {
    setGeoLoading(true);
    const ap = await detectLocation();
    if (ap) setSelectedIata(ap.iata);
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

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:inset-x-auto sm:top-1/2 sm:left-1/2 sm:max-h-[80vh] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold">{title}</h2>
            <p className="mt-0.5 text-xs text-[#9ca3af]">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#f5f5f5]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(85vh - 80px)" }}>
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
                onClick={() => setSelectedIata(a.iata)}
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
                  <p className="text-sm font-medium">
                    {a.cityZh} · {a.nameZh}
                  </p>
                  <p className="text-xs text-[#9ca3af]">{a.name}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedIata}
            className="hc-btn-primary w-full py-3 disabled:opacity-50"
          >
            确认出发地
          </button>
        </div>
      </div>
    </>
  );
}