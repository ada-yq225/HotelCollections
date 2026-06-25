import Link from "next/link";
import { PenLine, Star } from "lucide-react";
import { avgScore } from "@/lib/posts";

type ReviewPost = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  loungeDining: number | null;
  amenities: number | null;
  service: number | null;
  user: { name: string; isPlus: boolean };
};

export function HotelCommunityReviews({
  hotelId,
  hotelName,
  posts,
}: {
  hotelId: string;
  hotelName: string;
  posts: ReviewPost[];
}) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#e8e8e8] bg-[#fafafa] p-6 text-center">
        <p className="text-sm text-[#6b7280]">暂无社群实地点评</p>
        <Link
          href={`/community/new?hotel=${hotelId}`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#b8956b] hover:underline"
        >
          <PenLine className="h-4 w-4" />
          入住后来写第一条点评
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const score = avgScore(post);
        return (
          <Link
            key={post.id}
            href={`/community/${post.id}`}
            className="block rounded-xl border border-[#e8e8e8] p-4 transition hover:border-[#b8956b]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium leading-snug">{post.title}</p>
                <p className="mt-1 text-xs text-[#9ca3af]">
                  {post.user.name}
                  {post.user.isPlus && (
                    <span className="ml-1.5 rounded bg-[#faf6f0] px-1.5 py-0.5 text-[#b8956b]">
                      Plus
                    </span>
                  )}
                </p>
              </div>
              {score !== null && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#faf6f0] px-2 py-0.5 text-sm font-medium text-[#b8956b]">
                  <Star className="h-3.5 w-3.5 fill-[#b8956b]" />
                  {score}
                </span>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-[#6b7280]">{post.content}</p>
          </Link>
        );
      })}
      <Link
        href={`/community?hotel=${hotelId}`}
        className="inline-block text-sm text-[#b8956b] hover:underline"
      >
        查看 {hotelName} 全部社群点评 →
      </Link>
    </div>
  );
}