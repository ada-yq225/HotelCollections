import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { DiscussionForm } from "./DiscussionForm";

export default async function NewDiscussionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/club/benefits" className="text-sm text-[#6b7280]">← 权益互助</Link>
      <h1 className="mt-4 font-serif text-3xl">发起话题</h1>
      <DiscussionForm />
    </div>
  );
}