import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Compass,
  Crown,
  Map,
  Shield,
  Sparkles,
  Star,
  MapPin,
  TrendingUp,
  Award,
  Bell,
  GitCompare,
  Plane,
} from "lucide-react";
import { hotelDisplayImageUrl } from "@/lib/hotel-display-image";

const POPULAR_DESTINATIONS = [
  { name: "三亚", nameEn: "Sanya", subtitle: "海南岛 · 热带海滨度假天堂", color: "#e8734a", slug: "hotels?city=三亚", icon: "🏝️" },
  { name: "马尔代夫", nameEn: "Maldives", subtitle: "印度洋上的奢华岛屿", color: "#4a90d9", slug: "hotels?country=马尔代夫", icon: "🌊" },
  { name: "巴厘岛", nameEn: "Bali", subtitle: "众神之岛 · 文化度假胜地", color: "#6aaf6a", slug: "hotels?region=bali", icon: "🌴" },
  { name: "普吉岛", nameEn: "Phuket", subtitle: "安达曼海上的明珠", color: "#3cb4b4", slug: "hotels?region=phuket", icon: "🏖️" },
  { name: "日本", nameEn: "Japan", subtitle: "东京 · 京都 · 北海道", color: "#c75b7a", slug: "hotels?country=日本", icon: "🗾" },
  { name: "泰国", nameEn: "Thailand", subtitle: "曼谷 · 苏梅岛", color: "#d4a017", slug: "hotels?country=泰国", icon: "🛕" },
  { name: "新加坡", nameEn: "Singapore", subtitle: "花园城市 · 都市度假", color: "#e84855", slug: "hotels?country=新加坡", icon: "🏙️" },
  { name: "迪拜", nameEn: "Dubai", subtitle: "奢华与未来的交汇", color: "#c9a96e", slug: "hotels?country=阿联酋", icon: "🕌" },
  { name: "大溪地", nameEn: "Tahiti", subtitle: "南太平洋的人间天堂", color: "#5e8fba", slug: "hotels?region=tahiti", icon: "🌺" },
  { name: "国内度假", nameEn: "China Resort", subtitle: "长白山 · 丽江 · 桂林", color: "#8b5e3c", slug: "hotels?region=china", icon: "⛰️" },
];

