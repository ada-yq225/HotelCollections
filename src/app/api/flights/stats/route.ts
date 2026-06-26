import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AIRLINES } from "@/data/airlines";
import { getAirlineLogoPath } from "@/lib/airline-logos";

const IATA_COORDS: Record<string, { lat: number; lng: number; nameZh: string }> = {
  PEK: { lat: 40.0799, lng: 116.6031, nameZh: "北京首都" },
  PKX: { lat: 39.5098, lng: 116.4105, nameZh: "北京大兴" },
  PVG: { lat: 31.1443, lng: 121.8083, nameZh: "上海浦东" },
  SHA: { lat: 31.1978, lng: 121.3363, nameZh: "上海虹桥" },
  CAN: { lat: 23.3925, lng: 113.2988, nameZh: "广州白云" },
  SZX: { lat: 22.6394, lng: 113.8109, nameZh: "深圳宝安" },
  CTU: { lat: 30.5785, lng: 103.9467, nameZh: "成都天府" },
  HGH: { lat: 30.2295, lng: 120.4344, nameZh: "杭州萧山" },
  KMG: { lat: 25.1019, lng: 102.9291, nameZh: "昆明长水" },
  XIY: { lat: 34.4471, lng: 108.7516, nameZh: "西安咸阳" },
  CKG: { lat: 29.7192, lng: 106.6417, nameZh: "重庆江北" },
  HKG: { lat: 22.308, lng: 113.9147, nameZh: "香港国际" },
  MFM: { lat: 22.1496, lng: 113.5916, nameZh: "澳门国际" },
  TPE: { lat: 25.0777, lng: 121.2328, nameZh: "台北桃园" },
  NRT: { lat: 35.7719, lng: 140.3929, nameZh: "东京成田" },
  HND: { lat: 35.5533, lng: 139.7811, nameZh: "东京羽田" },
  KIX: { lat: 34.4273, lng: 135.2441, nameZh: "大阪关西" },
  ICN: { lat: 37.4602, lng: 126.4407, nameZh: "首尔仁川" },
  SIN: { lat: 1.359, lng: 103.989, nameZh: "新加坡樟宜" },
  BKK: { lat: 13.69, lng: 100.75, nameZh: "曼谷素万那普" },
  DXB: { lat: 25.2532, lng: 55.3657, nameZh: "迪拜国际" },
  DOH: { lat: 25.2731, lng: 51.6081, nameZh: "多哈哈马德" },
  AUH: { lat: 24.433, lng: 54.6511, nameZh: "阿布扎比" },
  LHR: { lat: 51.4706, lng: -0.4619, nameZh: "伦敦希思罗" },
  CDG: { lat: 49.0097, lng: 2.5479, nameZh: "巴黎戴高乐" },
  FRA: { lat: 50.0379, lng: 8.5622, nameZh: "法兰克福" },
  ZRH: { lat: 47.4647, lng: 8.5492, nameZh: "苏黎世" },
  FCO: { lat: 41.8003, lng: 12.2389, nameZh: "罗马菲乌米奇诺" },
  JFK: { lat: 40.6413, lng: -73.7781, nameZh: "纽约肯尼迪" },
  LAX: { lat: 33.9416, lng: -118.4085, nameZh: "洛杉矶" },
  SFO: { lat: 37.6213, lng: -122.379, nameZh: "旧金山" },
  SYD: { lat: -33.9399, lng: 151.1753, nameZh: "悉尼" },
  MEL: { lat: -37.669, lng: 144.841, nameZh: "墨尔本" },
  MLE: { lat: 4.1918, lng: 73.5291, nameZh: "马累维拉纳" },
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const flights = await prisma.flightStay.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  const totalSegments = flights.length;
  let totalKm = 0;
  let totalHours = 0;
  const visitedAirports = new Set<string>();
  const cabinCounts: Record<string, number> = { economy: 0, premium_economy: 0, business: 0, first: 0 };
  const airlineSet = new Set<string>();
  const cityPairs = new Map<string, number>();
  const routeLines: { dep: string; arr: string; depLat: number; depLng: number; arrLat: number; arrLng: number; count: number }[] = [];

  for (const f of flights) {
    visitedAirports.add(f.departureIata);
    visitedAirports.add(f.arrivalIata);
    cabinCounts[f.cabin] = (cabinCounts[f.cabin] ?? 0) + 1;
    airlineSet.add(f.airlineIata);

    const pairKey = `${f.departureIata}-${f.arrivalIata}`;
    cityPairs.set(pairKey, (cityPairs.get(pairKey) ?? 0) + 1);

    const dep = IATA_COORDS[f.departureIata];
    const arr = IATA_COORDS[f.arrivalIata];
    if (dep && arr) {
      const km = haversineKm(dep.lat, dep.lng, arr.lat, arr.lng);
      totalKm += km;
      totalHours += km / 800;
      routeLines.push({
        dep: f.departureIata,
        arr: f.arrivalIata,
        depLat: dep.lat,
        depLng: dep.lng,
        arrLat: arr.lat,
        arrLng: arr.lng,
        count: 1,
      });
    }
  }

  const topRoutes = [...cityPairs.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => {
      const [dep, arr] = key.split("-");
      return { dep, arr, depName: IATA_COORDS[dep]?.nameZh ?? dep, arrName: IATA_COORDS[arr]?.nameZh ?? arr, count };
    });

  const airlinesList = [...airlineSet].map((iata) => ({
    iata,
    name: AIRLINES[iata]?.nameZh ?? iata,
    alliance: AIRLINES[iata]?.alliance ?? null,
    logoUrl: getAirlineLogoPath(iata),
    count: flights.filter((f) => f.airlineIata === iata).length,
  })).sort((a, b) => b.count - a.count);

  const longestFlight = flights.reduce(
    (best, f) => {
      const dep = IATA_COORDS[f.departureIata];
      const arr = IATA_COORDS[f.arrivalIata];
      if (!dep || !arr) return best;
      const km = haversineKm(dep.lat, dep.lng, arr.lat, arr.lng);
      return km > best.km ? { ...f, km, depName: dep.nameZh, arrName: arr.nameZh } : best;
    },
    { km: 0 } as any
  );

  return NextResponse.json({
    totalSegments,
    totalKm: Math.round(totalKm),
    totalHours: Math.round(totalHours),
    visitedAirports: visitedAirports.size,
    uniqueAirlines: airlineSet.size,
    cabinBreakdown: cabinCounts,
    topRoutes,
    airlinesList,
    longestFlight: longestFlight.km > 0 ? longestFlight : null,
    routeLines,
    flights,
  });
}
