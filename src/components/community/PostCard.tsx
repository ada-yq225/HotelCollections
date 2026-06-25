import Link from "next/link";
import { Crown, Star } from "lucide-react";
import { parseImages, avgScore } from "@/lib/posts";

type Post = {
  id: string;
  title: string;
  content: string;
  images: string;
  upgradeRate: string | null;
  loungeDining: number | null;
  amenities: number | null;
  service: number | null;
  createdAt: string;
  user: { name: string; isPlus: boolean };
  hotel: {
    name: string;
    nameZh: string | null;
    cityZh: string;
    brand: { nameZh: string; group: { logoColor: string | null } };
  };
};

export function PostCard({ post }: { post: Post }) {
  const images = parseImages(post.images);
  const score = avgScore(post);

  return (
    <Link href={`/community/${post.id}`} className="hc-card block overflow-hidden break-inside-avoid">
      {images[0] ? (
        <img src={images[0]} alt="" className="aspect-[4/5] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-[#faf6f0] to-[#f5f5f5]">
          <span className="font-serif text-2xl text-[#b8956b]/40">H&C</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="line-clamp-2 font-medium leading-snug">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-[#6b7280]">{post.content}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.upgradeRate && (
            <span className="rounded-full bg-[#faf6f0] px-2 py-0.5 text-xs text-[#b8956b]">
              升房：{post.upgradeRate}
            </span>
          )}
          {score !== null && (
            <span className="flex items-center gap-0.5 rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs">
              <Star className="h-3 w-3 fill-[#b8956b] text-[#b8956b]" />
              {score}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#f0f0f0] pt-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-[#6b7280]">
              {post.hotel.nameZh || post.hotel.name}
            </p>
            <p className="truncate text-xs text-[#9ca3af]">
              {post.hotel.brand.nameZh} · {post.hotel.cityZh}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-xs">
            {post.user.isPlus && <Crown className="h-3 w-3 text-[#b8956b]" />}
            <span>{post.user.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}