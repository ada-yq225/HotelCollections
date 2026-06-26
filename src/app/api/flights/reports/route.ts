import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  flightStayId: z.string().optional(),
  title: z.string().min(1),
  content: z.string().min(1),
  images: z.string().default("[]"),
  seatComfort: z.number().min(1).max(5).optional(),
  catering: z.number().min(1).max(5).optional(),
  cabinService: z.number().min(1).max(5).optional(),
  entertainment: z.number().min(1).max(5).optional(),
  punctuality: z.number().min(1).max(5).optional(),
  loungeRating: z.number().min(1).max(5).optional(),
  loungeNote: z.string().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const reports = await prisma.flightReport.findMany({
    where: { userId: user.id, isPublished: true },
    include: { flightStay: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reports });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (data.flightStayId) {
      const existing = await prisma.flightReport.findUnique({ where: { flightStayId: data.flightStayId } });
      if (existing) {
        return NextResponse.json({ error: "该飞行记录已关联报告" }, { status: 400 });
      }
    }

    const report = await prisma.flightReport.create({
      data: {
        userId: user.id,
        flightStayId: data.flightStayId,
        title: data.title,
        content: data.content,
        images: data.images,
        seatComfort: data.seatComfort,
        catering: data.catering,
        cabinService: data.cabinService,
        entertainment: data.entertainment,
        punctuality: data.punctuality,
        loungeRating: data.loungeRating,
        loungeNote: data.loungeNote,
      },
    });

    return NextResponse.json({ report });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
    }
    return NextResponse.json({ error: "发布失败" }, { status: 500 });
  }
}
