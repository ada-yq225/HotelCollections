import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { FlightCheckinForm } from "@/components/flights/FlightCheckinForm";

export default async function FlightCheckinPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-serif text-4xl">飞行打卡</h1>
      <p className="mt-2 text-[#6b7280]">
        记录每一次飞行，上传登机牌，构建你的飞行航线图
      </p>

      <FlightCheckinForm />
    </div>
  );
}
