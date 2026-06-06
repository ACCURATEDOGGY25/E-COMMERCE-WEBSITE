import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromoBar } from "@/components/home/PromoBar";
import { CategoryNav } from "@/components/home/CategoryNav";
import { SetupBanner } from "@/components/layout/SetupBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MarketHub - Multi-Vendor Marketplace",
    template: "%s | MarketHub",
  },
  description:
    "Shop from thousands of vendors. Electronics, fashion, home & more with secure checkout.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <PromoBar />
        <SetupBanner />
        <Header />
        <CategoryNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
