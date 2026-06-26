import type { ExperienceTag } from "@/lib/hotel-experience-tags";

export function ExperienceTags({ tags }: { tags: ExperienceTag[] }) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t.slug}
          className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: t.color }}
        >
          {t.label}
        </span>
      ))}
    </div>
  );
}