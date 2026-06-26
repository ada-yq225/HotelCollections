import type { CredibilityBadge } from "@/lib/hotel-credibility";
import { ShieldCheck, AlertCircle, Info, BadgeCheck } from "lucide-react";

const VARIANT_STYLES = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  info: "bg-blue-50 text-blue-700 ring-blue-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  neutral: "bg-gray-50 text-gray-500 ring-gray-200",
};

const VARIANT_ICONS = {
  success: ShieldCheck,
  info: Info,
  warning: AlertCircle,
  neutral: BadgeCheck,
};

export function HotelCredibilityBadges({ badges }: { badges: CredibilityBadge[] }) {
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b) => {
        const Icon = VARIANT_ICONS[b.variant];
        return (
          <span
            key={b.slug}
            title={b.desc}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${VARIANT_STYLES[b.variant]}`}
          >
            <Icon className="h-3 w-3" />
            {b.label}
          </span>
        );
      })}
    </div>
  );
}