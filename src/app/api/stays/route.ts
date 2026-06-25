import { NextResponse } from "next/server";
import { z } from "zod";
import { differenceInDays } from "date-fns";
import { getCurrentUser } from "@/lib/auth";
import { evaluateAndAwardBadges } from "@/lib/badges";
import { prisma } from "@/lib/prisma";
import { FREE_STAY_LIMIT } from "@/lib/utils";

const schema = z.object({
  hotelId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  roomType: z.string().optional(),
  roomNumber: z.string().optional(),
  notes: z.string().optional(),
  proofUrl: z.string().optional(),
  proofType: z.enum(["photo", "receipt", "keycard"]).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const stays = await prisma.stay.findMany({
    where: { userId: user.id },
    include: {
      hotel: {
        include: { brand: { include: { group: true } } },
      },
    },
    orderBy: { checkIn: "desc" },
  });

  return NextResponse.json({ stays });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (!user.isPlus) {
      const count = await prisma.stay.count({ where: { userId: user.id } });
      if (count >= FREE_STAY_LIMIT) {
        return NextResponse.json(
          {
            error: `免费版最多记录 ${FREE_STAY_LIMIT} 次入住，升级 Plus 解锁无限打卡`,
            code: "LIMIT_REACHED",
          },
          { status: 403 }
        );
      }
    }

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    const nights = Math.max(1, differenceInDays(checkOut, checkIn));

    const stay = await prisma.stay.create({
      data: {
        userId: user.id,
        hotelId: data.hotelId,
        checkIn,
        checkOut,
        nights,
        roomType: data.roomType,
        roomNumber: data.roomNumber,
        notes: data.notes,
        proofUrl: data.proofUrl,
        proofType: data.proofType,
      },
      include: {
        hotel: {
          include: { brand: { include: { group: true } } },
        },
      },
    });

    const newBadges = await evaluateAndAwardBadges(user.id);

    return NextResponse.json({ stay, newBadges });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
    }
    return NextResponse.json({ error: "打卡失败" }, { status: 500 });
  }
}