import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { formatHotelPrice } from "@/lib/hotel-pricing";

type SimilarHotel = {
  id: string;
  slug: string;
  name: string;
  nameZh: string | null;
  cityZh: string;
  heroImage: string | null;
  avgBasePrice: number | null;
  brand: {
    slug: string;
    nameZh: string;
    group: { logoColor: string | null };
  };
};

export function SimilarHotels({ hotels }: { hotels: SimilarHotel[] }) {
  if (hotels.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 font-serif text-xl font-semibold">相似酒店推荐</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {hotels.map((h) => (
          <Link
            key={h.id}
            href={`/hotels/${h.slug}`}
            className="group flex gap-3 rounded-xl border border-[#e8e8e8] p-3 transition hover:border-[#b8956b]"
          >
            <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[#f3f0eb]">
              {h.heroImage ? (
                <img
                  src={h.heroImage}
                  alt={h.nameZh || h.name}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BrandLogo
                    brandSlug={h.brand.slug}
                    brandNameZh={h.brand.nameZh}
                    groupColor={h.brand.group.logoColor ?? "#b8956b"}
                    size="sm"
                  />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{h.nameZh || h.name}</p>
              <p className="text-xs text-[#6b7280]">{h.cityZh} · {h.brand.nameZh}</p>
              {h.avgBasePrice != null && (
                <p className="mt-1 text-xs text-[#b8956b]">
                  {formatHotelPrice(h.avgBasePrice)} / 晚
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}