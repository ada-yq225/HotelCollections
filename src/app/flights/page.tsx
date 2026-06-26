import { FlightSearchPage } from "@/components/flights/FlightSearchPage";

export const metadata = {
  title: "机票查询 · H&C Hotel Collection",
  description: "查询前往全球度假目的地的航班方案，直飞优先",
};

export default function FlightsPage() {
  return <FlightSearchPage />;
}