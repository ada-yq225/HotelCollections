"use client";

import { useEffect, useRef } from "react";

type RouteLine = {
  dep: string;
  arr: string;
  depLat: number;
  depLng: number;
  arrLat: number;
  arrLng: number;
  count: number;
};

export function FlightRouteMap({ routeLines }: { routeLines: RouteLine[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || routeLines.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement!.getBoundingClientRect();
    const w = rect.width;
    const h = 360;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, w, h);

    // Draw a simple world map outline (simplified continents)
    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 1;
    drawSimpleWorld(ctx, w, h);

    // Draw route lines
    const padding = 40;
    const maxCount = Math.max(...routeLines.map((r) => r.count), 1);

    for (const route of routeLines) {
      const x1 = padding + ((route.depLng + 180) / 360) * (w - padding * 2);
      const y1 = padding + ((90 - route.depLat) / 180) * (h - padding * 2);
      const x2 = padding + ((route.arrLng + 180) / 360) * (w - padding * 2);
      const y2 = padding + ((90 - route.arrLat) / 180) * (h - padding * 2);

      // Great circle arc approximation
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.15;

      const alpha = 0.2 + (route.count / maxCount) * 0.5;
      const lineWidth = 1 + (route.count / maxCount) * 2;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(midX, midY, x2, y2);
      ctx.strokeStyle = `rgba(184, 149, 107, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      // Draw dots at airports
      ctx.beginPath();
      ctx.arc(x1, y1, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#b8956b";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x2, y2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [routeLines]);

  return (
    <div className="hc-card overflow-hidden rounded-2xl">
      <canvas ref={canvasRef} className="w-full" style={{ height: 360 }} />
    </div>
  );
}

function drawSimpleWorld(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const pad = 40;
  const toX = (lng: number) => pad + ((lng + 180) / 360) * (w - pad * 2);
  const toY = (lat: number) => pad + ((90 - lat) / 180) * (h - pad * 2);

  // Simplified continent outlines
  const continents = [
    // North America
    [[-125, 25], [-125, 50], [-100, 70], [-60, 70], [-55, 45], [-65, 30], [-80, 25], [-97, 20], [-105, 18], [-117, 32]],
    // South America
    [[-80, 10], [-67, 12], [-50, 0], [-35, -5], [-35, -20], [-50, -35], [-68, -48], [-72, -35], [-70, -18], [-76, -5], [-80, 5]],
    // Europe
    [[-10, 36], [0, 43], [3, 48], [-2, 52], [2, 55], [10, 57], [15, 55], [25, 58], [30, 60], [35, 55], [28, 45], [25, 42], [18, 40], [10, 37], [5, 36], [-5, 36]],
    // Africa
    [[-5, 36], [10, 37], [35, 32], [40, 25], [50, 12], [40, 0], [35, -5], [30, -15], [25, -25], [20, -35], [15, -30], [12, -17], [8, -5], [5, 5], [-5, 5], [-15, 15], [-17, 20], [-8, 30]],
    // Asia
    [[30, 42], [45, 42], [50, 40], [55, 45], [60, 55], [70, 58], [80, 52], [95, 50], [100, 48], [105, 40], [110, 25], [120, 30], [128, 35], [140, 38], [145, 45], [145, 30], [140, 15], [130, 5], [120, -5], [110, -8], [105, 0], [95, 10], [90, 22], [85, 25], [75, 25], [65, 25], [55, 27], [45, 35], [35, 40]],
    // Australia
    [[115, -20], [115, -15], [120, -12], [130, -12], [138, -17], [145, -18], [150, -22], [153, -25], [150, -35], [145, -38], [140, -38], [135, -35], [125, -33], [118, -34], [115, -30], [114, -25]],
  ];

  for (const points of continents) {
    ctx.beginPath();
    ctx.moveTo(toX(points[0][0] as number), toY(points[0][1] as number));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(toX(points[i][0] as number), toY(points[i][1] as number));
    }
    ctx.closePath();
    ctx.fillStyle = "#f0f0f0";
    ctx.fill();
    ctx.stroke();
  }
}
