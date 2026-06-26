"use client";

import { useState, useRef, useCallback } from "react";
import { ImageOff } from "lucide-react";

const PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect fill="#f0f0f0" width="640" height="360"/><text x="320" y="180" text-anchor="middle" fill="#9ca3af" font-size="18" font-family="sans-serif">舱位图片加载中</text></svg>`
  );

export function CabinImage({
  src,
  alt,
  fallbackUrls = [],
  className = "h-full w-full object-cover",
}: {
  src: string;
  alt: string;
  fallbackUrls?: string[];
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src || PLACEHOLDER);
  const fallbackIndex = useRef(0);

  const tryNextFallback = useCallback(() => {
    if (fallbackUrls.length > 0 && fallbackIndex.current < fallbackUrls.length) {
      setCurrentSrc(fallbackUrls[fallbackIndex.current]);
      fallbackIndex.current += 1;
    } else {
      setFailed(true);
    }
  }, [fallbackUrls]);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#f0f0f0] text-[#9ca3af]">
        <ImageOff className="h-8 w-8" />
        <span className="text-xs">图片暂不可用</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={tryNextFallback}
    />
  );
}