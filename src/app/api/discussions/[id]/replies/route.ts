import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  content: z.string().min(1).max(2000),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await params;
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) return NextResponse.json({ error: "话题不存在" }, { status: 404 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const reply = await prisma.discussionReply.create({
      data: {
        discussionId: id,
        userId: user.id,
        content: data.content,
      },
      include: {
        user: { select: { id: true, name: true, isPlus: true } },
      },
    });

    return NextResponse.json({ reply });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "请输入回复内容" }, { status: 400 });
    }
    return NextResponse.json({ error: "回复失败" }, { status: 500 });
  }
}