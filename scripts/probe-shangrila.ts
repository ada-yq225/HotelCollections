async function main() {
  const res = await fetch("https://www.shangri-la.com/singapore/shangrila/", {
    headers: { "User-Agent": "Mozilla/5.0 Chrome/122" },
  });
  const html = await res.text();
  const imgs = [
    ...(html.match(/https:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi) ?? []),
    ...(html.match(/https:\/\/www\.shangri-la\.com[^"'\s]+/gi) ?? []),
  ].slice(0, 15);
  console.log("status", res.status, "len", html.length);
  console.log("imgs", [...new Set(imgs)].slice(0, 10));
  const fairmont = await fetch("https://www.fairmont.com/en/hotels/singapore/fairmont-singapore.html", {
    headers: { "User-Agent": "Mozilla/5.0 Chrome/122" },
  });
  const fhtml = await fairmont.text();
  const fimgs = (fhtml.match(/https:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi) ?? []).slice(0, 10);
  console.log("\nfairmont imgs", [...new Set(fimgs)]);
  const raffles = await fetch("https://www.raffles.com/singapore/", {
    headers: { "User-Agent": "Mozilla/5.0 Chrome/122" },
  });
  const rhtml = await raffles.text();
  console.log("\nraffles og", rhtml.match(/og:image[^>]+content="([^"]+)"/i)?.[1]);
}

main();