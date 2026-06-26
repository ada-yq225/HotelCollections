import { Shield, Clock, AlertTriangle } from "lucide-react";
import { getPriceCredibility } from "@/lib/hotel-credibility";

export function PriceCredibilityPanel({
  slug,
  avgBasePrice,
  enrichedAt,
}: {
  slug: string;
  avgBasePrice?: number | null;
  enrichedAt?: Date | null;
}) {
  const cred = getPriceCredibility({ slug, avgBasePrice, enrichedAt });
  const isVerified = cred.source === "scraped";

  return (
    <div
      className={`rounded-xl border p-4 ${
        isVerified ? "border-blue-100 bg-blue-50/50" : "border-amber-100 bg-amber-50/50"
      }`}
    >
      <div className="flex items-center gap-2">
        {isVerified ? (
          <Shield className="h-4 w-4 text-blue-600" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        )}
        <span className={`text-sm font-medium ${isVerified ? "text-blue-800" : "text-amber-800"}`}>
          {cred.label}
        </span>
      </div>
      <p className="mt-1 text-xs text-[#6b7280]">{cred.detail}</p>
      {cred.updatedAt && (
        <p className="mt-2 flex items-center gap-1 text-[10px] text-[#9ca3af]">
          <Clock className="h-3 w-3" />
          最近同步：{new Date(cred.updatedAt).toLocaleDateString("zh-CN")}
        </p>
      )}
      {!isVerified && (
        <p className="mt-2 text-[10px] text-amber-700">
          H&C 仅展示官网/OTA 抓取实价，拒绝展示估算价格以保护决策准确性
        </p>
      )}
    </div>
  );
}