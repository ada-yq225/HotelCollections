import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategoryLabel } from "@/lib/club";
import { ReplyForm } from "./ReplyForm";
import { formatDate } from "@/lib/utils";
import { Crown, ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, isPlus: true } },
      replies: {
        include: { user: { select: { id: true, name: true, isPlus: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!discussion) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/club/benefits" className="inline-flex items-center gap-1 text-sm text-[#6b7280]">
        <ArrowLeft className="h-4 w-4" /> 返回权益互助
      </Link>

      <article className="mt-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#faf6f0] px-3 py-0.5 text-xs text-[#b8956b]">
            {getCategoryLabel(discussion.category)}
          </span>
          {discussion.groupSlug && (
            <span className="rounded-full bg-[#f5f5f5] px-3 py-0.5 text-xs">{discussion.groupSlug}</span>
          )}
        </div>

        <h1 className="mt-4 font-serif text-3xl leading-tight">{discussion.title}</h1>

        <div className="mt-4 flex items-center gap-2 text-sm text-[#6b7280]">
          {discussion.user.isPlus && <Crown className="h-4 w-4 text-[#b8956b]" />}
          <span>{discussion.user.name}</span>
          <span>·</span>
          <span>{formatDate(discussion.createdAt)}</span>
        </div>

        <div className="mt-6 whitespace-pre-wrap leading-relaxed">{discussion.content}</div>
      </article>

      <section className="mt-10">
        <h2 className="font-serif text-xl">回复 · {discussion.replies.length}</h2>
        <div className="mt-4 space-y-4">
          {discussion.replies.map((r) => (
            <div key={r.id} className="hc-card p-4">
              <div className="flex items-center gap-2 text-sm">
                {r.user.isPlus && <Crown className="h-3 w-3 text-[#b8956b]" />}
                <span className="font-medium">{r.user.name}</span>
                <span className="text-xs text-[#9ca3af]">{formatDate(r.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#374151]">{r.content}</p>
            </div>
          ))}
        </div>

        {user ? (
          <div className="mt-6">
            <ReplyForm discussionId={discussion.id} />
          </div>
        ) : (
          <Link href="/login" className="mt-6 inline-block text-sm text-[#b8956b] hover:underline">
            登录后参与讨论
          </Link>
        )}
      </section>
    </div>
  );
}