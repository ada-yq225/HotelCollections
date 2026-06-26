import { DepartureAirportProvider } from "@/contexts/DepartureAirportContext";

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  return <DepartureAirportProvider>{children}</DepartureAirportProvider>;
}