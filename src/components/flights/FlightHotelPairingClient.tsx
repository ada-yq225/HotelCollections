"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hotel, ArrowRight } from "lucide-react";

type PairedHotel = {
  slug: string;
  name: string;
  nameZh: string | null;
  cityZh: string;
  heroImage: string | null;
  travelerScore: number | null;
  brand: { nameZh: string };
};

export function FlightHotelPairingClient({ destinationIata }: { destinationIata: string }) {
  const [hotels, setHotels] = useState<PairedHotel[]>([]);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!destinationIata) return;
    fetch(`/api/travel/hotel-pairing?iata=${destinationIata}`)
      .then((r) => r.json())
      .then((d) => {
        setHotels(d.hotels ?? []);
        setLabel(d.label ?? "");
      })
      .catch(() => setHotels([]));
  }, [destinationIata]);

  if (hotels.length === 0) return null;

  return (
    <section className="mt-10 rounded-2xl border border-[#e8e8e8] bg-gradient-to-br from-[#faf6f0] to-white p-6">
      <div className="flex items-center gap-2">
        <Hotel className="h-5 w-5 text-[#b8956b]" />
        <h3 className="font-serif text-xl font-semibold">舱位 × 酒店联程推荐</h3>
      </div>
      <p className="mt-1 text-sm text-[#6b7280]">{label} — 特色舱位落地后的住宿搭配</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {hotels.map((h) => (
          <Link
            key={h.slug}
            href={`/hotels/${h.slug}`}
            className="group flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-[#f0f0f0] transition hover:ring-[#b8956b]"
          >
            {h.heroImage ? (
              <img src={h.heroImage} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-[#f3f0eb] text-xs text-[#9ca3af]">
                H&C
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium group-hover:text-[#b8956b]">
                {h.nameZh || h.name}
              </p>
              <p className="text-xs text-[#6b7280]">
                {h.cityZh} · {h.brand.nameZh}
                {h.travelerScore != null && ` · ${h.travelerScore.toFixed(1)} 分`}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#9ca3af] group-hover:text-[#b8956b]" />
          </Link>
        ))}
      </div>
      <Link href="/hotels" className="mt-4 inline-block text-sm text-[#b8956b] hover:underline">
        浏览完整酒店库 →
      </Link>
    </section>
  );
}