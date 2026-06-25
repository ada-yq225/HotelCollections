"use client";

import { useState, useEffect, useCallback } from "react";
import { PostCard } from "@/components/community/PostCard";

type Post = Parameters<typeof PostCard>[0]["post"];

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [group, setGroup] = useState("");

  const loadPosts = useCallback(async (groupFilter: string, nextCursor?: string | null) => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "20" });
    if (nextCursor) params.set("cursor", nextCursor);
    if (groupFilter) params.set("group", groupFilter);

    const res = await fetch(`/api/posts?${params}`);
    const data = await res.json();

    const serialized = data.posts.map((p: Post & { createdAt: string }) => ({
      ...p,
      createdAt: typeof p.createdAt === "string" ? p.createdAt : new Date(p.createdAt).toISOString(),
    }));

    return { posts: serialized as Post[], nextCursor: data.nextCursor as string | null };
  }, []);

  useEffect(() => {
    loadPosts(group).then(({ posts: items, nextCursor }) => {
      setPosts(items);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
      setLoading(false);
    });
  }, [group, loadPosts]);

  async function loadMore() {
    if (!cursor) return;
    const { posts: more, nextCursor } = await loadPosts(group, cursor);
    setPosts((prev) => [...prev, ...more]);
    setCursor(nextCursor);
    setHasMore(!!nextCursor);
    setLoading(false);
  }

  const groups = [
    { slug: "", label: "全部" },
    { slug: "marriott", label: "万豪" },
    { slug: "hyatt", label: "凯悦" },
    { slug: "ihg", label: "洲际" },
    { slug: "hilton", label: "希尔顿" },
    { slug: "accor", label: "雅高" },
    { slug: "independent", label: "独立奢华" },
  ];

  return (
    <div className="mt-8">
      <div className="mb-6 flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g.slug}
            onClick={() => setGroup(g.slug)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              group === g.slug ? "bg-[#1a1a1a] text-white" : "border border-[#e8e8e8] bg-white"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {loading && posts.length === 0 ? (
        <div className="py-20 text-center text-[#6b7280]">加载中...</div>
      ) : posts.length === 0 ? (
        <div className="hc-card py-20 text-center">
          <p className="text-[#6b7280]">暂无点评，成为第一个分享入住体验的人</p>
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {posts.map((post) => (
            <div key={post.id} className="mb-4">
              <PostCard post={{ ...post, createdAt: post.createdAt }} />
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-full border border-[#e8e8e8] px-6 py-2 text-sm hover:border-[#b8956b] disabled:opacity-50"
          >
            {loading ? "加载中..." : "加载更多"}
          </button>
        </div>
      )}
    </div>
  );
}