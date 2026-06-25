"use client";

import { useCallback, useEffect, useState } from "react";
import { DEPARTURE_STORAGE_KEY, findNearestDepartureAirport } from "@/lib/travel";
import { getAirportByIata, type Airport } from "@/data/airports";

export function useDepartureAirport() {
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
    if (ap) {
      localStorage.setItem(DEPARTURE_STORAGE_KEY, iata);
      setDepartureState(ap);
    }
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
          setDeparture(ap.iata);
          resolve(ap);
        },
        () => resolve(null),
        { timeout: 10000, maximumAge: 300000 }
      );
    });
  }, [setDeparture]);

  const clearDeparture = useCallback(() => {
    localStorage.removeItem(DEPARTURE_STORAGE_KEY);
    setDepartureState(null);
  }, []);

  return { departure, setDeparture, detectLocation, clearDeparture, ready };
}