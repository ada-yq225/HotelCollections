import Link from "next/link";
import { Crown, ArrowUpCircle, Coffee, Gift, Clock } from "lucide-react";
import { BOOKING_PERKS } from "@/lib/club";

const ICONS = {
  upgrade: ArrowUpCircle,
  breakfast: Coffee,
  credit: Gift,
  checkout: Clock,
};

type HotelInfo = {
  id: string;
  name: string;
  nameZh: string | null;
  cityZh: string;
  brand: { nameZh: string };
};

export function BookingPerksCard({
  hotel,
  source = "hotel",
  compact = false,
  showCTA = true,
}: {
  hotel: HotelInfo;
  source?: string;
  compact?: boolean;
  showCTA?: boolean;
}) {
  const bookUrl = `/book?hotel=${hotel.id}&source=${source}`;

  if (compact) {
    return (
      <Link
        href={bookUrl}
        className="flex items-center justify-between rounded-2xl border border-[#e8e8e8] bg-gradient-to-r from-[#faf6f0] to-white p-4 transition hover:border-[#b8956b]"
      >
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <Crown className="h-4 w-4 text-[#b8956b]" />
            通过本平台预订，享专属礼遇
          </p>
          <p className="mt-0.5 text-xs text-[#6b7280]">升级 · 早餐 · 消费抵扣 · 弹性入退</p>
        </div>
        <span className="shrink-0 text-sm text-[#b8956b]">预订 →</span>
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-[#e8e8e8] bg-gradient-to-br from-[#faf6f0] via-white to-white p-6">
      <div className="flex items-start gap-3">
        <Crown className="mt-0.5 h-6 w-6 shrink-0 text-[#b8956b]" />
        <div>
          <h3 className="font-serif text-xl">专属礼遇预订</h3>
          <p className="mt-1 text-sm text-[#6b7280]">
            {hotel.nameZh || hotel.name} · {hotel.brand.nameZh} · {hotel.cityZh}
          </p>
          <p className="mt-2 text-xs text-[#9ca3af]">
            对标八大洲 / Virtuoso — 前台现付带待遇，人工代订尊享价
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {BOOKING_PERKS.map((perk) => {
          const Icon = ICONS[perk.icon as keyof typeof ICONS];
          return (
            <div key={perk.icon} className="rounded-xl bg-white/80 p-3 ring-1 ring-[#f0f0f0]">
              <Icon className="h-4 w-4 text-[#b8956b]" />
              <p className="mt-1.5 text-sm font-medium">{perk.title}</p>
              <p className="text-xs text-[#6b7280]">{perk.desc}</p>
            </div>
          );
        })}
      </div>

      {showCTA && (
        <Link href={bookUrl} className="hc-btn-gold mt-5 block w-full py-3 text-center text-sm">
          联系专属顾问预订
        </Link>
      )}
    </div>
  );
}