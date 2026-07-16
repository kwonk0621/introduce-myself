"use client";

import { useState, useEffect } from "react";
import { Twitter, Compass } from "lucide-react";

export default function Sidebar() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTimeStr(now.toLocaleTimeString("en-US", options));
    };

    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-between h-full min-h-[320px] md:min-h-[500px]">
      {/* Bio and Identity */}
      <div className="space-y-6">
        <div>
          <h1 className="text-base font-medium text-ink-black tracking-tight mb-2">
            권순형
          </h1>
          <p className="text-[13px] text-smoke leading-relaxed max-w-[200px]">
            서울 기반. 지능형 AI 모델과 미니멀 엔지니어링 미학의 융합을 탐구하고 개발합니다. 현재는 에이전트 인프라와 온디바이스 최적화를 연구 중입니다.
          </p>
        </div>

        {/* Plain Social Links */}
        <div className="flex flex-col space-y-2">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-[12px] text-ink-black hover:text-graphite transition-colors duration-200 w-fit"
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>X (Twitter)</span>
          </a>
          <a
            href="https://cosmos.so"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-[12px] text-ink-black hover:text-graphite transition-colors duration-200 w-fit"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Cosmos</span>
          </a>
        </div>
      </div>

      {/* Date / Location Stamp (Foot Note) */}
      <div className="space-y-1.5 pt-8">
        <div className="text-[12px] font-medium text-graphite tracking-wider uppercase">
          SEL {timeStr || "12:12"}
        </div>
        <p className="text-[12px] text-graphite leading-relaxed max-w-[180px]">
          맑고 파란 하늘, 시원한 산책을 가기 완벽한 오후.
        </p>
      </div>
    </div>
  );
}

