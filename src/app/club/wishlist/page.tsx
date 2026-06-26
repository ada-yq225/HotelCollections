import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Heart, MapPin, Star, Building2, ArrowRight, Trash2 } from "lucide-react";
import { hotelDisplayImageUrl } from "@/lib/hotel-display-image";
import { WishlistClient } from "./WishlistClient";

export default async function WishlistPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Heart className="mx-auto h-12 w-12 text-[#e8e8e8]" />
        <h1 className="mt-6 font-serif text-2xl font-semibold">我的心愿单</h1>
        <p className="mt-2 text-[#6b7280]">登录后即可收藏心仪的酒店</p>
        <Link href="/login" className="hc-btn-primary mt-6 inline-block">
          立即登录
        </Link>
      </div>
    );
  }

  const items = await prisma.userWishlist.findMany({
    where: { userId: user.id },
    include: {
      hotel: {
        select: {
          id: true,
          slug: true,
          name: true,
          nameZh: true,
          city: true,
          cityZh: true,
          country: true,
          heroImage: true,
          travelerScore: true,
          avgBasePrice: true,
          avgSuitePrice: true,
          brand: { select: { nameZh: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#e8e8e8] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#faf6f0_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <p className="mb-3 text-xs font-medium tracking-[0.25em] text-[#e84855] uppercase">Wishlist</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">我的心愿单</h1>
          <p className="mt-3 text-[#6b7280]">
            {items.length === 0
              ? "还没有收藏酒店，浏览酒店库发现心仪之选"
              : `已收藏 ${items.length} 家酒店`}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="mx-auto h-16 w-16 text-[#e8e8e8]" />
            <p className="mt-4 text-[#6b7280]">你的心愿单还是空的</p>
            <Link href="/hotels" className="hc-btn-primary mt-6 inline-block">
              浏览酒店库
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-[#e8e8e8] bg-white transition-all hover:border-[#b8956b]/40 hover:shadow-md"
              >
                <div className="aspect-[4/3] bg-[#f0f0f0]">
                  {item.hotel.heroImage && hotelDisplayImageUrl(item.hotel.slug, item.hotel.heroImage) ? (
                    <img
                      src={hotelDisplayImageUrl(item.hotel.slug, item.hotel.heroImage)!}
                      alt={item.hotel.nameZh || item.hotel.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#faf6f0] to-[#f0f0f0]">
                      <Building2 className="h-12 w-12 text-[#b8956b]/30" />
                    </div>
                  )}
                  <div className="absolute right-3 top-3">
                    <WishlistClient hotelId={item.hotel.id} initialWishlisted />
                  </div>
                  {item.priority === "must" && (
                    <div className="absolute left-3 top-3 rounded-full bg-[#e84855] px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                      必住
                    </div>
                  )}
                </div>
                <Link href={`/hotels/${item.hotel.slug}`} className="block p-4">
                  <p className="text-xs text-[#9ca3af]">{item.hotel.brand.nameZh}</p>
                  <h3 className="mt-1 font-medium text-[#1a1a1a] group-hover:text-[#b8956b]">
                    {item.hotel.nameZh || item.hotel.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-[#6b7280]">
                      <MapPin className="h-3 w-3" />
                      {item.hotel.cityZh} · {item.hotel.country}
                    </span>
                    {item.hotel.travelerScore != null && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#b8956b]">
                        <Star className="h-3 w-3 fill-[#b8956b] text-[#b8956b]" />
                        {item.hotel.travelerScore.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {item.hotel.avgBasePrice && (
                    <p className="mt-2 text-xs text-[#9ca3af]">
                      参考均价 ¥{item.hotel.avgBasePrice.toLocaleString()}/晚
                    </p>
                  )}
                  {item.note && (
                    <p className="mt-2 rounded-lg bg-[#faf6f0] px-3 py-2 text-xs text-[#6b7280]">
                      💭 {item.note}
                    </p>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
