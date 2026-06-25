import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDestinationWhere } from "@/data/destinations";
import { serializeHotelForList } from "@/lib/hotels";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const group = searchParams.get("group");
  const brand = searchParams.get("brand");
  const alliance = searchParams.get("alliance");
  const city = searchParams.get("city");
  const region = searchParams.get("region");
  const country = searchParams.get("country");
  const destination = searchParams.get("destination");
  const q = searchParams.get("q");

  const destinationWhere = destination ? getDestinationWhere(destination) : null;

  const hotels = await prisma.hotel.findMany({
    where: {
      isActive: true,
      ...(destinationWhere ?? {}),
      ...(region && !destinationWhere ? { region } : {}),
      ...(country && !destinationWhere ? { countryCode: country } : {}),
      ...(city ? { OR: [{ city: { contains: city } }, { cityZh: { contains: city } }] } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { nameZh: { contains: q } },
              { city: { contains: q } },
              { cityZh: { contains: q } },
            ],
          }
        : {}),
      brand: {
        ...(brand ? { slug: brand } : {}),
        ...(group ? { group: { slug: group } } : {}),
        ...(alliance ? { alliances: { some: { alliance: { slug: alliance } } } } : {}),
      },
    },
    include: {
      brand: {
        include: {
          group: true,
          alliances: { include: { alliance: true } },
        },
      },
    },
    orderBy: [{ country: "asc" }, { city: "asc" }, { name: "asc" }],
  });

  const serialized = hotels.map(serializeHotelForList);

  return NextResponse.json({ hotels: serialized, total: serialized.length });
}