"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Search } from "lucide-react";
import { HotelCompare } from "@/components/hotels/HotelCompare";
import Link from "next/link";

export default function ComparePage() {
  const [urlSlugs, setUrlSlugs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slugs = params.get("slugs")?.split(",").filter(Boolean) || [];
    setUrlSlugs(slugs);
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#e8e8e8] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#faf6f0_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <p className="mb-3 text-xs font-medium tracking-[0.25em] text-[#b8956b] uppercase">Compare</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">酒店对比</h1>
          <p className="mt-3 text-[#6b7280]">
            并排对比 2-3 家酒店的评分、价格、品牌与预订渠道礼遇
          </p>
          {urlSlugs.length > 0 && (
            <p className="mt-3 text-xs text-[#9ca3af]">
              已选择 {urlSlugs.length} 家酒店 → 可通过下方搜索添加更多
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <HotelCompare hotels={[]} />
      </div>
    </div>
  );
}
