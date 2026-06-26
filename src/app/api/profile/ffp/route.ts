import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.userFFPStatus.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const statuses = rows.map((r) => ({
    programSlug: r.programSlug,
    tierSlug: r.tierSlug,
    milesYTD: r.milesYTD,
    segmentsYTD: r.segmentsYTD,
    memberNumber: r.memberNumber ?? "",
  }));

  return NextResponse.json({ statuses });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { statuses } = (await req.json()) as {
    statuses: {
      programSlug: string;
      tierSlug: string;
      milesYTD: number;
      segmentsYTD: number;
      memberNumber?: string;
    }[];
  };

  // Delete all existing FFP statuses for this user
  await prisma.userFFPStatus.deleteMany({ where: { userId: user.id } });

  // Create new ones
  if (statuses.length > 0) {
    await prisma.userFFPStatus.createMany({
      data: statuses.map((s) => ({
        userId: user.id,
        programSlug: s.programSlug,
        tierSlug: s.tierSlug,
        milesYTD: s.milesYTD ?? 0,
        segmentsYTD: s.segmentsYTD ?? 0,
        memberNumber: s.memberNumber ?? null,
      })),
    });
  }

  const rows = await prisma.userFFPStatus.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    statuses: rows.map((r) => ({
      programSlug: r.programSlug,
      tierSlug: r.tierSlug,
      milesYTD: r.milesYTD,
      segmentsYTD: r.segmentsYTD,
      memberNumber: r.memberNumber ?? "",
    })),
  });
}
