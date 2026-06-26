const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122";

const URLS = [
  "https://www.marriott.com/zh-cn/hotels/beirz-the-ritz-carlton-beijing/overview/",
  "https://www.marriott.com/zh-cn/hotels/sharz-the-ritz-carlton-shanghai-pudong/overview/",
  "https://www.marriott.com/zh-cn/hotels/canrz-the-ritz-carlton-guangzhou/overview/",
  "https://www.marriott.com/zh-cn/hotels/szxrz-the-ritz-carlton-shenzhen/overview/",
  "https://www.marriott.com/zh-cn/hotels/bjsxr-the-st-regis-beijing/overview/",
  "https://www.marriott.com/zh-cn/hotels/shasr-the-st-regis-shanghai-jingan/overview/",
  "https://www.marriott.com/en-us/hotels/beirz-the-ritz-carlton-beijing/overview/",
];

async function main() {
  for (const url of URLS) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, "Accept-Language": "zh-CN,zh;q=0.9" },
        signal: AbortSignal.timeout(20000),
      });
      const html = await res.text();
      const og =
        html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
        html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1];
      const generic = og?.includes("lifestyle") || og?.includes("gvarz") || og?.includes("SBARZ");
      const imgs = [...html.matchAll(/cache\.marriott\.com[^"'\s]+/g)].map((m) => m[0]).slice(0, 3);
      console.log(res.status, url.split("/hotels/")[1]?.slice(0, 40), generic ? "GENERIC" : "OK", og?.slice(50, 110) ?? "no-og");
      if (imgs.length) console.log("  imgs:", imgs[0].slice(0, 90));
    } catch (e) {
      console.log("ERR", url, (e as Error).message);
    }
  }
}

main();