import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  imageUrl: z.string(),
  hotelId: z.string().optional(),
  brandId: z.string().optional(),
  year: z.number().optional(),
  tradeType: z.enum(["display", "offer", "wanted"]),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tradeType = searchParams.get("tradeType");
  const brand = searchParams.get("brand");
  const userId = searchParams.get("userId");

  const keycards = await prisma.keycard.findMany({
    where: {
      status: "active",
      ...(tradeType ? { tradeType } : {}),
      ...(userId ? { userId } : {}),
      ...(brand ? { brand: { slug: brand } } : {}),
    },
    include: {
      user: { select: { id: true, name: true, isPlus: true } },
      hotel: { include: { brand: { include: { group: true } } } },
      brand: { include: { group: true } },
      _count: { select: { offers: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ keycards });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const keycard = await prisma.keycard.create({
      data: {
        userId: user.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        hotelId: data.hotelId,
        brandId: data.brandId,
        year: data.year,
        tradeType: data.tradeType,
      },
      include: {
        user: { select: { id: true, name: true, isPlus: true } },
        hotel: { include: { brand: true } },
        brand: true,
      },
    });

    return NextResponse.json({ keycard });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
    }
    return NextResponse.json({ error: "发布失败" }, { status: 500 });
  }
}