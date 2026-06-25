export type HotelStatus = "active" | "closed" | "rebranded";

export type HotelEntry = {
  slug: string;
  name: string;
  nameZh?: string;
  brandSlug: string;
  city: string;
  cityZh: string;
  country: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  address?: string;
  openedYear?: number;
  /** Defaults to true when omitted */
  isActive?: boolean;
  status?: HotelStatus;
  /** Rebrand history, pipeline notes, etc. */
  notes?: string;
  websiteUrl?: string;
  description?: string;
  descriptionZh?: string;
  heroImage?: string;
  galleryImages?: string[];
};