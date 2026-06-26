"use client";

import { useState } from "react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { HotelPriceDisplay } from "./HotelPriceDisplay";
import { HotelTravelerRating } from "./HotelTravelerRating";
import { HotelCommunityReviews } from "./HotelCommunityReviews";
import { hotelDisplayImageUrl, hotelGalleryDisplayUrls } from "@/lib/hotel-display-image";

type HotelProfileProps = {
  slug: string;
  nameZh: string;
  name: string;
  descriptionZh?: string | null;
  description?: string | null;
  notes?: string | null;
  heroImage?: string | null;
  galleryImages: string[];
  websiteUrl?: string | null;
  avgBasePrice?: number | null;
  avgSuitePrice?: number | null;
  suiteLabel?: string;
  travelerScore?: number | null;
  travelerRatingCount?: number | null;
  travelerReviewSummary?: string | null;
  scoreLocation?: number | null;
  scoreDesign?: number | null;
  scoreService?: number | null;
  scoreDining?: number | null;
  scoreHardware?: number | null;
  hotelId?: string;
  communityReviews?: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    loungeDining: number | null;
    amenities: number | null;
    service: number | null;
    user: { name: string; isPlus: boolean };
  }[];
};

export function HotelProfile({
  slug,
  nameZh,
  name,
  descriptionZh,
  description,
  notes,
  heroImage,
  galleryImages,
  websiteUrl,
  avgBasePrice,
  avgSuitePrice,
  suiteLabel,
  travelerScore,
  travelerRatingCount,
  travelerReviewSummary,
  scoreLocation,
  scoreDesign,
  scoreService,
  scoreDining,
  scoreHardware,
  hotelId,
  communityReviews = [],
}: HotelProfileProps) {
  const rawImages = galleryImages.length > 0 ? galleryImages : heroImage ? [heroImage] : [];
  const images = hotelGalleryDisplayUrls(slug, rawImages);
  if (images.length === 0 && heroImage) {
    const single = hotelDisplayImageUrl(slug, heroImage);
    if (single) images.push(single);
  }
  const [active, setActive] = useState(0);
  const intro = descriptionZh || description || notes;

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-8">
      {images.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#e8e8e8]">
          <div className="relative aspect-[16/9] bg-[#f3f0eb]">
            <img
              src={images[active]}
              alt={`${nameZh} — 官方图片 ${active + 1}`}
              className="h-full w-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
                  aria-label="上一张"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
                  aria-label="下一张"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === active ? "w-6 bg-white" : "w-1.5 bg-white/60"
                      }`}
                      aria-label={`图片 ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto border-t border-[#e8e8e8] bg-[#fafafa] p-3">
              {images.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === active ? "border-[#b8956b]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {travelerScore != null &&
        travelerRatingCount != null &&
        scoreLocation != null &&
        scoreDesign != null &&
        scoreService != null &&
        scoreDining != null &&
        scoreHardware != null && (
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold">高端旅客评分</h2>
            <div className="rounded-2xl border border-[#e8e8e8] p-5">
              <HotelTravelerRating
                travelerScore={travelerScore}
                travelerRatingCount={travelerRatingCount}
                travelerReviewSummary={travelerReviewSummary}
                scoreLocation={scoreLocation}
                scoreDesign={scoreDesign}
                scoreService={scoreService}
                scoreDining={scoreDining}
                scoreHardware={scoreHardware}
              />
            </div>
          </section>
        )}

      {avgBasePrice != null && avgSuitePrice != null && (
        <section>
          <h2 className="mb-3 font-serif text-xl font-semibold">参考均价</h2>
          <HotelPriceDisplay
            avgBasePrice={avgBasePrice}
            avgSuitePrice={avgSuitePrice}
            suiteLabel={suiteLabel}
          />
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="font-serif text-xl font-semibold">酒店介绍</h2>
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#b8956b] px-4 py-2 text-sm text-[#b8956b] transition hover:bg-[#faf6f0]"
            >
              访问官网
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {intro ? (
          <div className="space-y-3 leading-relaxed text-[#374151]">
            <p>{intro}</p>
            {descriptionZh && description && descriptionZh !== description && (
              <p className="text-sm text-[#6b7280]">{description}</p>
            )}
          </div>
        ) : websiteUrl ? (
          <p className="text-sm text-[#6b7280]">
            暂未抓取到官网介绍，请点击上方链接访问 {name} 官方网站了解更多。
          </p>
        ) : (
          <p className="text-sm text-[#6b7280]">暂无官网介绍信息。</p>
        )}

        {websiteUrl && (
          <p className="mt-4 text-xs text-[#9ca3af]">
            图文来源：酒店官方网站 ·{" "}
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#b8956b]">
              {websiteUrl.replace(/^https?:\/\//, "")}
            </a>
          </p>
        )}
      </section>

      {hotelId && (
        <section>
          <h2 className="mb-3 font-serif text-xl font-semibold">社群真实点评</h2>
          <HotelCommunityReviews
            hotelId={hotelId}
            hotelName={nameZh}
            posts={communityReviews}
          />
        </section>
      )}
    </div>
  );
}