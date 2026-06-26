import { HOTEL_ENRICHMENT } from "@/data/hotel-enrichment";
import { getScrapedLegFareCny } from "@/lib/flight-prices-scraped";

function getRouteMinPrice(route: string): number | null {
  const [from, to] = route.split("-");
  if (!from || !to) return null;
  const fares = (
    ["economy", "business", "premium"] as const
  ).map((c) => getScrapedLegFareCny(from, to, c));
  const valid = fares.filter((p): p is number => p != null);
  return valid.length > 0 ? Math.min(...valid) : null;
}

export type TriggeredAlert = {
  id: string;
  hotelSlug: string | null;
  flightRoute: string | null;
  targetPrice: number;
  currentPrice: number | null;
  triggered: boolean;
  label: string;
};

export function evaluatePriceAlert(alert: {
  id: string;
  hotelSlug: string | null;
  flightRoute: string | null;
  targetPrice: number;
  direction: string;
}): TriggeredAlert {
  let currentPrice: number | null = null;
  let label = "";

  if (alert.hotelSlug) {
    const enrichment = HOTEL_ENRICHMENT[alert.hotelSlug];
    if (enrichment?.priceSource === "scraped" && enrichment.avgBasePrice != null) {
      currentPrice = enrichment.avgBasePrice;
      label = `${alert.hotelSlug} 官网 ¥${currentPrice.toLocaleString("zh-CN")}/晚`;
    } else {
      label = `${alert.hotelSlug}（价格待同步）`;
    }
  } else if (alert.flightRoute) {
    const scraped = getRouteMinPrice(alert.flightRoute);
    if (scraped != null) {
      currentPrice = scraped;
      label = `${alert.flightRoute} OTA ¥${currentPrice?.toLocaleString("zh-CN") ?? "—"}`;
    } else {
      label = `${alert.flightRoute}（价格待同步）`;
    }
  }

  const triggered =
    currentPrice != null &&
    (alert.direction === "below"
      ? currentPrice <= alert.targetPrice
      : currentPrice >= alert.targetPrice);

  return {
    id: alert.id,
    hotelSlug: alert.hotelSlug,
    flightRoute: alert.flightRoute,
    targetPrice: alert.targetPrice,
    currentPrice,
    triggered,
    label,
  };
}