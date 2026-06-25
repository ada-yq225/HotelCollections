import enrichmentJson from "./hotel-enrichment.json";

export type HotelEnrichmentRecord = {
  websiteUrl: string;
  description?: string;
  descriptionZh?: string;
  heroImage?: string;
  galleryImages?: string[];
  avgBasePrice?: number;
  avgSuitePrice?: number;
  priceSource?: "scraped" | "estimated";
};

export const HOTEL_ENRICHMENT: Record<string, HotelEnrichmentRecord> =
  enrichmentJson as Record<string, HotelEnrichmentRecord>;