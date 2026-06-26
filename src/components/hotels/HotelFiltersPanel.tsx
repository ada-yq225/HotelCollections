"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { ALL_EXPERIENCE_TAGS } from "@/lib/hotel-experience-tags";
import { GROUP_TOPIC_SLUGS } from "@/data/loyalty/group-guides";

type Group = {
  slug: string;
  nameZh: string;
  logoColor: string;
};

type Brand = {
  slug: string;
  nameZh: string;
  group: { slug: string; nameZh: string; logoColor: string };
  _count: { hotels: number };
};

type Alliance = { slug: string; nameZh: string };

type Destination = { slug: string; nameZh: string };

type FilterState = {
  destination: string;
  group: string;
  brand: string;
  alliance: string;
  experience: string;
};

type HotelFiltersPanelProps = {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onClear: () => void;
  groups: Group[];
  brands: Brand[];
  alliances: Alliance[];
  resortDestinations: Destination[];
  chinaDestinations: Destination[];
  signatureGroups: Group[];
  activeCount: number;
};

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#f0f0f0] last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3.5 text-left"
      >
        <span className="text-sm font-medium text-[#1a1a1a]">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#9ca3af] transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs transition ${
        active
          ? "font-medium text-white shadow-sm"
          : "border border-[#e8e8e8] bg-white text-[#374151] hover:border-[#b8956b]/50"
      }`}
      style={active && color ? { backgroundColor: color } : active ? { backgroundColor: "#1a1a1a" } : {}}
    >
      {children}
    </button>
  );
}

export function HotelFiltersPanel({
  open,
  onClose,
  filters,
  onChange,
  onClear,
  groups,
  brands,
  alliances,
  resortDestinations,
  chinaDestinations,
  signatureGroups,
  activeCount,
}: HotelFiltersPanelProps) {
  const [destTab, setDestTab] = useState<"resort" | "china">("resort");

  const displayBrands = filters.group
    ? brands.filter((b) => b.group.slug === filters.group)
    : brands;

  const sortedBrands = [...displayBrands].sort((a, b) => b._count.hotels - a._count.hotels);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:inset-x-auto sm:top-1/2 sm:left-1/2 sm:max-h-[80vh] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#b8956b]" />
            <h2 className="font-serif text-lg font-semibold">筛选酒店</h2>
            {activeCount > 0 && (
              <span className="rounded-full bg-[#b8956b] px-2 py-0.5 text-xs text-white">
                {activeCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#6b7280] hover:bg-[#f5f5f5]"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-6" style={{ maxHeight: "calc(85vh - 130px)" }}>
          <FilterSection title="目的地">
            <div className="mb-3 flex gap-1 rounded-lg bg-[#f5f5f5] p-1">
              {(["resort", "china"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDestTab(tab)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                    destTab === tab ? "bg-white text-[#1a1a1a] shadow-sm" : "text-[#6b7280]"
                  }`}
                >
                  {tab === "resort" ? "度假胜地" : "中国城市"}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={!filters.destination}
                onClick={() => onChange({ destination: "" })}
              >
                全部
              </Chip>
              {(destTab === "resort" ? resortDestinations : chinaDestinations).map((d) => (
                <Chip
                  key={d.slug}
                  active={filters.destination === d.slug}
                  onClick={() =>
                    onChange({
                      destination: filters.destination === d.slug ? "" : d.slug,
                    })
                  }
                >
                  {d.nameZh}
                </Chip>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="酒店集团">
            <div className="flex flex-wrap gap-2">
              <Chip active={!filters.group} onClick={() => onChange({ group: "", brand: "" })}>
                全部
              </Chip>
              {groups.map((g) => (
                <Chip
                  key={g.slug}
                  active={filters.group === g.slug}
                  color={g.logoColor}
                  onClick={() => {
                    const next = filters.group === g.slug ? "" : g.slug;
                    const currentBrand = brands.find((b) => b.slug === filters.brand);
                    onChange({
                      group: next,
                      brand:
                        next && currentBrand && currentBrand.group.slug !== next
                          ? ""
                          : filters.brand,
                    });
                  }}
                >
                  {g.nameZh}
                </Chip>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="品牌" defaultOpen={!!filters.group}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {sortedBrands.slice(0, filters.group ? 99 : 18).map((b) => (
                <button
                  key={b.slug}
                  type="button"
                  onClick={() =>
                    onChange({ brand: filters.brand === b.slug ? "" : b.slug })
                  }
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition ${
                    filters.brand === b.slug
                      ? "border-[#b8956b] bg-[#faf6f0]"
                      : "border-[#e8e8e8] hover:border-[#d4d4d4]"
                  }`}
                >
                  <BrandLogo
                    brandSlug={b.slug}
                    brandNameZh={b.nameZh}
                    groupColor={b.group.logoColor}
                    size="xs"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{b.nameZh}</p>
                    <p className="text-[10px] text-[#9ca3af]">{b._count.hotels} 家</p>
                  </div>
                </button>
              ))}
            </div>
            {!filters.group && sortedBrands.length > 18 && (
              <p className="mt-2 text-[11px] text-[#9ca3af]">选择集团可查看全部品牌</p>
            )}
          </FilterSection>

          <FilterSection title="体验标签" defaultOpen={false}>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={!filters.experience}
                onClick={() => onChange({ experience: "" })}
              >
                全部
              </Chip>
              {ALL_EXPERIENCE_TAGS.map((t) => (
                <Chip
                  key={t.slug}
                  active={filters.experience === t.slug}
                  color={t.color}
                  onClick={() =>
                    onChange({
                      experience: filters.experience === t.slug ? "" : t.slug,
                    })
                  }
                >
                  {t.label}
                </Chip>
              ))}
            </div>
          </FilterSection>

          {alliances.length > 0 && (
            <FilterSection title="联盟" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                <Chip
                  active={!filters.alliance}
                  onClick={() => onChange({ alliance: "" })}
                >
                  全部
                </Chip>
                {alliances.map((a) => (
                  <Chip
                    key={a.slug}
                    active={filters.alliance === a.slug}
                    onClick={() =>
                      onChange({
                        alliance: filters.alliance === a.slug ? "" : a.slug,
                      })
                    }
                  >
                    {a.nameZh}
                  </Chip>
                ))}
              </div>
            </FilterSection>
          )}

          <div className="mt-4 rounded-xl bg-[#faf6f0] p-4">
            <p className="mb-2 text-xs font-medium text-[#b8956b]">集团专题 · 会籍对照</p>
            <div className="flex flex-wrap gap-2">
              {groups
                .filter((g) => (GROUP_TOPIC_SLUGS as readonly string[]).includes(g.slug))
                .map((g) => (
                  <Link
                    key={g.slug}
                    href={`/groups/${g.slug}`}
                    className="rounded-lg border border-[#e8d5b8] bg-white px-3 py-2 text-xs font-medium transition hover:border-[#b8956b]"
                    style={{ color: g.logoColor }}
                  >
                    {g.nameZh} →
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-[#f0f0f0] px-5 py-4">
          <button
            type="button"
            onClick={onClear}
            className="flex-1 rounded-full border border-[#e8e8e8] py-2.5 text-sm text-[#6b7280] transition hover:border-[#b8956b]"
          >
            清除筛选
          </button>
          <button
            type="button"
            onClick={onClose}
            className="hc-btn-primary flex-1 py-2.5 text-center text-sm"
          >
            查看结果
          </button>
        </div>
      </div>
    </>
  );
}

export function ActiveFilterPills({
  filters,
  labels,
  onRemove,
  onClear,
}: {
  filters: FilterState;
  labels: Record<string, string>;
  onRemove: (key: keyof FilterState) => void;
  onClear: () => void;
}) {
  const entries = (Object.entries(filters) as [keyof FilterState, string][]).filter(
    ([, v]) => v
  );

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {entries.map(([key, value]) => (
        <button
          key={key}
          type="button"
          onClick={() => onRemove(key)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#e8d5b8] bg-[#faf6f0] px-3 py-1 text-xs text-[#374151] transition hover:border-[#b8956b]"
        >
          {labels[value] ?? value}
          <X className="h-3 w-3 text-[#9ca3af]" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-xs text-[#b8956b] hover:underline"
      >
        清除全部
      </button>
    </div>
  );
}