import { Sparkles } from "lucide-react";
import type { PremiumCabinProduct } from "@/data/flight-cabin-products";
import { formatFlightPriceLabel } from "@/data/flight-prices";
import { AirlineBadge } from "@/components/flights/AirlineBadge";
import { CabinImage } from "@/components/flights/CabinImage";
import { getAirline } from "@/data/airlines";
import { getScrapedPremiumProductPriceCny } from "@/lib/flight-prices-scraped";

export function PremiumCabinHighlights({ products }: { products: PremiumCabinProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-[#1a1a1a]">
        <Sparkles className="h-5 w-5 text-[#b8956b]" />
        本航线特色舱位
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-xl border border-[#b8956b]/40 bg-gradient-to-br from-[#faf6f0] to-white"
          >
            <div className="relative aspect-[16/9] bg-[#f0f0f0]">
              <CabinImage src={product.imageUrl} alt={product.nameZh} fallbackUrls={product.fallbackImageUrls} />
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-[#1a1a1a]">{product.nameZh}</p>
                  <p className="text-xs text-[#9ca3af]">{product.name}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-[#b8956b]">
                  {formatFlightPriceLabel(
                    getScrapedPremiumProductPriceCny(product.id) ?? null
                  )}
                </p>
              </div>
              <p className="text-xs leading-relaxed text-[#6b7280]">{product.descriptionZh}</p>
              <AirlineBadge airline={getAirline(product.airlineIata)} flightNumber="" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}