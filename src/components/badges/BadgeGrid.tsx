import type { ComponentType, CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  Moon, Bed, BedDouble, Star, Award, Globe, MapPin, Crown, Gem, Sparkles,
} from "lucide-react";

const ICON_MAP: Record<string, ComponentType<{ className?: string; style?: CSSProperties }>> = {
  moon: Moon,
  bed: Bed,
  "bed-double": BedDouble,
  star: Star,
  award: Award,
  globe: Globe,
  "map-pin": MapPin,
  crown: Crown,
  gem: Gem,
  sparkles: Sparkles,
};

type BadgeItem = {
  id: string;
  earned: boolean;
  earnedAt?: string;
  badge: {
    slug: string;
    name: string;
    nameZh: string;
    description: string;
    icon: string;
    color: string;
    category: string;
    threshold: number;
  };
};

export function BadgeGrid({ badges }: { badges: BadgeItem[] }) {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-8">
      {earned.length > 0 && (
        <section>
          <h3 className="mb-4 font-serif text-xl">已解锁 · {earned.length}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {earned.map((item) => (
              <BadgeCard key={item.badge.slug} item={item} />
            ))}
          </div>
        </section>
      )}

      {locked.length > 0 && (
        <section>
          <h3 className="mb-4 font-serif text-xl text-[#6b7280]">待解锁 · {locked.length}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {locked.map((item) => (
              <BadgeCard key={item.badge.slug} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function BadgeCard({ item }: { item: BadgeItem }) {
  const Icon = ICON_MAP[item.badge.icon] || Star;
  return (
    <div
      className={cn(
        "hc-card flex flex-col items-center p-5 text-center",
        item.earned ? "hc-badge-glow" : "opacity-50"
      )}
    >
      <div
        className="mb-3 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: item.earned ? `${item.badge.color}20` : "#f3f4f6" }}
      >
        <Icon
          className="h-7 w-7"
          style={{ color: item.earned ? item.badge.color : "#9ca3af" }}
        />
      </div>
      <p className="text-sm font-medium">{item.badge.nameZh}</p>
      <p className="mt-1 text-xs text-[#6b7280]">{item.badge.description}</p>
    </div>
  );
}