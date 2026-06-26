import Image from "next/image";
import type { AirlineAllianceSlug } from "@/data/airlines";
import { getAllianceLogoPath, ALLIANCE_META } from "@/lib/airline-logos";

type AllianceLogoProps = {
  alliance: AirlineAllianceSlug;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

const sizeMap = {
  sm: { box: "h-8 w-8", img: 32, text: "text-[9px]" },
  md: { box: "h-10 w-10", img: 40, text: "text-[10px]" },
  lg: { box: "h-14 w-14", img: 56, text: "text-xs" },
};

export function AllianceLogo({ alliance, size = "md", showLabel = true }: AllianceLogoProps) {
  const meta = ALLIANCE_META[alliance];
  const sz = sizeMap[size];
  const src = getAllianceLogoPath(alliance);

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`${sz.box} relative shrink-0 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-[#e8e8e8]`}
        title={meta.nameZh}
      >
        <Image
          src={src}
          alt={`${meta.nameZh} 官方标识`}
          width={sz.img}
          height={sz.img}
          className="h-full w-full object-contain p-0.5"
          unoptimized
        />
      </div>
      {showLabel && (
        <span
          className={`${sz.text} font-semibold whitespace-nowrap`}
          style={{ color: meta.color }}
        >
          {meta.nameZh}
        </span>
      )}
    </div>
  );
}

export const ALLIANCE_CONFIG = ALLIANCE_META;