"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import type { LoyaltyProgram } from "@/data/loyalty/programs";
import type { BookingChannel } from "@/data/loyalty/channels";
import { calcRetentionProgress } from "@/lib/loyalty";

type StatusRow = {
  programSlug: string;
  tierSlug: string;
  nightsYTD: number;
  channelSlugs: string[];
  memberNumber: string;
};

export function LoyaltyStatusEditor({
  initialStatuses,
  programs,
  channels,
}: {
  initialStatuses: StatusRow[];
  programs: LoyaltyProgram[];
  channels: BookingChannel[];
}) {
  const [statuses, setStatuses] = useState<StatusRow[]>(initialStatuses);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setStatuses(initialStatuses);
  }, [initialStatuses]);

  const usedPrograms = new Set(statuses.map((s) => s.programSlug));
  const availablePrograms = programs.filter((p) => !usedPrograms.has(p.slug));

  const addProgram = () => {
    const next = availablePrograms[0];
    if (!next) return;
    setStatuses((prev) => [
      ...prev,
      {
        programSlug: next.slug,
        tierSlug: next.tiers[0]?.slug ?? "member",
        nightsYTD: 0,
        channelSlugs: [],
        memberNumber: "",
      },
    ]);
  };

  const updateRow = (idx: number, patch: Partial<StatusRow>) => {
    setStatuses((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const removeRow = (idx: number) => {
    setStatuses((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleChannel = (idx: number, channelSlug: string) => {
    setStatuses((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s;
        const has = s.channelSlugs.includes(channelSlug);
        return {
          ...s,
          channelSlugs: has
            ? s.channelSlugs.filter((c) => c !== channelSlug)
            : [...s.channelSlugs, channelSlug],
        };
      })
    );
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/profile/loyalty", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statuses }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("已保存");
      const data = await res.json();
      setStatuses(
        data.statuses.map((s: StatusRow) => ({
          ...s,
          nightsYTD: s.nightsYTD ?? 0,
          channelSlugs: s.channelSlugs ?? [],
          memberNumber: s.memberNumber ?? "",
        }))
      );
    } else {
      setMessage("保存失败");
    }
  };

  return (
    <div className="space-y-6">
      {statuses.map((row, idx) => {
        const program = programs.find((p) => p.slug === row.programSlug);
        if (!program) return null;
        const retention = calcRetentionProgress(row.programSlug, row.tierSlug, row.nightsYTD);
        const programChannels = channels.filter((c) => c.groupSlugs.includes(program.groupSlug));

        return (
          <div key={row.programSlug} className="hc-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: program.color }}
                />
                <h3 className="font-serif text-xl">{program.nameZh}</h3>
              </div>
              <button
                type="button"
                onClick={() => removeRow(idx)}
                className="text-[#9ca3af] hover:text-red-500"
                aria-label="删除"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-[#6b7280]">当前等级</span>
                <select
                  value={row.tierSlug}
                  onChange={(e) => updateRow(idx, { tierSlug: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-3 py-2"
                >
                  {program.tiers.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.nameZh}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-[#6b7280]">今年房晚</span>
                <input
                  type="number"
                  min={0}
                  value={row.nightsYTD}
                  onChange={(e) => updateRow(idx, { nightsYTD: parseInt(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-3 py-2"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="text-[#6b7280]">会员号（选填）</span>
                <input
                  type="text"
                  value={row.memberNumber}
                  onChange={(e) => updateRow(idx, { memberNumber: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-3 py-2"
                  placeholder="仅本地保存，不会上传"
                />
              </label>
            </div>

            {retention && retention.nightsRequired > 0 && (
              <div className="mt-4 rounded-xl bg-[#faf6f0] p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">保级进度</span>
                  <span className="font-medium">
                    {row.nightsYTD} / {retention.nightsRequired} 晚
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8e8e8]">
                  <div
                    className="h-full rounded-full bg-[#b8956b] transition-all"
                    style={{ width: `${retention.progress}%` }}
                  />
                </div>
                {retention.nextTier && (
                  <p className="mt-2 text-xs text-[#9ca3af]">
                    升级 {retention.nextTier.nameZh} 需 {retention.nextTier.nightsToEarn} 晚
                  </p>
                )}
              </div>
            )}

            {programChannels.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-[#6b7280]">预订渠道</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {programChannels.map((ch) => (
                    <button
                      key={ch.slug}
                      type="button"
                      onClick={() => toggleChannel(idx, ch.slug)}
                      className={`rounded-full px-3 py-1 text-xs transition ${
                        row.channelSlugs.includes(ch.slug)
                          ? "bg-[#1a1a1a] text-white"
                          : "bg-[#f5f5f5] text-[#6b7280] hover:bg-[#e8e8e8]"
                      }`}
                    >
                      {ch.nameZh}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        {availablePrograms.length > 0 && (
          <button
            type="button"
            onClick={addProgram}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e8e8] px-4 py-2 text-sm hover:border-[#b8956b]"
          >
            <Plus className="h-4 w-4" />
            添加会籍
          </button>
        )}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="hc-btn-gold inline-flex items-center gap-1.5 px-6 py-2 text-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          保存会籍
        </button>
        {message && <span className="text-sm text-[#6b7280]">{message}</span>}
      </div>
    </div>
  );
}