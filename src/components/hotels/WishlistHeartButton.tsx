"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  hotelId: string;
  hotelSlug: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  onToggle?: (isWishlisted: boolean) => void;
};

export function WishlistHeartButton({ hotelId, hotelSlug, className, size = "md", onToggle }: Props) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile/wishlist")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.items?.some((i: any) => i.hotelId === hotelId)) {
          setIsWishlisted(true);
        }
      })
      .catch(() => {});
  }, [hotelId]);

  const toggle = useCallback(async () => {
    setLoading(true);
    try {
      if (isWishlisted) {
        await fetch("/api/profile/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hotelId }),
        });
        setIsWishlisted(false);
        onToggle?.(false);
      } else {
        const res = await fetch("/api/profile/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hotelId }),
        });
        if (res.ok) {
          setIsWishlisted(true);
          onToggle?.(true);
        } else {
          window.location.href = "/login";
        }
      }
    } finally {
      setLoading(false);
    }
  }, [isWishlisted, hotelId, onToggle]);

  const iconSize = size === "lg" ? "h-7 w-7" : size === "md" ? "h-5 w-5" : "h-4 w-4";
  const btnSize = size === "lg" ? "p-2.5" : size === "md" ? "p-2" : "p-1.5";

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        "rounded-full transition-all duration-300",
        btnSize,
        isWishlisted
          ? "bg-[#e84855]/10 text-[#e84855] hover:bg-[#e84855]/20"
          : "bg-white/80 text-[#6b7280] hover:bg-white hover:text-[#e84855]",
        "shadow-sm hover:shadow-md",
        "border border-[#e8e8e8]",
        loading && "animate-pulse",
        className
      )}
      aria-label={isWishlisted ? "取消收藏" : "添加收藏"}
      title={isWishlisted ? "取消收藏" : "加入心愿单"}
    >
      <Heart className={cn(iconSize, isWishlisted && "fill-[#e84855]")} />
    </button>
  );
}
