import { prisma } from "@/lib/prisma";
import { FEATURED_DESTINATIONS } from "@/data/destinations";
import { HotelsExplorer } from "./HotelsExplorer";

export default async function HotelsPage() {
  const filters = await prisma.hotelGroup.findMany({
    include: {
      brands: {
        include: {
          _count: { select: { hotels: true } },
          alliances: { include: { alliance: true } },
        },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  const alliances = await prisma.alliance.findMany({
    include: { _count: { select: { brands: true } } },
  });

  const hotelCount = await prisma.hotel.count({ where: { isActive: true } });

  const allBrands = await prisma.brand.findMany({
    where: { hotels: { some: { isActive: true } } },
    include: {
      group: true,
      _count: { select: { hotels: { where: { isActive: true } } } },
    },
    orderBy: { nameZh: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl">高端酒店库</h1>
        <p className="mt-2 text-[#6b7280]">
          白名单制度 · 共收录 {hotelCount} 家在营奢华酒店 · 覆盖全球主要度假胜地
          · 数据更新至 2026 年
        </p>
      </div>
      <HotelsExplorer
        groups={JSON.parse(JSON.stringify(filters))}
        brands={JSON.parse(JSON.stringify(allBrands))}
        alliances={JSON.parse(JSON.stringify(alliances))}
        destinations={FEATURED_DESTINATIONS}
      />
    </div>
  );
}