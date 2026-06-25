import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserStats } from "@/lib/badges";
import { prisma } from "@/lib/prisma";
import { FREE_STAY_LIMIT } from "@/lib/utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const stats = await getUserStats(user.id);
  const badges = await prisma.userBadge.findMany({
    where: { userId: user.id },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });

  const allBadges = await prisma.badge.findMany({ orderBy: { sortOrder: "asc" } });

  return NextResponse.json({
    user,
    stats,
    badges,
    allBadges,
    limits: {
      freeStayLimit: FREE_STAY_LIMIT,
      remaining: user.isPlus ? null : Math.max(0, FREE_STAY_LIMIT - stats.totalStays),
    },
  });
}