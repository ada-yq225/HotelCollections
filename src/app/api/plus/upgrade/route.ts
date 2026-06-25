import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  if (user.isPlus) {
    return NextResponse.json({ message: "您已是 Plus 会员" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isPlus: true, plusSince: new Date() },
  });

  return NextResponse.json({ message: "Plus 会员已激活（演示模式）" });
}