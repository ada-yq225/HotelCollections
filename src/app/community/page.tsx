import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { CommunityFeed } from "./CommunityFeed";
import { PenLine } from "lucide-react";

export default async function CommunityPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl">社区</h1>
          <p className="mt-2 text-[#6b7280]">
            结构化硬核点评 · 升房率 · 酒廊出品 · 备品硬件 · 服务细节
          </p>
        </div>
        {user ? (
          <Link href="/community/new" className="hc-btn-primary inline-flex items-center gap-2 text-sm">
            <PenLine className="h-4 w-4" /> 发布点评
          </Link>
        ) : (
          <Link href="/login" className="hc-btn-primary text-sm">
            登录后发布
          </Link>
        )}
      </div>

      <CommunityFeed />
    </div>
  );
}