const UA = "Mozilla/5.0 Chrome/122";

async function check(url: string) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25000) });
  const html = await res.text();
  const og =
    html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
  const imgs = [
    ...(html.match(/https:\/\/[^"'\s]+\.(?:jpg|jpeg|webp)/gi) ?? []),
    ...(html.match(/https:\/\/m\.ahstatic\.com[^"'\s]+/gi) ?? []),
    ...(html.match(/https:\/\/media\.ffycdn\.net[^"'\s]+/gi) ?? []),
    ...(html.match(/https:\/\/cache\.marriott\.com[^"'\s]+/gi) ?? []),
  ];
  const unique = [...new Set(imgs)].slice(0, 5);
  console.log(res.status, url.slice(0, 55));
  console.log("  og:", og?.slice(0, 80) ?? "—");
  console.log("  imgs:", unique.length, unique[0]?.slice(0, 80) ?? "—");
}

async function main() {
  await check("https://www.fairmont.com/singapore/");
  await check("https://www.mandarinoriental.com/en/bangkok/chao-phraya-river");
  await check("https://www.ritzcarlton.com/en/hotels/singapore");
  await check("https://www.shangri-la.com/hongkong/shangrila/");
  await check("https://www.raffles.com/singapore/");
}
main();