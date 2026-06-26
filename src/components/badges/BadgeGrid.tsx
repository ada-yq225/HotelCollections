import type { ComponentType, CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  Moon,
  Bed,
  BedDouble,
  Star,
  Award,
  Globe,
  MapPin,
  Crown,
  Gem,
  Sparkles,
  Luggage,
  Trophy,
  Medal,
  Compass,
  Building,
  Heart,
  Feather,
  Diamond,
  Leaf,
  TreePine,
  Plane,
  Map,
  Landmark,
  Waves,
  Sun,
  Mountain,
  Wine,
  Castle,
  Cloud,
  Palette,
  Palmtree,
  Train,
  Music,
  Ship,
  Calendar,
  CalendarDays,
  Snowflake,
  CreditCard,
  Pen,
  Binoculars,
} from "lucide-react";

const ICON_MAP: Record<string, ComponentType<{ className?: string; style?: CSSProperties }>> = {
  moon: Moon,
  bed: Bed,
  "bed-double": BedDouble,
  star: Star,
  award: Award,
  globe: Globe,
  "globe-2": Globe,
  "map-pin": MapPin,
  crown: Crown,
  gem: Gem,
  sparkles: Sparkles,
  luggage: Luggage,
  trophy: Trophy,
  medal: Medal,
  compass: Compass,
  building: Building,
  heart: Heart,
  feather: Feather,
  diamond: Diamond,
  leaf: Leaf,
  "tree-pine": TreePine,
  plane: Plane,
  map: Map,
  landmark: Landmark,
  waves: Waves,
  sun: Sun,
  mountain: Mountain,
  wine: Wine,
  castle: Castle,
  cloud: Cloud,
  palette: Palette,
  palmtree: Palmtree,
  train: Train,
  horse: Star,
  music: Music,
  ship: Ship,
  calendar: Calendar,
  "calendar-days": CalendarDays,
  snowflake: Snowflake,
  "credit-card": CreditCard,
  pen: Pen,
  cherry: Heart,
  binoculars: Binoculars,
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

  const byCategory = (items: BadgeItem[]) => {
    const order = ["nights", "milestones", "brands", "groups", "regions", "special"];
    const labels: Record<string, string> = {
      nights: "宿夜里程碑",
      milestones: "环球足迹",
      brands: "品牌成就",
      groups: "集团荣誉",
      regions: "区域探索",
      special: "传奇称号",
    };
    return order
      .map((cat) => ({
        cat,
        label: labels[cat],
        items: items.filter((b) => b.badge.category === cat),
      }))
      .filter((g) => g.items.length > 0);
  };

  return (
    <div className="space-y-10">
      {earned.length > 0 && (
        <section>
          <h3 className="mb-6 font-serif text-xl">已解锁 · {earned.length}</h3>
          {byCategory(earned).map((group) => (
            <div key={group.cat} className="mb-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#b8956b]">
                {group.label}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {group.items.map((item) => (
                  <BadgeCard key={item.badge.slug} item={item} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {locked.length > 0 && (
        <section>
          <h3 className="mb-6 font-serif text-xl text-[#6b7280]">待解锁 · {locked.length}</h3>
          {byCategory(locked).map((group) => (
            <div key={group.cat} className="mb-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9ca3af]">
                {group.label}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {group.items.map((item) => (
                  <BadgeCard key={item.badge.slug} item={item} />
                ))}
              </div>
            </div>
          ))}
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
        "hc-card flex flex-col items-center p-5 text-center transition hover:shadow-md",
        item.earned ? "hc-badge-glow" : "opacity-55"
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
      <p className="mt-1 text-[11px] leading-relaxed text-[#6b7280]">{item.badge.description}</p>
    </div>
  );
}