const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122";

async function bingUrls(query: string): Promise<string[]> {
  const res = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    signal: AbortSignal.timeout(20000),
  });
  const html = await res.text();
  const urls: string[] = [];
  for (const m of html.matchAll(/<a[^>]+href="(https?:\/\/[^"]+)"/gi)) {
    const u = m[1];
    if (!u.includes("bing.com") && !u.includes("microsoft.com")) urls.push(u);
  }
  for (const m of html.matchAll(/<cite[^>]*>([^<]+)<\/cite>/gi)) {
    const cite = m[1].replace(/<[^>]+>/g, "").trim();
    if (cite.startsWith("http")) urls.push(cite);
    else if (cite.includes(".")) urls.push(`https://${cite.split(" ")[0]}`);
  }
  return [...new Set(urls)];
}

async function main() {
  const queries = [
    "site:ritzcarlton.com Ritz-Carlton Beijing",
    "site:ritzcarlton.com Ritz-Carlton Shanghai Pudong",
    "site:marriott.com ritz carlton beijing",
    "site:ritzcarlton.com Ritz-Carlton Tokyo",
  ];
  for (const q of queries) {
    const urls = await bingUrls(q);
    console.log(`\n${q}`);
    console.log(urls.filter((u) => /marriott|hilton|hyatt|peninsula/i.test(u)).slice(0, 5));
    await new Promise((r) => setTimeout(r, 1500));
  }
}

main();