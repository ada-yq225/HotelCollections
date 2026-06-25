import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserStats } from "@/lib/badges";
import { buildMapPoints } from "@/lib/map";
import { prisma } from "@/lib/prisma";
import { MapSection } from "@/components/map/MapSection";

export default async function MapPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stats = await getUserStats(user.id);
  const allHotels = await prisma.hotel.findMany({
    include: { brand: { include: { group: true } } },
  });

  const mapPoints = buildMapPoints(
    allHotels,
    stats.stays.map((s) => ({
      hotelId: s.hotelId,
      nights: s.nights,
      checkIn: s.checkIn,
      proofUrl: s.proofUrl,
      roomType: s.roomType,
      hotel: s.hotel,
    }))
  );

  const visitedCount = mapPoints.filter((p) => p.visited).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-4xl">入住地图</h1>
      <p className="mt-2 text-[#6b7280]">
        你已点亮 <strong className="text-[#b8956b]">{visitedCount}</strong> 家酒店，
        地图上金色标记为全部住过的酒店
      </p>
      <div className="mt-8">
        <MapSection points={mapPoints} defaultMode="visited" />
      </div>
    </div>
  );
}