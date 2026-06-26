"use client";

import { useState } from "react";
import Image from "next/image";
import { getAirlineLogoPath, getAirlineLogoUrl } from "@/lib/airline-logos";

const sizeMap = {
  xs: { box: "h-6 w-6", img: 24, pad: "p-0.5" },
  sm: { box: "h-8 w-8", img: 32, pad: "p-0.5" },
  md: { box: "h-10 w-10", img: 40, pad: "p-1" },
  lg: { box: "h-12 w-12", img: 48, pad: "p-1" },
  xl: { box: "h-16 w-16", img: 64, pad: "p-1.5" },
};

type AirlineLogoProps = {
  iata: string;
  nameZh: string;
  size?: keyof typeof sizeMap;
  className?: string;
};

export function AirlineLogo({
  iata,
  nameZh,
  size = "sm",
  className = "",
}: AirlineLogoProps) {
  const sz = sizeMap[size];
  const [src, setSrc] = useState(getAirlineLogoPath(iata));
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${sz.box} flex shrink-0 items-center justify-center rounded-lg border border-[#e8e8e8] bg-[#1a1a1a] font-mono text-[10px] font-bold text-white ${className}`}
        title={nameZh}
      >
        {iata}
      </div>
    );
  }

  return (
    <div
      className={`${sz.box} relative shrink-0 overflow-hidden rounded-lg border border-[#e8e8e8] bg-white ${sz.pad} ${className}`}
    >
      <Image
        src={src}
        alt={`${nameZh} 官方标识`}
        width={sz.img}
        height={sz.img}
        className="h-full w-full object-contain"
        unoptimized
        onError={() => {
          if (src.startsWith("/airlines/")) {
            setSrc(getAirlineLogoUrl(iata, false));
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}