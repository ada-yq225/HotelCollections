import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  title: z.string().min(1).max(120),
  content: z.string().min(10).max(5000),
  category: z.enum(["status-match", "promo", "benefits", "compare", "general"]),
  groupSlug: z.string().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const group = searchParams.get("group");

  const discussions = await prisma.discussion.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(group ? { groupSlug: group } : {}),
    },
    include: {
      user: { select: { id: true, name: true, isPlus: true } },
      _count: { select: { replies: true } },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  return NextResponse.json({ discussions });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const discussion = await prisma.discussion.create({
      data: {
        userId: user.id,
        title: data.title,
        content: data.content,
        category: data.category,
        groupSlug: data.groupSlug,
      },
      include: {
        user: { select: { id: true, name: true, isPlus: true } },
      },
    });

    return NextResponse.json({ discussion });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
    }
    return NextResponse.json({ error: "发布失败" }, { status: 500 });
  }
}