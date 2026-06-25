import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Crown, Map, Shield, Sparkles } from "lucide-react";

export default async function HomePage() {
  const [hotelCount, brandCount, groupCount] = await Promise.all([
    prisma.hotel.count({ where: { isActive: true } }),
    prisma.brand.count(),
    prisma.hotelGroup.count(),
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
            严格的奢华酒店白名单 · 入住足迹点亮世界地图 · 专属荣誉称号
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
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_#faf6f0_0%,_transparent_60%)]" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-3 gap-6 text-center">
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
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center font-serif text-3xl">核心价值</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "严格白名单",
                desc: "仅限五星级及以上及奢华精品品牌，拒绝快捷与中端酒店",
              },
              {
                icon: Map,
                title: "足迹点亮",
                desc: "全球地图按集团、城市分层展示，房卡墙收纳入住凭证",
              },
              {
                icon: Sparkles,
                title: "社区点评",
                desc: "结构化硬核维度：升房率、酒廊出品、备品硬件、服务细节",
              },
              {
                icon: Crown,
                title: "Plus 会员",
                desc: "无限打卡、数据仪表盘、高清原图、尊贵金标身份",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="hc-card p-6">
                <Icon className="mb-4 h-8 w-8 text-[#b8956b]" />
                <h3 className="font-medium">{title}</h3>
                <p className="mt-2 text-sm text-[#6b7280]">{desc}</p>
              </div>
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