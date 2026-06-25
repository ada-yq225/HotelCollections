import type { MapPoint } from "@/components/map/WorldMap";

type StayRecord = {
  hotelId: string;
  nights: number;
  checkIn: Date;
  proofUrl: string | null;
  roomType: string | null;
  hotel: {
    id: string;
    name: string;
    nameZh: string | null;
    city: string;
    cityZh: string;
    latitude: number;
    longitude: number;
    brand: {
      nameZh: string;
      group: { slug: string; logoColor: string | null };
    };
  };
};

type HotelRecord = {
  id: string;
  name: string;
  nameZh: string | null;
  city: string;
  cityZh: string;
  latitude: number;
  longitude: number;
  brand: {
    nameZh: string;
    group: { slug: string; logoColor: string | null };
  };
};

export function buildMapPoints(
  allHotels: HotelRecord[],
  stays: StayRecord[]
): MapPoint[] {
  const stayAgg = new Map<
    string,
    { count: number; nights: number; lastCheckIn: Date; proofUrl: string | null; roomType: string | null }
  >();

  for (const stay of stays) {
    const existing = stayAgg.get(stay.hotelId);
    if (!existing) {
      stayAgg.set(stay.hotelId, {
        count: 1,
        nights: stay.nights,
        lastCheckIn: stay.checkIn,
        proofUrl: stay.proofUrl,
        roomType: stay.roomType,
      });
    } else {
      existing.count += 1;
      existing.nights += stay.nights;
      if (stay.checkIn > existing.lastCheckIn) {
        existing.lastCheckIn = stay.checkIn;
        existing.proofUrl = stay.proofUrl;
        existing.roomType = stay.roomType;
      }
    }
  }

  return allHotels.map((h) => {
    const agg = stayAgg.get(h.id);
    return {
      id: h.id,
      name: h.nameZh || h.name,
      city: h.cityZh || h.city,
      brand: h.brand.nameZh,
      group: h.brand.group.slug,
      groupColor: h.brand.group.logoColor ?? "#1a1a1a",
      lat: h.latitude,
      lng: h.longitude,
      visited: !!agg,
      stayCount: agg?.count,
      totalNights: agg?.nights,
      lastCheckIn: agg?.lastCheckIn.toISOString(),
      proofUrl: agg?.proofUrl,
      roomType: agg?.roomType,
    };
  });
}