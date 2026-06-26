/**
 * Scrape flight fares from OTA / airline snippets via Bing.
 * Updates src/data/flight-prices-scraped.json
 *
 * Usage:
 *   npx tsx scripts/scrape-flight-prices.ts
 *   npx tsx scripts/scrape-flight-prices.ts --route=PEK-PVG
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { DIRECT_ROUTE_MINUTES } from "../src/data/flight-routes";
import { PREMIUM_CABIN_PRODUCTS } from "../src/data/flight-cabin-products";
import {
  scrapeFlightFareCny,
  validateFlightFareCny,
  type FlightCabinKind,
  type ScrapedFlightFare,
} from "../src/lib/flight-ota-price";

const OUT = join(__dirname, "../src/data/flight-prices-scraped.json");
const DELAY_MS = 700;

type RouteCache = Record<
  string,
  Partial<Record<FlightCabinKind, ScrapedFlightFare>>
>;

type PremiumCache = Record<string, ScrapedFlightFare>;

type FileShape = RouteCache & PremiumCache;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function load(): FileShape {
  if (!existsSync(OUT)) return {};
  return JSON.parse(readFileSync(OUT, "utf-8")) as FileShape;
}

function allRoutes(): string[] {
  const keys = new Set<string>();
  for (const key of Object.keys(DIRECT_ROUTE_MINUTES)) {
    keys.add(key);
    const [a, b] = key.split("-");
    keys.add(`${b}-${a}`);
  }
  return [...keys].sort();
}

async function main() {
  const routeFilter = process.argv.find((a) => a.startsWith("--route="))?.split("=")[1];
  const cache = load();
  const routes = routeFilter ? [routeFilter] : allRoutes();
  const cabins: FlightCabinKind[] = ["economy", "business"];

  let updated = 0;
  console.log(`Scraping ${routes.length} routes × ${cabins.length} cabins...`);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const [from, to] = route.split("-");
    if (!from || !to) continue;

    if (!cache[route] || typeof cache[route] !== "object") {
      cache[route] = {};
    }
    const entry = cache[route] as Partial<Record<FlightCabinKind, ScrapedFlightFare>>;

    for (const cabin of cabins) {
      if (entry[cabin]?.priceCny) continue;
      const fare = await scrapeFlightFareCny(from, to, cabin);
      if (fare && validateFlightFareCny(fare.priceCny, from, to, cabin) != null) {
        entry[cabin] = fare;
        updated++;
        console.log(`  [${i + 1}/${routes.length}] ${route} ${cabin}: ¥${fare.priceCny} (${fare.source})`);
      } else if (fare) {
        console.log(`  [reject] ${route} ${cabin}: ¥${fare.priceCny}`);
      }
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nScraping ${PREMIUM_CABIN_PRODUCTS.length} premium cabin products...`);
  for (const product of PREMIUM_CABIN_PRODUCTS) {
    if (cache[product.id]?.priceCny) continue;
    const leg = product.legRoutes[0];
    if (!leg) continue;
    const [from, to] = leg.split("-");
    const fare = await scrapeFlightFareCny(from, to, "premium", `${product.nameZh} ${product.name}`);
    if (fare) {
      cache[product.id] = fare;
      updated++;
      console.log(`  ${product.id}: ¥${fare.priceCny} (${fare.source})`);
    } else {
      console.log(`  ${product.id}: no price`);
    }
    await sleep(DELAY_MS);
  }

  writeFileSync(OUT, JSON.stringify(cache, null, 2) + "\n");
  console.log(`\nDone. updated=${updated} → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});