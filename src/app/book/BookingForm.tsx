"use client";

import { useState } from "react";
import { MessageCircle, ExternalLink } from "lucide-react";


export function BookingForm({
  hotelId,
  hotelName,
  source,
}: {
  hotelId: string;
  hotelName: string;
  source: string;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [wechatUrl, setWechatUrl] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
    contact: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId,
        checkIn: form.checkIn || undefined,
        checkOut: form.checkOut || undefined,
        guests: parseInt(form.guests),
        contact: form.contact || undefined,
        source,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setWechatUrl(data.redirectUrl);
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="hc-card p-8 text-center">
        <MessageCircle className="mx-auto h-12 w-12 text-[#b8956b]" />
        <h3 className="mt-4 font-serif text-xl">意向已提交</h3>
        <p className="mt-2 text-sm text-[#6b7280]">
          {hotelName} 的预订咨询已记录，请添加专属顾问完成代订
        </p>
        <a
          href={wechatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hc-btn-gold mt-6 inline-flex items-center gap-2 text-sm"
        >
          <ExternalLink className="h-4 w-4" />
          打开企业微信联系顾问
        </a>
        <p className="mt-4 text-xs text-[#9ca3af]">添加 H&C 专属旅行顾问，享前台现付礼遇</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hc-card space-y-4 p-6">
      <h3 className="font-medium">填写预订意向</h3>
      <p className="text-xs text-[#6b7280]">顾问将为您确认房态、礼遇及最优价格（佣金约 10-15%）</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-[#6b7280]">入住日期</label>
          <input
            type="date"
            value={form.checkIn}
            onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
        <div>
          <label className="text-sm text-[#6b7280]">退房日期</label>
          <input
            type="date"
            value={form.checkOut}
            onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
            className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-[#6b7280]">入住人数</label>
        <select
          value={form.guests}
          onChange={(e) => setForm({ ...form, guests: e.target.value })}
          className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{n} 人</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-[#6b7280]">联系方式（微信/手机）</label>
        <input
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          placeholder="方便顾问联系您"
          className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="hc-btn-gold w-full py-3 text-sm disabled:opacity-50">
        {loading ? "提交中..." : "提交并联系顾问"}
      </button>
    </form>
  );
}