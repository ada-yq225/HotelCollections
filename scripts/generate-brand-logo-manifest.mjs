import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandsDir = path.join(__dirname, "../public/brands");
const outFile = path.join(__dirname, "../src/lib/brand-logo-files.ts");

const map = {};
for (const file of fs.readdirSync(brandsDir)) {
  const m = file.match(/^(.+)\.(svg|png)$/i);
  if (!m) continue;
  map[m[1]] = m[2].toLowerCase();
}

const lines = Object.entries(map)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([slug, ext]) => `  "${slug}": "${ext}",`)
  .join("\n");

const content = `/** Auto-generated — run: node scripts/generate-brand-logo-manifest.mjs */
export const BRAND_LOGO_FILES: Record<string, "svg" | "png"> = {
${lines}
};

export function getBrandLogoPath(slug: string): string | null {
  const ext = BRAND_LOGO_FILES[slug];
  return ext ? \`/brands/\${slug}.\${ext}\` : null;
}
`;

fs.writeFileSync(outFile, content);
console.log(`Generated ${Object.keys(map).length} logo entries → ${outFile}`);