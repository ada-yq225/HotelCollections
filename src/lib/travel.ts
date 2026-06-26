import {
  ALL_AIRPORTS,
  DEPARTURE_AIRPORTS,
  getAirportByIata,
  type Airport,
} from "@/data/airports";
import { getDirectMinutes, getRoutingHubs } from "@/data/flight-routes";
import {
  flightNumberFor,
  pickCarrierForLeg,
  type AirlineInfo,
} from "@/data/airlines";
import {
  getRoutePremiumHighlights,
  type PremiumCabinProduct,
} from "@/data/flight-cabin-products";
import {
  formatFlightPriceLabel,
  getFlightCabinFares,
  type CabinFareTier,
} from "@/data/flight-prices";

export type FlightLeg = {
  from: string;
  to: string;
  fromZh: string;
  toZh: string;
  durationMin: number;
  airline: AirlineInfo;
  flightNumber: string;
};

export type FlightOption = {
  type: "direct" | "connecting";
  legs: FlightLeg[];
  totalDurationMin: number;
  stops: number;
  layoverMin?: number;
  hubIata?: string;
  hubZh?: string;
  priceCny: number | null;
  priceLabel: string;
  businessPriceCny: number | null;
  businessPriceLabel: string;
  cabinTiers: CabinFareTier[];
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

function buildLeg(
  from: Airport,
  to: Airport,
  durationMin: number,
  legIndex: number,
  optionSalt: number
): FlightLeg {
  const airline = pickCarrierForLeg(from.countryCode, to.countryCode, to.countryCode, legIndex);
  return {
    from: from.iata,
    to: to.iata,
    fromZh: `${from.cityZh} ${from.nameZh}`,
    toZh: `${to.cityZh} ${to.nameZh}`,
    durationMin,
    airline,
    flightNumber: flightNumberFor(airline.iata, from.iata, to.iata, optionSalt + legIndex),
  };
}

function finalizeOption(
  option: Omit<
    FlightOption,
    | "priceCny"
    | "priceLabel"
    | "businessPriceCny"
    | "businessPriceLabel"
    | "cabinTiers"
  >,
  _dep: Airport,
  _dest: Airport
): FlightOption {
  const dist = option.legs.reduce((sum, leg) => {
    const fromAp = getAirportByIata(leg.from);
    const toAp = getAirportByIata(leg.to);
    if (!fromAp || !toAp) return sum;
    return sum + haversineKm(fromAp.latitude, fromAp.longitude, toAp.latitude, toAp.longitude);
  }, 0);
  const fares = getFlightCabinFares(
    option.legs.map((l) => ({ from: l.from, to: l.to })),
    option.stops,
    dist,
    option.totalDurationMin
  );
  return {
    ...option,
    priceCny: fares.economy,
    priceLabel: formatFlightPriceLabel(fares.economy),
    businessPriceCny: fares.business,
    businessPriceLabel: formatFlightPriceLabel(fares.business),
    cabinTiers: fares.tiers,
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
): {
  departure: Airport;
  destination: Airport;
  flights: FlightOption[];
  premiumHighlights: PremiumCabinProduct[];
} | null {
  const departure = getAirportByIata(departureIata);
  const destination = getAirportByIata(destinationIata);
  if (!departure || !destination) return null;
  if (departure.iata === destination.iata) return null;
  return {
    departure,
    destination,
    flights: findFlightOptions(departure, destination),
    premiumHighlights: getRoutePremiumHighlights(
      departure.iata,
      destination.iata,
      departure.countryCode,
      destination.countryCode
    ),
  };
}

function findFlightOptions(dep: Airport, dest: Airport): FlightOption[] {
  const options: FlightOption[] = [];

  const directMin = getDirectMinutes(dep.iata, dest.iata);
  if (directMin != null) {
    options.push(
      finalizeOption(
        {
          type: "direct",
          legs: [buildLeg(dep, dest, directMin, 0, 0)],
          totalDurationMin: directMin,
          stops: 0,
        },
        dep,
        dest
      )
    );
  } else {
    const estDirect = estimateFlightMinutes(dep, dest);
    if (haversineKm(dep.latitude, dep.longitude, dest.latitude, dest.longitude) < 1200) {
      options.push(
        finalizeOption(
          {
            type: "direct",
            legs: [buildLeg(dep, dest, estDirect, 0, 0)],
            totalDurationMin: estDirect,
            stops: 0,
          },
          dep,
          dest
        )
      );
    }
  }

  const connecting: FlightOption[] = [];
  const routingHubs = getRoutingHubs(dep.countryCode, dest.countryCode);
  for (const hubIata of routingHubs) {
    if (hubIata === dep.iata || hubIata === dest.iata) continue;
    const hub = getAirportByIata(hubIata);
    if (!hub) continue;

    const leg1 = getDirectMinutes(dep.iata, hubIata) ?? estimateFlightMinutes(dep, hub);
    const leg2 = getDirectMinutes(hubIata, dest.iata) ?? estimateFlightMinutes(hub, dest);
    if (leg1 > 900 || leg2 > 900) continue;

    const layover = hub.isHub ? 90 : 120;
    const salt = connecting.length;
    connecting.push(
      finalizeOption(
        {
          type: "connecting",
          legs: [
            buildLeg(dep, hub, leg1, 0, salt),
            buildLeg(hub, dest, leg2, 1, salt),
          ],
          totalDurationMin: leg1 + leg2 + layover,
          stops: 1,
          layoverMin: layover,
          hubIata,
          hubZh: hub.cityZh,
        },
        dep,
        dest
      )
    );
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