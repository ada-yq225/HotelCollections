"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageCircle, X } from "lucide-react";

type ShareButtonProps = {
  hotelName: string;
  hotelNameZh: string | null;
  hotelCity: string;
  hotelSlug: string;
  className?: string;
};

export function ShareButton({
  hotelName,
  hotelNameZh,
  hotelCity,
  hotelSlug,
  className = "",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayName = hotelNameZh || hotelName;
  const shareTitle = `${displayName} - H&C Hotel Collection`;
  const shareText = `${displayName} | ${hotelCity}\n高端奢华酒店，查看详情与社区真实点评`;
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/hotels/${hotelSlug}`;

  const handleCopy = async () => {
    const content = `${shareTitle}\n${shareText}\n${shareUrl}`;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWechatShare = () => {
    handleCopy();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-[#e8e8e8] px-4 py-2 text-sm font-medium text-[#6b7280] transition-all hover:border-[#b8956b] hover:text-[#b8956b] ${className}`}
      >
        <Share2 className="h-4 w-4" />
        分享
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">分享酒店</h3>
              <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-[#f5f5f5]">
                <X className="h-5 w-5 text-[#9ca3af]" />
              </button>
            </div>

            <p className="mb-4 text-sm text-[#6b7280]">{displayName}</p>

            <div className="space-y-3">
              {/* Copy Link */}
              <button
                onClick={handleCopy}
                className="flex w-full items-center gap-3 rounded-xl border border-[#e8e8e8] p-4 text-left transition-all hover:border-[#b8956b] hover:bg-[#faf6f0]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5]">
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-[#6b7280]" />}
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">{copied ? "已复制!" : "复制链接"}</p>
                  <p className="text-xs text-[#9ca3af]">一键复制酒店信息和链接</p>
                </div>
              </button>

              {/* WeChat Share */}
              <button
                onClick={handleWechatShare}
                className="flex w-full items-center gap-3 rounded-xl border border-[#e8e8e8] p-4 text-left transition-all hover:border-[#07c160] hover:bg-[#f0fff4]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0fff4]">
                  <MessageCircle className="h-5 w-5 text-[#07c160]" />
                </div>
                <div>
                  <p className="font-medium text-[#1a1a1a]">微信分享</p>
                  <p className="text-xs text-[#9ca3af]">复制内容粘贴到微信好友/群聊</p>
                </div>
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-[#9ca3af]">
              微信内可直接点击右上角「···」分享给朋友
            </p>
          </div>
        </div>
      )}
    </>
  );
}
