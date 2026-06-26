import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "./BookingForm";
import { HotelBenefitsSection } from "@/components/loyalty/HotelBenefitsSection";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ hotel?: string; source?: string }>;
}) {
  const params = await searchParams;

  if (!params.hotel) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link href="/club" className="text-sm text-[#6b7280]">← 俱乐部</Link>
        <h1 className="mt-4 font-serif text-4xl">专属礼遇预订</h1>
        <p className="mt-2 text-[#6b7280]">从酒店库或社区点评中选择酒店，享前台现付专属待遇</p>
        <Link href="/hotels" className="hc-btn-primary mt-8 inline-block text-sm">
          浏览酒店库
        </Link>
      </div>
    );
  }

  const hotel = await prisma.hotel.findUnique({
    where: { id: params.hotel },
    include: { brand: { include: { group: true } } },
  });

  if (!hotel) redirect("/hotels");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/club" className="text-sm text-[#6b7280]">← 俱乐部</Link>
      <h1 className="mt-4 font-serif text-4xl">预订咨询</h1>
      <p className="mt-2 text-[#6b7280]">
        提交意向后，专属顾问将通过企业微信为您人工代订
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <HotelBenefitsSection
          hotelId={hotel.id}
          hotelName={hotel.nameZh || hotel.name}
          groupSlug={hotel.brand.group.slug}
          groupNameZh={hotel.brand.group.nameZh}
          brandSlug={hotel.brand.slug}
          region={hotel.region}
          countryCode={hotel.countryCode}
        />
        <BookingForm
          hotelId={hotel.id}
          hotelName={hotel.nameZh || hotel.name}
          source={params.source ?? "book-page"}
        />
      </div>
    </div>
  );
}