import {
  ALL_AIRPORTS,
  DEPARTURE_AIRPORTS,
  getAirportByIata,
  type Airport,
} from "@/data/airports";
import { getDirectMinutes, ROUTING_HUBS } from "@/data/flight-routes";

export type FlightLeg = {
  from: string;
  to: string;
  fromZh: string;
  toZh: string;
  durationMin: number;
};

export type FlightOption = {
  type: "direct" | "connecting";
  legs: FlightLeg[];
  totalDurationMin: number;
  stops: number;
  layoverMin?: number;
  hubIata?: string;
  hubZh?: string;
};

export type TravelPlanResult = {
  departure: Airport;
  destinationAirport: Airport;
  hotelDistanceKm: number;
  airportToHotelKm: number;
  straightLineKm: number;
  flights: FlightOption[];
};

const EARTH_RADIUS_KM = 6371;

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} 米`;
  if (km < 100) return `${Math.round(km)} 公里`;
  return `${Math.round(km).toLocaleString("zh-CN")} 公里`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} 分钟`;
  if (m === 0) return `${h} 小时`;
  return `${h} 小时 ${m} 分`;
}

function estimateFlightMinutes(from: Airport, to: Airport): number {
  const direct = getDirectMinutes(from.iata, to.iata);
  if (direct != null) return direct;
  const dist = haversineKm(from.latitude, from.longitude, to.latitude, to.longitude);
  return Math.round(dist / 800 * 60) + 40;
}

function buildLeg(from: Airport, to: Airport, durationMin: number): FlightLeg {
  return {
    from: from.iata,
    to: to.iata,
    fromZh: `${from.cityZh} ${from.nameZh}`,
    toZh: `${to.cityZh} ${to.nameZh}`,
    durationMin,
  };
}

/** Pick nearest airport to hotel coordinates */
export function nearestDestinationAirport(
  latitude: number,
  longitude: number,
  countryCode: string,
  cityZh: string
): Airport {
  const countryMatch = ALL_AIRPORTS.filter((a) => a.countryCode === countryCode);
  const pool = countryMatch.length > 0 ? countryMatch : ALL_AIRPORTS;

  let best = pool[0];
  let bestDist = Infinity;
  for (const ap of pool) {
    const d = haversineKm(latitude, longitude, ap.latitude, ap.longitude);
    if (d < bestDist) {
      bestDist = d;
      best = ap;
    }
  }

  const cityAirport = pool.find(
    (a) => cityZh.includes(a.cityZh) || a.cityZh.includes(cityZh.slice(0, 2))
  );
  if (cityAirport) return cityAirport;

  return best;
}

export function findNearestDepartureAirport(lat: number, lng: number): Airport {
  let best = DEPARTURE_AIRPORTS[0];
  let bestDist = Infinity;
  for (const ap of DEPARTURE_AIRPORTS) {
    const d = haversineKm(lat, lng, ap.latitude, ap.longitude);
    if (d < bestDist) {
      bestDist = d;
      best = ap;
    }
  }
  return best;
}

export function searchFlightsBetweenAirports(
  departureIata: string,
  destinationIata: string
): { departure: Airport; destination: Airport; flights: FlightOption[] } | null {
  const departure = getAirportByIata(departureIata);
  const destination = getAirportByIata(destinationIata);
  if (!departure || !destination) return null;
  if (departure.iata === destination.iata) return null;
  return {
    departure,
    destination,
    flights: findFlightOptions(departure, destination),
  };
}

function findFlightOptions(dep: Airport, dest: Airport): FlightOption[] {
  const options: FlightOption[] = [];

  const directMin = getDirectMinutes(dep.iata, dest.iata);
  if (directMin != null) {
    options.push({
      type: "direct",
      legs: [buildLeg(dep, dest, directMin)],
      totalDurationMin: directMin,
      stops: 0,
    });
  } else {
    const estDirect = estimateFlightMinutes(dep, dest);
    if (haversineKm(dep.latitude, dep.longitude, dest.latitude, dest.longitude) < 1200) {
      options.push({
        type: "direct",
        legs: [buildLeg(dep, dest, estDirect)],
        totalDurationMin: estDirect,
        stops: 0,
      });
    }
  }

  const connecting: FlightOption[] = [];
  for (const hubIata of ROUTING_HUBS) {
    if (hubIata === dep.iata || hubIata === dest.iata) continue;
    const hub = getAirportByIata(hubIata);
    if (!hub) continue;

    const leg1 = getDirectMinutes(dep.iata, hubIata) ?? estimateFlightMinutes(dep, hub);
    const leg2 = getDirectMinutes(hubIata, dest.iata) ?? estimateFlightMinutes(hub, dest);
    if (leg1 > 900 || leg2 > 900) continue;

    const layover = hub.isHub ? 90 : 120;
    connecting.push({
      type: "connecting",
      legs: [buildLeg(dep, hub, leg1), buildLeg(hub, dest, leg2)],
      totalDurationMin: leg1 + leg2 + layover,
      stops: 1,
      layoverMin: layover,
      hubIata,
      hubZh: hub.cityZh,
    });
  }

  connecting.sort((a, b) => a.totalDurationMin - b.totalDurationMin);

  const seen = new Set<string>();
  for (const c of connecting) {
    const key = c.hubIata ?? c.legs.map((l) => l.to).join("-");
    if (seen.has(key)) continue;
    seen.add(key);
    if (options.length < 8) options.push(c);
  }

  options.sort((a, b) => {
    if (a.type !== b.type) return a.type === "direct" ? -1 : 1;
    return a.totalDurationMin - b.totalDurationMin;
  });

  return options.slice(0, 6);
}

export function planTravelToHotel(
  departureIata: string,
  hotel: {
    latitude: number;
    longitude: number;
    countryCode: string;
    cityZh: string;
  }
): TravelPlanResult | null {
  const departure = getAirportByIata(departureIata);
  if (!departure) return null;

  const destinationAirport = nearestDestinationAirport(
    hotel.latitude,
    hotel.longitude,
    hotel.countryCode,
    hotel.cityZh
  );

  const straightLineKm = haversineKm(
    departure.latitude,
    departure.longitude,
    hotel.latitude,
    hotel.longitude
  );

  const airportToHotelKm = haversineKm(
    destinationAirport.latitude,
    destinationAirport.longitude,
    hotel.latitude,
    hotel.longitude
  );

  const flights = findFlightOptions(departure, destinationAirport);

  return {
    departure,
    destinationAirport,
    hotelDistanceKm: straightLineKm,
    airportToHotelKm,
    straightLineKm,
    flights,
  };
}

export const DEPARTURE_STORAGE_KEY = "hc-departure-airport";