"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Map, Hotel, Plus, User, MessageSquare, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

type UserInfo = {
  name: string;
  isPlus: boolean;
} | null;

const NAV = [
  { href: "/hotels", label: "酒店库", icon: Hotel },
  { href: "/community", label: "社区", icon: MessageSquare },
  { href: "/club", label: "俱乐部", icon: Gem },
  { href: "/checkin", label: "打卡", icon: Plus },
  { href: "/map", label: "地图", icon: Map },
  { href: "/profile", label: "我的", icon: User },
];

export function Navbar({ user }: { user: UserInfo }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e8e8] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-semibold tracking-tight">H&C</span>
          <span className="hidden text-xs text-[#6b7280] sm:inline">Hotel Collection</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-[#1a1a1a] text-white"
                  : "text-[#6b7280] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 text-sm">
              {user.isPlus && <Crown className="h-4 w-4 text-[#b8956b]" />}
              <span className="font-medium">{user.name}</span>
            </Link>
          ) : (
            <Link href="/login" className="hc-btn-primary text-sm">
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}