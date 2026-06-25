import { NextResponse } from "next/server";
import { z } from "zod";
import { searchFlightsBetweenAirports } from "@/lib/travel";

const schema = z.object({
  departureIata: z.string().length(3),
  destinationIata: z.string().length(3),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const result = searchFlightsBetweenAirports(
      data.departureIata.toUpperCase(),
      data.destinationIata.toUpperCase()
    );

    if (!result) {
      return NextResponse.json({ error: "无效的机场或相同起降地" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }
}