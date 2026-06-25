import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getGroupBySlug, getHotelsByGroupSlug } from "@/lib/hotels";
import { SIGNATURE_GROUPS } from "@/data/destinations";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!SIGNATURE_GROUPS.includes(slug as (typeof SIGNATURE_GROUPS)[number])) {
    notFound();
  }

  const [group, hotels] = await Promise.all([
    getGroupBySlug(slug),
    getHotelsByGroupSlug(slug),
  ]);

  if (!group) notFound();

  const byCountry = hotels.reduce<Record<string, typeof hotels>>((acc, h) => {
    const key = h.country;
    if (!acc[key]) acc[key] = [];
    acc[key].push(h);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/hotels"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#b8956b]"
      >
        <ArrowLeft className="h-4 w-4" />
        返回酒店库
      </Link>

      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: group.logoColor ?? "#b8956b" }}
          />
          <p className="text-sm tracking-[0.2em] text-[#b8956b] uppercase">
            Signature Collection
          </p>
        </div>
        <h1 className="font-serif text-4xl font-semibold">{group.nameZh}</h1>
        <p className="mt-2 text-[#6b7280]">
          {group.name} · 全球 {hotels.length} 家在营酒店
        </p>
      </div>

      {Object.entries(byCountry).map(([country, countryHotels]) => (
        <section key={country} className="mb-10">
          <h2 className="mb-4 text-sm font-medium tracking-wide text-[#6b7280] uppercase">
            {country}
            <span className="ml-2 text-[#9ca3af]">({countryHotels.length})</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {countryHotels.map((h) => (
              <Link
                key={h.id}
                href={`/hotels/${h.slug}`}
                className="hc-card block p-5"
              >
                <h3 className="font-medium leading-snug">{h.nameZh || h.name}</h3>
                <p className="mt-1 text-sm text-[#6b7280]">{h.brand.nameZh}</p>
                <p className="mt-2 text-xs text-[#9ca3af]">
                  {h.cityZh || h.city}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}