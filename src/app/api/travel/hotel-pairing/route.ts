import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hotelInclude, serializeHotelForList } from "@/lib/hotels";

const DEST_REGION_MAP: Record<string, string[]> = {
  MLE: ["maldives"],
  DPS: ["bali"],
  HKT: ["phuket", "samui", "southeast-asia-island"],
  PPT: ["tahiti"],
  DXB: ["dubai", "uae"],
  SIN: ["singapore"],
  NRT: ["tokyo", "japan"],
  HND: ["tokyo", "japan"],
  LHR: ["london", "europe"],
  SYX: ["sanya", "china", "hainan"],
  HKG: ["hongkong", "china"],
  BKK: ["bangkok", "thailand"],
  CDG: ["paris", "europe"],
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const iata = searchParams.get("iata")?.toUpperCase();
  if (!iata) return NextResponse.json({ hotels: [], label: "" });

  const regions = DEST_REGION_MAP[iata] ?? [];

  let hotels = regions.length
    ? await prisma.hotel.findMany({
        where: {
          isActive: true,
          region: { in: regions },
          travelerScore: { not: null },
        },
        orderBy: { travelerScore: "desc" },
        take: 4,
        include: hotelInclude,
      })
    : [];

  let label = "目的地奢华酒店";
  if (hotels.length === 0) {
    hotels = await prisma.hotel.findMany({
      where: { isActive: true, travelerScore: { not: null } },
      orderBy: { travelerScore: "desc" },
      take: 3,
      include: hotelInclude,
    });
    label = "热门奢华酒店";
  }

  return NextResponse.json({
    label,
    hotels: hotels.map((h) => {
      const s = serializeHotelForList(h);
      return {
        slug: s.slug,
        name: s.name,
        nameZh: s.nameZh,
        cityZh: s.cityZh,
        heroImage: s.heroImage,
        travelerScore: s.travelerScore,
        brand: { nameZh: s.brand.nameZh },
      };
    }),
  });
}