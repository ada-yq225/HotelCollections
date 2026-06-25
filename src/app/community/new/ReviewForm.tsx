"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Star } from "lucide-react";
import { REVIEW_DIMENSIONS } from "@/lib/posts";

type Hotel = {
  id: string;
  name: string;
  nameZh: string | null;
  brand: { nameZh: string };
};

type Stay = {
  id: string;
  checkIn: string;
  nights: number;
  roomType: string | null;
  hotel: Hotel;
};

export function ReviewForm({
  preselectedHotel,
  preselectedStay,
  userStays,
}: {
  preselectedHotel: Hotel | null;
  preselectedStay: (Stay & { hotel: Hotel }) | null;
  userStays: (Stay & { hotel: Hotel })[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const initialHotel = preselectedStay?.hotel ?? preselectedHotel;
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(initialHotel);
  const [selectedStayId, setSelectedStayId] = useState(preselectedStay?.id ?? "");

  const [form, setForm] = useState({
    title: "",
    content: "",
    upgradeRate: "",
    loungeDining: 0,
    loungeNote: "",
    amenities: 0,
    amenitiesNote: "",
    service: 0,
    serviceNote: "",
  });

  function setScore(key: string, value: number) {
    setForm((f) => ({ ...f, [key]: f[key as keyof typeof f] === value ? 0 : value }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files).slice(0, 9 - images.length)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setImages((prev) => [...prev, data.url]);
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedHotel) { setError("请选择酒店"); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId: selectedHotel.id,
        stayId: selectedStayId || undefined,
        title: form.title,
        content: form.content,
        images,
        upgradeRate: form.upgradeRate || undefined,
        loungeDining: form.loungeDining || undefined,
        loungeNote: form.loungeNote || undefined,
        amenities: form.amenities || undefined,
        amenitiesNote: form.amenitiesNote || undefined,
        service: form.service || undefined,
        serviceNote: form.serviceNote || undefined,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push(`/community/${data.post.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {userStays.length > 0 && (
        <div className="hc-card p-6">
          <label className="text-sm font-medium">关联入住记录（可选）</label>
          <select
            value={selectedStayId}
            onChange={(e) => {
              const stay = userStays.find((s) => s.id === e.target.value);
              setSelectedStayId(e.target.value);
              if (stay) setSelectedHotel(stay.hotel);
            }}
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          >
            <option value="">不关联</option>
            {userStays.map((s) => (
              <option key={s.id} value={s.id}>
                {s.hotel.nameZh || s.hotel.name} · {new Date(s.checkIn).toLocaleDateString("zh-CN")} · {s.nights}晚
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedHotel && (
        <div className="hc-card p-4">
          <p className="text-sm text-[#6b7280]">点评酒店</p>
          <p className="font-medium">{selectedHotel.nameZh || selectedHotel.name}</p>
          <p className="text-sm text-[#6b7280]">{selectedHotel.brand.nameZh}</p>
        </div>
      )}

      <div className="hc-card space-y-4 p-6">
        <div>
          <label className="text-sm font-medium">标题</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="如：上海柏悦 · 钛金升套房体验"
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div>
          <label className="text-sm font-medium">入住体验</label>
          <textarea
            required
            minLength={10}
            rows={5}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="分享你的完整入住故事..."
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-xl">硬核维度</h3>
        {REVIEW_DIMENSIONS.map((dim) => {
          if (dim.type === "text") {
            return (
              <div key={dim.key} className="hc-card p-6">
                <label className="text-sm font-medium">{dim.label}</label>
                <p className="mt-1 text-xs text-[#6b7280]">{dim.hint}</p>
                <input
                  value={form.upgradeRate}
                  onChange={(e) => setForm({ ...form, upgradeRate: e.target.value })}
                  placeholder={dim.placeholder}
                  className="mt-3 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
                />
              </div>
            );
          }

          const scoreKey = dim.key;
          const noteKey = dim.noteKey!;
          const score = form[scoreKey as keyof typeof form] as number;

          return (
            <div key={dim.key} className="hc-card p-6">
              <label className="text-sm font-medium">{dim.label}</label>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setScore(scoreKey, n)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 transition ${
                        n <= score ? "fill-[#b8956b] text-[#b8956b]" : "text-[#e5e7eb] hover:text-[#d4bc94]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <input
                value={form[noteKey as keyof typeof form] as string}
                onChange={(e) => setForm({ ...form, [noteKey]: e.target.value })}
                placeholder={dim.placeholder}
                className="mt-3 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
              />
            </div>
          );
        })}
      </div>

      <div className="hc-card p-6">
        <label className="text-sm font-medium">图片（最多 9 张）</label>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <img key={i} src={url} alt="" className="aspect-square rounded-xl object-cover" />
          ))}
          {images.length < 9 && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e8e8e8] hover:border-[#b8956b]">
              <Upload className="h-6 w-6 text-[#6b7280]" />
              <span className="mt-1 text-xs text-[#6b7280]">{uploading ? "上传中" : "添加"}</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
            </label>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="hc-btn-primary w-full py-3 disabled:opacity-50">
        {loading ? "发布中..." : "发布点评"}
      </button>
    </form>
  );
}