import type { LoyaltyProgram, LoyaltyTier } from "@/data/loyalty/programs";
import type { BookingChannel } from "@/data/loyalty/channels";
import { getProgramForGroup, getChannelsForGroup, getTier, calcRetentionProgress } from "@/lib/loyalty";
import { getGroupChannelGuide } from "@/data/loyalty/group-guides";

export type TierMatrixRow = {
  slug: string;
  nameZh: string;
  nights: string;
  points: string;
  upgrade: string;
  breakfast: string;
  lounge: string;
  checkout: string;
  isUserTier?: boolean;
};

export type ChannelMatrixRow = {
  perk: string;
  values: Record<string, string>;
};

const PERK_LABELS: Record<string, string> = {
  upgrade: "客房升级",
  breakfast: "双人早餐",
  credit: "消费抵扣",
  checkout: "弹性退房",
  gift: "欢迎礼品",
  suite: "套房/第四晚",
};

function perkFromTier(tier: LoyaltyTier, icon: string): string {
  const hit = tier.benefits.find((b) => b.icon === icon);
  return hit ? hit.title : "—";
}

function pointsFromTier(tier: LoyaltyTier): string {
  const hit = tier.benefits.find((b) => b.icon === "points");
  return hit?.title.replace("积分", "").trim() || "—";
}

export function buildTierMatrix(
  program: LoyaltyProgram,
  userTierSlug?: string | null
): TierMatrixRow[] {
  return program.tiers.map((tier) => ({
    slug: tier.slug,
    nameZh: tier.nameZh,
    nights: tier.nightsToEarn ? `${tier.nightsToEarn} 晚` : "—",
    points: pointsFromTier(tier),
    upgrade: perkFromTier(tier, "upgrade") !== "—" ? perkFromTier(tier, "upgrade") : perkFromTier(tier, "suite"),
    breakfast: perkFromTier(tier, "breakfast"),
    lounge: perkFromTier(tier, "lounge"),
    checkout: perkFromTier(tier, "checkout"),
    isUserTier: userTierSlug === tier.slug,
  }));
}

export function buildChannelMatrix(channels: BookingChannel[]): {
  rows: ChannelMatrixRow[];
  channelSlugs: string[];
} {
  const channelSlugs = channels.map((c) => c.slug);
  const perkKeys = ["upgrade", "breakfast", "credit", "checkout", "gift"] as const;

  const rows: ChannelMatrixRow[] = perkKeys.map((key) => {
    const values: Record<string, string> = {};
    for (const ch of channels) {
      const perk = ch.perks.find((p) => p.icon === key);
      values[ch.slug] = perk ? "✓" : "—";
    }
    return { perk: PERK_LABELS[key] ?? key, values };
  });

  rows.push({
    perk: "可叠加会籍",
    values: Object.fromEntries(
      channels.map((c) => [c.slug, c.stackable ? "✓" : "—"])
    ),
  });

  return { rows, channelSlugs };
}

export function getGroupLoyaltyPageData(groupSlug: string) {
  const program = getProgramForGroup(groupSlug);
  const channels = getChannelsForGroup(groupSlug);
  const guide = getGroupChannelGuide(groupSlug);

  return {
    program,
    channels,
    guide,
    hasLoyaltyProgram: !!program,
  };
}

export function getUserGroupLoyaltyContext(
  program: LoyaltyProgram | null,
  userRecord: {
    programSlug: string;
    tierSlug: string;
    nightsYTD: number;
    channelSlugs: string[];
  } | null
) {
  if (!program || !userRecord || userRecord.programSlug !== program.slug) {
    return null;
  }

  const tier = getTier(program.slug, userRecord.tierSlug);
  const retention = calcRetentionProgress(
    program.slug,
    userRecord.tierSlug,
    userRecord.nightsYTD
  );

  return { tier, retention, channelSlugs: userRecord.channelSlugs };
}