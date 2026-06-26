"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AIRLINES } from "@/data/airlines";
import { AirlineInline } from "./AirlineInline";

type AirlinePickerProps = {
  value: string;
  onChange: (iata: string) => void;
  required?: boolean;
};

export function AirlinePicker({ value, onChange, required }: AirlinePickerProps) {
  const [query, setQuery] = useState("");
  const airlinesList = useMemo(
    () =>
      Object.entries(AIRLINES).sort((a, b) =>
        a[1].nameZh.localeCompare(b[1].nameZh, "zh")
      ),
    []
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return airlinesList;
    const q = query.trim().toLowerCase();
    return airlinesList.filter(
      ([iata, info]) =>
        iata.toLowerCase().includes(q) ||
        info.nameZh.includes(query) ||
        info.name.toLowerCase().includes(q)
    );
  }, [airlinesList, query]);

  const selected = value ? AIRLINES[value] : null;

  return (
    <div className="space-y-3">
      {selected && (
        <div className="rounded-xl border border-[#b8956b]/40 bg-[#faf6f0] px-4 py-3">
          <AirlineInline
            iata={selected.iata}
            nameZh={selected.nameZh}
            subtitle={`${selected.name} · ${selected.iata}`}
            size="md"
          />
        </div>
      )}

      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索航司名称或 IATA 代码..."
          className="w-full rounded-xl border border-[#e8e8e8] py-2.5 pr-4 pl-10 text-sm outline-none focus:border-[#b8956b]"
        />
      </div>

      <div
        className="max-h-52 overflow-y-auto rounded-xl border border-[#e8e8e8] divide-y divide-[#f0f0f0]"
        role="listbox"
        aria-required={required}
      >
        {filtered.map(([iata, info]) => {
          const active = value === iata;
          return (
            <button
              key={iata}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onChange(iata)}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-[#faf6f0] ${
                active ? "bg-[#faf6f0]" : ""
              }`}
            >
              <AirlineInline
                iata={iata}
                nameZh={info.nameZh}
                subtitle={`${info.name} · ${iata}`}
                size="sm"
              />
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-[#9ca3af]">未找到匹配航司</p>
        )}
      </div>
    </div>
  );
}