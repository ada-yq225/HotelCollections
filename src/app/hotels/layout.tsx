import { DepartureAirportProvider } from "@/contexts/DepartureAirportContext";

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return <DepartureAirportProvider>{children}</DepartureAirportProvider>;
}