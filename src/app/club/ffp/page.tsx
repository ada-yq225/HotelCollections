import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plane, Globe, Layers } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  FFP_PROGRAMS,
  FFP_BY_SLUG,
  ALLIANCE_DETAILS,
  ALLIANCE_FFP,
  type FFPAlliance,
} from "@/data/ffp-programs";
import { calcFFPProgress, getAllianceBenefits } from "@/lib/ffp-loyalty";
import { FFPStatusEditor } from "@/components/ffp/FFPStatusEditor";
import type { UserFFPRecord } from "@/lib/ffp-loyalty";
import type { AirlineAllianceSlug } from "@/data/airlines";

export default async function FFPPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rows = await prisma.userFFPStatus.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const initialStatuses = rows.map((r) => ({
    programSlug: r.programSlug,
    tierSlug: r.tierSlug,
    milesYTD: r.milesYTD,
    segmentsYTD: r.segmentsYTD,
    memberNumber: r.memberNumber ?? "",
  }));

  const userRecords: UserFFPRecord[] = rows.map((r) => ({
    programSlug: r.programSlug,
    tierSlug: r.tierSlug,
    milesYTD: r.milesYTD,
    segmentsYTD: r.segmentsYTD,
    memberNumber: r.memberNumber ?? undefined,
  }));

  const allianceBenefits = getAllianceBenefits(userRecords);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/club"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#b8956b]"
      >
        <ArrowLeft className="h-4 w-4" />
        返回俱乐部
      </Link>

      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "#b8956b15" }}
        >
          <Plane className="h-7 w-7 text-[#b8956b]" />
        </div>
        <div>
          <h1 className="font-serif text-4xl">飞行会籍中心</h1>
          <p className="mt-2 max-w-2xl text-[#6b7280]">
            管理你的航空公司常旅客计划（FFP）。追踪定级里程/航段进度、联盟互认权益、跨航司累积策略。
          </p>
        </div>
      </div>

      {/* Alliance recognition */}
      {allianceBenefits.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-serif text-lg">联盟权益识别</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allianceBenefits.map(({ alliance, details, programs, maxTierNameZh }) => (
              <div key={alliance} className="hc-card p-5">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: details.color }} />
                  <h3 className="font-serif text-lg">{details.nameZh}</h3>
                </div>
                <p className="mt-1 text-xs text-[#9ca3af]">{details.desc.substring(0, 80)}...</p>
                <div className="mt-3 rounded-lg bg-[#faf6f0] p-3">
                  <p className="text-xs text-[#6b7280]">
                    你的最高等级：<span className="font-semibold text-[#1a1a1a]">{maxTierNameZh}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#9ca3af]">
                    通过 {programs.map((p) => p.nameZh).join(" / ")} 获得
                  </p>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-[#6b7280]">
                  <li>✓ 全球贵宾室 + 优先服务</li>
                  <li>✓ 额外行李额</li>
                  <li>✓ 优先登机/值机/行李</li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My FFP Status */}
      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl">我的飞行会籍</h2>
        <FFPStatusEditor
          initialStatuses={initialStatuses}
          programs={FFP_PROGRAMS}
        />
      </section>

      {/* Upgrade progress */}
      {initialStatuses.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl">升保级进度一览</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {initialStatuses.map((s) => {
              const program = FFP_PROGRAMS.find((p) => p.slug === s.programSlug);
              const tier = program?.tiers.find((t) => t.slug === s.tierSlug);
              const progress = calcFFPProgress(s.programSlug, s.tierSlug, s.milesYTD, s.segmentsYTD);
              if (!program || !tier || !progress) return null;
              return (
                <div key={s.programSlug} className="hc-card p-5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: program.color }} />
                    <span className="font-medium">{program.nameZh}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#6b7280]">{tier.nameZh}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8e8e8]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress.milesProgress}%`,
                        backgroundColor: program.color,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#9ca3af]">
                    {s.milesYTD.toLocaleString()} / {progress.milesRequired.toLocaleString()} 英里
                    {progress.milesRemaining > 0 && ` · 还差 ${progress.milesRemaining.toLocaleString()}`}
                  </p>
                  {progress.segmentsRequired > 0 && (
                    <p className="text-[11px] text-[#9ca3af]">
                      或 {s.segmentsYTD} / {progress.segmentsRequired} 航段
                    </p>
                  )}
                  {progress.nextTier && (
                    <p className="mt-1 text-xs font-medium text-[#b8956b]">
                      下一级：{progress.nextTier.nameZh}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Alliance comparison table */}
      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5 text-[#b8956b]" />
          <h2 className="font-serif text-2xl">联盟与航司对照</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {(Object.keys(ALLIANCE_DETAILS) as FFPAlliance[]).map((alliance) => {
            const d = ALLIANCE_DETAILS[alliance];
            const programs = ALLIANCE_FFP[alliance];
            return (
              <div key={alliance} className="hc-card overflow-hidden">
                <div
                  className="border-b border-[#e8e8e8] px-5 py-4"
                  style={{ borderLeftWidth: 4, borderLeftColor: d.color }}
                >
                  <h3 className="font-serif text-lg">{d.nameZh}</h3>
                  <p className="mt-1 text-xs text-[#6b7280] leading-relaxed">{d.desc}</p>
                </div>
                <div className="p-5">
                  <ul className="space-y-2">
                    {programs.map((p) => (
                      <li key={p.slug} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="font-medium">{p.nameZh}</span>
                        <span className="text-xs text-[#9ca3af]">({p.name})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* All FFP programs tier comparison */}
      <section className="mt-12">
        <h2 className="mb-4 font-serif text-2xl">全部常旅客计划等级阶梯</h2>
        <div className="space-y-6">
          {FFP_PROGRAMS.map((program) => (
            <div key={program.slug} className="hc-card overflow-hidden">
              <div
                className="border-b border-[#e8e8e8] px-6 py-4"
                style={{ borderLeftWidth: 4, borderLeftColor: program.color }}
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl">{program.nameZh}</h3>
                  {program.alliance && (
                    <span className="rounded-full bg-[#f0f0f0] px-2 py-0.5 text-[10px] text-[#6b7280]">
                      {ALLIANCE_DETAILS[program.alliance].nameZh}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#6b7280]">{program.name} · {program.airlineIata}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-[#e8e8e8] bg-[#fafafa] text-left text-xs text-[#9ca3af]">
                      <th className="px-4 py-3 font-medium">等级</th>
                      <th className="px-4 py-3 font-medium">定级要求</th>
                      <th className="px-4 py-3 font-medium">联盟等级</th>
                      <th className="px-4 py-3 font-medium">核心权益</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.tiers.map((tier) => (
                      <tr key={tier.slug} className="border-b border-[#f0f0f0]">
                        <td className="px-4 py-3 font-medium">{tier.nameZh}</td>
                        <td className="px-4 py-3 text-[#6b7280]">
                          {tier.milesToEarn
                            ? `${tier.milesToEarn.toLocaleString()} 英里`
                            : "—"}
                          {tier.segmentsToEarn && ` / ${tier.segmentsToEarn} 段`}
                        </td>
                        <td className="px-4 py-3">
                          {tier.allianceTier ? (
                            <span className="rounded-full bg-[#faf6f0] px-2 py-0.5 text-xs text-[#b8956b]">
                              {tier.allianceTier === "platinum" ? "绿宝石" : tier.allianceTier === "gold" ? "金卡" : "银卡"}
                            </span>
                          ) : (
                            <span className="text-xs text-[#9ca3af]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#6b7280]">
                          {tier.benefits.map((b) => b.title).join(" · ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-[#e8e8e8] bg-[#fafafa] px-6 py-3">
                <div className="flex flex-wrap gap-2 text-[11px] text-[#9ca3af]">
                  {program.highlights.map((h, i) => (
                    <span key={i} className="rounded-full bg-white px-2 py-0.5 border border-[#e8e8e8]">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
