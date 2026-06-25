import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { KeycardGallery } from "./KeycardGallery";
import { Plus } from "lucide-react";

export default async function KeycardsPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/club" className="text-sm text-[#6b7280] hover:text-[#1a1a1a]">← 俱乐部</Link>
          <h1 className="mt-2 font-serif text-4xl">房卡交流</h1>
          <p className="mt-2 text-[#6b7280]">展示收藏 · 出让交换 · 求购稀有房卡</p>
        </div>
        {user ? (
          <Link href="/club/keycards/new" className="hc-btn-primary inline-flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" /> 上传房卡
          </Link>
        ) : (
          <Link href="/login" className="hc-btn-primary text-sm">登录后上传</Link>
        )}
      </div>
      <KeycardGallery />
    </div>
  );
}