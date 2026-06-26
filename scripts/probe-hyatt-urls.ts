const UA = "Mozilla/5.0 Chrome/122";
const URLS = [
  "https://www.hyatt.com/park-hyatt/en-US/tyoph-park-hyatt-tokyo",
  "https://www.hyatt.com/en-US/hotel/japan/tokyo/park-hyatt-tokyo/tyoph",
  "https://www.fairmont.com/singapore/",
  "https://www.sixsenses.com/en/hotels/maldives/kanuhura",
  "https://www.mandarinoriental.com/en/bangkok/chao-phraya-river",
];

async function main() {
  for (const url of URLS) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
      const html = await res.text();
      const og =
        html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
        html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
      console.log(res.status, url.slice(0, 65), "len", html.length, "og", og?.slice(0, 70) ?? "—");
    } catch (e) {
      console.log("ERR", url.slice(0, 50), (e as Error).message);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
}
main();