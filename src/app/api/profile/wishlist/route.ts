import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser();
    const items = await prisma.userWishlist.findMany({
      where: { userId: user.id },
      include: {
        hotel: {
          select: {
            slug: true,
            name: true,
            nameZh: true,
            city: true,
            cityZh: true,
            country: true,
            heroImage: true,
            travelerScore: true,
            avgBasePrice: true,
            brand: { select: { nameZh: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "获取收藏失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { hotelId, priority, note } = await req.json();
    if (!hotelId) return NextResponse.json({ error: "缺少酒店 ID" }, { status: 400 });

    const existing = await prisma.userWishlist.findUnique({
      where: { userId_hotelId: { userId: user.id, hotelId } },
    });
    if (existing) {
      const updated = await prisma.userWishlist.update({
        where: { id: existing.id },
        data: { priority: priority || existing.priority, note: note ?? existing.note },
      });
      return NextResponse.json({ item: updated, action: "updated" });
    }

    const item = await prisma.userWishlist.create({
      data: { userId: user.id, hotelId, priority: priority || "want", note },
    });
    return NextResponse.json({ item, action: "created" }, { status: 201 });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "添加收藏失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser();
    const { hotelId } = await req.json();
    if (!hotelId) return NextResponse.json({ error: "缺少酒店 ID" }, { status: 400 });

    await prisma.userWishlist.deleteMany({
      where: { userId: user.id, hotelId },
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "取消收藏失败" }, { status: 500 });
  }
}
