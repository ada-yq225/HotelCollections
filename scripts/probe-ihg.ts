import { extractScrapedBasePriceCny } from "../src/lib/hotel-price-scrape";
import { isBadImageUrl } from "../src/lib/hotel-cover-image";

const URLS = [
  "https://www.ihg.com/intercontinental/hotels/us/en/singapore/intercontinental-singapore/hoteldetail",
  "https://www.ihg.com/intercontinental/hotels/gb/en/singapore/sinhb-intercontinental-singapore/hoteldetail",
  "https://www.ihg.com/intercontinental/hotels/us/en/singapore/intercontinental-singapore/photos",
];

async function main() {
  for (const url of URLS) {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 Chrome/122", Accept: "text/html" },
      redirect: "follow",
    });
    const html = await res.text();
    const imgs = html.match(/https:\/\/digital\.ihg\.com[^"'\s]+/g) ?? [];
    const og =
      html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
    const price = extractScrapedBasePriceCny(html);
    console.log(res.status, url.split("/").slice(-3).join("/"), "len", html.length);
    console.log("  og", og?.slice(0, 60));
    console.log("  ihg imgs", imgs.filter((u) => !isBadImageUrl(u)).slice(0, 2));
    console.log("  price", price);
  }
}
main();