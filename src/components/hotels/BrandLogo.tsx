"use client";

import { useState } from "react";
import { getBrandLogoPath } from "@/lib/brand-logo-files";
import { getBrandVisual } from "@/lib/brand-logos";

type BrandLogoProps = {
  brandSlug: string;
  brandNameZh: string;
  groupColor?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
  variant?: "badge" | "plain";
};

const SIZES = {
  xs: { box: "h-7 w-7", name: "text-[10px]", pad: "p-0.5" },
  sm: { box: "h-9 w-9", name: "text-xs", pad: "p-1" },
  md: { box: "h-11 w-11", name: "text-sm", pad: "p-1" },
  lg: { box: "h-14 w-14", name: "text-sm", pad: "p-1.5" },
};

export function BrandLogo({
  brandSlug,
  brandNameZh,
  groupColor = "#b8956b",
  size = "sm",
  showName = false,
  className = "",
  variant = "badge",
}: BrandLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const logoPath = getBrandLogoPath(brandSlug);
  const visual = getBrandVisual(brandSlug, groupColor);
  const s = SIZES[size];

  const shapeClass =
    visual.shape === "circle"
      ? "rounded-full"
      : visual.shape === "square"
        ? "rounded-md"
        : "rounded-lg";

  const showImage = logoPath && !imgFailed;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {showImage ? (
        <div
          className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-white shadow-sm ${s.box} ${variant === "badge" ? shapeClass : "rounded-lg"} ${variant === "badge" ? "ring-1 ring-[#f0f0f0]" : ""}`}
          title={brandNameZh}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoPath}
            alt={brandNameZh}
            className={`h-full w-full object-contain ${s.pad}`}
            onError={() => setImgFailed(true)}
          />
        </div>
      ) : (
        <div
          className={`flex shrink-0 items-center justify-center font-semibold tracking-tight shadow-sm ${s.box} ${shapeClass} text-[10px]`}
          style={{
            backgroundColor: visual.bg,
            color: visual.fg,
            border: visual.border ? `1.5px solid ${visual.border}` : undefined,
            fontSize: size === "lg" ? "0.875rem" : size === "md" ? "0.75rem" : size === "sm" ? "0.625rem" : "0.5625rem",
          }}
          title={brandNameZh}
        >
          <span className="font-serif leading-none">{visual.monogram}</span>
        </div>
      )}
      {showName && (
        <span className={`font-medium text-[#374151] ${s.name}`}>{brandNameZh}</span>
      )}
    </div>
  );
}