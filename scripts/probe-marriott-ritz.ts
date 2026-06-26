const URLS = [
  "https://www.marriott.com/en-us/hotels/beirz-the-ritz-carlton-beijing/overview/",
  "https://www.marriott.com/en-us/hotels/sharz-the-ritz-carlton-shanghai-pudong/overview/",
  "https://www.ritzcarlton.com/en/hotels/washington-dc",
  "https://www.ritzcarlton.com/en/hotels/half-moon-bay",
  "https://www.ritzcarlton.com/en/hotels/new-york-central-park",
];

async function main() {
  for (const url of URLS) {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(20000) });
    const html = await res.text();
    const og =
      html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
    const gen = og?.includes("lifestyle") || og?.includes("gvarz");
    console.log(res.status, url.slice(40, 90), gen ? "GENERIC" : "OK", og?.slice(55, 110) ?? `len=${html.length}`);
  }
}
main();