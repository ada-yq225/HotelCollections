"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import type { FFPProgram } from "@/data/ffp-programs";
import { calcFFPProgress } from "@/lib/ffp-loyalty";
import { ALLIANCE_LABELS } from "@/data/airlines";
import type { AirlineAllianceSlug } from "@/data/airlines";

type StatusRow = {
  programSlug: string;
  tierSlug: string;
  milesYTD: number;
  segmentsYTD: number;
  memberNumber: string;
};

export function FFPStatusEditor({
  initialStatuses,
  programs,
}: {
  initialStatuses: StatusRow[];
  programs: FFPProgram[];
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
        milesYTD: 0,
        segmentsYTD: 0,
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

  const save = async () => {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/profile/ffp", {
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
          milesYTD: s.milesYTD ?? 0,
          segmentsYTD: s.segmentsYTD ?? 0,
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
        const progress = calcFFPProgress(row.programSlug, row.tierSlug, row.milesYTD, row.segmentsYTD);

        return (
          <div key={row.programSlug} className="hc-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: program.color }}
                />
                <h3 className="font-serif text-xl">{program.nameZh}</h3>
                {program.alliance && (
                  <span className="rounded-full bg-[#f0f0f0] px-2 py-0.5 text-[10px] text-[#6b7280]">
                    {ALLIANCE_LABELS[program.alliance as AirlineAllianceSlug]}
                  </span>
                )}
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
                <span className="text-[#6b7280]">今年定级里程</span>
                <input
                  type="number"
                  min={0}
                  value={row.milesYTD}
                  onChange={(e) => updateRow(idx, { milesYTD: parseInt(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-[#6b7280]">今年定级航段</span>
                <input
                  type="number"
                  min={0}
                  value={row.segmentsYTD}
                  onChange={(e) => updateRow(idx, { segmentsYTD: parseInt(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-[#6b7280]">会员号（选填）</span>
                <input
                  type="text"
                  value={row.memberNumber}
                  onChange={(e) => updateRow(idx, { memberNumber: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#e8e8e8] px-3 py-2"
                  placeholder="仅本地保存"
                />
              </label>
            </div>

            {progress && progress.milesRequired > 0 && (
              <div className="mt-4 rounded-xl bg-[#faf6f0] p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">
                    升级 {progress.nextTier?.nameZh ?? ""} 进度
                  </span>
                  <span className="font-medium">
                    {row.milesYTD.toLocaleString()} / {progress.milesRequired.toLocaleString()} 英里
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8e8e8]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${progress.milesProgress}%`,
                      backgroundColor: program.color,
                    }}
                  />
                </div>
                {progress.segmentsRequired > 0 && (
                  <p className="mt-1 text-xs text-[#9ca3af]">
                    或 {row.segmentsYTD} / {progress.segmentsRequired} 航段
                    {progress.segmentsRemaining > 0 &&
                      ` · 还差 ${progress.segmentsRemaining} 段`}
                  </p>
                )}
              </div>
            )}

            {program.highlights.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-[#9ca3af]">
                  {program.highlights.slice(0, 2).join(" · ")}
                </p>
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
            添加飞行会籍
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
