import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "권순형 | AIGRAVITY LAB",
  description: "지능형 AI 모델과 미니멀 엔지니어링 미학의 융합을 탐구하고 개발하는 AIGRAVITY LAB의 포트폴리오입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-porcelain text-ink font-inter antialiased">
        {/* Persistent Top Navigation Bar */}
        <Navbar />

        {/* Full-width container to allow full-bleed Hero Section */}
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}

