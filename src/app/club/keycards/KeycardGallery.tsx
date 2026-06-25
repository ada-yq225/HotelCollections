"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Crown } from "lucide-react";
import { KEYCARD_TRADE_TYPES, getTradeTypeLabel } from "@/lib/club";

type Keycard = {
  id: string;
  title: string;
  imageUrl: string;
  tradeType: string;
  year: number | null;
  user: { name: string; isPlus: boolean };
  hotel: { nameZh: string | null; name: string; brand: { nameZh: string } } | null;
  brand: { nameZh: string } | null;
  _count: { offers: number };
};

export function KeycardGallery() {
  const [keycards, setKeycards] = useState<Keycard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter) params.set("tradeType", filter);
    const res = await fetch(`/api/keycards?${params}`);
    const data = await res.json();
    setKeycards(data.keycards || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="mt-8">
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={`rounded-full px-4 py-1.5 text-sm ${!filter ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8]"}`}
        >
          全部
        </button>
        {KEYCARD_TRADE_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm ${filter === t.value ? "text-white" : "border border-[#e8e8e8]"}`}
            style={filter === t.value ? { backgroundColor: t.color } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-20 text-center text-[#6b7280]">加载中...</p>
      ) : keycards.length === 0 ? (
        <div className="hc-card py-20 text-center text-[#6b7280]">暂无房卡，成为第一个分享者</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {keycards.map((k) => (
            <Link key={k.id} href={`/club/keycards/${k.id}`} className="hc-card group overflow-hidden">
              <div className="relative aspect-[3/2] overflow-hidden bg-[#f5f5f5]">
                <img src={k.imageUrl} alt={k.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                <span
                  className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs text-white"
                  style={{ backgroundColor: KEYCARD_TRADE_TYPES.find((t) => t.value === k.tradeType)?.color }}
                >
                  {getTradeTypeLabel(k.tradeType)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium">{k.title}</h3>
                <p className="mt-1 text-xs text-[#6b7280]">
                  {k.hotel?.nameZh || k.hotel?.name || k.brand?.nameZh}
                  {k.year ? ` · ${k.year}` : ""}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-[#9ca3af]">
                  <span className="flex items-center gap-1">
                    {k.user.isPlus && <Crown className="h-3 w-3 text-[#b8956b]" />}
                    {k.user.name}
                  </span>
                  {k.tradeType !== "display" && k._count.offers > 0 && (
                    <span>{k._count.offers} 条意向</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}