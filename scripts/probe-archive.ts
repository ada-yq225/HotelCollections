async function main() {
  const url =
    "https://web.archive.org/web/2024id_/https://www.marriott.com/en-us/hotels/sinxr-the-st-regis-singapore/overview/";
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 Chrome/122" },
    signal: AbortSignal.timeout(20000),
  });
  const html = await res.text();
  console.log("status", res.status, "len", html.length);
  const imgs = html.match(/https:\/\/cache\.marriott\.com[^"'\s]+/g) ?? [];
  console.log("marriott", [...new Set(imgs)].slice(0, 5));
}
main();