import Link from "next/link";
import { Crown, GitCompare, ArrowRight, Layers } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseChannelSlugs } from "@/lib/loyalty";
import {
  buildTierMatrix,
  buildChannelMatrix,
  getGroupLoyaltyPageData,
  getUserGroupLoyaltyContext,
} from "@/lib/group-loyalty-page";
import { CHANNEL_BY_SLUG } from "@/lib/loyalty";

type Props = {
  groupSlug: string;
  groupNameZh: string;
  groupColor: string;
};

export async function GroupLoyaltyComparison({
  groupSlug,
  groupNameZh,
  groupColor,
}: Props) {
  const { program, channels, guide, hasLoyaltyProgram } =
    getGroupLoyaltyPageData(groupSlug);

  const user = await getCurrentUser();
  let userRecord: {
    programSlug: string;
    tierSlug: string;
    nightsYTD: number;
    channelSlugs: string[];
  } | null = null;

  if (user && program) {
    const row = await prisma.userLoyaltyStatus.findUnique({
      where: {
        userId_programSlug: { userId: user.id, programSlug: program.slug },
      },
    });
    if (row) {
      userRecord = {
        programSlug: row.programSlug,
        tierSlug: row.tierSlug,
        nightsYTD: row.nightsYTD,
        channelSlugs: parseChannelSlugs(row.channelSlugs),
      };
    }
  }

  const userCtx = getUserGroupLoyaltyContext(program, userRecord);
  const tierMatrix = program ? buildTierMatrix(program, userRecord?.tierSlug) : [];
  const displayChannels =
    guide?.recommendedChannelSlugs
      .map((s) => CHANNEL_BY_SLUG[s])
      .filter(Boolean) ?? channels;

  const { rows: channelRows } = buildChannelMatrix(displayChannels);

  return (
    <section className="mb-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${groupColor}15` }}
          >
            <Crown className="h-6 w-6" style={{ color: groupColor }} />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold">会籍礼遇对照</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              {groupNameZh} · 等级阶梯与预订渠道矩阵
            </p>
          </div>
        </div>
        <Link
          href="/club/status"
          className="inline-flex items-center gap-1 text-sm text-[#b8956b] hover:underline"
        >
          编辑我的会籍 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {user ? (
        userCtx && userCtx.tier ? (
          <div
            className="mb-6 rounded-2xl border p-5"
            style={{ borderColor: `${groupColor}40`, backgroundColor: `${groupColor}08` }}
          >
            <p className="text-sm text-[#6b7280]">你的 {groupNameZh} 会籍</p>
            <p className="mt-1 font-serif text-xl font-semibold" style={{ color: groupColor }}>
              {program?.nameZh} · {userCtx.tier.nameZh}
            </p>
            {userCtx.retention && userCtx.retention.nightsRequired > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-[#6b7280]">
                  <span>保级进度</span>
                  <span>
                    {userRecord!.nightsYTD} / {userCtx.retention.nightsRequired} 晚
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/80">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${userCtx.retention.progress}%`,
                      backgroundColor: groupColor,
                    }}
                  />
                </div>
              </div>
            )}
            {userCtx.channelSlugs.length > 0 && (
              <p className="mt-3 text-xs text-[#6b7280]">
                已选渠道：
                {userCtx.channelSlugs
                  .map((s) => CHANNEL_BY_SLUG[s]?.nameZh ?? s)
                  .join(" · ")}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-dashed border-[#e8e8e8] bg-[#fafafa] p-5 text-sm text-[#6b7280]">
            {hasLoyaltyProgram ? (
              <>
                尚未设置 {program?.nameZh} 会籍。
                <Link href="/club/status" className="ml-1 text-[#b8956b] hover:underline">
                  前往会籍中心添加 →
                </Link>
              </>
            ) : (
              <>
                {groupNameZh} 无集团积分计划，建议通过下方渠道预订获取礼遇。
                <Link href="/login" className="ml-1 text-[#b8956b] hover:underline">
                  登录
                </Link>
                后可保存渠道偏好。
              </>
            )}
          </div>
        )
      ) : (
        <div className="mb-6 rounded-2xl border border-[#e8e8e8] bg-[#faf6f0] p-5 text-sm text-[#6b7280]">
          <Link href="/login" className="font-medium text-[#b8956b] hover:underline">
            登录
          </Link>
          后高亮你的等级行，并查看个人保级进度
        </div>
      )}

      {guide && !hasLoyaltyProgram && (
        <div className="mb-6 hc-card p-6">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#b8956b]" />
            <h3 className="font-serif text-lg">
              {guide.programLabel ? `${guide.programLabel} · ` : ""}
              预订礼遇指南
            </h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#374151]">{guide.summary}</p>
          <ul className="mt-4 space-y-2">
            {guide.tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-[#6b7280]">
                <span className="text-[#b8956b]">·</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {program && tierMatrix.length > 0 && (
        <div className="mb-8 hc-card overflow-hidden">
          <div
            className="border-b border-[#e8e8e8] px-6 py-4"
            style={{ borderLeftWidth: 4, borderLeftColor: groupColor }}
          >
            <h3 className="font-serif text-lg">{program.nameZh} 等级矩阵</h3>
            <p className="text-xs text-[#9ca3af]">横向对比各等级核心待遇差异</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[#e8e8e8] bg-[#fafafa] text-left text-xs text-[#9ca3af]">
                  <th className="px-4 py-3 font-medium">等级</th>
                  <th className="px-4 py-3 font-medium">房晚</th>
                  <th className="px-4 py-3 font-medium">积分</th>
                  <th className="px-4 py-3 font-medium">升级</th>
                  <th className="px-4 py-3 font-medium">早餐</th>
                  <th className="px-4 py-3 font-medium">酒廊</th>
                  <th className="px-4 py-3 font-medium">退房</th>
                </tr>
              </thead>
              <tbody>
                {tierMatrix.map((row) => (
                  <tr
                    key={row.slug}
                    className={`border-b border-[#f0f0f0] ${
                      row.isUserTier ? "bg-[#faf6f0] ring-1 ring-inset ring-[#b8956b]/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {row.nameZh}
                      {row.isUserTier && (
                        <span className="ml-2 rounded-full bg-[#b8956b] px-2 py-0.5 text-[10px] text-white">
                          你的等级
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">{row.nights}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{row.points}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{row.upgrade}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{row.breakfast}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{row.lounge}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{row.checkout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {displayChannels.length > 0 && (
        <div className="hc-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#e8e8e8] px-6 py-4">
            <GitCompare className="h-5 w-5 text-[#b8956b]" />
            <div>
              <h3 className="font-serif text-lg">预订渠道礼遇矩阵</h3>
              <p className="text-xs text-[#9ca3af]">
                Virtuoso / FHR / STARS 等 · ✓ 表示通常包含
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-[#e8e8e8] bg-[#fafafa]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af]">
                    礼遇
                  </th>
                  {displayChannels.map((ch) => (
                    <th
                      key={ch.slug}
                      className="px-4 py-3 text-center text-xs font-medium"
                      style={{ color: ch.color }}
                    >
                      {ch.nameZh}
                      {ch.stackable && (
                        <span className="mt-0.5 block text-[10px] font-normal text-emerald-600">
                          可叠加
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {channelRows.map((row) => (
                  <tr key={row.perk} className="border-b border-[#f0f0f0]">
                    <td className="px-4 py-3 font-medium text-[#374151]">{row.perk}</td>
                    {displayChannels.map((ch) => (
                      <td
                        key={ch.slug}
                        className={`px-4 py-3 text-center ${
                          row.values[ch.slug] === "✓"
                            ? "font-medium text-emerald-600"
                            : "text-[#d4d4d4]"
                        }`}
                      >
                        {row.values[ch.slug] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 border-t border-[#f0f0f0] p-6 md:grid-cols-2">
            {displayChannels.map((ch) => (
              <div key={ch.slug} className="rounded-xl bg-[#fafafa] p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                  <span className="font-medium">{ch.nameZh}</span>
                </div>
                <p className="mt-1 text-xs text-[#6b7280]">{ch.desc}</p>
                <ul className="mt-2 space-y-1">
                  {ch.perks.slice(0, 4).map((p) => (
                    <li key={p.title} className="text-xs text-[#374151]">
                      {p.title}
                      <span className="text-[#9ca3af]"> — {p.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-[#9ca3af]">
        礼遇视房态与酒店政策 · 完整讨论见{" "}
        <Link href="/club/benefits" className="text-[#b8956b] hover:underline">
          权益互助论坛
        </Link>
      </p>
    </section>
  );
}