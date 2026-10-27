
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "../components/Header";
import FloatingNav from "../components/FloatingNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "uni_sns | 学生のゲーム制作マッチング",
  description:
    "学生同士がゲーム制作の仲間を探し、チームを形成できるWebサービス。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}

        <Suspense fallback={null}>
          <FloatingNav />
        </Suspense>
      </body>
    </html>
  );
}
