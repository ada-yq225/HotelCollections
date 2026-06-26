"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Upload, Calendar, Plane } from "lucide-react";
import { AirlinePicker } from "@/components/airlines/AirlinePicker";

const CABIN_OPTIONS = [
  { value: "economy", label: "经济舱" },
  { value: "premium_economy", label: "超经" },
  { value: "business", label: "商务舱" },
  { value: "first", label: "头等舱" },
];

export function FlightCheckinForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [boardingPassUrl, setBoardingPassUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    airlineIata: "",
    flightNumber: "",
    departureIata: "",
    arrivalIata: "",
    date: "",
    cabin: "economy" as string,
    seatNumber: "",
    bookingRef: "",
    notes: "",
  });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) setBoardingPassUrl(data.url);
    else setError(data.error);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.airlineIata || !form.flightNumber || !form.departureIata || !form.arrivalIata || !form.date) {
      setError("请填写完整信息");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/flights/stays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        boardingPassUrl: boardingPassUrl || undefined,
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
        <label className="text-sm font-medium">航司 & 航班号</label>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <AirlinePicker
            value={form.airlineIata}
            onChange={(iata) => setForm({ ...form, airlineIata: iata })}
            required
          />
          <input
            value={form.flightNumber}
            onChange={(e) => setForm({ ...form, flightNumber: e.target.value.toUpperCase() })}
            placeholder="航班号 如 CA1234"
            className="rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
            required
          />
        </div>
      </div>

      <div className="hc-card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <Plane className="h-4 w-4" /> 出发机场 (IATA)
          </label>
          <input
            value={form.departureIata}
            onChange={(e) => setForm({ ...form, departureIata: e.target.value.toUpperCase() })}
            placeholder="PEK / PVG / HKG"
            maxLength={3}
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
            required
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <Plane className="h-4 w-4 rotate-90" /> 到达机场 (IATA)
          </label>
          <input
            value={form.arrivalIata}
            onChange={(e) => setForm({ ...form, arrivalIata: e.target.value.toUpperCase() })}
            placeholder="NRT / SIN / LHR"
            maxLength={3}
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
            required
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <Calendar className="h-4 w-4" /> 飞行日期
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div>
          <label className="text-sm font-medium">舱位</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {CABIN_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm({ ...form, cabin: c.value })}
                className={`rounded-xl px-3 py-2 text-sm ${
                  form.cabin === c.value
                    ? "bg-[#1a1a1a] text-white"
                    : "border border-[#e8e8e8]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hc-card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">座位号</label>
          <input
            value={form.seatNumber}
            onChange={(e) => setForm({ ...form, seatNumber: e.target.value })}
            placeholder="如 12A"
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div>
          <label className="text-sm font-medium">预订编号</label>
          <input
            value={form.bookingRef}
            onChange={(e) => setForm({ ...form, bookingRef: e.target.value })}
            placeholder="如 ABC123"
            className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
      </div>

      <div className="hc-card p-6">
        <label className="text-sm font-medium">登机牌</label>
        <label className="mt-3 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#e8e8e8] p-8 transition hover:border-[#b8956b]">
          {boardingPassUrl ? (
            <img src={boardingPassUrl} alt="登机牌" className="max-h-40 rounded-lg object-cover" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-[#6b7280]" />
              <span className="mt-2 text-sm text-[#6b7280]">
                {uploading ? "上传中..." : "点击上传登机牌"}
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
          placeholder="餐食体验、座椅舒适度、服务亮点..."
          className="mt-2 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="hc-btn-primary w-full py-3 disabled:opacity-50">
        {loading ? "提交中..." : "完成飞行打卡"}
      </button>
    </form>
  );
}
