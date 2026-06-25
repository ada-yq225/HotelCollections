"use client";

import { useRouter } from "next/navigation";
import { LogOut, Crown } from "lucide-react";

export function ProfileActions({ isPlus }: { isPlus: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function handleUpgrade() {
    await fetch("/api/plus/upgrade", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="flex gap-3">
      {!isPlus && (
        <button onClick={handleUpgrade} className="hc-btn-gold flex items-center gap-1.5 text-sm">
          <Crown className="h-4 w-4" /> 升级 Plus
        </button>
      )}
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-full border border-[#e8e8e8] px-4 py-2 text-sm text-[#6b7280] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
      >
        <LogOut className="h-4 w-4" /> 退出
      </button>
    </div>
  );
}