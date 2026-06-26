import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { getCurrentUser } from "@/lib/auth";
import { DEMO_ACCOUNT_LABEL } from "@/lib/demo-account";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "H&C · Hotel Collection — 高端酒店垂直社区",
  description:
    "H&C Hotel Collection 是专为中国高端酒店爱好者打造的垂直社区平台。收录全球奢华酒店白名单，提供携程、飞猪、美团、去哪儿等OTA价格参考，支持酒店打卡、入住点评、房卡收藏。覆盖三亚、马尔代夫、巴厘岛、普吉岛、日本、迪拜等热门目的地。",
  keywords: [
    "高端酒店",
    "奢华酒店",
    "酒店社区",
    "酒店打卡",
    "酒店点评",
    "酒店价格对比",
    "携程酒店",
    "飞猪酒店",
    "三亚酒店",
    "马尔代夫酒店",
    "巴厘岛酒店",
    "迪拜酒店",
    "日本酒店",
    "五星级酒店",
    "度假酒店",
    "Hotel Collection",
    "H&C",
  ],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
  openGraph: {
    title: "H&C · Hotel Collection — 高端酒店垂直社区",
    description:
      "专为中国高端酒店爱好者打造，收录全球奢华酒店白名单，支持OTA价格对比与社区点评。",
    type: "website",
    locale: "zh_CN",
    siteName: "H&C Hotel Collection",
  },
  other: {
    "baidu-site-verification": "请替换为您的百度站点验证码",
    "sogou_site_verification": "请替换为您的搜狗站点验证码",
    "360-site-verification": "请替换为您的360站点验证码",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="zh-CN" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen antialiased">
        <Navbar user={user ? { name: user.name, isPlus: user.isPlus } : null} />
        <main>{children}</main>
        <footer className="border-t border-[#e8e8e8] bg-white py-8 text-center text-sm text-[#6b7280]">
          <p className="font-serif text-lg text-[#1a1a1a]">H&C · Hotel Collection</p>
          <p className="mt-1">专为高端酒店爱好者打造的精英生活方式社区</p>
          {!user && (
            <p className="mt-3 text-xs">
              演示登录：
              <span className="ml-1 font-mono text-[#374151]">{DEMO_ACCOUNT_LABEL}</span>
            </p>
          )}
        </footer>
      </body>
    </html>
  );
}