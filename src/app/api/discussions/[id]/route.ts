import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, isPlus: true } },
      replies: {
        include: { user: { select: { id: true, name: true, isPlus: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!discussion) return NextResponse.json({ error: "话题不存在" }, { status: 404 });
  return NextResponse.json({ discussion });
}