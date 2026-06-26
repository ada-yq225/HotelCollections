import { FileText, ArrowUpCircle, Coffee, DoorOpen } from "lucide-react";
import { getBrandBenefitPolicy, getGroupBenefitPolicy } from "@/data/loyalty/brand-policies";

export function HotelBenefitPolicy({
  brandSlug,
  groupSlug,
  brandNameZh,
}: {
  brandSlug: string;
  groupSlug: string;
  brandNameZh: string;
}) {
  const policy = getBrandBenefitPolicy(brandSlug, groupSlug);
  const group = getGroupBenefitPolicy(groupSlug);

  return (
    <section className="rounded-2xl border border-[#e8e8e8] bg-white p-6">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-[#b8956b]" />
        <h2 className="font-serif text-xl font-semibold">结构化礼遇政策</h2>
      </div>
      <p className="mt-1 text-sm text-[#6b7280]">
        {brandNameZh} · 会员精英待遇与渠道预订参考
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <PolicyBlock icon={ArrowUpCircle} title="升级政策" text={policy.upgradePolicy} />
        <PolicyBlock icon={Coffee} title="早餐政策" text={policy.breakfastPolicy} />
        <PolicyBlock icon={DoorOpen} title="酒廊政策" text={policy.loungePolicy} />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium tracking-wide text-[#9ca3af] uppercase">
          {brandNameZh} 核心权益
        </p>
        <div className="space-y-2">
          {policy.eliteBenefits.map((b) => (
            <div
              key={b.title}
              className="flex items-start justify-between gap-4 rounded-xl bg-[#fafafa] px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{b.title}</p>
                <p className="mt-0.5 text-xs text-[#6b7280]">{b.detail}</p>
              </div>
              {b.appliesTo && (
                <span className="shrink-0 rounded-full bg-[#faf6f0] px-2 py-0.5 text-[10px] text-[#b8956b]">
                  {b.appliesTo}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {group && (
        <div className="mt-5 border-t border-[#f0f0f0] pt-5">
          <p className="mb-2 text-xs font-medium text-[#9ca3af]">{group.title}</p>
          <ul className="space-y-1.5">
            {group.policies.map((p) => (
              <li key={p.title} className="text-sm text-[#374151]">
                <span className="font-medium">{p.title}</span>
                <span className="text-[#9ca3af]"> — {p.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-[10px] leading-relaxed text-[#b0b0b0]">
        {policy.channelNotes}。政策因酒店而异，以入住时前台告知为准。
      </p>
    </section>
  );
}

function PolicyBlock({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof FileText;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#f0f0f0] p-4">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Icon className="h-4 w-4 text-[#b8956b]" />
        {title}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[#6b7280]">{text}</p>
    </div>
  );
}