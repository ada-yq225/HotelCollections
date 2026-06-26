import { getOtaPriceForHotel, getBestOtaPrice, estimateChinaOtaPriceRange } from "@/lib/china-ota-prices";
import { TrendingDown } from "lucide-react";

type Props = {
  slug: string;
  brandSlug: string;
  cityZh: string;
  avgBasePrice?: number | null;
  avgSuitePrice?: number | null;
};

export function HotelPriceComparison({ slug, brandSlug, cityZh, avgBasePrice, avgSuitePrice }: Props) {
  const otaPrice = getOtaPriceForHotel(slug);
  const estimated = !otaPrice ? estimateChinaOtaPriceRange(brandSlug, cityZh) : null;

  if (!otaPrice && !estimated && !avgBasePrice) return null;

  const displayMin = otaPrice?.ctripMin ?? estimated?.min ?? avgBasePrice ?? 0;
  const displayMax = otaPrice?.ctripMax ?? estimated?.max ?? (avgBasePrice ? Math.round(avgBasePrice * 1.4) : 0);

  const formatPrice = (n: number) => `¥${n.toLocaleString("zh-CN")}`;

  const best = otaPrice ? getBestOtaPrice(otaPrice) : null;

  return (
    <div className="rounded-xl border border-[#e8e8e8] bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <TrendingDown className="h-5 w-5 text-[#b8956b]" />
        <h4 className="font-serif text-base font-semibold text-[#1a1a1a]">国内平台价格参考</h4>
      </div>

      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-[#b8956b]">
          {formatPrice(displayMin)}
        </span>
        <span className="text-sm text-[#9ca3af]">- {formatPrice(displayMax)}</span>
        <span className="text-xs text-[#9ca3af]">/ 晚</span>
      </div>

      {best && (
        <p className="mb-3 text-xs text-green-600">
          💰 {best.platform}最低 {formatPrice(best.minPrice)} 起
        </p>
      )}

      {otaPrice && (
        <div className="space-y-1.5">
          <PriceRow platform="携程" min={otaPrice.ctripMin} max={otaPrice.ctripMax} isBest={best?.platform === "携程"} />
          <PriceRow platform="飞猪" min={otaPrice.fliggyMin} max={otaPrice.fliggyMax} isBest={best?.platform === "飞猪"} />
          {otaPrice.meituanMin != null && (
            <PriceRow platform="美团" min={otaPrice.meituanMin} max={otaPrice.meituanMax!} isBest={best?.platform === "美团"} />
          )}
          {otaPrice.qunarMin != null && (
            <PriceRow platform="去哪儿" min={otaPrice.qunarMin} max={otaPrice.qunarMax!} isBest={best?.platform === "去哪儿"} />
          )}
        </div>
      )}

      {!otaPrice && estimated && (
        <div className="space-y-1.5">
          <PriceRow platform="携程" min={estimated.min} max={estimated.max} />
          <PriceRow platform="飞猪" min={Math.round(estimated.min * 0.95)} max={Math.round(estimated.max * 0.95)} />
        </div>
      )}

      <p className="mt-3 text-[10px] leading-relaxed text-[#b0b0b0]">
        * 以上为各平台基础房型参考价格，实际价格以预订时为准。通过 H&C 专属礼遇预订可享额外权益。
      </p>
    </div>
  );
}

function PriceRow({
  platform,
  min,
  max,
  isBest = false,
}: {
  platform: string;
  min: number;
  max: number;
  isBest?: boolean;
}) {
  const formatPrice = (n: number) => `¥${n.toLocaleString("zh-CN")}`;
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${isBest ? "bg-[#f0fff4]" : "bg-[#f9f9f9]"}`}>
      <span className="font-medium text-[#1a1a1a]">
        {platform}
        {isBest && <span className="ml-1.5 text-xs text-green-600">最低价</span>}
      </span>
      <span className="text-[#6b7280]">
        {formatPrice(min)} - {formatPrice(max)}
      </span>
    </div>
  );
}
