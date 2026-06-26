import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseChannelSlugs, LOYALTY_PROGRAMS, BOOKING_CHANNELS } from "@/lib/loyalty";

const loyaltySchema = z.object({
  statuses: z.array(
    z.object({
      programSlug: z.string(),
      tierSlug: z.string(),
      nightsYTD: z.number().int().min(0).optional(),
      expiresAt: z.string().nullable().optional(),
      channelSlugs: z.array(z.string()).optional(),
      memberNumber: z.string().nullable().optional(),
    })
  ),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const rows = await prisma.userLoyaltyStatus.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const statuses = rows.map((r) => ({
    programSlug: r.programSlug,
    tierSlug: r.tierSlug,
    nightsYTD: r.nightsYTD,
    expiresAt: r.expiresAt?.toISOString() ?? null,
    channelSlugs: parseChannelSlugs(r.channelSlugs),
    memberNumber: r.memberNumber,
  }));

  return NextResponse.json({
    statuses,
    programs: LOYALTY_PROGRAMS,
    channels: BOOKING_CHANNELS,
  });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const body = await req.json();
  const parsed = loyaltySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "数据格式错误" }, { status: 400 });
  }

  await prisma.userLoyaltyStatus.deleteMany({ where: { userId: user.id } });

  for (const s of parsed.data.statuses) {
    await prisma.userLoyaltyStatus.create({
      data: {
        userId: user.id,
        programSlug: s.programSlug,
        tierSlug: s.tierSlug,
        nightsYTD: s.nightsYTD ?? 0,
        expiresAt: s.expiresAt ? new Date(s.expiresAt) : null,
        channelSlugs: JSON.stringify(s.channelSlugs ?? []),
        memberNumber: s.memberNumber ?? null,
      },
    });
  }

  const rows = await prisma.userLoyaltyStatus.findMany({
    where: { userId: user.id },
  });

  return NextResponse.json({
    statuses: rows.map((r) => ({
      programSlug: r.programSlug,
      tierSlug: r.tierSlug,
      nightsYTD: r.nightsYTD,
      expiresAt: r.expiresAt?.toISOString() ?? null,
      channelSlugs: parseChannelSlugs(r.channelSlugs),
      memberNumber: r.memberNumber,
    })),
  });
}