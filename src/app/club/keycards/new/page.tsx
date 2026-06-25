import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { KeycardForm } from "./KeycardForm";

export default async function NewKeycardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link href="/club/keycards" className="text-sm text-[#6b7280] hover:text-[#1a1a1a]">← 房卡交流</Link>
      <h1 className="mt-4 font-serif text-3xl">上传房卡</h1>
      <p className="mt-2 text-sm text-[#6b7280]">分享你的房卡收藏，或发布交换/求购信息</p>
      <KeycardForm />
    </div>
  );
}