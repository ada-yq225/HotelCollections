import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserStats } from "@/lib/badges";
import { buildMapPoints } from "@/lib/map";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const stats = await getUserStats(user.id);
  const allHotels = await prisma.hotel.findMany({
    include: { brand: { include: { group: true } } },
  });
  const mapPoints = buildMapPoints(
    allHotels,
    stats.stays.map((s) => ({
      hotelId: s.hotelId,
      nights: s.nights,
      checkIn: s.checkIn,
      proofUrl: s.proofUrl,
      roomType: s.roomType,
      hotel: s.hotel,
    }))
  );
  const visited = mapPoints.filter((p) => p.visited);

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<title>${user.name} 的 H&C 入住足迹</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; background: #faf6f0; color: #1a1a1a; padding: 48px; }
  .card { max-width: 720px; margin: 0 auto; background: white; border-radius: 24px; padding: 48px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
  .badge { display: inline-block; margin-top: 8px; padding: 4px 12px; border-radius: 999px; background: #faf6f0; color: #b8956b; font-size: 11px; font-family: system-ui, sans-serif; }
  @media print {
    body { background: white; padding: 0; }
    .card { box-shadow: none; border-radius: 0; max-width: 100%; }
    .no-print { display: none; }
  }
  h1 { font-size: 32px; margin-bottom: 8px; }
  .sub { color: #6b7280; font-size: 14px; margin-bottom: 32px; font-family: system-ui, sans-serif; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat { text-align: center; padding: 16px; background: #faf6f0; border-radius: 12px; }
  .stat .num { font-size: 28px; color: #b8956b; font-weight: 600; }
  .stat .lbl { font-size: 12px; color: #6b7280; margin-top: 4px; font-family: system-ui, sans-serif; }
  .hotels { list-style: none; }
  .hotels li { padding: 12px 0; border-bottom: 1px solid #e8e8e8; font-family: system-ui, sans-serif; font-size: 14px; }
  .hotels li span { color: #b8956b; font-size: 12px; }
  .footer { margin-top: 32px; text-align: center; color: #9ca3af; font-size: 12px; font-family: system-ui, sans-serif; }
</style>
</head>
<body>
<div class="card">
  <h1>${user.name}</h1>
  <p class="sub">H&C Hotel Collection · 入住足迹海报</p>
  <span class="badge">Hotel Collection · 奢华足迹</span>
  <button class="no-print" onclick="window.print()" style="margin-top:16px;padding:8px 20px;border-radius:999px;border:1px solid #b8956b;background:#faf6f0;color:#b8956b;cursor:pointer;font-family:system-ui,sans-serif;font-size:13px;">打印 / 存为 PDF</button>
  <div class="stats">
    <div class="stat"><div class="num">${stats.totalNights}</div><div class="lbl">总晚数</div></div>
    <div class="stat"><div class="num">${visited.length}</div><div class="lbl">点亮酒店</div></div>
    <div class="stat"><div class="num">${stats.uniqueBrands}</div><div class="lbl">覆盖品牌</div></div>
    <div class="stat"><div class="num">${stats.uniqueCountries}</div><div class="lbl">到访国家</div></div>
  </div>
  <ul class="hotels">
    ${stats.stays
      .slice(0, 12)
      .map(
        (s) =>
          `<li>${s.hotel.nameZh || s.hotel.name} <span>· ${s.hotel.cityZh || s.hotel.city} · ${s.nights} 晚</span></li>`
      )
      .join("")}
  </ul>
  <p class="footer">生成于 ${new Date().toLocaleDateString("zh-CN")} · hotel-collection</p>
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="hc-journey-${user.name}.html"`,
    },
  });
}