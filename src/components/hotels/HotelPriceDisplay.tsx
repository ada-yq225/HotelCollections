import { formatHotelPrice } from "@/lib/hotel-pricing";
import { estimateOtaPrices, formatOtaPriceRange } from "@/lib/china-ota-prices";

type HotelPriceDisplayProps = {
  avgBasePrice: number;
  avgSuitePrice: number;
  suiteLabel?: string;
  /** Compact: single-line for list cards */
  compact?: boolean;
  className?: string;
  fromOfficial?: boolean;
  /** 酒店品牌slug，用于OTA价格估算 */
  brandSlug?: string;
  /** 酒店城市中文名，用于OTA价格估算 */
  cityZh?: string;
};

export function HotelPriceDisplay({
  avgBasePrice,
  avgSuitePrice,
  suiteLabel = "特色套房",
  compact = false,
  className = "",
  fromOfficial = true,
  brandSlug,
  cityZh,
}: HotelPriceDisplayProps) {
  if (compact) {
    return (
      <p className={`text-sm text-[#374151] ${className}`}>
        <span className="font-medium text-[#b8956b]">{formatHotelPrice(avgBasePrice)}</span>
        <span className="text-xs text-[#9ca3af]"> 起/晚{fromOfficial ? " · 官网" : ""}</span>
        <span className="mx-1.5 text-[#e8e8e8]">·</span>
        <span className="text-xs text-[#6b7280]">
          {suiteLabel} {formatHotelPrice(avgSuitePrice)}
        </span>
      </p>
    );
  }

  return (
    <div
      className={`grid gap-3 rounded-xl border border-[#e8e8e8] bg-[#fafafa] p-4 sm:grid-cols-2 ${className}`}
    >
      <div>
        <p className="text-xs text-[#9ca3af]">基础房型均价</p>
        <p className="mt-1 font-serif text-2xl font-semibold text-[#1a1a1a]">
          {formatHotelPrice(avgBasePrice)}
          <span className="ml-1 font-sans text-sm font-normal text-[#9ca3af]">/ 晚</span>
        </p>
        <p className="mt-1 text-xs text-[#6b7280]">官网公开起价（标准客房）</p>
      </div>
      <div className="sm:border-l sm:border-[#e8e8e8] sm:pl-4">
        <p className="text-xs text-[#9ca3af]">{suiteLabel}均价</p>
        <p className="mt-1 font-serif text-2xl font-semibold text-[#b8956b]">
          {formatHotelPrice(avgSuitePrice)}
          <span className="ml-1 font-sans text-sm font-normal text-[#9ca3af]">/ 晚</span>
        </p>
        <p className="mt-1 text-xs text-[#6b7280]">套房、别墅、泳池别墅等高端房型</p>
      </div>
      <p className="col-span-full text-[11px] leading-relaxed text-[#9ca3af]">
        价格取自酒店官网公开起价（人民币/晚），不含税费与服务费；实际以预订时房态为准。
      </p>

      {/* 中国OTA平台价格参考 */}
      {brandSlug && cityZh && (
        <OtaPriceSection
          brandSlug={brandSlug}
          cityZh={cityZh}
          officialBasePrice={avgBasePrice}
        />
      )}
    </div>
  );
}

/** 中国OTA平台价格参考子组件 */
function OtaPriceSection({
  brandSlug,
  cityZh,
  officialBasePrice,
}: {
  brandSlug: string;
  cityZh: string;
  officialBasePrice: number;
}) {
  const otaPrices = estimateOtaPrices(brandSlug, cityZh, officialBasePrice);

  return (
    <div className="col-span-full mt-3 border-t border-[#f0ece6] pt-3">
      <p className="mb-2 text-xs font-medium text-[#6b7280]">
        中国OTA平台参考价（估算）
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4">
        {otaPrices.entries.map((entry) => (
          <div key={entry.platform} className="text-xs">
            <span className="text-[#9ca3af]">{entry.labelZh}</span>
            <p className="font-medium text-[#374151]">
              {formatOtaPriceRange(entry.minPrice, entry.maxPrice)}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-[#b0b0b0]">
        以上为中国主流OTA平台估算参考价格，实际价格以各平台实时查询为准。携程(Ctrip)、飞猪(Fliggy)、美团酒店、去哪儿提供不同渠道的预订价格。
      </p>
    </div>
  );
}