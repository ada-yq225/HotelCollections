import userUrlsData from "@/data/hotel-official-urls-user.json";

export type UserOfficialUrlEntry = {
  url: string;
  galleryUrl?: string;
  note?: string;
};

const SKIP_KEYS = new Set(["_meta", "_examples", "_readme"]);

function normalizeEntry(raw: string | UserOfficialUrlEntry): UserOfficialUrlEntry | null {
  if (typeof raw === "string") {
    const url = raw.trim();
    return url.startsWith("http") ? { url } : null;
  }
  if (raw && typeof raw === "object" && typeof raw.url === "string" && raw.url.startsWith("http")) {
    return {
      url: raw.url.trim(),
      galleryUrl: raw.galleryUrl?.trim(),
      note: raw.note,
    };
  }
  return null;
}

/** User-supplied official URLs — highest priority when resolving / scraping */
export function getUserOfficialUrlEntries(): Record<string, UserOfficialUrlEntry> {
  const out: Record<string, UserOfficialUrlEntry> = {};
  const data = userUrlsData as unknown as Record<string, string | UserOfficialUrlEntry>;

  for (const [slug, raw] of Object.entries(data)) {
    if (SKIP_KEYS.has(slug) || slug.startsWith("_")) continue;
    const entry = normalizeEntry(raw);
    if (entry) out[slug] = entry;
  }
  return out;
}

export function getUserOfficialUrl(slug: string): string | null {
  return getUserOfficialUrlEntries()[slug]?.url ?? null;
}

export function getUserOfficialUrlCandidates(slug: string): string[] {
  const entry = getUserOfficialUrlEntries()[slug];
  if (!entry) return [];
  const seen = new Set<string>();
  const add = (u?: string) => {
    if (!u || seen.has(u)) return;
    seen.add(u);
    candidates.push(u);
  };
  const candidates: string[] = [];
  add(entry.url);
  add(entry.galleryUrl);
  if (entry.url.endsWith("/")) {
    for (const path of ["/photos/", "/photos-and-videos/", "/gallery/", "/photos-and-videos"]) {
      add(`${entry.url.replace(/\/$/, "")}${path}`);
    }
  }
  return candidates;
}