import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "H&C · Hotel Collection",
  description: "高端酒店垂直社区 — 专属记录、分享与社交平台",
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
        </footer>
      </body>
    </html>
  );
}