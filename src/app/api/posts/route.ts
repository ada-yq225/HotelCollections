import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  hotelId: z.string(),
  stayId: z.string().optional(),
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(5000),
  images: z.array(z.string()).max(9).optional(),
  upgradeRate: z.string().max(200).optional(),
  loungeDining: z.number().min(1).max(5).optional(),
  loungeNote: z.string().max(500).optional(),
  amenities: z.number().min(1).max(5).optional(),
  amenitiesNote: z.string().max(500).optional(),
  service: z.number().min(1).max(5).optional(),
  serviceNote: z.string().max(500).optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hotelId = searchParams.get("hotelId");
  const brand = searchParams.get("brand");
  const group = searchParams.get("group");
  const userId = searchParams.get("userId");
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20", 10));
  const cursor = searchParams.get("cursor");

  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      ...(hotelId ? { hotelId } : {}),
      ...(userId ? { userId } : {}),
      hotel: {
        brand: {
          ...(brand ? { slug: brand } : {}),
          ...(group ? { group: { slug: group } } : {}),
        },
      },
    },
    include: {
      user: { select: { id: true, name: true, isPlus: true, avatar: true } },
      hotel: {
        include: { brand: { include: { group: true } } },
      },
      stay: { select: { checkIn: true, nights: true, roomType: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, limit) : posts;

  return NextResponse.json({
    posts: items,
    nextCursor: hasMore ? items[items.length - 1]?.id : null,
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    if (data.stayId) {
      const stay = await prisma.stay.findFirst({
        where: { id: data.stayId, userId: user.id },
      });
      if (!stay) {
        return NextResponse.json({ error: "入住记录不存在" }, { status: 400 });
      }
      const existing = await prisma.post.findUnique({ where: { stayId: data.stayId } });
      if (existing) {
        return NextResponse.json({ error: "该入住记录已发布点评" }, { status: 400 });
      }
    }

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        hotelId: data.hotelId,
        stayId: data.stayId,
        title: data.title,
        content: data.content,
        images: JSON.stringify(data.images || []),
        upgradeRate: data.upgradeRate,
        loungeDining: data.loungeDining,
        loungeNote: data.loungeNote,
        amenities: data.amenities,
        amenitiesNote: data.amenitiesNote,
        service: data.service,
        serviceNote: data.serviceNote,
      },
      include: {
        user: { select: { id: true, name: true, isPlus: true } },
        hotel: { include: { brand: { include: { group: true } } } },
      },
    });

    return NextResponse.json({ post });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
    }
    return NextResponse.json({ error: "发布失败" }, { status: 500 });
  }
}