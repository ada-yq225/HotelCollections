import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { FlightJourneyDashboard } from "@/components/flights/FlightJourneyDashboard";

export default async function FlightJourneyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl">飞行足迹</h1>
          <p className="mt-2 text-[#6b7280]">航线网络图 · 飞行统计 · 航司收藏</p>
        </div>
      </div>

      <div className="mt-8">
        <FlightJourneyDashboard />
      </div>
    </div>
  );
}
