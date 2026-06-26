"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plane, MapPin, Clock, Award, Building2, Star, Navigation, PenLine } from "lucide-react";
import { FlightRouteMap } from "./FlightRouteMap";
import { formatDate } from "@/lib/utils";
import { AIRLINES } from "@/data/airlines";
import { AirlineLogo } from "@/components/airlines/AirlineLogo";
import { AllianceLogo } from "@/components/airlines/AllianceLogo";
import type { AirlineAllianceSlug } from "@/data/airlines";

const CABIN_LABELS: Record<string, string> = {
  economy: "经济舱",
  premium_economy: "超经",
  business: "商务舱",
  first: "头等舱",
};

type FlightStats = {
  totalSegments: number;
  totalKm: number;
  totalHours: number;
  visitedAirports: number;
  uniqueAirlines: number;
  cabinBreakdown: Record<string, number>;
  topRoutes: { dep: string; arr: string; depName: string; arrName: string; count: number }[];
  airlinesList: { iata: string; name: string; alliance: string | null; logoUrl: string; count: number }[];
  longestFlight: any;
  routeLines: any[];
  flights: any[];
};

export function FlightJourneyDashboard() {
  const [stats, setStats] = useState<FlightStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/flights/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-[#6b7280]">加载中...</div>;
  if (!stats || stats.totalSegments === 0) {
    return (
      <div className="py-20 text-center">
        <Plane className="mx-auto h-16 w-16 text-[#d1d5db]" />
        <p className="mt-4 text-lg font-medium text-[#6b7280]">还没有飞行记录</p>
        <p className="mt-1 text-sm text-[#9ca3af]">去打卡你的第一次飞行吧</p>
        <Link href="/flights/checkin" className="mt-6 inline-block hc-btn-primary px-6 py-3">
          开始飞行打卡
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: Plane, label: "飞行航段", value: stats.totalSegments },
          { icon: MapPin, label: "到访机场", value: stats.visitedAirports },
          { icon: Navigation, label: "总里程", value: `${(stats.totalKm / 1000).toFixed(1)} 万km` },
          { icon: Clock, label: "飞行小时", value: `${stats.totalHours} h` },
          { icon: Building2, label: "航司数量", value: stats.uniqueAirlines },
          { icon: Star, label: "商务舱", value: `${stats.cabinBreakdown.business ?? 0} 次` },
          { icon: Award, label: "头等舱", value: `${stats.cabinBreakdown.first ?? 0} 次` },
          { icon: Navigation, label: "最长航程", value: stats.longestFlight ? `${Math.round(stats.longestFlight.km)} km` : "-" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="hc-card p-5 text-center">
            <Icon className="mx-auto h-6 w-6 text-[#b8956b]" />
            <p className="mt-2 font-serif text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-[#6b7280]">{label}</p>
          </div>
        ))}
      </div>

      {/* Route Map */}
      {stats.routeLines.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif text-2xl">飞行航线图</h2>
          <FlightRouteMap routeLines={stats.routeLines} />
        </div>
      )}

      {/* Airline breakdown */}
      <div>
        <h2 className="mb-4 font-serif text-2xl">航司分布</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.airlinesList.map((al) => (
            <div key={al.iata} className="hc-card flex items-center gap-4 p-4">
              <AirlineLogo
                iata={al.iata}
                nameZh={AIRLINES[al.iata]?.nameZh ?? al.name}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{al.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#9ca3af]">
                  <span>{al.count} 次飞行</span>
                  {al.alliance && (
                    <AllianceLogo alliance={al.alliance as AirlineAllianceSlug} size="sm" showLabel={true} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top routes */}
      {stats.topRoutes.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif text-2xl">常飞航线</h2>
          <div className="space-y-2">
            {stats.topRoutes.map((r, i) => (
              <div key={i} className="hc-card flex items-center gap-3 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf6f0] text-xs font-bold text-[#b8956b]">
                  {i + 1}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-medium">{r.depName}</span>
                  <Plane className="h-4 w-4 text-[#b8956b] rotate-90" />
                  <span className="font-medium">{r.arrName}</span>
                </div>
                <span className="text-sm text-[#6b7280]">{r.count} 次</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Longest flight highlight */}
      {stats.longestFlight?.km > 0 && (
        <div className="hc-card border-l-4 border-[#b8956b] p-6">
          <p className="text-sm font-medium text-[#b8956b]">最长航程</p>
          <p className="mt-1 font-serif text-xl">
            {stats.longestFlight.depName} → {stats.longestFlight.arrName}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <AirlineLogo
              iata={stats.longestFlight.airlineIata}
              nameZh={AIRLINES[stats.longestFlight.airlineIata]?.nameZh ?? stats.longestFlight.airlineIata}
              size="sm"
            />
            <p className="text-sm text-[#6b7280]">
              {AIRLINES[stats.longestFlight.airlineIata]?.nameZh} {stats.longestFlight.flightNumber}
              {" · "}{CABIN_LABELS[stats.longestFlight.cabin] ?? stats.longestFlight.cabin}
              {" · "}{Math.round(stats.longestFlight.km)} km
            </p>
          </div>
        </div>
      )}

      {/* Flight log */}
      <div>
        <h2 className="mb-4 font-serif text-2xl">飞行记录</h2>
        <div className="space-y-3">
          {stats.flights.map((f: any) => (
            <div key={f.id} className="hc-card flex items-center gap-4 p-4">
              <AirlineLogo
                iata={f.airlineIata}
                nameZh={AIRLINES[f.airlineIata]?.nameZh ?? f.airlineIata}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium">
                  {f.departureIata} → {f.arrivalIata}
                </p>
                <p className="text-sm text-[#6b7280]">
                  {AIRLINES[f.airlineIata]?.nameZh} {f.flightNumber}
                  {" · "}{CABIN_LABELS[f.cabin] ?? f.cabin}
                  {f.seatNumber ? ` · ${f.seatNumber}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">{formatDate(f.date)}</p>
                <Link
                  href={`/flights/report?flight=${f.id}`}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-[#b8956b] hover:underline"
                >
                  <PenLine className="h-3 w-3" /> 写报告
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
