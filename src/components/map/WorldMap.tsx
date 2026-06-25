"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export type MapPoint = {
  id: string;
  name: string;
  city: string;
  brand: string;
  group: string;
  groupColor: string;
  lat: number;
  lng: number;
  visited: boolean;
  stayCount?: number;
  totalNights?: number;
  lastCheckIn?: string;
  proofUrl?: string | null;
  roomType?: string | null;
};

function FitBounds({ points, visitedOnly }: { points: MapPoint[]; visitedOnly: boolean }) {
  const map = useMap();
  useEffect(() => {
    const target = visitedOnly ? points.filter((p) => p.visited) : points;
    if (target.length === 0) return;

    if (target.length === 1) {
      map.setView([target[0].lat, target[0].lng], 10);
      return;
    }

    const lats = target.map((p) => p.lat);
    const lngs = target.map((p) => p.lng);
    const padding = visitedOnly ? 0.5 : 2;
    map.fitBounds([
      [Math.min(...lats) - padding, Math.min(...lngs) - padding],
      [Math.max(...lats) + padding, Math.max(...lngs) + padding],
    ]);
  }, [map, points, visitedOnly]);
  return null;
}

function FlyToPoint({ point }: { point: MapPoint | null }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.flyTo([point.lat, point.lng], 12, { duration: 1 });
  }, [map, point]);
  return null;
}

export function WorldMap({
  points,
  highlightGroup,
  defaultMode = "visited",
}: {
  points: MapPoint[];
  highlightGroup?: string;
  defaultMode?: "visited" | "all";
}) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"visited" | "all">(defaultMode);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const visitedPoints = useMemo(() => points.filter((p) => p.visited), [points]);
  const displayPoints = useMemo(() => {
    let list = mode === "visited" ? visitedPoints : points;
    if (highlightGroup) list = list.filter((p) => p.group === highlightGroup);
    return list;
  }, [mode, visitedPoints, points, highlightGroup]);

  const selectedPoint = displayPoints.find((p) => p.id === selectedId) ?? null;

  if (!mounted) {
    return (
      <div className="flex h-[560px] items-center justify-center rounded-2xl bg-[#f5f5f5] text-[#6b7280]">
        加载地图...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("visited")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              mode === "visited" ? "bg-[#b8956b] text-white" : "border border-[#e8e8e8] bg-white"
            }`}
          >
            住过的酒店 ({visitedPoints.length})
          </button>
          <button
            onClick={() => setMode("all")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              mode === "all" ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8] bg-white"
            }`}
          >
            全部酒店库 ({points.length})
          </button>
        </div>
        <p className="text-xs text-[#6b7280]">
          {mode === "visited" ? "金色标记为已入住酒店，点击侧栏可定位" : "灰色为未入住 · 金色为已入住"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="h-[560px] overflow-hidden rounded-2xl border border-[#e8e8e8]">
          {mode === "visited" && visitedPoints.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center bg-[#fafafa] text-[#6b7280]">
              <p>还没有入住记录</p>
              <Link href="/checkin" className="mt-3 text-sm text-[#b8956b] hover:underline">
                去打卡第一间酒店 →
              </Link>
            </div>
          ) : (
            <MapContainer
              center={[30, 105]}
              zoom={4}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <FitBounds points={displayPoints} visitedOnly={mode === "visited"} />
              <FlyToPoint point={selectedPoint} />
              {displayPoints.map((p) => (
                <CircleMarker
                  key={p.id}
                  center={[p.lat, p.lng]}
                  radius={p.visited ? (selectedId === p.id ? 12 : 10) : 4}
                  pathOptions={{
                    color: p.visited ? "#b8956b" : "#d1d5db",
                    fillColor: p.visited ? "#b8956b" : "#f3f4f6",
                    fillOpacity: p.visited ? 1 : 0.5,
                    weight: p.visited ? 3 : 1,
                  }}
                  eventHandlers={{
                    click: () => setSelectedId(p.id),
                  }}
                >
                  <Popup>
                    <div className="min-w-[180px] text-sm">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-gray-500">{p.brand}</p>
                      <p className="text-gray-400">{p.city}</p>
                      {p.visited ? (
                        <div className="mt-2 space-y-1 border-t pt-2">
                          <span className="inline-block rounded-full bg-[#faf6f0] px-2 py-0.5 text-xs text-[#b8956b]">
                            已入住 {p.stayCount} 次 · {p.totalNights} 晚
                          </span>
                          {p.lastCheckIn && (
                            <p className="text-xs text-gray-400">
                              最近：{formatDate(p.lastCheckIn)}
                            </p>
                          )}
                          {p.roomType && (
                            <p className="text-xs text-gray-400">房型：{p.roomType}</p>
                          )}
                          {p.proofUrl && (
                            <img src={p.proofUrl} alt="" className="mt-1 h-16 w-full rounded object-cover" />
                          )}
                          <Link
                            href={`/community/new?hotel=${p.id}`}
                            className="mt-1 block text-xs text-[#b8956b] hover:underline"
                          >
                            撰写点评 →
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={`/checkin?hotel=${p.id}`}
                          className="mt-2 block text-xs text-[#6b7280] hover:underline"
                        >
                          打卡此酒店 →
                        </Link>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>

        {mode === "visited" && visitedPoints.length > 0 && (
          <div className="hc-card max-h-[560px] overflow-y-auto p-3">
            <p className="mb-3 px-1 text-xs font-medium tracking-wide text-[#6b7280] uppercase">
              入住清单 · {visitedPoints.length}
            </p>
            <div className="space-y-1">
              {visitedPoints
                .sort((a, b) => (b.lastCheckIn || "").localeCompare(a.lastCheckIn || ""))
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full rounded-xl p-3 text-left transition ${
                      selectedId === p.id ? "bg-[#faf6f0] ring-1 ring-[#b8956b]" : "hover:bg-[#fafafa]"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: p.groupColor }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="truncate text-xs text-[#6b7280]">
                          {p.brand} · {p.city}
                        </p>
                        <p className="mt-0.5 text-xs text-[#b8956b]">
                          {p.stayCount} 次 · {p.totalNights} 晚
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}