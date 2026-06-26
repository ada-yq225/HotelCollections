import { prisma } from "@/lib/prisma";
import { FEATURED_DESTINATIONS } from "@/data/destinations";
import Link from "next/link";
import { GROUPS } from "@/data/meta";
import { GROUP_TOPIC_SLUGS } from "@/data/loyalty/group-guides";
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
    <div>
      <section className="relative overflow-hidden border-b border-[#e8e8e8] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#faf6f0_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
          <p className="mb-3 text-xs font-medium tracking-[0.25em] text-[#b8956b] uppercase">
            Curated Collection
          </p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            高端酒店库
          </h1>
          <p className="mt-4 max-w-xl text-[#6b7280] leading-relaxed">
            严格白名单收录 <span className="font-medium text-[#1a1a1a]">{hotelCount}</span> 家在营奢华酒店
            · 品牌标识 · 旅客评分 · 参考均价
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-[#6b7280]">
            <div>
              <p className="font-serif text-2xl font-semibold text-[#1a1a1a]">58</p>
              <p className="text-xs">奢华品牌</p>
            </div>
            <div className="h-10 w-px bg-[#e8e8e8]" />
            <div>
              <p className="font-serif text-2xl font-semibold text-[#1a1a1a]">9</p>
              <p className="text-xs">酒店集团</p>
            </div>
            <div className="h-10 w-px bg-[#e8e8e8]" />
            <div>
              <p className="font-serif text-2xl font-semibold text-[#1a1a1a]">30+</p>
              <p className="text-xs">度假目的地</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {GROUPS.filter((g) => (GROUP_TOPIC_SLUGS as readonly string[]).includes(g.slug)).map(
              (g) => (
                <Link
                  key={g.slug}
                  href={`/groups/${g.slug}`}
                  className="rounded-full border border-[#e8e8e8] bg-white px-3 py-1.5 text-xs font-medium transition hover:border-[#b8956b]"
                  style={{ color: g.logoColor }}
                >
                  {g.nameZh} 会籍对照
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <HotelsExplorer
          groups={JSON.parse(JSON.stringify(filters))}
          brands={JSON.parse(JSON.stringify(allBrands))}
          alliances={JSON.parse(JSON.stringify(alliances))}
          destinations={FEATURED_DESTINATIONS}
        />
      </div>
    </div>
  );
}