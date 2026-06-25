import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });

  const stayCount = await prisma.stay.count({ where: { userId: user.id } });

  return NextResponse.json({ user: { ...user, stayCount } });
}