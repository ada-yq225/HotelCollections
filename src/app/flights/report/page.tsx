import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { FlightReportForm } from "@/components/flights/FlightReportForm";

export default async function FlightReportPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-serif text-4xl">飞行报告</h1>
      <p className="mt-2 text-[#6b7280]">
        分享你的飞行体验——座椅、餐食、服务、娱乐、贵宾室
      </p>

      <FlightReportForm />
    </div>
  );
}