export default async function HomePage() {
  const [hotelCount, brandCount, groupCount, badgeCount, topHotels] = await Promise.all([
    prisma.hotel.count({ where: { isActive: true } }),
    prisma.brand.count(),
    prisma.hotelGroup.count(),
    prisma.badge.count(),
    prisma.hotel.findMany({
      where: {
        isActive: true,
        travelerScore: { not: null },
      },
      orderBy: { travelerScore: "desc" },
      take: 3,
      select: {
        slug: true,
        name: true,
        nameZh: true,
        cityZh: true,
        heroImage: true,
        travelerScore: true,
        brand: { select: { nameZh: true } },
      },
    }),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <p className="mb-4 text-sm tracking-[0.3em] text-[#b8956b] uppercase">Hotel Collection</p>
          <h1 className="font-serif text-5xl font-semibold tracking-tight md:text-7xl">
            高端酒店
            <br />
            <span className="text-[#b8956b]">垂直社区</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[#6b7280]">
            严格的奢华酒店白名单 · 每家酒店官方图集 · {badgeCount} 项荣誉称号等你解锁
            <br />
            与同圈层爱好者分享极具参考价值的入住攻略
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/checkin" className="hc-btn-primary">
              开始打卡
            </Link>
            <Link
              href="/hotels"
              className="rounded-full border border-[#e8e8e8] px-6 py-2.5 text-sm font-medium transition hover:border-[#b8956b]"
            >
              浏览酒店库
            </Link>
            <Link
              href="/club/status"
              className="rounded-full border border-[#b8956b] bg-[#faf6f0] px-6 py-2.5 text-sm font-medium text-[#b8956b] transition hover:bg-[#f3ebe0]"
            >
              会籍中心
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_#faf6f0_0%,_transparent_60%)]" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          <div className="hc-card p-8">
            <p className="font-serif text-4xl font-semibold text-[#b8956b]">{hotelCount}</p>
            <p className="mt-2 text-sm text-[#6b7280]">白名单酒店</p>
          </div>
          <div className="hc-card p-8">
            <p className="font-serif text-4xl font-semibold">{brandCount}</p>
            <p className="mt-2 text-sm text-[#6b7280]">奢华品牌</p>
          </div>
          <div className="hc-card p-8">
            <p className="font-serif text-4xl font-semibold">{groupCount}</p>
            <p className="mt-2 text-sm text-[#6b7280]">酒店集团</p>
          </div>
          <div className="hc-card p-8">
            <p className="font-serif text-4xl font-semibold text-[#b8956b]">{badgeCount}</p>
            <p className="mt-2 text-sm text-[#6b7280]">荣誉称号</p>
          </div>
        </div>
      </section>

      {/* 今日推荐 */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-[#b8956b]" />
          <h2 className="font-serif text-2xl font-semibold">今日推荐</h2>
          <span className="text-sm text-[#9ca3af]">评分最高的奢华酒店</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topHotels.map((hotel) => (
            <Link
              key={hotel.slug}
              href={`/hotels/${hotel.slug}`}
              className="group overflow-hidden rounded-xl border border-[#e8e8e8] bg-white transition-all hover:border-[#b8956b]/40 hover:shadow-md"
            >
              <div className="aspect-[4/3] bg-[#f0f0f0]">
                {hotel.heroImage && hotelDisplayImageUrl(hotel.slug, hotel.heroImage) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hotelDisplayImageUrl(hotel.slug, hotel.heroImage)!}
                    alt={hotel.nameZh || hotel.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#faf6f0] to-[#f0f0f0]">
                    <Star className="h-12 w-12 text-[#b8956b]/30" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-[#9ca3af]">{hotel.brand.nameZh}</p>
                <h3 className="mt-1 font-medium text-[#1a1a1a] group-hover:text-[#b8956b]">
                  {hotel.nameZh || hotel.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-[#6b7280]">
                    <MapPin className="h-3 w-3" />
                    {hotel.cityZh}
                  </span>
                  {hotel.travelerScore != null && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-[#b8956b]">
                      <Star className="h-3.5 w-3.5 fill-[#b8956b] text-[#b8956b]" />
                      {hotel.travelerScore.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 热门目的地 */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex items-center gap-2">
            <Compass className="h-6 w-6 text-[#b8956b]" />
            <h2 className="font-serif text-2xl font-semibold">热门目的地</h2>
            <span className="text-sm text-[#9ca3af]">中国旅行者最爱的奢华度假地</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {POPULAR_DESTINATIONS.map((dest) => (
              <Link
                key={dest.name}
                href={`/${dest.slug}`}
                className="group rounded-xl border border-[#e8e8e8] p-5 text-center transition-all hover:border-[#b8956b]/50 hover:shadow-md"
              >
                <span className="text-3xl">{dest.icon}</span>
                <h3 className="mt-3 font-medium text-[#1a1a1a] group-hover:text-[#b8956b]">{dest.name}</h3>
                <p className="mt-1 text-xs text-[#9ca3af]">{dest.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center font-serif text-3xl">平台能力</h2>
          <p className="mb-12 text-center text-sm text-[#6b7280]">
            从会籍管理到价格可信度，为常旅客打造决策工具
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Award,
                title: "会籍中心",
                desc: "五大集团等级档案、保级进度、Virtuoso/STARS/FHR 渠道礼遇对照",
                href: "/club/status",
              },
              {
                icon: GitCompare,
                title: "你的等级待遇",
                desc: "酒店详情自动匹配会员精英待遇与预订渠道叠加礼遇",
                href: "/club/status",
              },
              {
                icon: Shield,
                title: "价格可信度",
                desc: "仅展示官网/OTA 抓取实价，拒绝估算价误导决策",
                href: "/hotels",
              },
              {
                icon: Sparkles,
                title: "体验标签",
                desc: "海岛度假、游猎、城市奢华等标签筛选，快速找到心仪酒店",
                href: "/hotels",
              },
              {
                icon: Plane,
                title: "舱位×酒店联程",
                desc: "机票搜索联动目的地奢华酒店，特色舱位落地住宿一站式",
                href: "/flights",
              },
              {
                icon: Bell,
                title: "价格提醒",
                desc: "设置目标价，官网实价达标时个人中心高亮通知",
                href: "/profile",
              },
              {
                icon: Map,
                title: "足迹海报",
                desc: "全球地图点亮、入住足迹导出分享卡，可打印存为 PDF",
                href: "/journey",
              },
              {
                icon: Crown,
                title: "社区点评",
                desc: "升房率、酒廊出品、备品硬件等结构化硬核维度",
                href: "/community",
              },
            ].map(({ icon: Icon, title, desc, href }) => (
              <Link key={title} href={href} className="hc-card group p-6 transition hover:ring-1 hover:ring-[#b8956b]">
                <Icon className="mb-4 h-8 w-8 text-[#b8956b]" />
                <h3 className="font-medium group-hover:text-[#b8956b]">{title}</h3>
                <p className="mt-2 text-sm text-[#6b7280]">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h2 className="font-serif text-3xl">开启你的奢华足迹</h2>
        <p className="mt-4 text-[#6b7280]">免费版可记录 6 次入住，Plus 会员畅享无限打卡</p>
        <Link href="/login" className="hc-btn-gold mt-8 inline-block">
          立即加入
        </Link>
      </section>
    </div>
  );
}