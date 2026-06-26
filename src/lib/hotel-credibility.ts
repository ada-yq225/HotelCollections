import { HOTEL_ENRICHMENT } from "@/data/hotel-enrichment";
import { LISTING_YEAR } from "@/lib/hotel-visibility";

export type CredibilityBadge = {
  slug: string;
  label: string;
  desc: string;
  color: string;
  variant: "success" | "info" | "warning" | "neutral";
};

export function getHotelCredibilityBadges(hotel: {
  slug: string;
  openedYear?: number | null;
  enrichedAt?: Date | null;
  heroImage?: string | null;
  description?: string | null;
  avgBasePrice?: number | null;
  travelerRatingCount?: number | null;
  staysVerified?: number;
}): CredibilityBadge[] {
  const badges: CredibilityBadge[] = [];
  const enrichment = HOTEL_ENRICHMENT[hotel.slug];

  if (hotel.openedYear != null && hotel.openedYear <= LISTING_YEAR) {
    badges.push({
      slug: "operating",
      label: "已开业",
      desc: `${hotel.openedYear} 年起运营`,
      color: "#059669",
      variant: "success",
    });
  } else if (hotel.openedYear != null && hotel.openedYear > LISTING_YEAR) {
    badges.push({
      slug: "pipeline",
      label: "筹备中",
      desc: `预计 ${hotel.openedYear} 年开业`,
      color: "#d97706",
      variant: "warning",
    });
  } else {
    badges.push({
      slug: "listed",
      label: "在营收录",
      desc: "已通过 H&C 开业核验",
      color: "#059669",
      variant: "success",
    });
  }

  if (enrichment?.priceSource === "scraped" || (hotel.avgBasePrice != null && enrichment?.avgBasePrice)) {
    badges.push({
      slug: "price-verified",
      label: "官网实价",
      desc: "价格来自官网/OTA 抓取，非估算",
      color: "#1d4ed8",
      variant: "info",
    });
  } else {
    badges.push({
      slug: "price-pending",
      label: "价格待同步",
      desc: "暂无官网实价，展示待同步",
      color: "#9ca3af",
      variant: "neutral",
    });
  }

  if (hotel.heroImage && (hotel.enrichedAt || enrichment?.heroImage)) {
    badges.push({
      slug: "media-verified",
      label: "官方图文",
      desc: "图片与介绍来自官网抓取",
      color: "#7c3aed",
      variant: "info",
    });
  }

  if ((hotel.staysVerified ?? 0) > 0) {
    badges.push({
      slug: "stayed-verified",
      label: "住过认证",
      desc: `${hotel.staysVerified} 位会员已打卡认证`,
      color: "#b8956b",
      variant: "success",
    });
  }

  if ((hotel.travelerRatingCount ?? 0) >= 5) {
    badges.push({
      slug: "community-rated",
      label: "社群评分",
      desc: `${hotel.travelerRatingCount} 条高端旅客评分`,
      color: "#1a1a1a",
      variant: "info",
    });
  }

  return badges;
}

export function getPriceCredibility(hotel: {
  slug: string;
  avgBasePrice?: number | null;
  enrichedAt?: Date | null;
}): {
  source: "scraped" | "pending";
  label: string;
  detail: string;
  updatedAt?: string;
} {
  const enrichment = HOTEL_ENRICHMENT[hotel.slug];
  const isScraped = enrichment?.priceSource === "scraped" && enrichment.avgBasePrice != null;

  if (isScraped) {
    return {
      source: "scraped",
      label: "官网实价",
      detail: `¥${enrichment!.avgBasePrice!.toLocaleString("zh-CN")} / 晚（基础房型参考）`,
      updatedAt: hotel.enrichedAt?.toISOString(),
    };
  }

  return {
    source: "pending",
    label: "价格待同步",
    detail: "尚未抓取到官网或 OTA 实价，不展示估算价格",
  };
}