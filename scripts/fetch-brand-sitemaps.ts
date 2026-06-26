async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function main() {
  const sources = [
    "https://www.ritzcarlton.com/sitemap.xml",
    "https://www.fairmont.com/sitemap.xml",
    "https://www.raffles.com/sitemap.xml",
    "https://www.shangri-la.com/sitemap.xml",
    "https://www.hyatt.com/sitemap.xml",
    "https://www.ihg.com/sitemap.xml",
  ];
  for (const url of sources) {
    const text = await fetchText(url);
    console.log(`\n${url}: ${text ? text.length + " bytes" : "FAIL"}`);
    if (text) {
      const hotelUrls = text.match(/https?:\/\/[^<\s]+/g)?.filter((u) =>
        /hotel|resort|property|overview/i.test(u)
      );
      console.log("  sample:", hotelUrls?.slice(0, 5));
    }
  }
}

main();