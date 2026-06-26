import { NextRequest, NextResponse } from "next/server";
import { cacheHotelImageLocally, localHotelMediaFile } from "@/lib/china-hotel-images";
import { existsSync, readFileSync } from "fs";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const url = req.nextUrl.searchParams.get("url");

  if (!slug || !url) {
    return NextResponse.json({ error: "missing slug or url" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "invalid url" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  const localFile = localHotelMediaFile(slug);
  if (!existsSync(localFile)) {
    const cached = await cacheHotelImageLocally(slug, url);
    if (!cached) {
      return NextResponse.json({ error: "fetch failed" }, { status: 502 });
    }
  }

  const buf = readFileSync(localFile);
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}