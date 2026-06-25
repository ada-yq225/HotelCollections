import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  message: z.string().max(300).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await params;
  const keycard = await prisma.keycard.findUnique({ where: { id } });

  if (!keycard) return NextResponse.json({ error: "房卡不存在" }, { status: 404 });
  if (keycard.userId === user.id) {
    return NextResponse.json({ error: "不能对自己的房卡发起交换" }, { status: 400 });
  }
  if (keycard.tradeType === "display") {
    return NextResponse.json({ error: "此房卡仅展示，不接受交换" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const offer = await prisma.keycardOffer.create({
      data: {
        keycardId: id,
        userId: user.id,
        message: data.message,
      },
      include: {
        user: { select: { id: true, name: true, isPlus: true } },
      },
    });

    return NextResponse.json({ offer });
  } catch {
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }
}