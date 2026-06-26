import { Sun, FileText } from "lucide-react";
import { getSeasonInfo, getVisaInfo } from "@/data/travel/season-visa";

export function SeasonVisaPanel({
  region,
  countryCode,
  country,
}: {
  region: string;
  countryCode: string;
  country: string;
}) {
  const season = getSeasonInfo(region, countryCode);
  const visa = getVisaInfo(countryCode);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-[#e8e8e8] p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sun className="h-5 w-5 text-[#b8956b]" />
          <h4 className="font-serif text-base font-semibold">最佳出行季节</h4>
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-emerald-600 font-medium">最佳：</span>
            {season.best.join("、")}
          </p>
          <p>
            <span className="text-blue-600 font-medium">尚可：</span>
            {season.good.join("、")}
          </p>
          <p>
            <span className="text-amber-600 font-medium">避开：</span>
            {season.avoid.join("、")}
          </p>
        </div>
        <p className="mt-3 text-xs text-[#6b7280]">{season.tip}</p>
      </div>

      <div className="rounded-xl border border-[#e8e8e8] p-5">
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#b8956b]" />
          <h4 className="font-serif text-base font-semibold">签证快览 · {country}</h4>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#6b7280]">政策</dt>
            <dd className="font-medium text-right">{visa.policy}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#6b7280]">停留</dt>
            <dd className="font-medium text-right">{visa.stay}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-[#6b7280]">{visa.note}</p>
        {visa.evisa && (
          <span className="mt-2 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">
            支持电子签
          </span>
        )}
      </div>
    </div>
  );
}