"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Crown, Pin, MessageCircle } from "lucide-react";
import { DISCUSSION_CATEGORIES, getCategoryLabel } from "@/lib/club";
import { formatDate } from "@/lib/utils";

type Discussion = {
  id: string;
  title: string;
  content: string;
  category: string;
  groupSlug: string | null;
  isPinned: boolean;
  createdAt: string;
  user: { name: string; isPlus: boolean };
  _count: { replies: number };
};

const GROUPS = [
  { slug: "", label: "全部集团" },
  { slug: "marriott", label: "万豪" },
  { slug: "hyatt", label: "凯悦" },
  { slug: "ihg", label: "洲际" },
  { slug: "hilton", label: "希尔顿" },
  { slug: "independent", label: "独立" },
];

export function BenefitsForum() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [group, setGroup] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (group) params.set("group", group);
    const res = await fetch(`/api/discussions?${params}`);
    const data = await res.json();
    setDiscussions(data.discussions || []);
    setLoading(false);
  }, [category, group]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("")}
          className={`rounded-full px-3 py-1 text-xs ${!category ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8]"}`}
        >
          全部分类
        </button>
        {DISCUSSION_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`rounded-full px-3 py-1 text-xs ${category === c.value ? "bg-[#b8956b] text-white" : "border border-[#e8e8e8]"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <button
            key={g.slug}
            onClick={() => setGroup(g.slug)}
            className={`rounded-full px-3 py-1 text-xs ${group === g.slug ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8]"}`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-16 text-center text-[#6b7280]">加载中...</p>
      ) : discussions.length === 0 ? (
        <div className="hc-card py-16 text-center text-[#6b7280]">暂无话题</div>
      ) : (
        <div className="space-y-3">
          {discussions.map((d) => (
            <Link key={d.id} href={`/club/benefits/${d.id}`} className="hc-card block p-5 transition hover:ring-1 hover:ring-[#e8e8e8]">
              <div className="flex items-start gap-3">
                {d.isPinned && <Pin className="mt-1 h-4 w-4 shrink-0 text-[#b8956b]" />}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs">{getCategoryLabel(d.category)}</span>
                    {d.groupSlug && (
                      <span className="text-xs text-[#9ca3af]">{d.groupSlug}</span>
                    )}
                  </div>
                  <h3 className="mt-2 font-medium">{d.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[#6b7280]">{d.content}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-[#9ca3af]">
                    <span className="flex items-center gap-1">
                      {d.user.isPlus && <Crown className="h-3 w-3 text-[#b8956b]" />}
                      {d.user.name}
                    </span>
                    <span>{formatDate(d.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> {d._count.replies}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}