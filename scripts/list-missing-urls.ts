import { ALL_HOTELS } from "../src/data/hotels";
import { resolveOfficialUrl } from "../src/lib/hotel-official-url";

for (const h of ALL_HOTELS.filter((x) => x.isActive !== false)) {
  if (!h.websiteUrl && !resolveOfficialUrl(h)) {
    console.log(h.brandSlug, h.slug, h.name);
  }
}