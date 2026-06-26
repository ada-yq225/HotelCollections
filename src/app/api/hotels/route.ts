import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDestinationWhere } from "@/data/destinations";
import { serializeHotelForList } from "@/lib/hotels";
import { hotelMatchesExperienceTag } from "@/lib/hotel-experience-tags";

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
  const experience = searchParams.get("experience");

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

  let filtered = hotels;
  if (experience) {
    filtered = hotels.filter((h) =>
      hotelMatchesExperienceTag(
        {
          region: h.region,
          countryCode: h.countryCode,
          brandSlug: h.brand.slug,
          city: h.city,
          cityZh: h.cityZh,
        },
        experience
      )
    );
  }

  const serialized = filtered.map(serializeHotelForList);

  return NextResponse.json({ hotels: serialized, total: serialized.length });
}