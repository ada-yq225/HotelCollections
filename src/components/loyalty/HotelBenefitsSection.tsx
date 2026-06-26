"use client";

import { useEffect, useState } from "react";
import { TierBenefitsCard } from "./TierBenefitsCard";
import type { ResolvedBenefit } from "@/lib/loyalty";

type Props = {
  hotelId: string;
  hotelName: string;
  groupSlug: string;
  groupNameZh: string;
  brandSlug: string;
  region: string;
  countryCode: string;
};

export function HotelBenefitsSection(props: Props) {
  const [data, setData] = useState<{
    loggedIn: boolean;
    program: { nameZh: string } | null;
    tier: { nameZh: string } | null;
    tierBenefits: ResolvedBenefit[];
    channelBenefits: ResolvedBenefit[];
    userRecord: unknown;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      group: props.groupSlug,
      brand: props.brandSlug,
      region: props.region,
      country: props.countryCode,
    });
    fetch(`/api/benefits?${params}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [props.groupSlug, props.brandSlug, props.region, props.countryCode]);

  if (!data) {
    return (
      <div className="h-48 animate-pulse rounded-2xl bg-[#f5f5f5]" />
    );
  }

  return (
    <TierBenefitsCard
      hotelName={props.hotelName}
      hotelId={props.hotelId}
      groupNameZh={props.groupNameZh}
      programNameZh={data.program?.nameZh}
      tierNameZh={data.tier?.nameZh}
      tierBenefits={data.tierBenefits}
      channelBenefits={data.channelBenefits}
      loggedIn={data.loggedIn}
      hasLoyalty={!!data.userRecord}
    />
  );
}