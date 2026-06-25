import { formatHotelPrice } from "@/lib/hotel-pricing";

type HotelPriceDisplayProps = {
  avgBasePrice: number;
  avgSuitePrice: number;
  suiteLabel?: string;
  /** Compact: single-line for list cards */
  compact?: boolean;
  className?: string;
};

export function HotelPriceDisplay({
  avgBasePrice,
  avgSuitePrice,
  suiteLabel = "特色套房",
  compact = false,
  className = "",
}: HotelPriceDisplayProps) {
  if (compact) {
    return (
      <p className={`text-sm text-[#374151] ${className}`}>
        <span className="font-medium text-[#b8956b]">{formatHotelPrice(avgBasePrice)}</span>
        <span className="text-xs text-[#9ca3af]"> 起/晚</span>
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
        <p className="mt-1 text-xs text-[#6b7280]">标准客房 / 豪华客房参考价</p>
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
        价格优先取自酒店官网公开起价，并结合品牌与目的地市场数据校准（人民币/晚），实际以预订时房态为准。
      </p>
    </div>
  );
}