import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTradeTypeLabel } from "@/lib/club";
import { KeycardOfferForm } from "./KeycardOfferForm";
import { Crown, ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export default async function KeycardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  const keycard = await prisma.keycard.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, isPlus: true } },
      hotel: { include: { brand: { include: { group: true } } } },
      brand: true,
      offers: {
        include: { user: { select: { id: true, name: true, isPlus: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!keycard) notFound();

  const isOwner = user?.id === keycard.userId;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/club/keycards" className="inline-flex items-center gap-1 text-sm text-[#6b7280]">
        <ArrowLeft className="h-4 w-4" /> 返回房卡交流
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#e8e8e8] bg-[#fafafa]">
        <img src={keycard.imageUrl} alt={keycard.title} className="w-full object-contain max-h-[400px]" />
      </div>

      <div className="mt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-[#1a1a1a] px-3 py-0.5 text-xs text-white">
              {getTradeTypeLabel(keycard.tradeType)}
            </span>
            <h1 className="mt-3 font-serif text-3xl">{keycard.title}</h1>
            {(keycard.hotel || keycard.brand) && (
              <p className="mt-2 text-[#6b7280]">
                {keycard.hotel?.nameZh || keycard.hotel?.name || keycard.brand?.nameZh}
                {keycard.year ? ` · ${keycard.year}` : ""}
              </p>
            )}
          </div>
          <div className="text-right text-sm">
            <div className="flex items-center justify-end gap-1">
              {keycard.user.isPlus && <Crown className="h-4 w-4 text-[#b8956b]" />}
              <span className="font-medium">{keycard.user.name}</span>
            </div>
          </div>
        </div>

        {keycard.description && (
          <p className="mt-4 leading-relaxed text-[#374151]">{keycard.description}</p>
        )}

        {!isOwner && keycard.tradeType !== "display" && user && (
          <div className="mt-8">
            <KeycardOfferForm keycardId={keycard.id} tradeType={keycard.tradeType} />
          </div>
        )}

        {!user && keycard.tradeType !== "display" && (
          <Link href="/login" className="hc-btn-primary mt-8 inline-block text-sm">
            登录后发起交换意向
          </Link>
        )}

        {keycard.offers.length > 0 && isOwner && (
          <div className="mt-8">
            <h3 className="font-serif text-xl">交换意向 · {keycard.offers.length}</h3>
            <div className="mt-4 space-y-3">
              {keycard.offers.map((o) => (
                <div key={o.id} className="hc-card p-4">
                  <div className="flex items-center gap-2">
                    {o.user.isPlus && <Crown className="h-3 w-3 text-[#b8956b]" />}
                    <span className="text-sm font-medium">{o.user.name}</span>
                    <span className="text-xs text-[#9ca3af]">
                      {new Date(o.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                  {o.message && <p className="mt-2 text-sm text-[#6b7280]">{o.message}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}