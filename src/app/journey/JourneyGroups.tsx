"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Image as ImageIcon, PenLine } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Group = { slug: string; nameZh: string; logoColor: string };
type Stay = {
  id: string;
  nights: number;
  checkIn: string;
  proofUrl: string | null;
  proofType: string | null;
  hasReview?: boolean;
  hotel: {
    id: string;
    name: string;
    nameZh: string | null;
    city: string;
    cityZh: string;
    brand: { nameZh: string; group: { slug: string; nameZh: string; logoColor: string } };
  };
};
type GroupStats = Record<string, { hotels: number; nights: number; cities: string[] }>;

export function JourneyGroups({
  groups,
  groupStats,
  stays,
}: {
  groups: Group[];
  groupStats: GroupStats;
  stays: Stay[];
}) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const groupStays = activeGroup
    ? stays.filter((s) => s.hotel.brand.group.slug === activeGroup)
    : stays;

  const cities = [...new Set(groupStays.map((s) => s.hotel.cityZh || s.hotel.city))].sort();

  const cityStays = activeCity
    ? groupStays.filter((s) => (s.hotel.cityZh || s.hotel.city) === activeCity)
    : groupStays;

  const visitedGroups = groups.filter((g) => (groupStats[g.slug]?.hotels ?? 0) > 0);

  return (
    <div className="mt-12 space-y-8">
      <h2 className="font-serif text-2xl">按集团浏览</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visitedGroups.length > 0 ? (
          visitedGroups.map((g) => {
            const stat = groupStats[g.slug];
            return (
              <button
                key={g.slug}
                onClick={() => { setActiveGroup(activeGroup === g.slug ? null : g.slug); setActiveCity(null); }}
                className={`hc-card p-5 text-left transition ${activeGroup === g.slug ? "ring-2 ring-[#b8956b]" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: g.logoColor }} />
                    <span className="font-medium">{g.nameZh}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#6b7280]" />
                </div>
                <p className="mt-2 text-sm text-[#6b7280]">
                  {stat.hotels} 家酒店 · {stat.nights} 晚 · {stat.cities.length} 座城市
                </p>
              </button>
            );
          })
        ) : (
          <p className="text-[#6b7280]">还没有入住记录，去打卡第一间奢华酒店吧</p>
        )}
      </div>

      {activeGroup && cities.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-[#6b7280]">按城市</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCity(null)}
              className={`rounded-full px-4 py-1.5 text-sm ${!activeCity ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8]"}`}
            >
              全部
            </button>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCity(activeCity === c ? null : c)}
                className={`rounded-full px-4 py-1.5 text-sm ${activeCity === c ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8]"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {cityStays.length > 0 && (
        <div>
          <h3 className="mb-4 font-serif text-xl">房卡墙</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cityStays.map((s) => (
              <div key={s.id} className="hc-card overflow-hidden">
                {s.proofUrl ? (
                  <img src={s.proofUrl} alt="凭证" className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-[#f5f5f5]">
                    <ImageIcon className="h-10 w-10 text-[#d1d5db]" />
                  </div>
                )}
                <div className="p-4">
                  <p className="font-medium">{s.hotel.nameZh || s.hotel.name}</p>
                  <p className="text-sm text-[#6b7280]">
                    {s.hotel.brand.nameZh} · {s.hotel.cityZh || s.hotel.city}
                  </p>
                  <p className="mt-1 text-xs text-[#9ca3af]">
                    {formatDate(s.checkIn)} · {s.nights} 晚
                  </p>
                  {!s.hasReview && (
                    <Link
                      href={`/community/new?stay=${s.id}&hotel=${s.hotel.id}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-[#b8956b] hover:underline"
                    >
                      <PenLine className="h-3 w-3" /> 撰写点评
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}