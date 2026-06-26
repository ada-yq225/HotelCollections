/** Known direct routes: "DEP-DST" → flight time in minutes */
export const DIRECT_ROUTE_MINUTES: Record<string, number> = {
  // China domestic / regional
  "PEK-PVG": 130,
  "PEK-CAN": 195,
  "PEK-SZX": 185,
  "PEK-HKG": 210,
  "PVG-HKG": 150,
  "PVG-CAN": 165,
  "CAN-HKG": 75,
  "SZX-HKG": 60,
  "PEK-SYX": 255,
  "PVG-SYX": 210,
  "CTU-SYX": 165,
  "PEK-CTU": 165,
  "PVG-CTU": 185,
  "PEK-XIY": 135,
  "PVG-NRT": 170,
  "PEK-NRT": 210,
  "PVG-ICN": 95,
  "PEK-ICN": 125,
  "HKG-TPE": 90,
  "PVG-SIN": 330,
  "PEK-SIN": 360,
  "CAN-SIN": 240,
  "HKG-SIN": 240,
  "PVG-BKK": 270,
  "PEK-BKK": 300,
  "CAN-BKK": 180,
  "HKG-BKK": 165,
  "PVG-DPS": 360,
  "PEK-DPS": 390,
  "SIN-DPS": 150,
  "HKG-DPS": 285,
  "PVG-HKT": 300,
  "HKG-HKT": 195,
  "BKK-HKT": 85,
  "SIN-HKT": 120,
  // Middle East hubs
  "PEK-DXB": 510,
  "PVG-DXB": 540,
  "CAN-DXB": 480,
  "HKG-DXB": 450,
  "PEK-DOH": 540,
  "PVG-DOH": 570,
  "DXB-DOH": 60,
  // Hub → resort
  "DXB-MLE": 255,
  "DOH-MLE": 270,
  "SIN-MLE": 255,
  "HKG-MLE": 285,
  "BKK-MLE": 255,
  "DXB-MRU": 390,
  "DXB-CPT": 510,
  "DXB-NBO": 300,
  "DXB-SEZ": 270,
  "DOH-MRU": 405,
  "SIN-MRU": 330,
  "HKG-MRU": 360,
  "SIN-CGK": 105,
  "SIN-BKK": 150,
  "HKG-PPT": 660,
  "NRT-PPT": 600,
  "LAX-PPT": 480,
  "AKL-PPT": 300,
  "SYD-PPT": 330,
  "HNL-PPT": 330,
  "HKG-NAN": 600,
  "SYD-NAN": 240,
  "AKL-NAN": 180,
  "LAX-HNL": 330,
  "HKG-HNL": 540,
  "NRT-HNL": 420,
  "PEK-IST": 600,
  "PVG-IST": 630,
  "IST-BJV": 75,
  "ATH-JTR": 45,
  "ATH-BJV": 60,
  "DXB-IST": 270,
  "LHR-DXB": 420,
  "CDG-DXB": 390,
  "PEK-LHR": 660,
  "PVG-LHR": 720,
  "PEK-CDG": 690,
  "HKG-LHR": 780,
  "JFK-LHR": 420,
  "LAX-NRT": 660,
  "HKG-NRT": 270,
  "PEK-JFK": 810,
  "PVG-JFK": 840,
  "MIA-SXM": 150,
  "JFK-MIA": 165,
  "PEK-AUH": 540,
  "PVG-AUH": 570,
  "HKG-AUH": 510,
  "AUH-LHR": 420,
  "AUH-MLE": 270,
  "DXB-PPT": 1020,
  "SIN-PPT": 780,
  // Direct to destinations (less common)
  "PEK-CPT": 840,
  "PVG-NBO": 660,
  "CAN-DPS": 255,
  "PEK-PQC": 270,
  "SGN-PQC": 60,
  "SGN-HAN": 120,
  "HKG-USM": 210,
  "BKK-USM": 75,
};

/** Primary transfer hubs for routing */
export const ROUTING_HUBS = ["SIN", "HKG", "DXB", "DOH", "AUH", "BKK", "IST", "NRT", "ICN", "LHR", "CDG"] as const;

/** Hubs that make geographic sense for routes involving China */
export const CHINA_RELEVANT_HUBS: readonly string[] = ["HKG", "SIN", "BKK", "NRT", "ICN"] as const;

/** Pure domestic China routes — no international hubs needed */
export const CHINA_DOMESTIC_HUBS: readonly string[] = ["HKG"] as const;

/** Check if both airports are in mainland China (domestic route) */
export function isChinaDomesticRoute(depCountry: string, destCountry: string): boolean {
  return depCountry === "CN" && destCountry === "CN";
}

/** Get appropriate hubs for a given route */
export function getRoutingHubs(depCountry: string, destCountry: string): readonly string[] {
  if (isChinaDomesticRoute(depCountry, destCountry)) return CHINA_DOMESTIC_HUBS;
  if (depCountry === "CN" || destCountry === "CN") return CHINA_RELEVANT_HUBS;
  return ROUTING_HUBS;
}

export function routeKey(a: string, b: string): string {
  return `${a}-${b}`;
}

export function getDirectMinutes(from: string, to: string): number | null {
  const key = routeKey(from, to);
  if (DIRECT_ROUTE_MINUTES[key] != null) return DIRECT_ROUTE_MINUTES[key];
  const reverse = routeKey(to, from);
  if (DIRECT_ROUTE_MINUTES[reverse] != null) return DIRECT_ROUTE_MINUTES[reverse];
  return null;
}