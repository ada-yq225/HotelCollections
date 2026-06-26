"use client";

import { useState } from "react";
import { ArrowLeftRight, Search, X, Star, MapPin, Building2, Gem, Bed, Coffee, Clock } from "lucide-react";
import Link from "next/link";
import { hotelDisplayImageUrl } from "@/lib/hotel-display-image";

type HotelBrief = {
  id: string;
  slug: string;
  name: string;
  nameZh: string | null;
  cityZh: string;
  country: string;
  heroImage: string | null;
  travelerScore: number | null;
  avgBasePrice: number | null;
  avgSuitePrice: number | null;
  brand: { nameZh: string; slug: string; group: { nameZh: string; slug: string } };
};

type CompareHotel = HotelBrief & {
  brand: HotelBrief["brand"] & { alliances?: { alliance: { slug: string; name: string; nameZh: string } }[] };
  notes?: string | null;
  openedYear?: number | null;
  address?: string | null;
};

export function HotelCompare({ hotels: initial }: { hotels: CompareHotel[] }) {
  const [selected, setSelected] = useState<CompareHotel[]>(initial.slice(0, 3));
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<HotelBrief[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(initial.length === 0);

  const handleSearch = async (q: string) => {
    setSearch(q);
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    const res = await fetch(`/api/hotels?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.hotels || []);
    setSearching(false);
  };

  const addHotel = async (hotel: HotelBrief) => {
    if (selected.length >= 3) return;
    const res = await fetch(`/api/hotels/compare?slugs=${hotel.slug}`);
    const data = await res.json();
    if (data.hotels?.[0]) {
      setSelected((prev) => [...prev, data.hotels[0]]);
      setSearch("");
      setResults([]);
    }
  };

  const removeHotel = (slug: string) => {
    setSelected((prev) => prev.filter((h) => h.slug !== slug));
  };

  return (
    <div>
      {selected.length < 3 && (
        <div className="mb-8">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="inline-flex items-center gap-2 rounded-full border border-dashed border-[#b8956b] px-4 py-2 text-sm font-medium text-[#b8956b] hover:bg-[#faf6f0] transition"
          >
            <Search className="h-4 w-4" />
            {selected.length === 0 ? "搜索酒店开始对比" : "添加酒店对比"}
            <span className="text-[#9ca3af]">（{selected.length}/3）</span>
          </button>

          {showSearch && (
            <div className="mt-4 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="输入酒店名称搜索……"
                  className="w-full rounded-xl border border-[#e8e8e8] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#b8956b] focus:ring-1 focus:ring-[#b8956b]"
                  autoFocus
                />
              </div>
              {searching && <p className="mt-2 text-xs text-[#9ca3af]">搜索中……</p>}
              {results.length > 0 && (
                <div className="mt-2 space-y-1 rounded-xl border border-[#e8e8e8] bg-white p-2 max-h-64 overflow-y-auto">
                  {results.map((h) => (
                    <button
                      key={h.slug}
                      onClick={() => addHotel(h)}
                      disabled={selected.some((s) => s.slug === h.slug)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-[#faf6f0] disabled:opacity-40"
                    >
                      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-[#f0f0f0]">
                        {h.heroImage && hotelDisplayImageUrl(h.slug, h.heroImage) ? (
                          <img src={hotelDisplayImageUrl(h.slug, h.heroImage)!} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="h-full w-full p-1.5 text-[#9ca3af]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{h.nameZh || h.name}</p>
                        <p className="text-xs text-[#9ca3af]">{h.brand.nameZh} · {h.cityZh}</p>
                      </div>
                      <span className="text-xs text-[#b8956b]">+ 添加</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {selected.length === 0 && !showSearch && (
        <div className="py-20 text-center">
          <ArrowLeftRight className="mx-auto h-12 w-12 text-[#e8e8e8]" />
          <p className="mt-4 text-[#6b7280]">选择 2-3 家酒店进行并排对比</p>
          <button
            onClick={() => setShowSearch(true)}
            className="mt-4 hc-btn-primary"
          >
            搜索酒店
          </button>
        </div>
      )}

      {selected.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40 p-3 text-left text-xs font-medium text-[#9ca3af] border-b border-[#e8e8e8] bg-[#fafafa] rounded-tl-xl">
                  对比维度
                </th>
                {selected.map((h) => (
                  <th key={h.slug} className="p-3 text-left border-b border-[#e8e8e8] bg-[#fafafa] last:rounded-tr-xl">
                    <div className="relative">
                      <button
                        onClick={() => removeHotel(h.slug)}
                        className="absolute -right-1 -top-1 rounded-full p-0.5 text-[#9ca3af] hover:bg-[#f0f0f0] hover:text-[#e84855]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="mb-2 aspect-[4/3] overflow-hidden rounded-lg bg-[#f0f0f0]">
                        {h.heroImage && hotelDisplayImageUrl(h.slug, h.heroImage) ? (
                          <img src={hotelDisplayImageUrl(h.slug, h.heroImage)!} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Building2 className="h-10 w-10 text-[#d0d0d0]" />
                          </div>
                        )}
                      </div>
                      <Link href={`/hotels/${h.slug}`} className="block font-serif text-base font-semibold hover:text-[#b8956b] transition">
                        {h.nameZh || h.name}
                      </Link>
                      <p className="mt-1 text-xs text-[#9ca3af]">{h.brand.nameZh}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 评分 */}
              <tr>
                <td className="p-3 text-sm text-[#6b7280] border-b border-[#e8e8e8] bg-[#fafafa]">
                  <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-[#b8956b]" />旅客评分</span>
                </td>
                {selected.map((h) => (
                  <td key={h.slug} className="p-3 border-b border-[#e8e8e8]">
                    {h.travelerScore ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#faf6f0] px-2.5 py-1 text-sm font-semibold text-[#b8956b]">
                        <Star className="h-3.5 w-3.5 fill-[#b8956b] text-[#b8956b]" />
                        {h.travelerScore.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-sm text-[#9ca3af]">暂无评分</span>
                    )}
                  </td>
                ))}
              </tr>
              {/* 价格 */}
              <tr>
                <td className="p-3 text-sm text-[#6b7280] border-b border-[#e8e8e8] bg-[#fafafa]">
                  <span className="flex items-center gap-1.5"><Gem className="h-3.5 w-3.5 text-[#b8956b]" />基础均价</span>
                </td>
                {selected.map((h) => (
                  <td key={h.slug} className="p-3 border-b border-[#e8e8e8]">
                    {h.avgBasePrice ? (
                      <span className="font-medium">¥{h.avgBasePrice.toLocaleString()}<span className="text-xs text-[#9ca3af]">/晚</span></span>
                    ) : (
                      <span className="text-sm text-[#9ca3af]">暂无</span>
                    )}
                  </td>
                ))}
              </tr>
              {/* 套房价格 */}
              <tr>
                <td className="p-3 text-sm text-[#6b7280] border-b border-[#e8e8e8] bg-[#fafafa]">
                  <span className="flex items-center gap-1.5"><Bed className="h-3.5 w-3.5 text-[#b8956b]" />套房均价</span>
                </td>
                {selected.map((h) => (
                  <td key={h.slug} className="p-3 border-b border-[#e8e8e8]">
                    {h.avgSuitePrice ? (
                      <span className="font-medium">¥{h.avgSuitePrice.toLocaleString()}<span className="text-xs text-[#9ca3af]">/晚</span></span>
                    ) : (
                      <span className="text-sm text-[#9ca3af]">暂无</span>
                    )}
                  </td>
                ))}
              </tr>
              {/* 开业年份 */}
              <tr>
                <td className="p-3 text-sm text-[#6b7280] border-b border-[#e8e8e8] bg-[#fafafa]">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#b8956b]" />开业年份</span>
                </td>
                {selected.map((h) => (
                  <td key={h.slug} className="p-3 border-b border-[#e8e8e8]">
                    <span className="text-sm">{h.openedYear || "—"}</span>
                  </td>
                ))}
              </tr>
              {/* 城市 */}
              <tr>
                <td className="p-3 text-sm text-[#6b7280] border-b border-[#e8e8e8] bg-[#fafafa]">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#b8956b]" />目的地</span>
                </td>
                {selected.map((h) => (
                  <td key={h.slug} className="p-3 border-b border-[#e8e8e8] text-sm">
                    {h.cityZh} · {h.country}
                  </td>
                ))}
              </tr>
              {/* 集团 */}
              <tr>
                <td className="p-3 text-sm text-[#6b7280] border-b border-[#e8e8e8] bg-[#fafafa]">
                  <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-[#b8956b]" />集团 · 品牌</span>
                </td>
                {selected.map((h) => (
                  <td key={h.slug} className="p-3 border-b border-[#e8e8e8] text-sm">
                    {h.brand.group.nameZh} · {h.brand.nameZh}
                  </td>
                ))}
              </tr>
              {/* 预订渠道 */}
              <tr>
                <td className="p-3 text-sm text-[#6b7280] bg-[#fafafa] rounded-bl-xl">
                  <span className="flex items-center gap-1.5"><Coffee className="h-3.5 w-3.5 text-[#b8956b]" />奢华渠道</span>
                </td>
                {selected.map((h) => (
                  <td key={h.slug} className="p-3 last:rounded-br-xl">
                    <div className="flex flex-wrap gap-1">
                      {(h as any).brand?.alliances?.map((a: any) => (
                        <span key={a.alliance.slug} className="rounded-full bg-[#faf6f0] px-2 py-0.5 text-xs text-[#b8956b]">
                          {a.alliance.name}
                        </span>
                      )) || <span className="text-xs text-[#9ca3af]">—</span>}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
