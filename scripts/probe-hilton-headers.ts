const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

const URLS = [
  "https://www.hilton.com/en/hotels/bkkcici-conrad-bangkok/",
  "https://www.hilton.com/en/hotels/sinwawa-waldorf-astoria-singapore/",
  "https://www.marriott.com/en-us/hotels/sinxr-the-st-regis-singapore/overview/",
  "https://www.ihg.com/intercontinental/hotels/gb/en/singapore/sinhb-intercontinental-singapore/hoteldetail",
  "https://www.hyatt.com/en-US/hotel/japan/tokyo/park-hyatt-tokyo/tyoph",
];

async function main() {
  for (const url of URLS) {
    try {
      const res = await fetch(url, { headers: HEADERS, redirect: "follow" });
      const html = await res.text();
      const og =
        html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
        html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
      const imgs = (html.match(/https:\/\/[^"'\s]+\.(?:jpg|jpeg|webp)/gi) ?? []).slice(0, 3);
      console.log(res.status, url.slice(0, 60), "len", html.length, "og", og?.slice(0, 50), "imgs", imgs.length);
    } catch (e) {
      console.log("ERR", url, (e as Error).message);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
}
main();