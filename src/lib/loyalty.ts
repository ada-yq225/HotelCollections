import {
  LOYALTY_PROGRAMS,
  PROGRAM_BY_GROUP,
  PROGRAM_BY_SLUG,
  type LoyaltyProgram,
  type LoyaltyTier,
} from "@/data/loyalty/programs";
import {
  BOOKING_CHANNELS,
  CHANNEL_BY_SLUG,
  type BookingChannel,
} from "@/data/loyalty/channels";

export type UserLoyaltyRecord = {
  programSlug: string;
  tierSlug: string;
  nightsYTD?: number;
  expiresAt?: string | null;
  channelSlugs?: string[];
  memberNumber?: string | null;
};

export type ResolvedBenefit = {
  source: "tier" | "channel" | "booking";
  sourceLabel: string;
  sourceColor?: string;
  icon: string;
  title: string;
  desc: string;
  stackable?: boolean;
};

export type HotelBenefitContext = {
  groupSlug: string;
  brandSlug: string;
  region: string;
  countryCode: string;
};

export function parseChannelSlugs(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function getProgramForGroup(groupSlug: string): LoyaltyProgram | null {
  return PROGRAM_BY_GROUP[groupSlug] ?? null;
}

export function getTier(programSlug: string, tierSlug: string): LoyaltyTier | null {
  const program = PROGRAM_BY_SLUG[programSlug];
  if (!program) return null;
  return program.tiers.find((t) => t.slug === tierSlug) ?? null;
}

export function getChannelsForGroup(groupSlug: string): BookingChannel[] {
  return BOOKING_CHANNELS.filter((c) => c.groupSlugs.includes(groupSlug));
}

export function getApplicableChannels(
  groupSlug: string,
  userChannels: string[]
): BookingChannel[] {
  const available = getChannelsForGroup(groupSlug);
  return available.filter((c) => userChannels.includes(c.slug));
}

export function resolveBenefitsForHotel(
  hotel: HotelBenefitContext,
  userLoyalty: UserLoyaltyRecord[]
): {
  program: LoyaltyProgram | null;
  tier: LoyaltyTier | null;
  userRecord: UserLoyaltyRecord | null;
  tierBenefits: ResolvedBenefit[];
  channelBenefits: ResolvedBenefit[];
  allBenefits: ResolvedBenefit[];
  channels: BookingChannel[];
} {
  const program = getProgramForGroup(hotel.groupSlug);
  const userRecord =
    program != null
      ? userLoyalty.find((r) => r.programSlug === program.slug) ?? null
      : null;
  const tier =
    program && userRecord ? getTier(program.slug, userRecord.tierSlug) : null;

  const tierBenefits: ResolvedBenefit[] =
    tier && program
      ? tier.benefits.map((b) => ({
          source: "tier" as const,
          sourceLabel: `${program.nameZh} · ${tier.nameZh}`,
          sourceColor: program.color,
          icon: b.icon,
          title: b.title,
          desc: b.desc,
          stackable: true,
        }))
      : [];

  const userChannels = userRecord?.channelSlugs ?? [];
  const channels = getApplicableChannels(hotel.groupSlug, userChannels);

  const channelBenefits: ResolvedBenefit[] = channels.flatMap((ch) =>
    ch.perks.map((p) => ({
      source: "channel" as const,
      sourceLabel: ch.nameZh,
      sourceColor: ch.color,
      icon: p.icon,
      title: p.title,
      desc: p.desc,
      stackable: ch.stackable,
    }))
  );

  const allBenefits = [...tierBenefits, ...channelBenefits];

  return {
    program,
    tier,
    userRecord,
    tierBenefits,
    channelBenefits,
    allBenefits,
    channels,
  };
}

export function calcRetentionProgress(
  programSlug: string,
  tierSlug: string,
  nightsYTD: number
): {
  nightsRequired: number;
  nightsRemaining: number;
  progress: number;
  nextTier: LoyaltyTier | null;
} | null {
  const program = PROGRAM_BY_SLUG[programSlug];
  if (!program) return null;

  const currentTier = getTier(programSlug, tierSlug);
  if (!currentTier) return null;

  const nightsRequired = currentTier.nightsToRenew ?? currentTier.nightsToEarn ?? 0;
  const nightsRemaining = Math.max(0, nightsRequired - nightsYTD);
  const progress = nightsRequired > 0 ? Math.min(100, (nightsYTD / nightsRequired) * 100) : 100;

  const nextTier =
    program.tiers.find((t) => t.level === currentTier.level + 1) ?? null;

  return { nightsRequired, nightsRemaining, progress, nextTier };
}

export function compareChannelPerks(channelSlugs: string[]) {
  return channelSlugs
    .map((slug) => CHANNEL_BY_SLUG[slug])
    .filter(Boolean)
    .map((ch) => ({
      slug: ch.slug,
      nameZh: ch.nameZh,
      color: ch.color,
      perks: ch.perks,
      stackable: ch.stackable,
    }));
}

export { LOYALTY_PROGRAMS, BOOKING_CHANNELS, PROGRAM_BY_SLUG, CHANNEL_BY_SLUG };