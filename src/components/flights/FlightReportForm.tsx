"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, Upload } from "lucide-react";

const DIMENSIONS = [
  { key: "seatComfort", label: "座椅舒适度" },
  { key: "catering", label: "餐食品质" },
  { key: "cabinService", label: "客舱服务" },
  { key: "entertainment", label: "娱乐系统" },
  { key: "punctuality", label: "准点率" },
  { key: "loungeRating", label: "贵宾室体验" },
];

export function FlightReportForm() {
  const router = useRouter();
  const params = useSearchParams();
  const flightId = params.get("flight");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    images: "[]",
    seatComfort: 0,
    catering: 0,
    cabinService: 0,
    entertainment: 0,
    punctuality: 0,
    loungeRating: 0,
    loungeNote: "",
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      const newImages = [...uploadedImages, data.url];
      setUploadedImages(newImages);
      setForm({ ...form, images: JSON.stringify(newImages) });
    }
    setUploading(false);
  }

  function setRating(key: string, value: number) {
    setForm({ ...form, [key]: value } as any);
  }

  function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n === value ? 0 : n)}
            className="transition"
          >
            <Star
              className={`h-5 w-5 ${n <= value ? "fill-[#b8956b] text-[#b8956b]" : "text-[#d1d5db]"}`}
            />
          </button>
        ))}
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.content) {
      setError("请填写标题和内容");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/flights/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        flightStayId: flightId || undefined,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push("/flights/journey");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="hc-card p-6">
        <label className="text-sm font-medium">报告标题</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="如：国泰头等舱 HKG-JFK 极致体验"
          className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          required
        />
      </div>

      <div className="hc-card p-6">
        <label className="text-sm font-medium">体验评分</label>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {DIMENSIONS.map((d) => (
            <div key={d.key} className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280]">{d.label}</span>
              <StarRating
                value={(form as any)[d.key] ?? 0}
                onChange={(v) => setRating(d.key, v)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hc-card p-6">
        <label className="text-sm font-medium">贵宾室体验</label>
        <textarea
          value={form.loungeNote}
          onChange={(e) => setForm({ ...form, loungeNote: e.target.value })}
          rows={2}
          placeholder="如：国泰玉衡堂头等贵宾室，按摩/点餐/浴泉..."
          className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
        />
      </div>

      <div className="hc-card p-6">
        <label className="text-sm font-medium">飞行报告正文</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={8}
          placeholder="详细描述你的飞行体验：值机流程、登机顺序、座椅硬件、餐饮出品、客舱服务、娱乐系统、中转体验..."
          className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          required
        />
      </div>

      <div className="hc-card p-6">
        <label className="text-sm font-medium">照片</label>
        <div className="mt-3 flex flex-wrap gap-3">
          {uploadedImages.map((url, i) => (
            <img key={i} src={url} alt="" className="h-24 w-24 rounded-xl object-cover" />
          ))}
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e8e8e8] transition hover:border-[#b8956b]">
            <Upload className="h-6 w-6 text-[#6b7280]" />
            <span className="mt-1 text-xs text-[#6b7280]">
              {uploading ? "上传中" : "添加照片"}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="hc-btn-primary w-full py-3 disabled:opacity-50">
        {loading ? "发布中..." : "发布飞行报告"}
      </button>
    </form>
  );
}
