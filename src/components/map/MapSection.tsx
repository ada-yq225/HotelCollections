"use client";

import dynamic from "next/dynamic";
import type { MapPoint } from "./WorldMap";

const WorldMap = dynamic(() => import("./WorldMap").then((m) => m.WorldMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] items-center justify-center rounded-2xl bg-[#f5f5f5] text-[#6b7280]">
      加载地图...
    </div>
  ),
});

export function MapSection({
  points,
  defaultMode = "visited",
}: {
  points: MapPoint[];
  defaultMode?: "visited" | "all";
}) {
  return <WorldMap points={points} defaultMode={defaultMode} />;
}