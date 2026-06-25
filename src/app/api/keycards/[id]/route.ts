import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const keycard = await prisma.keycard.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, isPlus: true } },
      hotel: { include: { brand: { include: { group: true } } } },
      brand: { include: { group: true } },
      offers: {
        include: { user: { select: { id: true, name: true, isPlus: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!keycard) return NextResponse.json({ error: "房卡不存在" }, { status: 404 });
  return NextResponse.json({ keycard });
}