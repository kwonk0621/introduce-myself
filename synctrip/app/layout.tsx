import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import IncomingChatListener from "@/components/IncomingChatListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SyncTrip - AI 기반 여행 동행 매칭",
  description: "AI로 나의 여행 성향을 분석하고, 신뢰할 수 있는 동행을 만나보세요.",
  applicationName: "SyncTrip",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-screen w-screen overflow-hidden antialiased`}
    >
      <body className="h-screen w-screen overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md h-screen md:h-[min(850px,95dvh)] bg-white shadow-2xl flex flex-col relative md:rounded-2xl md:overflow-hidden border border-gray-100">
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <IncomingChatListener />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
