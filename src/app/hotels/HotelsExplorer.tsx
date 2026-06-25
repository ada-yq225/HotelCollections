"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import Link from "next/link";

type Hotel = {
  id: string;
  slug: string;
  name: string;
  nameZh: string | null;
  city: string;
  cityZh: string;
  country: string;
  heroImage: string | null;
  brand: {
    name: string;
    nameZh: string;
    slug: string;
    group: { slug: string; nameZh: string; logoColor: string };
  };
};

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
  const [group, setGroup] = useState("");
  const [brand, setBrand] = useState("");
  const [alliance, setAlliance] = useState("");
  const [destination, setDestination] = useState("");

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (group) params.set("group", group);
    if (brand) params.set("brand", brand);
    if (alliance) params.set("alliance", alliance);
    if (destination) params.set("destination", destination);

    const res = await fetch(`/api/hotels?${params}`);
    const data = await res.json();
    setHotels(data.hotels || []);
    setLoading(false);
  }, [q, group, brand, alliance, destination]);

  useEffect(() => {
    const timer = setTimeout(fetchHotels, 300);
    return () => clearTimeout(timer);
  }, [fetchHotels]);

  const displayBrands = useMemo(() => {
    const list = group
      ? brands.filter((b) => b.group.slug === group)
      : brands;
    return [...list].sort((a, b) => b._count.hotels - a._count.hotels);
  }, [brands, group]);

  const chinaDestinations = destinations.filter((d) => d.slug.startsWith("china"));
  const resortDestinations = destinations.filter((d) => !d.slug.startsWith("china"));

  const signatureGroups = groups.filter((g) => SIGNATURE_GROUPS.has(g.slug));

  return (
    <div className="space-y-6">
      <div className="hc-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索酒店、城市..."
            className="w-full rounded-xl border border-[#e8e8e8] py-3 pr-4 pl-10 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-[#6b7280]">
          <Filter className="h-4 w-4" />
          筛选
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="w-full text-xs text-[#6b7280] sm:w-auto sm:self-center">度假胜地</span>
        <button
          onClick={() => setDestination("")}
          className={`rounded-full px-3 py-1 text-xs transition ${!destination ? "bg-[#b8956b] text-white" : "border border-[#e8e8e8] hover:border-[#b8956b]"}`}
        >
          全部
        </button>
        {resortDestinations.map((d) => (
          <button
            key={d.slug}
            onClick={() => setDestination(destination === d.slug ? "" : d.slug)}
            className={`rounded-full px-3 py-1 text-xs transition ${destination === d.slug ? "bg-[#b8956b] text-white" : "border border-[#e8e8e8] hover:border-[#b8956b]"}`}
          >
            {d.nameZh}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="w-full text-xs text-[#6b7280] sm:w-auto sm:self-center">中国城市</span>
        {chinaDestinations.map((d) => (
          <button
            key={d.slug}
            onClick={() => setDestination(destination === d.slug ? "" : d.slug)}
            className={`rounded-full px-3 py-1 text-xs transition ${destination === d.slug ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8] hover:border-[#b8956b]"}`}
          >
            {d.nameZh}
          </button>
        ))}
      </div>

      {signatureGroups.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#6b7280]">独立集团</span>
          {signatureGroups.map((g) => (
            <Link
              key={g.slug}
              href={`/groups/${g.slug}`}
              className="rounded-full border border-[#e8e8e8] px-3 py-1 text-xs transition hover:border-[#b8956b]"
              style={{ borderColor: `${g.logoColor}40` }}
            >
              {g.nameZh} →
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="w-full text-xs text-[#6b7280] sm:w-auto sm:self-center">集团</span>
        <button
          onClick={() => { setGroup(""); setBrand(""); }}
          className={`rounded-full px-4 py-1.5 text-sm transition ${!group ? "bg-[#1a1a1a] text-white" : "bg-white border border-[#e8e8e8] hover:border-[#b8956b]"}`}
        >
          全部集团
        </button>
        {groups.map((g) => (
          <button
            key={g.slug}
            onClick={() => {
              const next = group === g.slug ? "" : g.slug;
              setGroup(next);
              if (next && brand) {
                const current = brands.find((b) => b.slug === brand);
                if (current && current.group.slug !== next) setBrand("");
              }
            }}
            className={`rounded-full px-4 py-1.5 text-sm transition ${group === g.slug ? "text-white" : "bg-white border border-[#e8e8e8] hover:border-[#b8956b]"}`}
            style={group === g.slug ? { backgroundColor: g.logoColor } : {}}
          >
            {g.nameZh}
          </button>
        ))}
      </div>

      {displayBrands.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="w-full text-xs text-[#6b7280] sm:w-auto sm:self-center">品牌</span>
          <button
            onClick={() => setBrand("")}
            className={`rounded-full px-3 py-1 text-xs ${!brand ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8]"}`}
          >
            全部品牌
          </button>
          {displayBrands.map((b) => (
            <button
              key={b.slug}
              onClick={() => setBrand(brand === b.slug ? "" : b.slug)}
              className={`rounded-full px-3 py-1 text-xs transition ${brand === b.slug ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8] hover:border-[#b8956b]"}`}
            >
              {b.nameZh}
              <span className="ml-1 opacity-60">({b._count.hotels})</span>
            </button>
          ))}
        </div>
      )}

      {alliances.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-[#6b7280]">联盟</span>
          {alliances.map((a) => (
            <button
              key={a.slug}
              onClick={() => setAlliance(alliance === a.slug ? "" : a.slug)}
              className={`rounded-full px-3 py-1 text-xs transition ${alliance === a.slug ? "bg-[#b8956b] text-white" : "bg-white border border-[#e8e8e8]"}`}
            >
              {a.nameZh}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-[#6b7280]">
        {loading ? "加载中..." : `共 ${hotels.length} 家酒店`}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((h) => (
          <Link key={h.id} href={`/hotels/${h.slug}`} className="hc-card block overflow-hidden">
            {h.heroImage ? (
              <div className="aspect-[16/9] overflow-hidden bg-[#f3f0eb]">
                <img
                  src={h.heroImage}
                  alt={h.nameZh || h.name}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>
            ) : (
              <div
                className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-[#faf6f0] to-[#f0ebe3]"
                style={{ borderBottom: `3px solid ${h.brand.group.logoColor}` }}
              >
                <span className="font-serif text-lg text-[#b8956b]">{h.brand.nameZh}</span>
              </div>
            )}
            <div className="p-5">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: h.brand.group.logoColor }}
                />
                <span className="text-xs text-[#6b7280]">{h.brand.group.nameZh}</span>
              </div>
              <h3 className="font-medium leading-snug">{h.nameZh || h.name}</h3>
              <p className="mt-1 text-sm text-[#6b7280]">{h.brand.nameZh}</p>
              <p className="mt-2 text-xs text-[#9ca3af]">
                {h.cityZh || h.city} · {h.country}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}