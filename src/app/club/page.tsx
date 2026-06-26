import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreditCard, Users, Crown, ArrowRight, Award, Plane, Heart, ArrowLeftRight, Calculator, Calendar, ShieldCheck } from "lucide-react";
import { getActivePromos } from "@/data/loyalty/promotions";

export default async function ClubPage() {
  const [keycardCount, discussionCount, inquiryCount, wishlistCount] = await Promise.all([
    prisma.keycard.count({ where: { status: "active" } }),
    prisma.discussion.count(),
    prisma.bookingInquiry.count(),
    prisma.userWishlist.count().catch(() => 0),
  ]);

  const activePromos = getActivePromos();

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
      href: "/club/ffp",
      icon: Plane,
      title: "飞行会籍",
      desc: "12 大航司常旅客计划、三大联盟互认、定级里程/航段进度追踪与跨航司累积策略",
      stat: "全新上线",
      color: "#1a1a1a",
    },
    {
      href: "/club/wishlist",
      icon: Heart,
      title: "我的心愿单",
      desc: "收藏心仪的酒店，规划未来旅行，标记必住目的地",
      stat: `${wishlistCount} 家收藏`,
      color: "#e84855",
    },
    {
      href: "/club/compare",
      icon: ArrowLeftRight,
      title: "酒店对比",
      desc: "并排对比 2-3 家酒店的评分、价格、品牌礼遇与预订渠道",
      stat: "全新上线",
      color: "#4a90d9",
    },
    {
      href: "/club/calculator",
      icon: Calculator,
      title: "积分计算器",
      desc: "输入消费金额，实时计算各集团积分/航司里程 + 信用卡推荐",
      stat: "全新上线",
      color: "#8b5e3c",
    },
    {
      href: "/club/promotions",
      icon: Calendar,
      title: "促销日历",
      desc: "五大集团 Q1-Q4 促销时间线、注册入口、入住窗口一目了然",
      stat: `${activePromos.length} 个活动可注册`,
      color: "#16a34a",
    },
    {
      href: "/club/status-match",
      icon: ShieldCheck,
      title: "会籍匹配",
      desc: "各集团与航司 Status Match / Challenge 政策 & 申请指南",
      stat: "全新上线",
      color: "#e8734a",
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
      <p className="mt-2 text-[#6b7280]">深度社交与交易衍生 · 工具与资讯 — 为常旅客打造的决策平台</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {sections.map(({ href, icon: Icon, title, desc, stat, color }) => (
          <Link key={href} href={href} className="hc-card group p-6 transition hover:ring-1 hover:ring-[#b8956b]">
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <h2 className="font-serif text-lg">{title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#6b7280]">{desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] text-[#9ca3af]">{stat}</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#6b7280] transition group-hover:translate-x-1 group-hover:text-[#b8956b]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
