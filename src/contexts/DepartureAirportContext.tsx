"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEPARTURE_STORAGE_KEY, findNearestDepartureAirport } from "@/lib/travel";
import { getAirportByIata, type Airport } from "@/data/airports";

type DepartureAirportContextValue = {
  departure: Airport | null;
  ready: boolean;
  setDeparture: (iata: string) => void;
  detectLocation: () => Promise<Airport | null>;
  clearDeparture: () => void;
};

const DepartureAirportContext = createContext<DepartureAirportContextValue | null>(null);

export function DepartureAirportProvider({ children }: { children: ReactNode }) {
  const [departure, setDepartureState] = useState<Airport | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(DEPARTURE_STORAGE_KEY);
    if (saved) {
      const ap = getAirportByIata(saved);
      if (ap) setDepartureState(ap);
    }
    setReady(true);
  }, []);

  const setDeparture = useCallback((iata: string) => {
    const ap = getAirportByIata(iata);
    if (!ap) return;
    localStorage.setItem(DEPARTURE_STORAGE_KEY, iata);
    setDepartureState(ap);
    window.dispatchEvent(new CustomEvent("hc-departure-changed", { detail: iata }));
  }, []);

  const detectLocation = useCallback((): Promise<Airport | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const ap = findNearestDepartureAirport(pos.coords.latitude, pos.coords.longitude);
          localStorage.setItem(DEPARTURE_STORAGE_KEY, ap.iata);
          setDepartureState(ap);
          window.dispatchEvent(new CustomEvent("hc-departure-changed", { detail: ap.iata }));
          resolve(ap);
        },
        () => resolve(null),
        { timeout: 10000, maximumAge: 300000 }
      );
    });
  }, []);

  const clearDeparture = useCallback(() => {
    localStorage.removeItem(DEPARTURE_STORAGE_KEY);
    setDepartureState(null);
    window.dispatchEvent(new CustomEvent("hc-departure-changed", { detail: null }));
  }, []);

  const value = useMemo(
    () => ({ departure, ready, setDeparture, detectLocation, clearDeparture }),
    [departure, ready, setDeparture, detectLocation, clearDeparture]
  );

  return (
    <DepartureAirportContext.Provider value={value}>{children}</DepartureAirportContext.Provider>
  );
}

export function useDepartureAirport() {
  const ctx = useContext(DepartureAirportContext);
  if (!ctx) {
    throw new Error("useDepartureAirport must be used within DepartureAirportProvider");
  }
  return ctx;
}