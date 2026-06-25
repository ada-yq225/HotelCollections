import {
  TRAVELER_RATING_DIMENSIONS,
  formatTravelerScore,
  scoreLabel,
} from "@/lib/hotel-ratings";
import { Star, Users } from "lucide-react";

type HotelTravelerRatingProps = {
  travelerScore: number;
  travelerRatingCount: number;
  travelerReviewSummary?: string | null;
  scoreLocation: number;
  scoreDesign: number;
  scoreService: number;
  scoreDining: number;
  scoreHardware: number;
  compact?: boolean;
  className?: string;
};

function ScoreBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f0ebe3]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#c9a962] to-[#b8956b]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function HotelTravelerRating({
  travelerScore,
  travelerRatingCount,
  travelerReviewSummary,
  scoreLocation,
  scoreDesign,
  scoreService,
  scoreDining,
  scoreHardware,
  compact = false,
  className = "",
}: HotelTravelerRatingProps) {
  const dimScores: Record<string, number> = {
    scoreLocation,
    scoreDesign,
    scoreService,
    scoreDining,
    scoreHardware,
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#faf6f0] px-2 py-0.5 text-sm font-semibold text-[#b8956b]">
          <Star className="h-3.5 w-3.5 fill-[#b8956b]" />
          {formatTravelerScore(travelerScore)}
        </span>
        <span className="text-xs text-[#9ca3af]">{scoreLabel(travelerScore)}</span>
        <span className="text-xs text-[#9ca3af]">· {travelerRatingCount} 位旅客</span>
      </div>
    );
  }

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-wide text-[#9ca3af] uppercase">H&C 高端旅客评分</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-4xl font-semibold text-[#1a1a1a]">
              {formatTravelerScore(travelerScore)}
            </span>
            <span className="text-lg text-[#9ca3af]">/ 10</span>
            <span className="ml-2 rounded-full bg-[#b8956b] px-2.5 py-0.5 text-xs text-white">
              {scoreLabel(travelerScore)}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-[#6b7280]">
            <Users className="h-3.5 w-3.5" />
            {travelerRatingCount} 位高端旅客参与评价
          </p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(travelerScore / 2)
                  ? "fill-[#b8956b] text-[#b8956b]"
                  : "text-[#e5e7eb]"
              }`}
            />
          ))}
        </div>
      </div>

      {travelerReviewSummary && (
        <blockquote className="border-l-2 border-[#b8956b] bg-[#fafafa] px-4 py-3 text-sm leading-relaxed text-[#374151]">
          {travelerReviewSummary}
        </blockquote>
      )}

      <div className="space-y-3">
        {TRAVELER_RATING_DIMENSIONS.map((dim) => (
          <div key={dim.key} className="flex items-center gap-3">
            <div className="w-20 shrink-0">
              <p className="text-xs font-medium text-[#374151]">{dim.label}</p>
            </div>
            <ScoreBar value={dimScores[dim.key]} />
            <span className="w-8 shrink-0 text-right text-sm font-medium text-[#b8956b]">
              {formatTravelerScore(dimScores[dim.key])}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[#9ca3af]">
        评分来自 H&C 社群高端旅客综合口碑，涵盖位置、设计、服务、餐饮、硬件五个维度。
      </p>
    </div>
  );
}