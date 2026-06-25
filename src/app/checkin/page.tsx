import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckinForm } from "./CheckinForm";

export default async function CheckinPage({
  searchParams,
}: {
  searchParams: Promise<{ hotel?: string }>;
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

  const stayCount = await prisma.stay.count({ where: { userId: user.id } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-serif text-4xl">入住打卡</h1>
      <p className="mt-2 text-[#6b7280]">
        记录你的奢华入住，上传凭证收纳至个人足迹
      </p>

      {!user.isPlus && (
        <div className="mt-4 rounded-xl border border-[#e8e8e8] bg-[#faf6f0] px-4 py-3 text-sm">
          免费版剩余打卡次数：<strong>{Math.max(0, 6 - stayCount)}</strong> / 6
        </div>
      )}

      <CheckinForm
        preselectedHotel={preselectedHotel ? JSON.parse(JSON.stringify(preselectedHotel)) : null}
      />
    </div>
  );
}