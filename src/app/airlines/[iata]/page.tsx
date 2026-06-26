import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Calendar, ArrowLeft, Star, ExternalLink, Plane, Users, Globe, Award, Crown, ChevronRight } from "lucide-react";
import { getAirlineEnrichment } from "@/data/airline-enrichment";
import { getAirline, type AirlineAllianceSlug } from "@/data/airlines";
import { FFP_BY_AIRLINE, ALLIANCE_DETAILS } from "@/data/ffp-programs";
import { AllianceLogo, ALLIANCE_CONFIG } from "@/components/airlines/AllianceLogo";
import { AirlineLogo } from "@/components/airlines/AirlineLogo";

export default async function AirlineDetailPage({
  params,
}: {
  params: Promise<{ iata: string }>;
}) {
  const { iata } = await params;
  const enrichment = getAirlineEnrichment(iata.toUpperCase());
  if (!enrichment) notFound();

  const airline = getAirline(iata.toUpperCase());
  const ffp = FFP_BY_AIRLINE[iata.toUpperCase()];

  // Alliance info
  const allianceInfo = airline.alliance ? ALLIANCE_DETAILS[airline.alliance] : null;

  // Alliance logo colors
  const allianceConfig: Record<AirlineAllianceSlug, { nameZh: string; color: string; bgColor: string; textColor: string }> = {
    "star-alliance": { nameZh: "星空联盟", color: "#1a1a1a", bgColor: "#f5f5f5", textColor: "#1a1a1a" },
    skyteam: { nameZh: "天合联盟", color: "#003580", bgColor: "#e8f0fe", textColor: "#003580" },
    oneworld: { nameZh: "寰宇一家", color: "#006564", bgColor: "#e6f2f2", textColor: "#006564" },
  };

  const allyCfg = airline.alliance ? allianceConfig[airline.alliance] : null;

  // Related airlines (same alliance)
  const relatedAirlines = airline.alliance
    ? Object.entries(getAirline as any)
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Back link */}
      <Link
        href="/airlines"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#b8956b]"
      >
        <ArrowLeft className="h-4 w-4" />
        返回航空公司库
      </Link>

      <div className="hc-card overflow-hidden">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#faf6f0] via-white to-[#faf6f0] p-8 pb-0">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full opacity-[0.03] bg-[#1a1a1a]" />
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-16 translate-y-16 rounded-full opacity-[0.03] bg-[#1a1a1a]" />

          <div className="relative">
            {/* Logo + Alliance + Name */}
            <div className="flex flex-wrap items-start gap-5">
              <AirlineLogo
                iata={airline.iata}
                nameZh={airline.nameZh}
                size="xl"
                className="shadow-md ring-1 ring-[#e8e8e8] rounded-2xl"
              />

              <div className="min-w-0 flex-1">
                {/* Alliance badge */}
                {allyCfg && (
                  <div className="mb-1 flex items-center gap-2">
                    <AllianceLogo alliance={airline.alliance!} size="sm" />
                    {enrichment.allianceHistory && (
                      <span className="text-[10px] text-[#9ca3af]">{enrichment.allianceHistory}</span>
                    )}
                  </div>
                )}

                <h1 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
                  {airline.nameZh}
                </h1>
                <p className="mt-1.5 text-[#6b7280]">{airline.name} · {iata.toUpperCase()}</p>
              </div>
            </div>

            {/* Meta row */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#6b7280]">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#b8956b]" />
                枢纽：{enrichment.hub}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#b8956b]" />
                {enrichment.foundedYear} 年成立
              </span>
              {enrichment.skytraxRating > 0 && (
                <span className="flex items-center gap-1">
                  {Array.from({ length: enrichment.skytraxRating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#b8956b] text-[#b8956b]" />
                  ))}
                  <span className="ml-1 text-[#b8956b] font-medium">Skytrax {enrichment.skytraxRating} 星</span>
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="mt-4 flex flex-wrap gap-6">
              <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-[#e8e8e8]">
                <p className="font-serif text-xl font-semibold text-[#1a1a1a]">{enrichment.fleetSize}</p>
                <p className="text-[10px] text-[#9ca3af]">机队规模</p>
              </div>
              <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-[#e8e8e8]">
                <p className="font-serif text-xl font-semibold text-[#1a1a1a]">{enrichment.destinations}+</p>
                <p className="text-[10px] text-[#9ca3af]">通航目的地</p>
              </div>
              {enrichment.skytraxRank2024 && (
                <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-[#e8e8e8]">
                  <p className="font-serif text-xl font-semibold text-[#b8956b]">#{enrichment.skytraxRank2024}</p>
                  <p className="text-[10px] text-[#9ca3af]">Skytrax 2024 排名</p>
                </div>
              )}
              {enrichment.skytraxRank2023 && (
                <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-[#e8e8e8]">
                  <p className="font-serif text-xl font-semibold text-[#6b7280]">#{enrichment.skytraxRank2023}</p>
                  <p className="text-[10px] text-[#9ca3af]">Skytrax 2023 排名</p>
                </div>
              )}
            </div>

            {/* Awards */}
            {enrichment.awards.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {enrichment.awards.map((award) => (
                  <span
                    key={award}
                    className="inline-flex items-center gap-1 rounded-full bg-[#faf6f0] px-3 py-1 text-xs text-[#b8956b]"
                  >
                    <Award className="h-3 w-3" />
                    {award}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid gap-8 p-8 lg:grid-cols-5">
          {/* Left: main content */}
          <div className="lg:col-span-3 space-y-10">
            {/* Description */}
            <section>
              <h2 className="mb-3 font-serif text-xl font-semibold">航司介绍</h2>
              <p className="leading-relaxed text-[#374151]">{enrichment.descriptionZh}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">{enrichment.description}</p>
              {enrichment.websiteUrl && (
                <a
                  href={enrichment.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#b8956b] px-4 py-2 text-sm text-[#b8956b] transition hover:bg-[#faf6f0]"
                >
                  访问官网
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </section>

            {/* Features */}
            {enrichment.features.length > 0 && (
              <section>
                <h2 className="mb-4 font-serif text-xl font-semibold">航司特色</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {enrichment.features.map((f, i) => (
                    <div key={i} className="rounded-xl border border-[#e8e8e8] p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#faf6f0]">
                          {f.icon === "seat" && <Plane className="h-3.5 w-3.5 text-[#b8956b]" />}
                          {f.icon === "dining" && <Star className="h-3.5 w-3.5 text-[#b8956b]" />}
                          {f.icon === "lounge" && <Crown className="h-3.5 w-3.5 text-[#b8956b]" />}
                          {f.icon === "service" && <Award className="h-3.5 w-3.5 text-[#b8956b]" />}
                          {f.icon === "route" && <Globe className="h-3.5 w-3.5 text-[#b8956b]" />}
                          {f.icon === "cabin" && <Plane className="h-3.5 w-3.5 text-[#b8956b]" />}
                          {f.icon === "wifi" && <Star className="h-3.5 w-3.5 text-[#b8956b]" />}
                        </div>
                        <p className="text-sm font-medium text-[#1a1a1a]">{f.title}</p>
                      </div>
                      <p className="text-xs leading-relaxed text-[#6b7280]">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Cabin Classes */}
            {enrichment.cabinClasses.length > 0 && (
              <section>
                <h2 className="mb-4 font-serif text-xl font-semibold">客舱产品</h2>
                <div className="space-y-3">
                  {enrichment.cabinClasses.map((cabin, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[#e8e8e8] p-4"
                      style={{
                        borderLeftWidth: "3px",
                        borderLeftColor: i === 0 ? "#c9a962" : i === 1 ? "#b8956b" : i === 2 ? "#9ca3af" : "#e8e8e8",
                      }}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#1a1a1a]">{cabin.nameZh}</p>
                          <p className="text-[10px] text-[#9ca3af] uppercase">{cabin.name}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{cabin.descZh}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skytrax Rankings & Honors */}
            <section>
              <h2 className="mb-4 font-serif text-xl font-semibold">Skytrax 排名与荣誉</h2>
              <div className="rounded-2xl border border-[#e8e8e8] p-5 space-y-4">
                {/* Star rating */}
                <div>
                  <p className="text-xs text-[#9ca3af] mb-1">Skytrax 星级评定</p>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < enrichment.skytraxRating ? "fill-[#b8956b] text-[#b8956b]" : "text-[#e8e8e8]"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-[#1a1a1a]">
                      {enrichment.skytraxRating} 星航空
                    </span>
                  </div>
                </div>

                {/* Rankings */}
                <div className="grid grid-cols-2 gap-4">
                  {enrichment.skytraxRank2024 && (
                    <div className="rounded-xl bg-[#faf6f0] p-4 text-center">
                      <p className="font-serif text-3xl font-bold text-[#b8956b]">#{enrichment.skytraxRank2024}</p>
                      <p className="mt-1 text-xs text-[#6b7280]">Skytrax 2024 全球排名</p>
                    </div>
                  )}
                  {enrichment.skytraxRank2023 && (
                    <div className="rounded-xl bg-[#f5f5f5] p-4 text-center">
                      <p className="font-serif text-3xl font-bold text-[#6b7280]">#{enrichment.skytraxRank2023}</p>
                      <p className="mt-1 text-xs text-[#6b7280]">Skytrax 2023 全球排名</p>
                    </div>
                  )}
                </div>

                {/* All awards */}
                {enrichment.awards.length > 0 && (
                  <div>
                    <p className="text-xs text-[#9ca3af] mb-2">历年荣誉</p>
                    <div className="space-y-1">
                      {enrichment.awards.map((award, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#374151]">
                          <Award className="h-3.5 w-3.5 shrink-0 text-[#b8956b]" />
                          {award}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right: sidebar */}
          <aside className="space-y-6 lg:col-span-2">
            {/* Alliance card */}
            {allianceInfo && allyCfg && (
              <div className="rounded-2xl border border-[#e8e8e8] p-5">
                <p className="text-xs text-[#9ca3af] mb-3 uppercase tracking-wider">航空联盟</p>
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: `${allyCfg.color}08` }}
                >
                  <AllianceLogo alliance={airline.alliance!} size="lg" />
                  <p className="mt-3 text-xs leading-relaxed text-[#6b7280]">
                    {allianceInfo.desc}
                  </p>
                  <p className="mt-2 text-[10px] text-[#9ca3af]">
                    {enrichment.allianceHistory}
                  </p>
                </div>
              </div>
            )}

            {/* FFP card */}
            {ffp && (
              <div className="rounded-2xl border border-[#e8e8e8] p-5">
                <p className="text-xs text-[#9ca3af] mb-3 uppercase tracking-wider">常旅客计划</p>
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: `${ffp.color}12` }}
                >
                  <p className="font-semibold text-[#1a1a1a]">{ffp.nameZh}</p>
                  <p className="text-[10px] text-[#9ca3af]">{ffp.name}</p>

                  {/* Tier list */}
                  <div className="mt-3 space-y-1.5">
                    {ffp.tiers.slice(1).map((tier) => (
                      <div
                        key={tier.slug}
                        className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 text-xs"
                      >
                        <span className="font-medium text-[#1a1a1a]">{tier.nameZh}</span>
                        <span className="text-[#9ca3af]">
                          {tier.allianceTier
                            ? tier.allianceTier === "silver"
                              ? "Elite"
                              : tier.allianceTier === "gold"
                                ? "Elite Plus"
                                : tier.allianceTier === "platinum"
                                  ? "绿宝石"
                                  : ""
                            : ""}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  {ffp.highlights.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {ffp.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-[#6b7280]">
                          <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-[#b8956b]" />
                          {h}
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/club/ffp"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#b8956b] hover:underline"
                  >
                    管理我的会籍 <ArrowLeft className="h-3 w-3 rotate-180" />
                  </Link>
                </div>
              </div>
            )}

            {/* Key stats */}
            <div className="rounded-2xl border border-[#e8e8e8] p-5">
              <p className="text-xs text-[#9ca3af] mb-3 uppercase tracking-wider">基本信息</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">IATA 代码</span>
                  <span className="font-mono font-medium text-[#1a1a1a]">{enrichment.iata}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">成立年份</span>
                  <span className="font-medium text-[#1a1a1a]">{enrichment.foundedYear}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">机队规模</span>
                  <span className="font-medium text-[#1a1a1a]">{enrichment.fleetSize} 架</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">目的地</span>
                  <span className="font-medium text-[#1a1a1a]">{enrichment.destinations}+</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">枢纽</span>
                  <span className="font-medium text-[#1a1a1a] text-right">{enrichment.hub}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">联盟</span>
                  <span className="font-medium" style={{ color: allyCfg?.color ?? "#9ca3af" }}>
                    {allyCfg?.nameZh ?? "无"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6b7280]">Skytrax</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: enrichment.skytraxRating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#b8956b] text-[#b8956b]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Website */}
            {enrichment.websiteUrl && (
              <a
                href={enrichment.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-[#e8e8e8] p-5 transition hover:border-[#b8956b] hover:bg-[#faf6f0]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">访问官方网站</p>
                    <p className="text-[10px] text-[#9ca3af] mt-0.5">
                      {enrichment.websiteUrl.replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#b8956b]" />
                </div>
              </a>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
