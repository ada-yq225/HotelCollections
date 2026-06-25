"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReplyForm({ discussionId }: { discussionId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/discussions/${discussionId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setContent("");
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="hc-card space-y-3 p-4">
      <textarea
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="写下你的回复..."
        className="w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="hc-btn-primary text-sm disabled:opacity-50">
        {loading ? "发送中..." : "回复"}
      </button>
    </form>
  );
}