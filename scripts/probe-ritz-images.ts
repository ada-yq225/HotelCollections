const UA = "Mozilla/5.0 Chrome/122";
const HOTELS = [
  ["beijing", "https://www.ritzcarlton.com/en/hotels/beijing"],
  ["singapore", "https://www.ritzcarlton.com/en/hotels/singapore"],
  ["tokyo", "https://www.ritzcarlton.com/en/hotels/tokyo"],
];

async function main() {
  for (const [name, url] of HOTELS) {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25000) });
    const html = await res.text();
    const og =
      html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
    const propertyImgs = [
      ...(html.match(/https:\/\/cache\.marriott\.com\/[^"'\s]+/gi) ?? []),
    ].filter((u) => !u.includes("rc-club-ap-lifestyle") && !u.includes("brand"));
    const unique = [...new Set(propertyImgs)].slice(0, 4);
    console.log(`\n${name} status=${res.status} og=${og?.slice(0, 80)}`);
    unique.forEach((u) => console.log(" ", u.slice(0, 100)));
  }
}
main();