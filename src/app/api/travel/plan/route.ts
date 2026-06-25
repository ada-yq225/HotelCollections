import { NextResponse } from "next/server";
import { z } from "zod";
import { planTravelToHotel } from "@/lib/travel";

const schema = z.object({
  departureIata: z.string().length(3),
  latitude: z.number(),
  longitude: z.number(),
  countryCode: z.string().length(2),
  cityZh: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const plan = planTravelToHotel(data.departureIata.toUpperCase(), {
      latitude: data.latitude,
      longitude: data.longitude,
      countryCode: data.countryCode,
      cityZh: data.cityZh,
    });

    if (!plan) {
      return NextResponse.json({ error: "无效的出发机场" }, { status: 400 });
    }

    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }
}