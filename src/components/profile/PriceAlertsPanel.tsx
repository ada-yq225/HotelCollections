"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, Loader2, TrendingDown } from "lucide-react";

type EvaluatedAlert = {
  id: string;
  hotelSlug: string | null;
  flightRoute: string | null;
  targetPrice: number;
  currentPrice: number | null;
  triggered: boolean;
  label: string;
};

export function PriceAlertsPanel() {
  const [evaluated, setEvaluated] = useState<EvaluatedAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotelSlug, setHotelSlug] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [adding, setAdding] = useState(false);

  const load = () => {
    fetch("/api/price-alerts")
      .then((r) => r.json())
      .then((d) => setEvaluated(d.evaluated ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const addAlert = async () => {
    if (!hotelSlug || !targetPrice) return;
    setAdding(true);
    await fetch("/api/price-alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelSlug,
        targetPrice: parseInt(targetPrice),
        direction: "below",
      }),
    });
    setHotelSlug("");
    setTargetPrice("");
    setAdding(false);
    load();
  };

  const removeAlert = async (id: string) => {
    await fetch(`/api/price-alerts?id=${id}`, { method: "DELETE" });
    load();
  };

  if (loading) {
    return <div className="h-24 animate-pulse rounded-2xl bg-[#f5f5f5]" />;
  }

  const triggered = evaluated.filter((a) => a.triggered);

  return (
    <div className="hc-card p-6">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-[#b8956b]" />
        <h3 className="font-serif text-xl">价格变动提醒</h3>
      </div>
      <p className="mt-1 text-sm text-[#6b7280]">
        对比官网实价与目标价，达标时在下方高亮显示（也可在酒店详情页一键设置）
      </p>

      {triggered.length > 0 && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-800">
            <TrendingDown className="h-4 w-4" />
            {triggered.length} 条提醒已达标
          </p>
          <ul className="mt-2 space-y-1 text-xs text-emerald-700">
            {triggered.map((a) => (
              <li key={a.id}>
                {a.label} — 目标 ¥{a.targetPrice.toLocaleString("zh-CN")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {evaluated.length > 0 && (
        <ul className="mt-4 space-y-2">
          {evaluated.map((a) => (
            <li
              key={a.id}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
                a.triggered ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-[#faf6f0]"
              }`}
            >
              <div>
                <p className="font-medium">
                  {a.hotelSlug || a.flightRoute} · 低于 ¥{a.targetPrice.toLocaleString("zh-CN")}
                </p>
                <p className="mt-0.5 text-xs text-[#6b7280]">
                  {a.currentPrice != null
                    ? `当前 ${a.label}`
                    : "当前价格待同步"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAlert(a.id)}
                className="text-[#9ca3af] hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="酒店 slug，如 ritz-carlton-beijing"
          value={hotelSlug}
          onChange={(e) => setHotelSlug(e.target.value)}
          className="min-w-[200px] flex-1 rounded-xl border border-[#e8e8e8] px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="目标价 ¥"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          className="w-28 rounded-xl border border-[#e8e8e8] px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addAlert}
          disabled={adding}
          className="inline-flex items-center gap-1 rounded-xl bg-[#1a1a1a] px-4 py-2 text-sm text-white"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          添加
        </button>
      </div>
    </div>
  );
}