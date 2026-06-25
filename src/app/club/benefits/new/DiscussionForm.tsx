"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DISCUSSION_CATEGORIES } from "@/lib/club";

const GROUPS = [
  { slug: "", label: "不限集团" },
  { slug: "marriott", label: "万豪" },
  { slug: "hyatt", label: "凯悦" },
  { slug: "ihg", label: "洲际" },
  { slug: "hilton", label: "希尔顿" },
  { slug: "accor", label: "雅高" },
  { slug: "independent", label: "独立奢华" },
];

export function DiscussionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "general" as string,
    groupSlug: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        groupSlug: form.groupSlug || undefined,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push(`/club/benefits/${data.discussion.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="hc-card space-y-4 p-6">
        <div>
          <label className="text-sm font-medium">分类</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {DISCUSSION_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm({ ...form, category: c.value })}
                className={`rounded-full px-3 py-1 text-xs ${form.category === c.value ? "bg-[#b8956b] text-white" : "border border-[#e8e8e8]"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">相关集团</label>
          <select
            value={form.groupSlug}
            onChange={(e) => setForm({ ...form, groupSlug: e.target.value })}
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none"
          >
            {GROUPS.map((g) => (
              <option key={g.slug} value={g.slug}>{g.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">标题</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="如：2026 万豪 Q1 活动叠加攻略"
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">内容</label>
          <textarea
            required
            minLength={10}
            rows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="分享你的保级经验、活动玩法、礼遇对比..."
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="hc-btn-primary w-full py-3 disabled:opacity-50">
        {loading ? "发布中..." : "发布话题"}
      </button>
    </form>
  );
}