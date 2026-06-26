"use client";

import { useState } from "react";
import { Bell, Loader2, Check } from "lucide-react";

export function HotelPriceAlertButton({
  hotelSlug,
  hotelName,
  currentPrice,
}: {
  hotelSlug: string;
  hotelName: string;
  currentPrice?: number | null;
}) {
  const [target, setTarget] = useState(
    currentPrice ? String(Math.round(currentPrice * 0.9)) : ""
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    const price = parseInt(target);
    if (!price || price <= 0) return;
    setLoading(true);
    const res = await fetch("/api/price-alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hotelSlug, targetPrice: price, direction: "below" }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setOpen(false);
      }, 2000);
    } else if (res.status === 401) {
      window.location.href = "/login";
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8e8e8] bg-white px-4 py-3 text-sm transition hover:border-[#b8956b]"
      >
        <Bell className="h-4 w-4 text-[#b8956b]" />
        价格低于目标时提醒我
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-[#e8e8e8] bg-white p-4">
      <p className="text-sm font-medium">价格提醒 · {hotelName}</p>
      <p className="mt-1 text-xs text-[#6b7280]">
        当官网实价低于目标价时，在个人中心显示提醒
        {currentPrice != null && `（当前参考 ¥${currentPrice.toLocaleString("zh-CN")}）`}
      </p>
      <div className="mt-3 flex gap-2">
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="目标价 ¥"
          className="flex-1 rounded-lg border border-[#e8e8e8] px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={submit}
          disabled={loading || done}
          className="inline-flex items-center gap-1 rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : done ? (
            <Check className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {done ? "已设置" : "设置"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="mt-2 text-xs text-[#9ca3af] hover:text-[#6b7280]"
      >
        取消
      </button>
    </div>
  );
}