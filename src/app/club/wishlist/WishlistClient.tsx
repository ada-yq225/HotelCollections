"use client";

import { Heart } from "lucide-react";

export function WishlistClient({ hotelId, initialWishlisted }: { hotelId: string; initialWishlisted: boolean }) {
  return (
    <form
      action={async () => {
        await fetch("/api/profile/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hotelId }),
        });
      }}
    >
      <button
        type="submit"
        className="rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition hover:bg-white hover:shadow-md border border-[#e8e8e8]"
        title="取消收藏"
      >
        <Heart className="h-4 w-4 fill-[#e84855] text-[#e84855]" />
      </button>
    </form>
  );
}
