import { prisma } from "./prisma";

export async function evaluateFlightBadges(userId: string) {
  const flights = await prisma.flightStay.findMany({ where: { userId } });
  const reports = await prisma.flightReport.count({ where: { userId } });
  const stays = await prisma.stay.count({ where: { userId } });

  const totalSegments = flights.length;
  const businessCount = flights.filter((f) => f.cabin === "business").length;
  const firstCount = flights.filter((f) => f.cabin === "first").length;
  const uniqueAirlines = new Set(flights.map((f) => f.airlineIata)).size;

  let totalKm = 0;
  let hasTranspacific = false;
  let hasTransatlantic = false;
  let intercontinentalCount = 0;

  const IATA_COORDS: Record<string, { lat: number; lng: number }> = {
    PEK: { lat: 40.08, lng: 116.6 }, PVG: { lat: 31.14, lng: 121.8 }, CAN: { lat: 23.39, lng: 113.3 },
    SZX: { lat: 22.64, lng: 113.8 }, CTU: { lat: 30.58, lng: 103.9 }, HKG: { lat: 22.31, lng: 113.9 },
    NRT: { lat: 35.77, lng: 140.4 }, HND: { lat: 35.55, lng: 139.8 }, SIN: { lat: 1.36, lng: 103.99 },
    BKK: { lat: 13.69, lng: 100.75 }, DXB: { lat: 25.25, lng: 55.36 }, DOH: { lat: 25.27, lng: 51.61 },
    LHR: { lat: 51.47, lng: -0.46 }, CDG: { lat: 49.01, lng: 2.55 }, FRA: { lat: 50.04, lng: 8.56 },
    JFK: { lat: 40.64, lng: -73.78 }, LAX: { lat: 33.94, lng: -118.4 }, SFO: { lat: 37.62, lng: -122.38 },
    SYD: { lat: -33.94, lng: 151.18 }, MLE: { lat: 4.19, lng: 73.53 },
    ICN: { lat: 37.46, lng: 126.44 }, TPE: { lat: 25.08, lng: 121.23 }, KIX: { lat: 34.43, lng: 135.24 },
    AUH: { lat: 24.43, lng: 54.65 }, ZRH: { lat: 47.46, lng: 8.55 }, FCO: { lat: 41.8, lng: 12.24 },
    MEL: { lat: -37.67, lng: 144.84 },
  };

  const intercontinentalPairs = new Set<string>();

  for (const f of flights) {
    const dep = IATA_COORDS[f.departureIata];
    const arr = IATA_COORDS[f.arrivalIata];
    if (!dep || !arr) continue;

    const km = haversineKm(dep.lat, dep.lng, arr.lat, arr.lng);
    totalKm += km;

    // Detect transpacific
    if (
      (dep.lng < -100 && arr.lng > 100) || (arr.lng < -100 && dep.lng > 100) ||
      (dep.lng < 140 && dep.lng > 100 && arr.lng < -100) || (arr.lng < 140 && arr.lng > 100 && dep.lng < -100)
    ) {
      hasTranspacific = true;
    }

    // Detect transatlantic
    if (
      (dep.lng > -10 && dep.lng < 40 && arr.lng < -40) || (arr.lng > -10 && arr.lng < 40 && dep.lng < -40)
    ) {
      hasTransatlantic = true;
    }

    // Detect intercontinental (crosses 2+ major regions)
    if (isIntercontinental(dep, arr)) {
      intercontinentalPairs.add(`${f.departureIata}-${f.arrivalIata}`);
    }
  }

  intercontinentalCount = intercontinentalPairs.size;

  const allBadges = await prisma.badge.findMany();
  const earned = await prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } });
  const earnedSet = new Set(earned.map((e) => e.badgeId));
  const toAward: string[] = [];

  for (const badge of allBadges) {
    if (earnedSet.has(badge.id)) continue;
    if (badge.category !== "flights") continue;

    let qualifies = false;
    switch (badge.slug) {
      case "first-flight": qualifies = totalSegments >= 1; break;
      case "flights-5": qualifies = totalSegments >= 5; break;
      case "flights-10": qualifies = totalSegments >= 10; break;
      case "flights-25": qualifies = totalSegments >= 25; break;
      case "flights-50": qualifies = totalSegments >= 50; break;
      case "flights-100": qualifies = totalSegments >= 100; break;
      case "business-cabin-1": qualifies = businessCount >= 1; break;
      case "business-cabin-5": qualifies = businessCount >= 5; break;
      case "first-cabin-1": qualifies = firstCount >= 1; break;
      case "first-cabin-3": qualifies = firstCount >= 3; break;
      case "distance-10000": qualifies = totalKm >= 10000; break;
      case "distance-50000": qualifies = totalKm >= 50000; break;
      case "distance-100000": qualifies = totalKm >= 100000; break;
      case "transpacific": qualifies = hasTranspacific; break;
      case "transatlantic": qualifies = hasTransatlantic; break;
      case "intercontinental-3": qualifies = intercontinentalCount >= 3; break;
      case "airlines-3": qualifies = uniqueAirlines >= 3; break;
      case "airlines-5": qualifies = uniqueAirlines >= 5; break;
      case "airlines-10": qualifies = uniqueAirlines >= 10; break;
      case "flight-report-1": qualifies = reports >= 1; break;
      case "flight-report-5": qualifies = reports >= 5; break;
      case "complete-traveler": qualifies = stays >= 5 && totalSegments >= 5; break;
    }

    if (qualifies) toAward.push(badge.id);
  }

  if (toAward.length > 0) {
    await prisma.userBadge.createMany({
      data: toAward.map((badgeId) => ({ userId, badgeId })),
    });
  }

  return toAward.length;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isIntercontinental(dep: { lat: number; lng: number }, arr: { lat: number; lng: number }): boolean {
  const regions = (lat: number, lng: number): string => {
    if (lat > 20 && lat < 55 && lng > -15 && lng < 40) return "europe";
    if (lat > 10 && lat < 55 && lng > 70 && lng < 150) return "east-asia";
    if (lat > 0 && lat < 35 && lng > 35 && lng < 80) return "middle-east";
    if (lat > 15 && lat < 55 && lng > -130 && lng < -60) return "north-america";
    if (lat > -10 && lat < 20 && lng > 95 && lng < 140) return "se-asia";
    if (lat > -40 && lat < -10 && lng > 110 && lng < 155) return "oceania";
    if (lat > -35 && lat < 35 && lng > -20 && lng < 50) return "africa";
    return "other";
  };
  return regions(dep.lat, dep.lng) !== regions(arr.lat, arr.lng);
}
