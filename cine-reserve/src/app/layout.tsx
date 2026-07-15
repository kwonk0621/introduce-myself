import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CGV 모바일 | 영화 그 이상의 감동",
  description: "CGV 모바일 웹 앱 클론 코딩 MVP. 실시간 무비차트 영화 목록 조회, 일정 및 상영시간 선택, 좌석 배치 지정 및 모바일 가상 결제와 티켓 발권 기능을 제공합니다.",
  keywords: ["CGV", "CGV 예매", "영화 예매", "모바일 티켓", "건대입구 CGV"],
  authors: [{ name: "CGV Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F4F5F7] text-gray-900 font-sans selection:bg-red-500 selection:text-white pb-16">
        <BookingProvider>
          {/* Main App Container styled like a mobile web app interface */}
          <div className="max-w-md w-full mx-auto min-h-screen bg-white shadow-xl flex flex-col relative border-x border-gray-200">
            <Header id="main-header" />
            <main id="main-content" className="flex-1 flex flex-col w-full overflow-y-auto">
              {children}
            </main>
            <Footer />
            <AIAssistant />
          </div>
        </BookingProvider>
      </body>
    </html>
  );
}
