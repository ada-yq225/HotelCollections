import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getUserStats } from "@/lib/badges";
import { buildMapPoints } from "@/lib/map";
import { prisma } from "@/lib/prisma";
import { MapSection } from "@/components/map/MapSection";
import { JourneyGroups } from "./JourneyGroups";
import { JourneyExportButton } from "@/components/journey/JourneyExportButton";
import { Plane } from "lucide-react";

export default async function JourneyPage() {
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
  const groups = await prisma.hotelGroup.findMany({ orderBy: { sortOrder: "asc" } });

  const stayIdsWithPost = new Set(
    (
      await prisma.post.findMany({
        where: { userId: user.id, stayId: { not: null } },
        select: { stayId: true },
      })
    ).map((p) => p.stayId!)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl">入住足迹</h1>
          <p className="mt-2 text-[#6b7280]">全球点亮地图 · 按集团与城市分类浏览</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <JourneyExportButton />
          <Link href="/map" className="text-sm text-[#b8956b] hover:underline">
            全屏地图 →
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "总晚数", value: stats.totalNights },
          { label: "点亮酒店", value: visitedCount },
          { label: "覆盖品牌", value: stats.uniqueBrands },
          { label: "到访城市", value: stats.uniqueCities },
        ].map(({ label, value }) => (
          <div key={label} className="hc-card p-5 text-center">
            <p className="font-serif text-3xl font-semibold text-[#b8956b]">{value}</p>
            <p className="mt-1 text-sm text-[#6b7280]">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-serif text-2xl">全球地图</h2>
        <MapSection points={mapPoints} defaultMode="visited" />
      </div>

      <JourneyGroups
        groups={JSON.parse(JSON.stringify(groups))}
        groupStats={stats.groupStats}
        stays={stats.stays.map((s) => ({
          id: s.id,
          nights: s.nights,
          checkIn: s.checkIn.toISOString(),
          proofUrl: s.proofUrl,
          proofType: s.proofType,
          hasReview: stayIdsWithPost.has(s.id),
          hotel: {
            id: s.hotel.id,
            name: s.hotel.name,
            nameZh: s.hotel.nameZh,
            city: s.hotel.city,
            cityZh: s.hotel.cityZh,
            brand: {
              nameZh: s.hotel.brand.nameZh,
              group: {
                slug: s.hotel.brand.group.slug,
                nameZh: s.hotel.brand.group.nameZh,
                logoColor: s.hotel.brand.group.logoColor ?? "#1a1a1a",
              },
            },
          },
        }))}
      />

      {/* Flight journey teaser */}
      <div className="mt-16 border-t border-[#e8e8e8] pt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl">飞行足迹</h2>
            <p className="mt-1 text-sm text-[#6b7280]">记录航班、查看航线图、撰写飞行报告</p>
          </div>
          <Link
            href="/flights/journey"
            className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm text-white hover:bg-[#333]"
          >
            <Plane className="h-4 w-4" /> 查看飞行足迹
          </Link>
        </div>
      </div>
    </div>
  );
}