import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "./ReviewForm";

export default async function NewReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ hotel?: string; stay?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;

  const preselectedHotel = params.hotel
    ? await prisma.hotel.findUnique({
        where: { id: params.hotel },
        include: { brand: { include: { group: true } } },
      })
    : null;

  const preselectedStay = params.stay
    ? await prisma.stay.findFirst({
        where: { id: params.stay, userId: user.id },
        include: { hotel: { include: { brand: { include: { group: true } } } } },
      })
    : null;

  const userStays = await prisma.stay.findMany({
    where: {
      userId: user.id,
      post: null,
    },
    include: { hotel: { include: { brand: true } } },
    orderBy: { checkIn: "desc" },
    take: 20,
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-serif text-4xl">发布点评</h1>
      <p className="mt-2 text-[#6b7280]">
        用常旅客最关心的维度，分享你的真实入住体验
      </p>
      <ReviewForm
        preselectedHotel={preselectedHotel ? JSON.parse(JSON.stringify(preselectedHotel)) : null}
        preselectedStay={preselectedStay ? JSON.parse(JSON.stringify(preselectedStay)) : null}
        userStays={JSON.parse(JSON.stringify(userStays))}
      />
    </div>
  );
}