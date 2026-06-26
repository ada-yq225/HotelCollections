import { STATUS_MATCH_POLICIES } from "@/data/loyalty/status-match";
import { FFP_BY_SLUG } from "@/data/ffp-programs";
import { AirlineInline } from "@/components/airlines/AirlineInline";
import { AllianceLogo } from "@/components/airlines/AllianceLogo";
import { getAirline } from "@/data/airlines";
import Link from "next/link";
import { Hotel, Plane, ExternalLink, CheckCircle2, XCircle, AlertCircle, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import type { AirlineAllianceSlug } from "@/data/airlines";

const ALLIANCE_MEMBER_SAMPLES: Record<AirlineAllianceSlug, string[]> = {
  "star-alliance": ["CA", "NH", "SQ", "UA"],
  skyteam: ["MU", "DL", "AF", "KE"],
  oneworld: ["CX", "BA", "JL", "QR"],
};

export default function StatusMatchPage() {
  const hotelPolicies = STATUS_MATCH_POLICIES.filter((p) => p.type === "hotel");
  const airlinePolicies = STATUS_MATCH_POLICIES.filter((p) => p.type === "airline");

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#e8e8e8] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#faf6f0_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <p className="mb-3 text-xs font-medium tracking-[0.25em] text-[#b8956b] uppercase">Status Match</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">会籍匹配/挑战指南</h1>
          <p className="mt-3 max-w-xl text-[#6b7280]">
            各酒店集团和航司的会籍匹配（Status Match）与挑战（Challenge）政策汇总。
            用你现有的高级会籍获取其他集团同等待遇，让每一次出行都享受精英礼遇。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#hotel" className="flex items-center gap-1.5 rounded-full border border-[#e8e8e8] bg-white px-4 py-2 text-sm hover:border-[#b8956b] transition">
              <Hotel className="h-4 w-4" />酒店集团
            </a>
            <a href="#airline" className="flex items-center gap-1.5 rounded-full border border-[#e8e8e8] bg-white px-4 py-2 text-sm hover:border-[#b8956b] transition">
              <Plane className="h-4 w-4" />航空公司
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Quick summary */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#e8e8e8] bg-white p-5">
            <span className="text-2xl">🏨</span>
            <p className="mt-2 text-2xl font-semibold">{hotelPolicies.length}</p>
            <p className="text-sm text-[#6b7280]">酒店集团有匹配/挑战方案</p>
          </div>
          <div className="rounded-xl border border-[#e8e8e8] bg-white p-5">
            <span className="text-2xl">✈️</span>
            <p className="mt-2 text-2xl font-semibold">{airlinePolicies.length}</p>
            <p className="text-sm text-[#6b7280]">航司有匹配/挑战方案</p>
          </div>
          <div className="rounded-xl border border-[#e8e8e8] bg-white p-5">
            <span className="text-2xl">💡</span>
            <p className="mt-2 text-2xl font-semibold">3</p>
            <p className="text-sm text-[#6b7280]">联盟互认通用（星空/天合/寰宇）</p>
          </div>
        </div>

        {/* Hotel policies */}
        <h2 id="hotel" className="mb-6 flex items-center gap-2 font-serif text-2xl font-semibold">
          <Hotel className="h-6 w-6 text-[#b8956b]" />酒店集团
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {hotelPolicies.map((policy) => (
            <div key={policy.programSlug} className="rounded-xl border border-[#e8e8e8] bg-white p-6 transition hover:border-[#b8956b]/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-semibold">{policy.programNameZh}</h3>
                  <p className="text-xs text-[#9ca3af]">{policy.programName}</p>
                </div>
                <div className="flex gap-1.5">
                  {policy.offersMatch ? (
                    <span className="flex items-center gap-1 rounded-full bg-[#dcfce7] px-2.5 py-1 text-xs font-medium text-[#16a34a]">
                      <CheckCircle2 className="h-3 w-3" />可匹配
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-[#fef2f2] px-2.5 py-1 text-xs font-medium text-[#dc2626]">
                      <XCircle className="h-3 w-3" />无匹配
                    </span>
                  )}
                  {policy.offersChallenge && (
                    <span className="flex items-center gap-1 rounded-full bg-[#eff6ff] px-2.5 py-1 text-xs font-medium text-[#2563eb]">
                      <ShieldCheck className="h-3 w-3" />可挑战
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-sm font-medium text-[#1a1a1a]">{policy.policyTitle}</h4>
              <p className="mt-2 text-sm text-[#6b7280]">{policy.policyDesc}</p>

              {policy.eligibleFrom.length > 0 && (
                <div className="mt-4 rounded-lg bg-[#faf6f0] p-3">
                  <p className="text-xs font-medium text-[#b8956b]">可匹配来源</p>
                  <ul className="mt-1.5 space-y-0.5">
                    {policy.eligibleFrom.map((e) => (
                      <li key={e} className="text-xs text-[#6b7280]">{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {policy.challengeNights && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-[#b8956b]" />
                  <span>
                    挑战要求：<strong>{policy.challengeNights} 晚</strong> · {policy.challengeDuration}
                  </span>
                </div>
              )}

              <div className="mt-3 rounded-lg bg-[#f9fafb] p-3">
                <p className="text-xs font-medium text-[#1a1a1a]">如何申请</p>
                <p className="mt-1 text-xs text-[#6b7280]">{policy.howToApply}</p>
                {policy.link && (
                  <a
                    href={policy.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#b8956b] hover:underline"
                  >
                    官方页面 <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {policy.tips.length > 0 && (
                <div className="mt-3 space-y-1">
                  {policy.tips.map((tip, i) => (
                    <p key={i} className="flex items-start gap-2 text-xs text-[#6b7280]">
                      <span className="mt-0.5 text-[#b8956b]">•</span>
                      {tip}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Airline policies */}
        <h2 id="airline" className="mb-6 mt-12 flex items-center gap-2 font-serif text-2xl font-semibold">
          <Plane className="h-6 w-6 text-[#b8956b]" />航空公司
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {airlinePolicies.map((policy) => {
            const ffp = FFP_BY_SLUG[policy.programSlug];
            const airline = ffp ? getAirline(ffp.airlineIata) : null;
            return (
            <div key={policy.programSlug} className="rounded-xl border border-[#e8e8e8] bg-white p-6 transition hover:border-[#b8956b]/50">
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="min-w-0">
                  {airline ? (
                    <AirlineInline
                      iata={airline.iata}
                      nameZh={policy.programNameZh}
                      subtitle={policy.programName}
                      size="md"
                    />
                  ) : (
                    <>
                      <h3 className="font-serif text-lg font-semibold">{policy.programNameZh}</h3>
                      <p className="text-xs text-[#9ca3af]">{policy.programName}</p>
                    </>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {policy.offersMatch ? (
                    <span className="flex items-center gap-1 rounded-full bg-[#dcfce7] px-2.5 py-1 text-xs font-medium text-[#16a34a]">
                      <CheckCircle2 className="h-3 w-3" />可匹配
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-[#fef2f2] px-2.5 py-1 text-xs font-medium text-[#dc2626]">
                      <XCircle className="h-3 w-3" />无匹配
                    </span>
                  )}
                  {policy.offersChallenge && (
                    <span className="flex items-center gap-1 rounded-full bg-[#eff6ff] px-2.5 py-1 text-xs font-medium text-[#2563eb]">
                      <ShieldCheck className="h-3 w-3" />可挑战
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-sm font-medium text-[#1a1a1a]">{policy.policyTitle}</h4>
              <p className="mt-2 text-sm text-[#6b7280]">{policy.policyDesc}</p>

              {policy.eligibleFrom.length > 0 && (
                <div className="mt-4 rounded-lg bg-[#faf6f0] p-3">
                  <p className="text-xs font-medium text-[#b8956b]">可匹配来源</p>
                  <ul className="mt-1.5 space-y-0.5">
                    {policy.eligibleFrom.map((e) => (
                      <li key={e} className="text-xs text-[#6b7280]">{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {policy.matchDuration !== "N/A" && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-[#b8956b]" />
                  <span>匹配有效期：<strong>{policy.matchDuration}</strong></span>
                </div>
              )}

              <div className="mt-3 rounded-lg bg-[#f9fafb] p-3">
                <p className="text-xs font-medium text-[#1a1a1a]">如何申请</p>
                <p className="mt-1 text-xs text-[#6b7280]">{policy.howToApply}</p>
                {policy.link && (
                  <a
                    href={policy.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#b8956b] hover:underline"
                  >
                    官方页面 <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {policy.tips.length > 0 && (
                <div className="mt-3 space-y-1">
                  {policy.tips.map((tip, i) => (
                    <p key={i} className="flex items-start gap-2 text-xs text-[#6b7280]">
                      <span className="mt-0.5 text-[#b8956b]">•</span>
                      {tip}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
          })}
        </div>

        {/* Alliance note */}
        <div className="mt-12 rounded-xl border border-[#b8956b]/30 bg-[#faf6f0] p-8 text-center">
          <h3 className="font-serif text-xl font-semibold">三大航空联盟互认</h3>
          <p className="mt-3 max-w-xl mx-auto text-sm text-[#6b7280]">
            即便无法直接 Status Match，三大联盟内的金卡/白金卡权益在所有成员航司通用：
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {(["star-alliance", "skyteam", "oneworld"] as AirlineAllianceSlug[]).map((alliance) => {
              const titles: Record<AirlineAllianceSlug, string> = {
                "star-alliance": "星空联盟 Star Alliance",
                skyteam: "天合联盟 SkyTeam",
                oneworld: "寰宇一家 oneworld",
              };
              const descs: Record<AirlineAllianceSlug, string> = {
                "star-alliance": "金卡 = 优先值机/额外行李/休息室",
                skyteam: "超级精英 = 所有成员航司休息室",
                oneworld: "蓝宝石 = 商务舱休息室全球通用",
              };
              return (
                <div key={alliance} className="rounded-xl bg-white border border-[#e8e8e8] p-4 min-w-[220px]">
                  <div className="flex items-center gap-2">
                    <AllianceLogo alliance={alliance} size="sm" showLabel={false} />
                    <p className="font-semibold">{titles[alliance]}</p>
                  </div>
                  <p className="mt-2 text-xs text-[#6b7280]">{descs[alliance]}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ALLIANCE_MEMBER_SAMPLES[alliance].map((iata) => {
                      const al = getAirline(iata);
                      return (
                        <AirlineInline
                          key={iata}
                          iata={al.iata}
                          nameZh={al.nameZh}
                          size="xs"
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
