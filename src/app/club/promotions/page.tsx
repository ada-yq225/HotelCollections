import { PROMOTIONS_2026, getActivePromos, getPromosByQuarter } from "@/data/loyalty/promotions";
import { Calendar, Clock, ExternalLink, Tag, TrendingUp, Gift } from "lucide-react";

const TYPE_ICONS: Record<string, { icon: any; label: string }> = {
  "double-points": { icon: TrendingUp, label: "双倍积分" },
  "bonus-nights": { icon: Calendar, label: "房晚加速" },
  "flash-sale": { icon: Tag, label: "闪促" },
  "status-boost": { icon: Gift, label: "会籍加速" },
  "points-buy": { icon: Tag, label: "积分闪购" },
  other: { icon: Calendar, label: "其他促销" },
};

export default function PromotionsPage() {
  const active = getActivePromos();
  const byQuarter = getPromosByQuarter();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#e8e8e8] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#faf6f0_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <p className="mb-3 text-xs font-medium tracking-[0.25em] text-[#b8956b] uppercase">Promotions</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">促销活动日历</h1>
          <p className="mt-3 max-w-xl text-[#6b7280]">
            五大酒店集团 Q1-Q4 促销时间线。哪些活动已开放注册、何时入住最划算，一目了然。
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-medium text-[#16a34a]">
              <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
              {active.length} 个活动可注册
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Active / Coming Soon */}
        {active.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 font-serif text-xl font-semibold flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#16a34a] animate-pulse" />
              当前可注册
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {active.map((promo) => {
                const typeInfo = TYPE_ICONS[promo.promoType] || TYPE_ICONS.other;
                const Icon = typeInfo.icon;
                return (
                  <div
                    key={promo.id}
                    className="relative overflow-hidden rounded-xl border-2 border-[#16a34a]/20 bg-white p-6 transition hover:border-[#16a34a]/50"
                  >
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-[#dcfce7] px-3 py-1.5 text-xs font-medium text-[#16a34a]">
                      可注册
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: promo.color + "10" }}
                      >
                        <Icon className="h-5 w-5" style={{ color: promo.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium" style={{ color: promo.color }}>
                          {promo.groupNameZh}
                        </p>
                        <h3 className="mt-1 font-serif text-lg font-semibold">{promo.titleZh}</h3>
                        <p className="mt-2 text-sm text-[#6b7280]">{promo.description}</p>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs">
                          <span className="flex items-center gap-1 text-[#6b7280]">
                            <Calendar className="h-3.5 w-3.5" />
                            注册截止：{promo.registrationEnd}
                          </span>
                          <span className="flex items-center gap-1 text-[#6b7280]">
                            <Clock className="h-3.5 w-3.5" />
                            入住期间：{promo.stayStart} ~ {promo.stayEnd}
                          </span>
                        </div>
                        <div className="mt-3 rounded-lg bg-[#faf6f0] p-3">
                          <p className="text-xs font-medium text-[#b8956b]">奖励</p>
                          <p className="text-sm font-semibold">{promo.bonusDetail}</p>
                        </div>
                        {promo.tips.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {promo.tips.map((tip, i) => (
                              <p key={i} className="flex items-start gap-1.5 text-xs text-[#6b7280]">
                                <span className="text-[#b8956b]">•</span>
                                {tip}
                              </p>
                            ))}
                          </div>
                        )}
                        {promo.link && (
                          <a
                            href={promo.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#b8956b] hover:underline"
                          >
                            立即注册 <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All by quarter */}
        <h2 className="mb-6 font-serif text-xl font-semibold">全年促销一览</h2>
        {(["Q2", "Q3", "Q4"] as const).map((q) => {
          const promos = byQuarter[q];
          if (promos.length === 0) return null;
          return (
            <div key={q} className="mb-8">
              <h3 className="mb-4 text-sm font-semibold text-[#9ca3af]">{q}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {promos.map((promo) => {
                  const typeInfo = TYPE_ICONS[promo.promoType] || TYPE_ICONS.other;
                  const Icon = typeInfo.icon;
                  const isActive = active.some((a) => a.id === promo.id);
                  return (
                    <div
                      key={promo.id}
                      className={`rounded-xl border bg-white p-5 transition ${
                        isActive ? "border-[#16a34a]/30" : "border-[#e8e8e8] hover:border-[#d0d0d0]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{ backgroundColor: promo.color + "10" }}
                        >
                          <Icon className="h-4 w-4" style={{ color: promo.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium" style={{ color: promo.color }}>
                              {promo.groupNameZh}
                            </p>
                            <span className="rounded-full bg-[#f0f0f0] px-2 py-0.5 text-[10px] text-[#9ca3af]">
                              {typeInfo.label}
                            </span>
                            {isActive && (
                              <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-medium text-[#16a34a]">
                                进行中
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-medium">{promo.titleZh}</h4>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#9ca3af]">
                        <span>{promo.stayStart} ~ {promo.stayEnd}</span>
                      </div>
                      <div className="mt-2 rounded bg-[#fafafa] px-3 py-1.5 text-xs">
                        <span className="font-medium text-[#1a1a1a]">{promo.bonusDetail}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
