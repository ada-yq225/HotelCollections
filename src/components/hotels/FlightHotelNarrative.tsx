import Link from "next/link";
import { Plane, ArrowRight } from "lucide-react";

const REGION_ROUTES: Record<string, { route: string; cabin: string; narrative: string }[]> = {
  maldives: [
    { route: "PEK-MLE", cabin: "商务舱", narrative: "北京直飞马累 + 水上飞机接驳，搭配瑞吉/丽思水上别墅" },
    { route: "PVG-MLE", cabin: "头等舱", narrative: "东航/新航联程，上海出发经新加坡转机马累" },
  ],
  japan: [
    { route: "PEK-NRT", cabin: "商务舱", narrative: "国航/全日空商务，东京柏悦/安缦东京 2-3 晚城市奢华" },
    { route: "SHA-HND", cabin: "特色舱位", narrative: "上海虹桥-羽田，搭配京都悦榕庄或箱根温泉酒店" },
  ],
  safari: [
    { route: "PVG-NBO", cabin: "商务舱", narrative: "内罗毕入境 + 轻型飞机接驳营地，Singita 游猎 4 晚" },
  ],
  bali: [
    { route: "PVG-DPS", cabin: "商务舱", narrative: "直飞登巴萨，搭配乌布 COMO / 水明漾 W 酒店" },
  ],
  europe: [
    { route: "PEK-CDG", cabin: "头等舱", narrative: "法航/国航头等，巴黎瑰丽 + 南法罗莱夏朵庄园" },
    { route: "PVG-LHR", cabin: "商务舱", narrative: "伦敦文华东方 + Cotswolds 乡村酒店联程" },
  ],
};

const DEFAULT_ROUTES = [
  { route: "PEK-SIN", cabin: "商务舱", narrative: "经新加坡枢纽中转，搭配东南亚海岛或城市奢华酒店" },
  { route: "PVG-HKG", cabin: "特色舱位", narrative: "沪港快线 + 香港半岛/文华东方周末度假" },
];

export function FlightHotelNarrative({
  region,
  hotelName,
  cityZh,
}: {
  region: string;
  hotelName: string;
  cityZh: string;
}) {
  const routes = REGION_ROUTES[region] ?? DEFAULT_ROUTES;

  return (
    <section className="rounded-2xl border border-[#e8e8e8] bg-gradient-to-r from-[#f8fafc] to-[#faf6f0] p-6">
      <div className="flex items-center gap-2">
        <Plane className="h-5 w-5 text-[#b8956b]" />
        <h2 className="font-serif text-xl font-semibold">联程灵感</h2>
      </div>
      <p className="mt-1 text-sm text-[#6b7280]">
        特色舱位 × {hotelName}（{cityZh}）行程叙事
      </p>
      <ul className="mt-4 space-y-3">
        {routes.map((r) => (
          <li key={r.route} className="rounded-xl bg-white/80 p-4 ring-1 ring-[#f0f0f0]">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-medium">{r.route}</span>
              <span className="rounded-full bg-[#faf6f0] px-2 py-0.5 text-xs text-[#b8956b]">
                {r.cabin}
              </span>
            </div>
            <p className="mt-2 text-sm text-[#374151]">{r.narrative}</p>
          </li>
        ))}
      </ul>
      <Link
        href="/flights"
        className="mt-4 inline-flex items-center gap-1 text-sm text-[#b8956b] hover:underline"
      >
        查看特色舱位机票 <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}