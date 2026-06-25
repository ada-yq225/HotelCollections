"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { HotelCard } from "@/components/hotels/HotelCard";
import {
  HotelFiltersPanel,
  ActiveFilterPills,
} from "@/components/hotels/HotelFiltersPanel";
import { DepartureBar } from "@/components/hotels/DepartureBar";

type Hotel = Parameters<typeof HotelCard>[0]["hotel"];

type Group = {
  slug: string;
  nameZh: string;
  logoColor: string;
  brands: { slug: string; nameZh: string; _count: { hotels: number } }[];
};

type Brand = {
  slug: string;
  nameZh: string;
  group: { slug: string; nameZh: string; logoColor: string };
  _count: { hotels: number };
};

type Alliance = {
  slug: string;
  nameZh: string;
  _count: { brands: number };
};

type Destination = {
  slug: string;
  nameZh: string;
};

const SIGNATURE_GROUPS = new Set(["four-seasons", "mandarin-oriental", "cheval-blanc"]);

const QUICK_DESTINATIONS = [
  "maldives",
  "tahiti",
  "bali",
  "bodrum",
  "safari",
  "caribbean",
  "china-beijing",
  "china-shanghai",
  "china-sanya",
  "china-hongkong",
];

type FilterState = {
  destination: string;
  group: string;
  brand: string;
  alliance: string;
};

export function HotelsExplorer({
  groups,
  brands,
  alliances,
  destinations,
}: {
  groups: Group[];
  brands: Brand[];
  alliances: Alliance[];
  destinations: Destination[];
}) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    destination: "",
    group: "",
    brand: "",
    alliance: "",
  });

  const updateFilter = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ destination: "", group: "", brand: "", alliance: "" });
  }, []);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (filters.group) params.set("group", filters.group);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.alliance) params.set("alliance", filters.alliance);
    if (filters.destination) params.set("destination", filters.destination);

    const res = await fetch(`/api/hotels?${params}`);
    const data = await res.json();
    setHotels(data.hotels || []);
    setLoading(false);
  }, [q, filters]);

  useEffect(() => {
    const timer = setTimeout(fetchHotels, 300);
    return () => clearTimeout(timer);
  }, [fetchHotels]);

  const chinaDestinations = destinations.filter((d) => d.slug.startsWith("china"));
  const resortDestinations = destinations.filter((d) => !d.slug.startsWith("china"));
  const signatureGroups = groups.filter((g) => SIGNATURE_GROUPS.has(g.slug));

  const labelMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const d of destinations) map[d.slug] = d.nameZh;
    for (const g of groups) map[g.slug] = g.nameZh;
    for (const b of brands) map[b.slug] = b.nameZh;
    for (const a of alliances) map[a.slug] = a.nameZh;
    return map;
  }, [destinations, groups, brands, alliances]);

  const activeCount = Object.values(filters).filter(Boolean).length;

  const quickDests = destinations.filter((d) => QUICK_DESTINATIONS.includes(d.slug));

  const removeFilter = (key: keyof FilterState) => {
    if (key === "group") updateFilter({ group: "", brand: "" });
    else updateFilter({ [key]: "" });
  };

  return (
    <div className="space-y-5">
      <DepartureBar />

      {/* Search + filter trigger */}
      <div className="hc-card overflow-hidden p-1">
        <div className="flex gap-1">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索酒店名称、城市..."
              className="w-full rounded-xl bg-transparent py-3.5 pr-4 pl-11 text-sm outline-none placeholder:text-[#9ca3af]"
            />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeCount > 0
                ? "bg-[#1a1a1a] text-white"
                : "bg-[#faf6f0] text-[#374151] hover:bg-[#f3f0eb]"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">筛选</span>
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#b8956b] text-[10px] text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick destination scroll */}
      <div className="relative -mx-1">
        <div className="flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => updateFilter({ destination: "" })}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
              !filters.destination
                ? "bg-[#1a1a1a] text-white"
                : "border border-[#e8e8e8] bg-white text-[#6b7280] hover:border-[#b8956b]"
            }`}
          >
            全部目的地
          </button>
          {quickDests.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() =>
                updateFilter({
                  destination: filters.destination === d.slug ? "" : d.slug,
                })
              }
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
                filters.destination === d.slug
                  ? "bg-[#b8956b] text-white shadow-sm"
                  : "border border-[#e8e8e8] bg-white text-[#374151] hover:border-[#b8956b]/60"
              }`}
            >
              {d.nameZh}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="shrink-0 rounded-full border border-dashed border-[#d4d4d4] px-4 py-2 text-xs text-[#9ca3af] transition hover:border-[#b8956b] hover:text-[#b8956b]"
          >
            更多 →
          </button>
        </div>
      </div>

      <ActiveFilterPills
        filters={filters}
        labels={labelMap}
        onRemove={removeFilter}
        onClear={clearFilters}
      />

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b7280]">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              加载中...
            </span>
          ) : (
            <>
              共 <span className="font-medium text-[#1a1a1a]">{hotels.length}</span> 家酒店
            </>
          )}
        </p>
      </div>

      {/* Hotel grid */}
      {loading && hotels.length === 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="hc-card overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-[#f0ebe3]" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-2/3 rounded bg-[#f0ebe3]" />
                <div className="h-4 w-full rounded bg-[#f0ebe3]" />
              </div>
            </div>
          ))}
        </div>
      ) : hotels.length === 0 ? (
        <div className="hc-card py-16 text-center">
          <p className="text-[#6b7280]">未找到匹配的酒店</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 text-sm text-[#b8956b] hover:underline"
          >
            清除筛选条件
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      )}

      <HotelFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={updateFilter}
        onClear={clearFilters}
        groups={groups}
        brands={brands}
        alliances={alliances}
        resortDestinations={resortDestinations}
        chinaDestinations={chinaDestinations}
        signatureGroups={signatureGroups}
        activeCount={activeCount}
      />
    </div>
  );
}