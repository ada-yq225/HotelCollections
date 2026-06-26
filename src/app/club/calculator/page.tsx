import Link from "next/link";
import { Calculator } from "lucide-react";
import { PointsCalculator } from "@/components/loyalty/PointsCalculator";

export default function CalculatorPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#e8e8e8] bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#faf6f0_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <p className="mb-3 text-xs font-medium tracking-[0.25em] text-[#b8956b] uppercase">Calculator</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">积分里程计算器</h1>
          <p className="mt-3 max-w-lg text-[#6b7280]">
            输入住宿或飞行消费金额，实时计算各集团/航司可获积分与里程。含精英加赠、里程碑奖励与信用卡推荐。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <PointsCalculator />
      </div>
    </div>
  );
}
