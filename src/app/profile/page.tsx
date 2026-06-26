import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserStats } from "@/lib/badges";
import { prisma } from "@/lib/prisma";
import { FREE_STAY_LIMIT } from "@/lib/utils";
import { BadgeGrid } from "@/components/badges/BadgeGrid";
import { ProfileActions } from "./ProfileActions";
import Link from "next/link";
import { Crown, Moon, Building2, Globe, Award, ArrowRight } from "lucide-react";
import {
  parseChannelSlugs,
  calcRetentionProgress,
  PROGRAM_BY_SLUG,
  LOYALTY_PROGRAMS,
  BOOKING_CHANNELS,
} from "@/lib/loyalty";
import { LoyaltyStatusEditor } from "@/components/loyalty/LoyaltyStatusEditor";
import { PriceAlertsPanel } from "@/components/profile/PriceAlertsPanel";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stats = await getUserStats(user.id);
  const earnedBadges = await prisma.userBadge.findMany({
    where: { userId: user.id },
    include: { badge: true },
  });
  const allBadges = await prisma.badge.findMany({ orderBy: { sortOrder: "asc" } });

  const loyaltyRows = await prisma.userLoyaltyStatus.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  const initialStatuses = loyaltyRows.map((r) => ({
    programSlug: r.programSlug,
    tierSlug: r.tierSlug,
    nightsYTD: r.nightsYTD,
    channelSlugs: parseChannelSlugs(r.channelSlugs),
    memberNumber: r.memberNumber ?? "",
  }));

  const earnedSlugs = new Set(earnedBadges.map((b) => b.badge.slug));
  const badgeItems = allBadges.map((badge) => {
    const earned = earnedSlugs.has(badge.slug);
    const userBadge = earnedBadges.find((ub) => ub.badge.slug === badge.slug);
    return {
      id: badge.id,
      earned,
      earnedAt: userBadge?.earnedAt.toISOString(),
      badge,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#faf6f0] font-serif text-2xl text-[#b8956b]">
            {user.name[0]?.toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl">{user.name}</h1>
              {user.isPlus && (
                <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#c9a962] to-[#b8956b] px-3 py-0.5 text-xs text-white">
                  <Crown className="h-3 w-3" /> Plus
                </span>
              )}
            </div>
            <p className="text-sm text-[#6b7280]">{user.email}</p>
          </div>
        </div>
        <ProfileActions isPlus={user.isPlus} />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Moon, label: "总晚数", value: stats.totalNights },
          { icon: Building2, label: "品牌数", value: stats.uniqueBrands },
          { icon: Globe, label: "国家数", value: stats.uniqueCountries },
          { icon: Crown, label: "打卡次数", value: `${stats.totalStays}${user.isPlus ? "" : ` / ${FREE_STAY_LIMIT}`}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="hc-card flex items-center gap-4 p-5">
            <Icon className="h-8 w-8 text-[#b8956b]" />
            <div>
              <p className="font-serif text-2xl font-semibold">{value}</p>
              <p className="text-sm text-[#6b7280]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {!user.isPlus && (
        <div className="mt-8 rounded-2xl border border-[#e8e8e8] bg-gradient-to-r from-[#faf6f0] to-white p-6">
          <h3 className="font-serif text-xl">升级 Plus 会员</h3>
          <p className="mt-2 text-sm text-[#6b7280]">
            无限打卡 · 数据仪表盘 · 高清原图 · 尊贵金标 · 专属黑金主题
          </p>
          <p className="mt-1 text-sm font-medium text-[#b8956b]">¥99 / 年</p>
        </div>
      )}

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-[#b8956b]" />
            <h2 className="font-serif text-3xl">我的会籍</h2>
          </div>
          <Link href="/club/status" className="text-sm text-[#b8956b] hover:underline">
            会籍中心 <ArrowRight className="inline h-4 w-4" />
          </Link>
        </div>

        {initialStatuses.length > 0 && (
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {initialStatuses.map((s) => {
              const program = PROGRAM_BY_SLUG[s.programSlug];
              const tier = program?.tiers.find((t) => t.slug === s.tierSlug);
              const retention = calcRetentionProgress(s.programSlug, s.tierSlug, s.nightsYTD);
              if (!program || !tier) return null;
              return (
                <div key={s.programSlug} className="hc-card p-4">
                  <p className="font-medium">{program.nameZh}</p>
                  <p className="text-sm text-[#b8956b]">{tier.nameZh}</p>
                  {retention && retention.nightsRequired > 0 && (
                    <p className="mt-1 text-xs text-[#9ca3af]">
                      保级 {s.nightsYTD}/{retention.nightsRequired} 晚
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <LoyaltyStatusEditor
          initialStatuses={initialStatuses}
          programs={LOYALTY_PROGRAMS}
          channels={BOOKING_CHANNELS}
        />
      </section>

      <section className="mt-12">
        <PriceAlertsPanel />
      </section>

      <div className="mt-12">
        <h2 className="mb-6 font-serif text-3xl">荣誉称号</h2>
        <BadgeGrid badges={badgeItems} />
      </div>
    </div>
  );
}