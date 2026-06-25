import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [groups, brands, alliances, cities] = await Promise.all([
    prisma.hotelGroup.findMany({
      include: { _count: { select: { brands: true } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.brand.findMany({
      include: {
        group: true,
        _count: { select: { hotels: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.alliance.findMany({
      include: { _count: { select: { brands: true } } },
    }),
    prisma.hotel.groupBy({
      by: ["city", "cityZh", "countryCode"],
      _count: true,
      orderBy: { city: "asc" },
    }),
  ]);

  const hotelCount = await prisma.hotel.count();

  return NextResponse.json({ groups, brands, alliances, cities, hotelCount });
}