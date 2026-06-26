async function probe(url: string): Promise<void> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();
    const og =
      html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
    const imgs = (html.match(/https:\/\/cache\.marriott\.com\/[^"'\s]+/g) ?? []).slice(0, 2);
    console.log(`${res.status} ${url}`);
    console.log(`  final: ${res.url.slice(0, 90)}`);
    console.log(`  og: ${og?.slice(0, 90) ?? "none"}`);
    if (imgs.length) console.log(`  marriott: ${imgs[0].slice(0, 90)}`);
  } catch (e) {
    console.log(`ERR ${url}: ${(e as Error).message}`);
  }
}

const urls = [
  "https://www.ritzcarlton.com/en/hotels/japan/tokyo/ritz-carlton-tokyo",
  "https://www.ritzcarlton.com/en/hotels/tyoqr-the-ritz-carlton-tokyo/overview/",
  "https://www.ritzcarlton.com/en/hotels/singapore/singapore/ritz-carlton-singapore",
  "https://www.peninsula.com/en/tokyo/5-star-luxury-hotel-ginza",
  "https://www.peninsula.com/en/hong-kong/5-star-luxury-hotel-kowloon",
  "https://www.shangri-la.com/singapore/shangrila/",
  "https://www.shangri-la.com/tokyo/shangrila/",
  "https://www.fairmont.com/en/hotels/singapore/fairmont-singapore.html",
  "https://www.fairmont.com/en/hotels/bali/fairmont-sanur-beach-bali.html",
  "https://www.hyatt.com/en-US/hotel/indonesia/bali/park-hyatt-bali",
  "https://www.ihg.com/intercontinental/hotels/us/en/singapore/sinhb-intercontinental-singapore/photos",
  "https://www.hilton.com/en/hotels/bkkcici-conrad-bangkok/",
  "https://www.hilton.com/en/hotels/sinwawa-waldorf-astoria-singapore/",
  "https://www.marriott.com/en-us/hotels/bkkwi-w-bangkok/overview/",
  "https://www.marriott.com/en-us/hotels/sinxr-the-st-regis-singapore/overview/",
  "https://capellahotels.com/en/capella-hotels-and-resorts/singapore",
  "https://www.oneandonlyresorts.com/maldives",
  "https://www.belmond.com/hotels/europe/italy/amalfi-coast/hotel-caruso",
];

async function main() {
  for (const u of urls) {
    await probe(u);
    await new Promise((r) => setTimeout(r, 500));
  }
}

main();