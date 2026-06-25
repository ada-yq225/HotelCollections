"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function KeycardOfferForm({
  keycardId,
  tradeType,
}: {
  keycardId: string;
  tradeType: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/keycards/${keycardId}/offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="rounded-xl bg-[#faf6f0] p-4 text-sm text-[#b8956b]">
        交换意向已发送，对方将收到通知
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hc-card space-y-4 p-6">
      <h3 className="font-medium">
        {tradeType === "wanted" ? "我有房卡可换" : "发起交换意向"}
      </h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="说明你想交换的房卡或联系方式..."
        className="w-full rounded-xl border border-[#e8e8e8] px-4 py-3 text-sm outline-none focus:border-[#b8956b]"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="hc-btn-primary text-sm disabled:opacity-50">
        {loading ? "提交中..." : "发送意向"}
      </button>
    </form>
  );
}