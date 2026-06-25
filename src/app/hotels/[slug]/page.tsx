import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import { getHotelBySlug, ensureHotelEnriched } from "@/lib/hotels";
import { parseGalleryImages } from "@/lib/hotel-enrichment";
import { SIGNATURE_GROUPS } from "@/data/destinations";
import { HotelProfile } from "@/components/hotels/HotelProfile";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = await getHotelBySlug(slug);
  if (!raw || !raw.isActive) notFound();

  const hotel = await ensureHotelEnriched(raw);
  const galleryImages = parseGalleryImages(hotel.galleryImages);

  const groupSlug = hotel.brand.group.slug;
  const isSignature = SIGNATURE_GROUPS.includes(
    groupSlug as (typeof SIGNATURE_GROUPS)[number]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/hotels"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#b8956b]"
      >
        <ArrowLeft className="h-4 w-4" />
        返回酒店库
      </Link>

      <div className="hc-card overflow-hidden">
        <div className="p-8 pb-0">
          <div className="mb-4 flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: hotel.brand.group.logoColor ?? "#b8956b" }}
            />
            {isSignature ? (
              <Link
                href={`/groups/${groupSlug}`}
                className="text-sm text-[#b8956b] hover:underline"
              >
                {hotel.brand.group.nameZh}
              </Link>
            ) : (
              <span className="text-sm text-[#6b7280]">{hotel.brand.group.nameZh}</span>
            )}
            <span className="text-[#d4d4d4]">·</span>
            <span className="text-sm text-[#6b7280]">{hotel.brand.nameZh}</span>
          </div>

          <h1 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
            {hotel.nameZh || hotel.name}
          </h1>
          {hotel.nameZh && (
            <p className="mt-2 text-[#6b7280]">{hotel.name}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#6b7280]">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#b8956b]" />
              {hotel.cityZh || hotel.city} · {hotel.country}
            </span>
            {hotel.openedYear && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#b8956b]" />
                {hotel.openedYear} 年开业
              </span>
            )}
          </div>
        </div>

        <div className="p-8">
          <HotelProfile
            nameZh={hotel.nameZh || hotel.name}
            name={hotel.name}
            descriptionZh={hotel.descriptionZh}
            description={hotel.description}
            notes={hotel.notes}
            heroImage={hotel.heroImage}
            galleryImages={galleryImages}
            websiteUrl={hotel.websiteUrl}
          />
        </div>

        <div className="border-t border-[#e8e8e8] px-8 py-6">
          <div className="flex flex-wrap gap-3">
            <Link href={`/checkin?hotel=${hotel.id}`} className="hc-btn-primary">
              打卡入住
            </Link>
            <Link
              href={`/book?hotel=${hotel.id}&source=detail`}
              className="rounded-full border border-[#e8e8e8] px-5 py-2.5 text-sm transition hover:border-[#b8956b]"
            >
              礼遇预订
            </Link>
            <Link
              href={`/map?focus=${hotel.id}`}
              className="rounded-full border border-[#e8e8e8] px-5 py-2.5 text-sm text-[#6b7280] transition hover:border-[#b8956b]"
            >
              地图定位
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}