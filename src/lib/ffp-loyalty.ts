import {
  FFP_PROGRAMS,
  FFP_BY_SLUG,
  FFP_BY_AIRLINE,
  ALLIANCE_FFP,
  ALLIANCE_DETAILS,
  type FFPProgram,
  type FFPTier,
  type FFPAlliance,
} from "@/data/ffp-programs";
import { getAirline } from "@/data/airlines";

export type UserFFPRecord = {
  programSlug: string;
  tierSlug: string;
  milesYTD: number;
  segmentsYTD: number;
  memberNumber?: string;
};

/** Get alliance benefits a user enjoys via their FFP status */
export function getAllianceBenefits(
  userPrograms: UserFFPRecord[]
): {
  alliance: FFPAlliance;
  details: (typeof ALLIANCE_DETAILS)[FFPAlliance];
  programs: FFPProgram[];
  maxTierLevel: number;
  maxTierNameZh: string;
}[] {
  const allianceMap = new Map<FFPAlliance, { programs: FFPProgram[]; maxLevel: number; maxTierNameZh: string }>();

  for (const record of userPrograms) {
    const program = FFP_BY_SLUG[record.programSlug];
    if (!program || !program.alliance) continue;
    const tier = program.tiers.find((t) => t.slug === record.tierSlug);
    if (!tier || !tier.allianceTier) continue;

    const existing = allianceMap.get(program.alliance);
    if (!existing) {
      allianceMap.set(program.alliance, { programs: [program], maxLevel: tier.level, maxTierNameZh: tier.nameZh });
    } else {
      existing.programs.push(program);
      if (tier.level > existing.maxLevel) {
        existing.maxLevel = tier.level;
        existing.maxTierNameZh = tier.nameZh;
      }
    }
  }

  return Array.from(allianceMap.entries()).map(([alliance, data]) => ({
    alliance,
    details: ALLIANCE_DETAILS[alliance],
    ...data,
  }));
}

/** Map FFP tier to alliance tier level for cross-recognition */
export function ffpTierToAllianceLevel(tierSlug: string, programSlug: string): "silver" | "gold" | "platinum" | null {
  const program = FFP_BY_SLUG[programSlug];
  if (!program) return null;
  const tier = program.tiers.find((t) => t.slug === tierSlug);
  return tier?.allianceTier ?? null;
}

/** Calculate progress towards next tier */
export function calcFFPProgress(
  programSlug: string,
  tierSlug: string,
  milesYTD: number,
  segmentsYTD: number
): {
  currentTier: FFPTier;
  nextTier: FFPTier | null;
  milesRequired: number;
  milesRemaining: number;
  milesProgress: number;
  segmentsRequired: number;
  segmentsRemaining: number;
  segmentsProgress: number;
} | null {
  const program = FFP_BY_SLUG[programSlug];
  if (!program) return null;

  const currentTier = program.tiers.find((t) => t.slug === tierSlug);
  if (!currentTier) return null;

  const nextTier = program.tiers.find((t) => t.level === currentTier.level + 1) ?? null;

  const milesRequired = nextTier?.milesToEarn ?? 0;
  const milesRemaining = Math.max(0, milesRequired - milesYTD);
  const milesProgress = milesRequired > 0 ? Math.min(100, (milesYTD / milesRequired) * 100) : 100;

  const segmentsRequired = nextTier?.segmentsToEarn ?? 0;
  const segmentsRemaining = Math.max(0, segmentsRequired - segmentsYTD);
  const segmentsProgress = segmentsRequired > 0 ? Math.min(100, (segmentsYTD / segmentsRequired) * 100) : 100;

  return {
    currentTier,
    nextTier,
    milesRequired,
    milesRemaining,
    milesProgress,
    segmentsRequired,
    segmentsRemaining,
    segmentsProgress,
  };
}

/** Find which FFPs are relevant for a given flight route */
export function getRelevantFFPs(depIata: string, destIata: string): FFPProgram[] {
  const depAirline = getAirline(depIata);
  const destAirline = getAirline(destIata);

  const relevant = new Set<FFPProgram>();

  // Direct airline FFPs
  for (const iata of [depIata, destIata]) {
    const ffp = FFP_BY_AIRLINE[iata];
    if (ffp) relevant.add(ffp);
  }

  // Alliance members
  const depFFP = FFP_BY_AIRLINE[depIata];
  const destFFP = FFP_BY_AIRLINE[destIata];
  if (depFFP?.alliance) {
    ALLIANCE_FFP[depFFP.alliance].forEach((p) => relevant.add(p));
  }
  if (destFFP?.alliance && destFFP.alliance !== depFFP?.alliance) {
    ALLIANCE_FFP[destFFP.alliance].forEach((p) => relevant.add(p));
  }

  // Always include Chinese FFPs for Chinese travellers
  FFP_PROGRAMS.filter((p) => ["CA", "MU", "CZ", "HU"].includes(p.airlineIata)).forEach((p) => relevant.add(p));

  return Array.from(relevant).slice(0, 8);
}

/** Check if two FFPs can cross-accrue (same alliance) */
export function canCrossAccrue(programSlug1: string, programSlug2: string): boolean {
  const p1 = FFP_BY_SLUG[programSlug1];
  const p2 = FFP_BY_SLUG[programSlug2];
  if (!p1 || !p2) return false;
  if (!p1.alliance || !p2.alliance) return false;
  return p1.alliance === p2.alliance;
}

export { FFP_PROGRAMS, FFP_BY_SLUG, FFP_BY_AIRLINE, ALLIANCE_FFP, ALLIANCE_DETAILS };
export type { FFPProgram, FFPTier, FFPAlliance };
