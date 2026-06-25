import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { BenefitsForum } from "./BenefitsForum";
import { PenLine } from "lucide-react";

export default async function BenefitsPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/club" className="text-sm text-[#6b7280] hover:text-[#1a1a1a]">← 俱乐部</Link>
          <h1 className="mt-2 font-serif text-4xl">权益互助</h1>
          <p className="mt-2 text-[#6b7280]">保级攻略 · 季度活动 · 礼遇对比 · 合规权益分享</p>
        </div>
        {user ? (
          <Link href="/club/benefits/new" className="hc-btn-primary inline-flex items-center gap-2 text-sm">
            <PenLine className="h-4 w-4" /> 发起话题
          </Link>
        ) : (
          <Link href="/login" className="hc-btn-primary text-sm">登录后发帖</Link>
        )}
      </div>
      <BenefitsForum />
    </div>
  );
}