import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const slugs = req.nextUrl.searchParams.get("slugs");
  if (!slugs) return NextResponse.json({ hotels: [] });

  const slugList = slugs.split(",").slice(0, 3);
  const hotels = await prisma.hotel.findMany({
    where: { slug: { in: slugList }, isActive: true },
    include: {
      brand: { include: { group: true, alliances: { include: { alliance: true } } } },
    },
  });

  const sorted = slugList
    .map((s) => hotels.find((h) => h.slug === s))
    .filter(Boolean);

  return NextResponse.json({ hotels: JSON.parse(JSON.stringify(sorted)) });
}
