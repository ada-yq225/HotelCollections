import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseImages, avgScore } from "@/lib/posts";
import { ReviewScoresDisplay } from "@/components/community/ReviewScores";
import { formatDate } from "@/lib/utils";
import { Crown, ArrowLeft, Star } from "lucide-react";
import { HotelBenefitsSection } from "@/components/loyalty/HotelBenefitsSection";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id, isPublished: true },
    include: {
      user: { select: { id: true, name: true, isPlus: true } },
      hotel: { include: { brand: { include: { group: true } } } },
      stay: { select: { checkIn: true, nights: true, roomType: true, proofUrl: true } },
    },
  });

  if (!post) notFound();

  const images = parseImages(post.images);
  const score = avgScore(post);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/community" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a1a1a]">
        <ArrowLeft className="h-4 w-4" /> 返回社区
      </Link>

      <article className="mt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#faf6f0] font-serif text-[#b8956b]">
            {post.user.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium">{post.user.name}</span>
              {post.user.isPlus && <Crown className="h-4 w-4 text-[#b8956b]" />}
            </div>
            <p className="text-xs text-[#6b7280]">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <h1 className="mt-6 font-serif text-3xl leading-tight">{post.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs"
            style={{ backgroundColor: `${post.hotel.brand.group.logoColor}15`, color: post.hotel.brand.group.logoColor ?? "#1a1a1a" }}
          >
            {post.hotel.brand.nameZh}
          </span>
          <span className="text-sm text-[#6b7280]">
            {post.hotel.nameZh || post.hotel.name} · {post.hotel.cityZh}
          </span>
          {score !== null && (
            <span className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-[#b8956b] text-[#b8956b]" />
              {score}
            </span>
          )}
        </div>

        {images.length > 0 && (
          <div className={`mt-6 grid gap-2 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className={`rounded-2xl object-cover ${i === 0 && images.length > 1 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
              />
            ))}
          </div>
        )}

        <div className="mt-8 whitespace-pre-wrap leading-relaxed text-[#374151]">{post.content}</div>

        <div className="mt-10">
          <h2 className="mb-4 font-serif text-2xl">硬核维度</h2>
          <ReviewScoresDisplay post={post} />
        </div>

        {post.stay && (
          <div className="mt-8 hc-card p-4">
            <p className="text-sm text-[#6b7280]">关联入住</p>
            <p className="mt-1 text-sm">
              {formatDate(post.stay.checkIn)} · {post.stay.nights} 晚
              {post.stay.roomType && ` · ${post.stay.roomType}`}
            </p>
          </div>
        )}

        <div className="mt-10">
          <HotelBenefitsSection
            hotelId={post.hotel.id}
            hotelName={post.hotel.nameZh || post.hotel.name}
            groupSlug={post.hotel.brand.group.slug}
            groupNameZh={post.hotel.brand.group.nameZh}
            brandSlug={post.hotel.brand.slug}
            region={post.hotel.region}
            countryCode={post.hotel.countryCode}
          />
        </div>

        <div className="mt-8 flex gap-3">
          <Link href={`/checkin?hotel=${post.hotelId}`} className="hc-btn-primary text-sm">
            打卡此酒店
          </Link>
          <Link
            href={`/hotels`}
            className="rounded-full border border-[#e8e8e8] px-5 py-2 text-sm hover:border-[#b8956b]"
          >
            浏览酒店库
          </Link>
        </div>
      </article>
    </div>
  );
}