import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id, isPublished: true },
    include: {
      user: { select: { id: true, name: true, isPlus: true, avatar: true } },
      hotel: { include: { brand: { include: { group: true } } } },
      stay: { select: { checkIn: true, checkOut: true, nights: true, roomType: true, proofUrl: true } },
    },
  });

  if (!post) return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
  return NextResponse.json({ post });
}