import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Crown, Layers, GitCompare } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  LOYALTY_PROGRAMS,
  BOOKING_CHANNELS,
  parseChannelSlugs,
  calcRetentionProgress,
} from "@/lib/loyalty";
import { LoyaltyStatusEditor } from "@/components/loyalty/LoyaltyStatusEditor";
import { GROUPS } from "@/data/meta";
import { GROUP_TOPIC_SLUGS } from "@/data/loyalty/group-guides";

export default async function ClubStatusPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rows = await prisma.userLoyaltyStatus.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const initialStatuses = rows.map((r) => ({
    programSlug: r.programSlug,
    tierSlug: r.tierSlug,
    nightsYTD: r.nightsYTD,
    channelSlugs: parseChannelSlugs(r.channelSlugs),
    memberNumber: r.memberNumber ?? "",
  }));

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
          <Crown className="h-7 w-7 text-[#b8956b]" />
        </div>
        <div>
          <h1 className="font-serif text-4xl">会籍中心</h1>
          <p className="mt-2 max-w-2xl text-[#6b7280]">
            管理五大集团会籍档案、预订渠道与保级进度。在酒店详情页自动匹配你的等级待遇与 Virtuoso / STARS / FHR 等渠道礼遇。
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-serif text-lg">集团专题 · 会籍对照</h2>
        <div className="flex flex-wrap gap-2">
          {GROUPS.filter((g) => (GROUP_TOPIC_SLUGS as readonly string[]).includes(g.slug)).map(
            (g) => (
              <Link
                key={g.slug}
                href={`/groups/${g.slug}`}
                className="rounded-full border border-[#e8e8e8] px-3 py-1.5 text-xs font-medium transition hover:border-[#b8956b]"
                style={{ color: g.logoColor }}
              >
                {g.nameZh} →
              </Link>
            )
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-serif text-2xl">我的会籍档案</h2>
        <LoyaltyStatusEditor
          initialStatuses={initialStatuses}
          programs={LOYALTY_PROGRAMS}
          channels={BOOKING_CHANNELS}
        />
      </section>

      {initialStatuses.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl">保级进度一览</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {initialStatuses.map((s) => {
              const program = LOYALTY_PROGRAMS.find((p) => p.slug === s.programSlug);
              const tier = program?.tiers.find((t) => t.slug === s.tierSlug);
              const retention = calcRetentionProgress(s.programSlug, s.tierSlug, s.nightsYTD);
              if (!program || !tier || !retention) return null;
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
                      style={{ width: `${retention.progress}%`, backgroundColor: program.color }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#9ca3af]">
                    {s.nightsYTD} / {retention.nightsRequired} 晚
                    {retention.nightsRemaining > 0 && ` · 还差 ${retention.nightsRemaining} 晚`}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5 text-[#b8956b]" />
          <h2 className="font-serif text-2xl">等级阶梯对照</h2>
        </div>
        <div className="space-y-6">
          {LOYALTY_PROGRAMS.map((program) => (
            <div key={program.slug} className="hc-card overflow-hidden">
              <div
                className="border-b border-[#e8e8e8] px-6 py-4"
                style={{ borderLeftWidth: 4, borderLeftColor: program.color }}
              >
                <h3 className="font-serif text-xl">{program.nameZh}</h3>
                <p className="text-sm text-[#6b7280]">{program.name}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-[#e8e8e8] bg-[#fafafa] text-left text-xs text-[#9ca3af]">
                      <th className="px-4 py-3 font-medium">等级</th>
                      <th className="px-4 py-3 font-medium">房晚</th>
                      <th className="px-4 py-3 font-medium">核心权益</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.tiers.map((tier) => (
                      <tr key={tier.slug} className="border-b border-[#f0f0f0]">
                        <td className="px-4 py-3 font-medium">{tier.nameZh}</td>
                        <td className="px-4 py-3 text-[#6b7280]">
                          {tier.nightsToEarn ? `${tier.nightsToEarn} 晚` : "—"}
                        </td>
                        <td className="px-4 py-3 text-[#6b7280]">
                          {tier.benefits.map((b) => b.title).join(" · ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-[#b8956b]" />
          <h2 className="font-serif text-2xl">预订渠道礼遇对比</h2>
        </div>
        <p className="mb-6 text-sm text-[#6b7280]">
          Virtuoso、Amex FHR、万豪 Luminous、凯悦 STARS 等渠道礼遇可与会员精英待遇叠加（视酒店政策）
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {BOOKING_CHANNELS.map((ch) => (
            <div key={ch.slug} className="hc-card p-5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: ch.color }} />
                <h3 className="font-serif text-lg">{ch.nameZh}</h3>
                {ch.stackable && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                    可叠加会籍
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[#6b7280]">{ch.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {ch.perks.map((p) => (
                  <li key={p.title} className="text-sm text-[#374151]">
                    <span className="font-medium">{p.title}</span>
                    <span className="text-[#9ca3af]"> — {p.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/club/benefits" className="text-sm text-[#b8956b] hover:underline">
            前往权益互助论坛讨论保级与礼遇 →
          </Link>
        </div>
      </section>
    </div>
  );
}