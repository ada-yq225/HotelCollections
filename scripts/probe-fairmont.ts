async function main() {
  const res = await fetch("https://www.fairmont.com/en/hotels/singapore/fairmont-singapore.html", {
    headers: { "User-Agent": "Mozilla/5.0 Chrome/122", Accept: "text/html" },
  });
  const t = await res.text();
  console.log("len", t.length);
  const og = t.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
    ?? t.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
  console.log("og:image", og);
  const ah = t.match(/https:\/\/[^"'\s]*ahstatic[^"'\s]+/g);
  console.log("ahstatic", [...new Set(ah ?? [])].slice(0, 5));
  const ld = t.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (ld) console.log("jsonld image", JSON.parse(ld[1]).image);
}
main();