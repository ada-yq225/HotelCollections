"use client";

import { useState } from "react";
import { Calculator, Hotel, Plane, TrendingUp, CreditCard, ArrowRight } from "lucide-react";
import { HOTEL_EARNING_RATES, AIRLINE_EARNING_RATES, calculatePoints, POINTS_TRANSFERS, PROGRAM_EARNING_BY_SLUG } from "@/data/loyalty/points-earning";
import { LOYALTY_PROGRAMS } from "@/data/loyalty/programs";
import { FFP_PROGRAMS } from "@/data/ffp-programs";

export function PointsCalculator() {
  const [mode, setMode] = useState<"hotel" | "airline" | "transfer">("hotel");
  const [programSlug, setProgramSlug] = useState("marriott-bonvoy");
  const [eliteTier, setEliteTier] = useState("member");
  const [spending, setSpending] = useState(5000);

  const currentProgram = mode === "hotel"
    ? HOTEL_EARNING_RATES.find((p) => p.programSlug === programSlug)
    : AIRLINE_EARNING_RATES.find((p) => p.programSlug === programSlug);

  const result = currentProgram ? calculatePoints(spending, currentProgram.programSlug, eliteTier) : null;

  const tiers = mode === "hotel"
    ? LOYALTY_PROGRAMS.find((p) => p.slug === programSlug)?.tiers || []
    : FFP_PROGRAMS.find((p) => p.slug === programSlug)?.tiers || [];

  const programs = mode === "hotel" ? HOTEL_EARNING_RATES : AIRLINE_EARNING_RATES;
  const currentTier = tiers.find((t: any) => t.slug === eliteTier);

  const filteredTransfers = mode === "transfer"
    ? POINTS_TRANSFERS.filter((t) => t.fromProgram === programSlug)
    : [];

  return (
    <div>
      {/* Mode selector */}
      <div className="mb-6 flex gap-2">
        {[
          { key: "hotel" as const, icon: Hotel, label: "酒店积分" },
          { key: "airline" as const, icon: Plane, label: "飞行里程" },
          { key: "transfer" as const, icon: ArrowRight, label: "积分转换" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => { setMode(key); setProgramSlug(key === "hotel" ? "marriott-bonvoy" : key === "airline" ? "phoenix-miles" : "marriott-bonvoy"); }}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
              mode === key
                ? "border-[#b8956b] bg-[#faf6f0] text-[#b8956b] font-medium"
                : "border-[#e8e8e8] text-[#6b7280] hover:border-[#d0d0d0]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {mode !== "transfer" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div className="space-y-4 rounded-xl border border-[#e8e8e8] bg-white p-6">
            <label className="block text-sm font-medium">常旅客计划</label>
            <select
              value={programSlug}
              onChange={(e) => setProgramSlug(e.target.value)}
              className="w-full rounded-lg border border-[#e8e8e8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b8956b]"
            >
              {programs.map((p) => (
                <option key={p.programSlug} value={p.programSlug}>{p.nameZh}</option>
              ))}
            </select>

            <label className="block text-sm font-medium">当前会籍等级</label>
            <select
              value={eliteTier}
              onChange={(e) => setEliteTier(e.target.value)}
              className="w-full rounded-lg border border-[#e8e8e8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b8956b]"
            >
              {tiers.map((t: any) => (
                <option key={t.slug} value={t.slug}>{t.nameZh}</option>
              ))}
            </select>

            <label className="block text-sm font-medium">预计消费金额 (¥)</label>
            <div className="flex gap-3">
              {[2000, 5000, 10000, 25000, 50000].map((v) => (
                <button
                  key={v}
                  onClick={() => setSpending(v)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                    spending === v
                      ? "border-[#b8956b] bg-[#faf6f0] text-[#b8956b]"
                      : "border-[#e8e8e8] text-[#6b7280] hover:border-[#d0d0d0]"
                  }`}
                >
                  {v >= 10000 ? `${v / 10000}万` : v.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                value={spending}
                onChange={(e) => setSpending(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-[#e8e8e8] bg-white px-3 py-2.5 text-lg font-semibold outline-none focus:border-[#b8956b]"
                min={0}
                max={1000000}
              />
            </div>

            {currentProgram?.recommendedCards && currentProgram.recommendedCards.length > 0 && (
              <div className="mt-4 rounded-xl bg-[#faf6f0] p-4">
                <p className="flex items-center gap-1.5 text-xs font-medium text-[#b8956b]">
                  <CreditCard className="h-3.5 w-3.5" />推荐信用卡
                </p>
                <ul className="mt-2 space-y-2">
                  {currentProgram.recommendedCards.map((card) => (
                    <li key={card.name} className="text-xs text-[#6b7280]">
                      <span className="font-medium text-[#1a1a1a]">{card.name}</span>
                      <span className="ml-1">— {card.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="rounded-xl border border-[#e8e8e8] bg-white p-6">
              <p className="text-xs text-[#9ca3af]">预计获得</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-4xl font-semibold text-[#1a1a1a]">
                  {result?.total.toLocaleString()}
                </span>
                <span className="text-sm text-[#6b7280]">{mode === "hotel" ? "积分" : "里程"}</span>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">基础{mode === "hotel" ? "积分" : "里程"}</span>
                  <span className="font-medium">{result?.basePoints.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">
                    {currentTier?.nameZh || "会员"}加赠
                    {currentProgram && `（${Math.round((currentProgram.rate.eliteBonus[eliteTier] || 0) * 100)}%）`}
                  </span>
                  <span className="font-medium text-[#b8956b]">+{result?.eliteBonus.toLocaleString()}</span>
                </div>
                <div className="border-t border-[#e8e8e8] pt-2 flex justify-between font-medium">
                  <span>合计</span>
                  <span className="text-lg">{result?.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Milestones */}
            {result?.milestoneReached && result.milestoneReached.length > 0 && (
              <div className="rounded-xl border border-[#e8e8e8] bg-white p-6">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 text-[#b8956b]" />里程碑奖励（达到房晚时获得）
                </p>
                <div className="mt-3 space-y-2">
                  {result.milestoneReached.map((m) => (
                    <div key={m.nights} className="flex justify-between rounded-lg bg-[#fafafa] px-3 py-2 text-sm">
                      <span>{m.nights} 晚</span>
                      <span className="font-medium">+{m.bonus.toLocaleString()} 分</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Night equivalent */}
            {mode === "hotel" && currentProgram && (
              <div className="rounded-xl border border-[#e8e8e8] bg-white p-4">
                <p className="text-xs text-[#9ca3af]">
                  按 ¥{spending.toLocaleString()} 消费估算 ≈ 
                  <span className="font-medium text-[#1a1a1a]">
                    {currentProgram.rate.basePointsPerCNY < 1
                      ? `约 ${Math.round(spending / 2000)} 晚住宿`
                      : `约 ${Math.round(spending / 1500)} 晚住宿`}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Transfer mode */
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#e8e8e8] bg-white p-6">
            <label className="block text-sm font-medium">来源计划</label>
            <select
              value={programSlug}
              onChange={(e) => setProgramSlug(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e8e8e8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b8956b]"
            >
              {[...HOTEL_EARNING_RATES, { programSlug: "cmb-centurion", nameZh: "招行运通百夫长", name: "招商银行" } as any].map((p: any) => (
                <option key={p.programSlug} value={p.programSlug}>{p.nameZh}</option>
              ))}
            </select>

            <div className="mt-6">
              <p className="text-sm font-medium text-[#1a1a1a]">可转换至</p>
              {filteredTransfers.length === 0 ? (
                <p className="mt-4 text-sm text-[#9ca3af]">该计划暂无积分转换数据</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {filteredTransfers.map((t, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-[#faf6f0] p-4">
                      <div>
                        <p className="text-sm font-medium">{t.toName}</p>
                        <p className="text-xs text-[#9ca3af]">{t.note || ""}</p>
                      </div>
                      <div className="text-right">
                        <span className="rounded-full bg-[#b8956b]/10 px-3 py-1 text-sm font-semibold text-[#b8956b]">
                          {t.ratio}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#e8e8e8] bg-white p-6">
            <p className="text-sm font-medium">快速计算</p>
            <p className="mt-2 text-xs text-[#9ca3af]">输入积分数量，计算转换结果</p>
            <input
              type="number"
              defaultValue={60000}
              className="mt-3 w-full rounded-lg border border-[#e8e8e8] bg-white px-3 py-2.5 text-lg font-semibold outline-none focus:border-[#b8956b]"
              placeholder="输入积分数量"
              id="transfer-amount"
            />
            <div className="mt-4 space-y-2">
              {filteredTransfers.map((t, i) => {
                const [from, to] = t.ratio.split(":").map(Number);
                return (
                  <div key={i} className="flex justify-between rounded-lg bg-[#fafafa] px-3 py-2 text-sm">
                    <span>{t.toName}</span>
                    <span className="font-medium">
                      ≈ {Math.round(60000 * (to / from)).toLocaleString()} {t.toName.includes("万豪") ? "积分" : "里程"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
