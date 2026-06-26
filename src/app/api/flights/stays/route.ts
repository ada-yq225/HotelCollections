import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { evaluateAndAwardBadges } from "@/lib/badges";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  flightNumber: z.string().min(1),
  airlineIata: z.string().length(2),
  departureIata: z.string().length(3),
  arrivalIata: z.string().length(3),
  date: z.string(),
  cabin: z.enum(["economy", "premium_economy", "business", "first"]).default("economy"),
  seatNumber: z.string().optional(),
  bookingRef: z.string().optional(),
  boardingPassUrl: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const flights = await prisma.flightStay.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ flights });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const flight = await prisma.flightStay.create({
      data: {
        userId: user.id,
        flightNumber: data.flightNumber,
        airlineIata: data.airlineIata.toUpperCase(),
        departureIata: data.departureIata.toUpperCase(),
        arrivalIata: data.arrivalIata.toUpperCase(),
        date: new Date(data.date),
        cabin: data.cabin,
        seatNumber: data.seatNumber,
        bookingRef: data.bookingRef,
        boardingPassUrl: data.boardingPassUrl,
        notes: data.notes,
      },
    });

    await evaluateAndAwardBadges(user.id);

    return NextResponse.json({ flight });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
    }
    return NextResponse.json({ error: "打卡失败" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await req.json();
  await prisma.flightStay.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ ok: true });
}
