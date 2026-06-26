"use client";

import { Download, Share2 } from "lucide-react";

export function JourneyExportButton() {
  const exportPoster = () => {
    window.open("/api/journey/export", "_blank");
  };

  const shareCard = async () => {
    const url = `${window.location.origin}/api/journey/export`;
    if (navigator.share) {
      await navigator.share({ title: "我的 H&C 入住足迹", url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("分享链接已复制");
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={exportPoster}
        className="inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] px-4 py-2 text-sm hover:border-[#b8956b]"
      >
        <Download className="h-4 w-4" />
        导出足迹海报
      </button>
      <button
        type="button"
        onClick={shareCard}
        className="inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] px-4 py-2 text-sm hover:border-[#b8956b]"
      >
        <Share2 className="h-4 w-4" />
        分享卡片
      </button>
    </div>
  );
}