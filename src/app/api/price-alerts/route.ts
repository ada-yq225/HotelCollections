import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluatePriceAlert } from "@/lib/price-alerts";

const createSchema = z.object({
  hotelSlug: z.string().optional(),
  flightRoute: z.string().optional(),
  targetPrice: z.number().int().positive(),
  direction: z.enum(["below", "above"]).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const alerts = await prisma.priceAlert.findMany({
    where: { userId: user.id, active: true },
    orderBy: { createdAt: "desc" },
  });

  const evaluated = alerts.map(evaluatePriceAlert);
  const triggered = evaluated.filter((a) => a.triggered);

  return NextResponse.json({ alerts, evaluated, triggered });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success || (!parsed.data.hotelSlug && !parsed.data.flightRoute)) {
    return NextResponse.json({ error: "请提供酒店或航线" }, { status: 400 });
  }

  const alert = await prisma.priceAlert.create({
    data: {
      userId: user.id,
      hotelSlug: parsed.data.hotelSlug ?? null,
      flightRoute: parsed.data.flightRoute ?? null,
      targetPrice: parsed.data.targetPrice,
      direction: parsed.data.direction ?? "below",
    },
  });

  return NextResponse.json({ alert });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });

  await prisma.priceAlert.updateMany({
    where: { id, userId: user.id },
    data: { active: false },
  });

  return NextResponse.json({ ok: true });
}