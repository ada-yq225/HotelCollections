import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveBenefitsForHotel, parseChannelSlugs } from "@/lib/loyalty";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupSlug = searchParams.get("group");
  const brandSlug = searchParams.get("brand");
  const region = searchParams.get("region") ?? "";
  const countryCode = searchParams.get("country") ?? "";

  if (!groupSlug || !brandSlug) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 });
  }

  let userLoyalty: {
    programSlug: string;
    tierSlug: string;
    nightsYTD?: number;
    channelSlugs?: string[];
  }[] = [];

  const user = await getCurrentUser();
  if (user) {
    const rows = await prisma.userLoyaltyStatus.findMany({
      where: { userId: user.id },
    });
    userLoyalty = rows.map((r) => ({
      programSlug: r.programSlug,
      tierSlug: r.tierSlug,
      nightsYTD: r.nightsYTD,
      channelSlugs: parseChannelSlugs(r.channelSlugs),
    }));
  }

  const resolved = resolveBenefitsForHotel(
    { groupSlug, brandSlug, region, countryCode },
    userLoyalty
  );

  return NextResponse.json({
    loggedIn: !!user,
    ...resolved,
  });
}