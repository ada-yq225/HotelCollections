const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122";

async function probe(label: string, url: string, opts?: RequestInit) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, ...(opts?.headers as Record<string, string>) },
      signal: AbortSignal.timeout(20000),
      ...opts,
    });
    const html = await res.text();
    const og =
      html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
    console.log(`${label}: ${res.status} len=${html.length} og=${og?.slice(0, 60) ?? "—"}`);
    return { status: res.status, html, og };
  } catch (e) {
    console.log(`${label}: ERR ${(e as Error).message}`);
    return null;
  }
}

async function main() {
  await probe(
    "wiki FS",
    "https://en.wikipedia.org/w/api.php?action=query&titles=Four_Seasons_Hotel_Hong_Kong&prop=pageimages&format=json&pithumbsize=1200"
  );
  await probe("ritz sitemap", "https://www.ritzcarlton.com/sitemap.xml");
  await probe("hyatt sitemap", "https://www.hyatt.com/sitemap.xml");
  await probe("bing", "https://www.bing.com/search?q=site:marriott.com+st+regis+singapore", {
    headers: { Accept: "text/html" },
  });
  await probe("hilton conrad", "https://www.hilton.com/en/hotels/bkkcici-conrad-bangkok/");
  await probe("ritz singapore", "https://www.ritzcarlton.com/en/hotels/singapore");
  await probe("conrad bangkok", "https://www.conradhotels.com/en/hotels/bangkok/conrad-bangkok/");
  await probe("waldorf singapore", "https://www.waldorfastoria.com/en/hotels/singapore/waldorf-astoria-singapore/");
  await probe("st regis bing", "https://www.bing.com/search?q=site:marriott.com+st+regis+singapore+overview");
  await probe("peninsula hk", "https://www.peninsula.com/en/hong-kong/5-star-luxury-hotel-kowloon");
  await probe("shangri-la hk", "https://www.shangri-la.com/hongkong/shangrila/");
}

main();