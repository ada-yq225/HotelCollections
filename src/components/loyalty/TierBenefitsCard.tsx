"use client";

import Link from "next/link";
import {
  Crown,
  ArrowUpCircle,
  Coffee,
  Gift,
  Clock,
  Star,
  DoorOpen,
  Sparkles,
  LogIn,
} from "lucide-react";
import type { ResolvedBenefit } from "@/lib/loyalty";

const ICONS: Record<string, typeof Crown> = {
  upgrade: ArrowUpCircle,
  breakfast: Coffee,
  credit: Gift,
  checkout: Clock,
  points: Star,
  lounge: DoorOpen,
  suite: Sparkles,
  gift: Gift,
};

type Props = {
  hotelName: string;
  hotelId: string;
  groupNameZh: string;
  programNameZh?: string | null;
  tierNameZh?: string | null;
  tierBenefits: ResolvedBenefit[];
  channelBenefits: ResolvedBenefit[];
  loggedIn: boolean;
  hasLoyalty: boolean;
};

export function TierBenefitsCard({
  hotelName,
  hotelId,
  groupNameZh,
  programNameZh,
  tierNameZh,
  tierBenefits,
  channelBenefits,
  loggedIn,
  hasLoyalty,
}: Props) {
  const bookUrl = `/book?hotel=${hotelId}&source=hotel`;
  const allBenefits = [...tierBenefits, ...channelBenefits];

  if (!loggedIn) {
    return (
      <div className="rounded-2xl border border-[#e8e8e8] bg-gradient-to-br from-[#faf6f0] via-white to-white p-6">
        <div className="flex items-start gap-3">
          <Crown className="mt-0.5 h-6 w-6 shrink-0 text-[#b8956b]" />
          <div className="flex-1">
            <h3 className="font-serif text-xl">你的等级待遇</h3>
            <p className="mt-1 text-sm text-[#6b7280]">
              登录并设置会籍后，查看在 {hotelName} 的专属礼遇
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#b8956b] hover:underline"
            >
              <LogIn className="h-4 w-4" />
              登录设置会籍
            </Link>
          </div>
        </div>
        <DefaultPerksGrid />
        <Link href={bookUrl} className="hc-btn-gold mt-5 block w-full py-3 text-center text-sm">
          联系专属顾问预订
        </Link>
      </div>
    );
  }

  if (!hasLoyalty) {
    return (
      <div className="rounded-2xl border border-[#e8e8e8] bg-gradient-to-br from-[#faf6f0] via-white to-white p-6">
        <div className="flex items-start gap-3">
          <Crown className="mt-0.5 h-6 w-6 shrink-0 text-[#b8956b]" />
          <div className="flex-1">
            <h3 className="font-serif text-xl">你的等级待遇</h3>
            <p className="mt-1 text-sm text-[#6b7280]">
              {groupNameZh} 酒店 — 尚未设置会籍档案
            </p>
            <Link
              href="/club/status"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#b8956b] px-4 py-1.5 text-sm text-[#b8956b] hover:bg-[#faf6f0]"
            >
              前往会籍中心设置 →
            </Link>
          </div>
        </div>
        <DefaultPerksGrid />
        <Link href={bookUrl} className="hc-btn-gold mt-5 block w-full py-3 text-center text-sm">
          通过顾问预订享渠道礼遇
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#e8e8e8] bg-gradient-to-br from-[#faf6f0] via-white to-white p-6">
      <div className="flex items-start gap-3">
        <Crown className="mt-0.5 h-6 w-6 shrink-0 text-[#b8956b]" />
        <div>
          <h3 className="font-serif text-xl">你的等级待遇</h3>
          <p className="mt-1 text-sm text-[#6b7280]">
            {programNameZh} · <span className="font-medium text-[#1a1a1a]">{tierNameZh}</span>
          </p>
        </div>
      </div>

      {tierBenefits.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium tracking-wide text-[#9ca3af] uppercase">会员精英待遇</p>
          <BenefitsGrid benefits={tierBenefits} />
        </div>
      )}

      {channelBenefits.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium tracking-wide text-[#9ca3af] uppercase">预订渠道礼遇（可叠加）</p>
          <BenefitsGrid benefits={channelBenefits} />
        </div>
      )}

      {allBenefits.length === 0 && <DefaultPerksGrid />}

      <Link href={bookUrl} className="hc-btn-gold mt-5 block w-full py-3 text-center text-sm">
        联系专属顾问预订
      </Link>
      <p className="mt-2 text-center text-[10px] text-[#b0b0b0]">
        礼遇视房态与酒店政策，以入住时前台为准
      </p>
    </div>
  );
}

function BenefitsGrid({ benefits }: { benefits: ResolvedBenefit[] }) {
  const unique = dedupeBenefits(benefits);
  return (
    <div className="grid grid-cols-2 gap-3">
      {unique.map((b, i) => {
        const Icon = ICONS[b.icon] ?? Gift;
        return (
          <div
            key={`${b.title}-${i}`}
            className="rounded-xl bg-white/80 p-3 ring-1 ring-[#f0f0f0]"
            style={{ borderLeft: b.sourceColor ? `3px solid ${b.sourceColor}` : undefined }}
          >
            <div className="flex items-center gap-1.5">
              <Icon className="h-4 w-4 text-[#b8956b]" />
              <p className="text-sm font-medium">{b.title}</p>
            </div>
            <p className="mt-1 text-xs text-[#6b7280]">{b.desc}</p>
            <p className="mt-1 text-[10px] text-[#b0b0b0]">{b.sourceLabel}</p>
          </div>
        );
      })}
    </div>
  );
}

function DefaultPerksGrid() {
  const perks = [
    { icon: ArrowUpCircle, title: "视房态升级", desc: "基础房升行政房/套房" },
    { icon: Coffee, title: "双人早餐", desc: "每日免费双人自助早餐" },
    { icon: Gift, title: "消费抵扣", desc: "50-100 美金餐饮/SPA 额度" },
    { icon: Clock, title: "弹性入退", desc: "提前入住 & 延迟退房" },
  ];
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      {perks.map((p) => (
        <div key={p.title} className="rounded-xl bg-white/80 p-3 ring-1 ring-[#f0f0f0]">
          <p.icon className="h-4 w-4 text-[#b8956b]" />
          <p className="mt-1.5 text-sm font-medium">{p.title}</p>
          <p className="text-xs text-[#6b7280]">{p.desc}</p>
        </div>
      ))}
    </div>
  );
}

function dedupeBenefits(benefits: ResolvedBenefit[]): ResolvedBenefit[] {
  const seen = new Set<string>();
  return benefits.filter((b) => {
    const key = `${b.title}-${b.source}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}