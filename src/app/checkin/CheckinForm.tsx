"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Upload, Calendar, Image as ImageIcon } from "lucide-react";

type HotelOption = {
  id: string;
  name: string;
  nameZh: string | null;
  city: string;
  cityZh: string;
  brand: { nameZh: string; group: { nameZh: string } };
};

type Preselected = HotelOption & { brand: { nameZh: string; group: { nameZh: string } } };

export function CheckinForm({ preselectedHotel }: { preselectedHotel: Preselected | null }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [selected, setSelected] = useState<HotelOption | null>(preselectedHotel);
  const [showSearch, setShowSearch] = useState(!preselectedHotel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    roomType: "",
    roomNumber: "",
    notes: "",
    proofType: "photo" as "photo" | "receipt" | "keycard",
    upgraded: false,
    welcomeGift: "",
    lateCheckout: false,
    breakfastQuality: 0,
    actualPrice: "",
  });

  const searchHotels = useCallback(async () => {
    if (!query.trim()) { setHotels([]); return; }
    const res = await fetch(`/api/hotels?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setHotels((data.hotels || []).slice(0, 8));
  }, [query]);

  useEffect(() => {
    const t = setTimeout(searchHotels, 300);
    return () => clearTimeout(t);
  }, [searchHotels]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setProofUrl(data.url);
    else setError(data.error);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) { setError("请选择酒店"); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/stays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId: selected.id,
        ...form,
        proofUrl: proofUrl || undefined,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push("/journey");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="hc-card p-6">
        <label className="text-sm font-medium">选择酒店</label>
        {selected && !showSearch ? (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#fafafa] p-4">
            <div>
              <p className="font-medium">{selected.nameZh || selected.name}</p>
              <p className="text-sm text-[#6b7280]">
                {selected.brand.nameZh} · {selected.cityZh || selected.city}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setShowSearch(true); setSelected(null); }}
              className="text-sm text-[#b8956b]"
            >
              更换
            </button>
          </div>
        ) : (
          <div className="relative mt-3">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索酒店名称或城市..."
              className="w-full rounded-xl border border-[#e8e8e8] py-3 pr-4 pl-10 text-sm outline-none focus:border-[#b8956b]"
            />
            {hotels.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-xl border border-[#e8e8e8] bg-white shadow-lg">
                {hotels.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => { setSelected(h); setShowSearch(false); setHotels([]); }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-[#fafafa] first:rounded-t-xl last:rounded-b-xl"
                  >
                    <span className="font-medium">{h.nameZh || h.name}</span>
                    <span className="ml-2 text-[#6b7280]">{h.cityZh}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="hc-card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <Calendar className="h-4 w-4" /> 入住日期
          </label>
          <input
            type="date"
            required
            value={form.checkIn}
            onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <Calendar className="h-4 w-4" /> 退房日期
          </label>
          <input
            type="date"
            required
            value={form.checkOut}
            onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div>
          <label className="text-sm font-medium">房型</label>
          <input
            value={form.roomType}
            onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            placeholder="如：行政大床房"
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div>
          <label className="text-sm font-medium">房号</label>
          <input
            value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            placeholder="如：2806"
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
      </div>

      {/* Stay experience highlights */}
      <div className="hc-card p-6">
        <label className="text-sm font-medium">入住体验亮点</label>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-[#e8e8e8] p-3 cursor-pointer hover:border-[#b8956b]">
            <input
              type="checkbox"
              checked={form.upgraded}
              onChange={(e) => setForm({ ...form, upgraded: e.target.checked })}
              className="h-4 w-4 accent-[#b8956b]"
            />
            <div>
              <p className="text-sm font-medium">升级了房型</p>
              <p className="text-xs text-[#9ca3af]">是否获得免费升房</p>
            </div>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-[#e8e8e8] p-3 cursor-pointer hover:border-[#b8956b]">
            <input
              type="checkbox"
              checked={form.lateCheckout}
              onChange={(e) => setForm({ ...form, lateCheckout: e.target.checked })}
              className="h-4 w-4 accent-[#b8956b]"
            />
            <div>
              <p className="text-sm font-medium">延迟退房</p>
              <p className="text-xs text-[#9ca3af]">是否获得延迟退房权益</p>
            </div>
          </label>
        </div>
        <div className="mt-3">
          <label className="text-xs text-[#6b7280]">欢迎礼遇</label>
          <input
            value={form.welcomeGift}
            onChange={(e) => setForm({ ...form, welcomeGift: e.target.value })}
            placeholder="如：水果、香槟、手写欢迎信、马卡龙..."
            className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-[#6b7280]">早餐品质评分</label>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, breakfastQuality: form.breakfastQuality === n ? 0 : n })}
                  className="text-lg transition"
                >
                  {n <= form.breakfastQuality ? "★" : "☆"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-[#6b7280]">实际支付价格 (CNY)</label>
            <input
              value={form.actualPrice}
              onChange={(e) => setForm({ ...form, actualPrice: e.target.value })}
              placeholder="每晚均价，选填"
              type="number"
              className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
            />
          </div>
        </div>
      </div>

      <div className="hc-card p-6">
        <label className="text-sm font-medium">入住凭证</label>
        <div className="mt-3 flex gap-3">
          {(["photo", "receipt", "keycard"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, proofType: t })}
              className={`rounded-full px-4 py-1.5 text-xs ${form.proofType === t ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8]"}`}
            >
              {t === "photo" ? "照片" : t === "receipt" ? "订单截图" : "房卡"}
            </button>
          ))}
        </div>
        <label className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#e8e8e8] p-8 transition hover:border-[#b8956b]">
          {proofUrl ? (
            <img src={proofUrl} alt="凭证" className="max-h-40 rounded-lg object-cover" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-[#6b7280]" />
              <span className="mt-2 text-sm text-[#6b7280]">
                {uploading ? "上传中..." : "点击上传凭证"}
              </span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="hc-card p-6">
        <label className="text-sm font-medium">备注</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
          placeholder="升房体验、酒廊出品、备品亮点..."
          className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="hc-btn-primary w-full py-3 disabled:opacity-50">
        {loading ? "提交中..." : "完成打卡"}
      </button>
    </form>
  );
}