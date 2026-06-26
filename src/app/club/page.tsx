import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreditCard, Users, Crown, ArrowRight, Award } from "lucide-react";

export default async function ClubPage() {
  const [keycardCount, discussionCount, inquiryCount] = await Promise.all([
    prisma.keycard.count({ where: { status: "active" } }),
    prisma.discussion.count(),
    prisma.bookingInquiry.count(),
  ]);

  const sections = [
    {
      href: "/club/status",
      icon: Award,
      title: "会籍中心",
      desc: "五大集团等级档案、保级进度、Virtuoso/STARS/FHR 渠道礼遇对照与酒店待遇匹配",
      stat: "核心功能",
      color: "#b8956b",
    },
    {
      href: "/club/keycards",
      icon: CreditCard,
      title: "房卡交流",
      desc: "展示、出让、求换奢华酒店房卡与纪念品，为收集控打造的交换板块",
      stat: `${keycardCount} 张房卡`,
      color: "#b8956b",
    },
    {
      href: "/club/benefits",
      icon: Users,
      title: "权益互助",
      desc: "讨论保级政策、Q1/Q2 活动玩法、STARS/Luminous 礼遇对比与合规权益分享",
      stat: `${discussionCount} 个话题`,
      color: "#1a1a1a",
    },
    {
      href: "/book",
      icon: Crown,
      title: "专属预订",
      desc: "八大洲模式 — 看点评被种草，一键联系顾问享升级、早餐、消费抵扣等前台现付礼遇",
      stat: `${inquiryCount} 次咨询`,
      color: "#c9a962",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-serif text-4xl">精英俱乐部</h1>
      <p className="mt-2 text-[#6b7280]">深度社交与交易衍生 — 第三阶段核心功能</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sections.map(({ href, icon: Icon, title, desc, stat, color }) => (
          <Link key={href} href={href} className="hc-card group p-8 transition hover:ring-1 hover:ring-[#b8956b]">
            <div
              className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-6 w-6" style={{ color }} />
            </div>
            <h2 className="font-serif text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">{desc}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-[#9ca3af]">{stat}</span>
              <ArrowRight className="h-4 w-4 text-[#6b7280] transition group-hover:translate-x-1 group-hover:text-[#b8956b]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}