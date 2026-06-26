import { Search, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getEnrichedAirlines } from "@/data/airline-enrichment";
import { AIRLINES, type AirlineAllianceSlug } from "@/data/airlines";
import { AirlineCard } from "@/components/airlines/AirlineCard";
import { AllianceLogo } from "@/components/airlines/AllianceLogo";
import { FFP_PROGRAMS } from "@/data/ffp-programs";

export default function AirlinesPage() {
  const enriched = getEnrichedAirlines();
  const ffpIatas = new Set(FFP_PROGRAMS.map((p) => p.airlineIata));

  // Count by alliance
  const starCount = enriched.filter(
    (a) => AIRLINES[a.iata]?.alliance === "star-alliance"
  ).length;
  const skyteamCount = enriched.filter(
    (a) => AIRLINES[a.iata]?.alliance === "skyteam"
  ).length;
  const oneworldCount = enriched.filter(
    (a) => AIRLINES[a.iata]?.alliance === "oneworld"
  ).length;
  const nonAllianceCount = enriched.filter(
    (a) => !AIRLINES[a.iata]?.alliance
  ).length;

  // Skytrax top 10
  const topRanked = enriched
    .filter((a) => a.skytraxRank2024 != null && a.skytraxRank2024 <= 10)
    .sort((a, b) => (a.skytraxRank2024 ?? 99) - (b.skytraxRank2024 ?? 99));

  // Five-star airlines
  const fiveStars = enriched.filter((a) => a.skytraxRating === 5);

  const allianceSections: { key: AirlineAllianceSlug | "non-alliance"; label: string; color: string; count: number }[] = [
    { key: "star-alliance", label: "星空联盟", color: "#1a1a1a", count: starCount },
    { key: "skyteam", label: "天合联盟", color: "#003580", count: skyteamCount },
    { key: "oneworld", label: "寰宇一家", color: "#006564", count: oneworldCount },
    { key: "non-alliance", label: "非联盟精选", color: "#b8956b", count: nonAllianceCount },
  ];

  function getSectionAirlines(key: string) {
    if (key === "non-alliance") {
      return enriched.filter((a) => !AIRLINES[a.iata]?.alliance);
    }
    return enriched.filter((a) => AIRLINES[a.iata]?.alliance === key);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#e8e8e8] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#faf6f0_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
          <p className="mb-3 text-xs font-medium tracking-[0.25em] text-[#b8956b] uppercase">
            Airline Showcase
          </p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            全球航空公司
          </h1>
          <p className="mt-4 max-w-xl text-[#6b7280] leading-relaxed">
            收录 <span className="font-medium text-[#1a1a1a]">{enriched.length}</span> 家全球主流航空公司
            · Skytrax 排名 · 会员权益 · 常旅客计划 · 客舱产品
          </p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-[#6b7280]">
            {allianceSections.map((sec) => (
              <div key={sec.key}>
                <p className="font-serif text-2xl font-semibold" style={{ color: sec.color }}>
                  {sec.count}
                </p>
                <p className="text-xs">{sec.label}</p>
              </div>
            ))}
            <div className="h-10 w-px bg-[#e8e8e8]" />
            <div>
              <p className="font-serif text-2xl font-semibold text-[#b8956b]">
                {fiveStars.length}
              </p>
              <p className="text-xs">五星航空</p>
            </div>
            <div className="h-10 w-px bg-[#e8e8e8]" />
            <div>
              <p className="font-serif text-2xl font-semibold text-[#1a1a1a]">
                {ffpIatas.size}
              </p>
              <p className="text-xs">常旅客计划</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/club/ffp"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e8e8] bg-white px-3 py-1.5 text-xs font-medium transition hover:border-[#b8956b] text-[#1a1a1a]"
            >
              管理我的飞行会籍 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-12">
        {/* Skytrax Top 10 */}
        {topRanked.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#b8956b]">
                <Star className="h-4 w-4 fill-white text-white" />
              </div>
              <h2 className="font-serif text-2xl font-semibold">Skytrax 2024 全球 Top 10</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {topRanked.map((a) => (
                <AirlineCard key={a.iata} enrichment={a} />
              ))}
            </div>
          </section>
        )}

        {/* By alliance sections */}
        {allianceSections.map((section) => {
          const airlines = getSectionAirlines(section.key);
          if (airlines.length === 0) return null;

          return (
            <section key={section.key}>
              <div className="mb-5 flex items-center gap-3">
                {section.key !== "non-alliance" ? (
                  <AllianceLogo alliance={section.key} size="md" showLabel={false} />
                ) : (
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${section.color}15` }}
                  >
                    <span className="text-sm font-bold" style={{ color: section.color }}>◎</span>
                  </div>
                )}
                <h2 className="font-serif text-2xl font-semibold">
                  {section.label}
                  <span className="ml-2 text-sm font-normal text-[#9ca3af]">{airlines.length} 家</span>
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {airlines.map((a) => (
                  <AirlineCard key={a.iata} enrichment={a} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
