"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { storage } from "@/lib/storage";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const profile = storage.getProfile();
    if (profile) {
      router.push("/dashboard");
    } else {
      router.push("/onboarding");
    }
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white text-center">
      <div className="animate-pulse flex flex-col items-center">
        <Sparkles className="w-12 h-12 text-primary mb-4 animate-spin-slow" />
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">SyncTrip</h1>
        <p className="text-sm text-gray-400">여행 동행 매칭 서비스를 불러오는 중...</p>
      </div>
    </div>
  );
}
