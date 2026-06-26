async function main() {
  const res = await fetch("https://www.hilton.com/en/hotels/bkkcici-conrad-bangkok/", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122",
      Accept: "text/html",
    },
  });
  const html = await res.text();
  console.log("status", res.status, "len", html.length);
  const og =
    html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
  console.log("og", og);
  const hilton = html.match(/https:\/\/[^"'\s]*hilton[^"'\s]+\.(?:jpg|jpeg|webp)/gi);
  console.log("hilton imgs", hilton?.slice(0, 5));
  const ld = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (ld) {
    try {
      const d = JSON.parse(ld[1]);
      console.log("jsonld image", d.image ?? d["@graph"]?.[0]?.image);
    } catch {
      console.log("jsonld parse fail");
    }
  }
}
main();