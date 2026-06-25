import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getWeChatWorkUrl } from "@/lib/booking";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  hotelId: z.string(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().min(1).max(10).optional(),
  contact: z.string().max(100).optional(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const user = await getCurrentUser();

    const hotel = await prisma.hotel.findUnique({
      where: { id: data.hotelId },
      include: { brand: { include: { group: true } } },
    });
    if (!hotel) return NextResponse.json({ error: "酒店不存在" }, { status: 404 });

    const inquiry = await prisma.bookingInquiry.create({
      data: {
        userId: user?.id,
        hotelId: data.hotelId,
        checkIn: data.checkIn ? new Date(data.checkIn) : null,
        checkOut: data.checkOut ? new Date(data.checkOut) : null,
        guests: data.guests ?? 2,
        contact: data.contact,
        source: data.source ?? "hotel",
      },
    });

    const wechatUrl = getWeChatWorkUrl();
    const hotelName = hotel.nameZh || hotel.name;

    return NextResponse.json({
      inquiry,
      wechatUrl,
      message: `预订意向已记录 · ${hotelName}`,
      redirectUrl: `${wechatUrl}${wechatUrl.includes("?") ? "&" : "?"}hc_inquiry=${inquiry.id}`,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
    }
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }
}