"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { KEYCARD_TRADE_TYPES } from "@/lib/club";

export function KeycardForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    hotelQuery: "",
    hotelId: "",
    year: "",
    tradeType: "display" as "display" | "offer" | "wanted",
  });

  async function searchHotel(q: string) {
    if (!q.trim()) return;
    const res = await fetch(`/api/hotels?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    return data.hotels?.[0];
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setImageUrl(data.url);
    else setError(data.error);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) { setError("请上传房卡照片"); return; }
    setLoading(true);
    setError("");

    let hotelId = form.hotelId;
    if (!hotelId && form.hotelQuery) {
      const hotel = await searchHotel(form.hotelQuery);
      hotelId = hotel?.id;
    }

    const res = await fetch("/api/keycards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description || undefined,
        imageUrl,
        hotelId: hotelId || undefined,
        year: form.year ? parseInt(form.year) : undefined,
        tradeType: form.tradeType,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push(`/club/keycards/${data.keycard.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="hc-card p-6">
        <label className="text-sm font-medium">房卡照片</label>
        <label className="mt-3 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#e8e8e8] p-8 hover:border-[#b8956b]">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="max-h-48 rounded-lg object-contain" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-[#6b7280]" />
              <span className="mt-2 text-sm text-[#6b7280]">上传房卡正面照片</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="hc-card space-y-4 p-6">
        <div>
          <label className="text-sm font-medium">标题</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="如：上海柏悦 2024 钛金房卡"
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div>
          <label className="text-sm font-medium">关联酒店（可选）</label>
          <input
            value={form.hotelQuery}
            onChange={(e) => setForm({ ...form, hotelQuery: e.target.value })}
            placeholder="搜索酒店名称"
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div>
          <label className="text-sm font-medium">年份（可选）</label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            placeholder="2024"
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div>
          <label className="text-sm font-medium">类型</label>
          <div className="mt-2 flex gap-2">
            {KEYCARD_TRADE_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm({ ...form, tradeType: t.value })}
                className={`rounded-full px-4 py-1.5 text-sm ${form.tradeType === t.value ? "text-white" : "border border-[#e8e8e8]"}`}
                style={form.tradeType === t.value ? { backgroundColor: t.color } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">描述（可选）</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="品相、稀有度、交换偏好..."
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="hc-btn-primary w-full py-3 disabled:opacity-50">
        {loading ? "发布中..." : "发布房卡"}
      </button>
    </form>
  );
}