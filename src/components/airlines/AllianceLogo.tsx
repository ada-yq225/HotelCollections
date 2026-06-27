import Image from "next/image";
import type { AirlineAllianceSlug } from "@/data/airlines";
import { getAllianceLogoPath, ALLIANCE_META } from "@/lib/airline-logos";

type AllianceLogoProps = {
  alliance: AirlineAllianceSlug;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

type LogoSize = "sm" | "md" | "lg";

const squareLayout: Record<LogoSize, { box: string; imgW: number; imgH: number; text: string }> = {
  sm: { box: "h-8 w-8", imgW: 32, imgH: 32, text: "text-[9px]" },
  md: { box: "h-10 w-10", imgW: 40, imgH: 40, text: "text-[10px]" },
  lg: { box: "h-14 w-14", imgW: 56, imgH: 56, text: "text-xs" },
};

/** SkyTeam blockmark is horizontal (~2.85:1); needs a wide box to stay legible. */
const skyteamLayout: Record<LogoSize, { box: string; imgW: number; imgH: number; text: string }> = {
  sm: { box: "h-8 w-[92px]", imgW: 92, imgH: 32, text: "text-[9px]" },
  md: { box: "h-10 w-[115px]", imgW: 115, imgH: 40, text: "text-[10px]" },
  lg: { box: "h-14 w-[160px]", imgW: 160, imgH: 56, text: "text-xs" },
};

function getLayout(alliance: AirlineAllianceSlug, size: LogoSize) {
  return alliance === "skyteam" ? skyteamLayout[size] : squareLayout[size];
}

export function AllianceLogo({ alliance, size = "md", showLabel = true }: AllianceLogoProps) {
  const meta = ALLIANCE_META[alliance];
  const layout = getLayout(alliance, size);
  const src = getAllianceLogoPath(alliance);

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`${layout.box} relative shrink-0 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-[#e8e8e8]`}
        title={meta.nameZh}
      >
        <Image
          src={src}
          alt={`${meta.nameZh} 官方标识`}
          width={layout.imgW}
          height={layout.imgH}
          className="h-full w-full object-contain px-1 py-0.5"
          unoptimized
        />
      </div>
      {showLabel && (
        <span
          className={`${layout.text} font-semibold whitespace-nowrap`}
          style={{ color: meta.color }}
        >
          {meta.nameZh}
        </span>
      )}
    </div>
  );
}

export const ALLIANCE_CONFIG = ALLIANCE_META;