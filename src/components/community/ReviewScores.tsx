import { REVIEW_DIMENSIONS } from "@/lib/posts";
import { Star } from "lucide-react";

type PostScores = {
  upgradeRate?: string | null;
  loungeDining?: number | null;
  loungeNote?: string | null;
  amenities?: number | null;
  amenitiesNote?: string | null;
  service?: number | null;
  serviceNote?: string | null;
};

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= value ? "fill-[#b8956b] text-[#b8956b]" : "text-[#e5e7eb]"}`}
        />
      ))}
    </div>
  );
}

export function ReviewScoresDisplay({ post }: { post: PostScores }) {
  return (
    <div className="space-y-4">
      {REVIEW_DIMENSIONS.map((dim) => {
        if (dim.type === "text") {
          const val = post.upgradeRate;
          if (!val) return null;
          return (
            <div key={dim.key} className="hc-card p-4">
              <p className="text-sm font-medium">{dim.label}</p>
              <p className="mt-1 text-xs text-[#6b7280]">{dim.hint}</p>
              <p className="mt-2 text-sm">{val}</p>
            </div>
          );
        }

        const score = post[dim.key as keyof PostScores] as number | null | undefined;
        const noteKey = dim.noteKey;
        const note = noteKey ? (post[noteKey as keyof PostScores] as string | null) : null;
        if (!score && !note) return null;

        return (
          <div key={dim.key} className="hc-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{dim.label}</p>
              {score && <ScoreBar value={score} />}
            </div>
            {note && <p className="mt-2 text-sm text-[#6b7280]">{note}</p>}
          </div>
        );
      })}
    </div>
  );
}