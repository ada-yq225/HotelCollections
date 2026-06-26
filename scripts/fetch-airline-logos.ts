/**
 * Download airline tail logos (Kiwi CDN — industry-standard official marks)
 * and alliance official logos (Wikimedia Commons).
 *
 * Usage: npx tsx scripts/fetch-airline-logos.ts
 */
import fs from "fs";
import path from "path";
import { AIRLINES } from "../src/data/airlines";

const ROOT = path.join(process.cwd(), "public");
const AIRLINE_DIR = path.join(ROOT, "airlines");
const ALLIANCE_DIR = path.join(ROOT, "alliances");

const ALLIANCE_SOURCES: Record<string, string> = {
  "star-alliance":
    "https://upload.wikimedia.org/wikipedia/commons/d/d8/Star_Alliance_Logo.svg",
  skyteam:
    "https://upload.wikimedia.org/wikipedia/commons/9/90/Skyteam_Logo_Alliance.svg",
  oneworld:
    "https://upload.wikimedia.org/wikipedia/commons/3/31/Oneworld_logo.svg",
};

async function fetchBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; H&C-HotelCollection/1.0; +https://github.com/ada-yq225/HotelCollections)",
      },
    });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function main() {
  fs.mkdirSync(AIRLINE_DIR, { recursive: true });
  fs.mkdirSync(ALLIANCE_DIR, { recursive: true });

  const iatas = Object.keys(AIRLINES);
  let airlineOk = 0;
  let airlineFail = 0;

  for (const iata of iatas) {
    const out = path.join(AIRLINE_DIR, `${iata}.png`);
    if (fs.existsSync(out) && fs.statSync(out).size > 500) {
      airlineOk++;
      continue;
    }
    const buf = await fetchBuffer(`https://images.kiwi.com/airlines/128/${iata}.png`);
    if (buf && buf.length > 200) {
      fs.writeFileSync(out, buf);
      airlineOk++;
      process.stdout.write(`  ✓ ${iata}\n`);
    } else {
      airlineFail++;
      process.stdout.write(`  ✗ ${iata}\n`);
    }
    await new Promise((r) => setTimeout(r, 80));
  }

  let allianceOk = 0;
  for (const [slug, url] of Object.entries(ALLIANCE_SOURCES)) {
    const out = path.join(ALLIANCE_DIR, `${slug}.svg`);
    if (fs.existsSync(out) && fs.statSync(out).size > 500) {
      allianceOk++;
      console.log(`  alliance ✓ ${slug} (cached)`);
      continue;
    }
    const buf = await fetchBuffer(url);
    if (buf && buf.length > 100) {
      fs.writeFileSync(out, buf);
      allianceOk++;
      console.log(`  alliance ✓ ${slug}`);
    } else {
      console.log(`  alliance ✗ ${slug} (kept existing if any)`);
      if (fs.existsSync(out) && fs.statSync(out).size > 100) allianceOk++;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  const manifest: Record<string, boolean> = {};
  for (const iata of iatas) {
    const p = path.join(AIRLINE_DIR, `${iata}.png`);
    manifest[iata] = fs.existsSync(p) && fs.statSync(p).size > 200;
  }

  const manifestPath = path.join(process.cwd(), "src", "lib", "airline-logo-files.ts");
  const lines = [
    "/** Auto-generated — run: npx tsx scripts/fetch-airline-logos.ts */",
    "export const AIRLINE_LOGO_FILES: Record<string, boolean> = {",
    ...Object.entries(manifest)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `  "${k}": ${v},`),
    "};",
    "",
    "export const ALLIANCE_LOGO_FILES = {",
    '  "star-alliance": "svg",',
    '  skyteam: "svg",',
    '  oneworld: "svg",',
    "} as const;",
    "",
    "export type AirlineAllianceSlug = keyof typeof ALLIANCE_LOGO_FILES;",
    "",
  ];
  fs.writeFileSync(manifestPath, lines.join("\n"));

  console.log(`\nAirlines: ${airlineOk} ok, ${airlineFail} failed`);
  console.log(`Alliances: ${allianceOk}/3`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});