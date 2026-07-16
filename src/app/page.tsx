"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import CarouselSection from "@/components/CarouselSection";
import FeaturedCard from "@/components/FeaturedCard";

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("kwonk0621@naver.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter projects by category
  const systemProjects = projects.filter((p) => p.category === "Systems");
  const researchProjects = projects.filter((p) => p.category === "Research");
  const demoProjects = projects.filter((p) => p.category === "Demos");

  return (
    <div className="w-full pb-24">
      {/* 1. Hero Section */}
      <section 
        className="relative w-full h-[calc(100vh-68px)] flex flex-col justify-center items-center overflow-hidden px-6 text-center select-none"
        style={{
          background: "radial-gradient(64.38% 210.53% at 35.62% 50%, #dfe1f0 0%, #aeb1cc 100%)"
        }}
      >
        {/* Oversized Wordmark bleeding off edges */}
        <h1 className="text-[14vw] sm:text-[11.5vw] font-semibold text-porcelain tracking-[-0.025em] leading-[0.95] sm:leading-[0.9] uppercase scale-y-95 select-none z-10">
          AI ENGINEER <br /> SOONHYEONG
        </h1>

        {/* Foreground Content (Bio Subtext & CTAs) */}
        <div className="relative z-20 flex flex-col items-center max-w-[480px] space-y-6 select-none mt-8">
          {/* Bio Subtext - Inter 18px, white text */}
          <p className="text-[16px] sm:text-[18px] text-porcelain/90 leading-relaxed font-normal tracking-tight">
            Seoul-based. Investigating the intersection of cognitive intelligence and minimal engineering. We design and build autonomous systems and advanced agentic architectures.
          </p>

          {/* Hero CTA Pair - Both Ghost Outlined per Morflax specification */}
          <div className="flex gap-4">
            <a
              href="#systems"
              className="px-6 py-3 text-[14px] font-semibold text-porcelain border border-porcelain rounded-full bg-transparent hover:bg-porcelain hover:text-[#aeb1cc] transition-all duration-300 active:scale-95"
            >
              Explore Ecosystem
            </a>
            <button
              onClick={handleCopyEmail}
              className="px-6 py-3 text-[14px] font-semibold text-porcelain border border-porcelain rounded-full bg-transparent hover:bg-porcelain hover:text-[#aeb1cc] transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Open Studio ↗
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout Container */}
      <div className="max-w-[1200px] mx-auto px-6 space-y-36 md:space-y-48 mt-24 md:mt-32">
        
        {/* 2. Display Statement (Editorial Interlude) */}
        <section className="py-[35vh] flex justify-center items-center bg-porcelain my-12">
          <div className="max-w-[850px] text-center space-y-6 px-6 select-none">
            <span className="rogan-label text-[12px] text-smoke">Philosophy</span>
            <p className="text-[28px] sm:text-[36px] font-semibold text-ink tracking-[-0.36px] leading-[1.5] sm:leading-[1.45] text-pretty">
              "AI 엔지니어링은 수학적 논리와 소프트웨어 설계의 평형 상태이며, 인지적 지능과 미니멀한 기술 실행력의 교차점을 탐구하는 여정입니다."
            </p>
          </div>
        </section>

        {/* About Me Section */}
        <section id="about" className="py-32 md:py-48 border-t border-frost grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          {/* Left Column - Profile & Email */}
          <div className="md:col-span-4 space-y-6 select-none">
            <div className="space-y-2">
              <span className="rogan-label text-[12px] text-smoke">About Me</span>
              <h2 className="text-[28px] sm:text-[32px] font-bold text-ink tracking-tight leading-none">
                권순형
              </h2>
              <p className="text-[14px] text-smoke">
                AI Engineer & Architect
              </p>
            </div>
            
            <div className="pt-4 border-t border-frost space-y-2">
              <span className="text-[12px] text-ash font-medium uppercase tracking-wider block">Contact</span>
              <button 
                onClick={handleCopyEmail}
                className="text-[14px] font-medium text-ink hover:text-cobalt-spark transition-colors duration-200 text-left select-text cursor-pointer"
              >
                kwonk0621@naver.com ↗
              </button>
            </div>
          </div>

          {/* Right Column - Vision & Plans */}
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-4">
              <h3 className="rogan-label text-[12px] text-ink select-none">Vision & Engineering Identity</h3>
              <p className="text-[15px] sm:text-[16px] text-smoke leading-relaxed">
                지능형 자율 에이전트 아키텍처와 경량화 모델 최적화에 주력하는 AI 엔지니어 권순형입니다. 
                수학적 지능과 미니멀한 소프트웨어 구조의 결합을 통해, 복잡한 인공지능 기술을 일상의 효율적인 경험으로 바꾸어 내는 시스템 설계를 지향합니다.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-frost/50">
              <h3 className="rogan-label text-[12px] text-ink select-none">Future Plans & Direction</h3>
              <p className="text-[15px] sm:text-[16px] text-smoke leading-relaxed">
                향후에는 온디바이스(On-device) 환경에서 초저지연으로 구동하는 소형 거대 모델(SLM)의 지식 증류 연구 및 자율 에이전트 분산 오케스트레이션 인프라 고도화에 집중할 계획입니다. 
                기술적 장벽을 허물어 사람과 지능형 시스템이 매끄럽게 교감하는 스마트 생태계를 구축하고자 합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Achievements & Research Progress Section */}
        <section className="py-16 sm:py-24 border border-frost bg-bone rounded-3xl p-8 sm:p-12 space-y-12 shadow-md mt-16 md:mt-28">
          {/* Section Header */}
          <div className="space-y-2 select-none">
            <span className="rogan-label text-[12px] text-smoke">Lab Status</span>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-ink tracking-tight">
              Achievements & Research Progress
            </h2>
            <p className="text-[14px] text-smoke max-w-[500px]">
              연구소의 성과와 현재 진행 중인 주요 AI 연구 파이프라인의 진행 상황입니다.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-frost/50">
            <div className="space-y-1">
              <div className="text-[32px] sm:text-[40px] font-bold text-ink tracking-tight">12+ Papers</div>
              <div className="text-[12px] text-smoke rogan-label">NeurIPS / CVPR / ICLR</div>
            </div>
            <div className="space-y-1">
              <div className="text-[32px] sm:text-[40px] font-bold text-ink tracking-tight">10k+ Stars</div>
              <div className="text-[12px] text-smoke rogan-label">GitHub Open Source</div>
            </div>
            <div className="space-y-1">
              <div className="text-[32px] sm:text-[40px] font-bold text-ink tracking-tight">35+ Systems</div>
              <div className="text-[12px] text-smoke rogan-label">Enterprise Deployments</div>
            </div>
          </div>

          {/* Research Timeline / Progress Table */}
          <div className="space-y-4 pt-6 border-t border-frost/50">
            <h3 className="rogan-label text-[12px] text-ink">Active Research Tracks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-frost text-smoke font-medium">
                    <th className="py-2.5 pr-4">Research Topic</th>
                    <th className="py-2.5 pr-4">Focus Area</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-frost/30 text-ink">
                  <tr>
                    <td className="py-3.5 pr-4 font-medium">Agentic Workflows</td>
                    <td className="py-3.5 pr-4 text-smoke">Multi-agent collaboration loops</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 text-[11px] font-medium border border-frost rounded-full bg-porcelain text-cobalt-spark">
                        Active: Evaluation
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 font-medium">On-device Distillation</td>
                    <td className="py-3.5 pr-4 text-smoke">Quantization & Attention Matching</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 text-[11px] font-medium border border-frost rounded-full bg-porcelain text-cobalt-spark">
                        Active: Fine-tuning
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 font-medium">Graph RAG Indexer</td>
                    <td className="py-3.5 pr-4 text-smoke">Context mapping via Neo4j database</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 text-[11px] font-medium border border-frost rounded-full bg-porcelain text-smoke">
                        Completed: Production
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. Systems Carousel */}
        <CarouselSection id="systems" title="Systems">
          {systemProjects.map((project) => (
            <FeaturedCard key={project.id} project={project} />
          ))}
        </CarouselSection>

        {/* 4. Research Carousel */}
        <CarouselSection id="research" title="Research">
          {researchProjects.map((project) => (
            <FeaturedCard key={project.id} project={project} />
          ))}
        </CarouselSection>

        {/* 5. Demos Carousel */}
        <CarouselSection id="demos" title="Demos">
          {demoProjects.map((project) => (
            <FeaturedCard key={project.id} project={project} />
          ))}
        </CarouselSection>

        {/* 6. Contact Section & Footer */}
        <section className="pt-24 pb-12 md:pt-36 border-t border-frost flex flex-col items-center text-center space-y-8 select-none">
          <div className="space-y-3">
            <span className="rogan-label text-[12px] text-smoke">Ready to build?</span>
            <h2 className="text-[28px] sm:text-[36px] font-bold text-ink tracking-tight">
              Let's build intelligence together.
            </h2>
            <p className="text-[14px] text-smoke max-w-[420px] mx-auto">
              미니멀 AI 아키텍처와 엔지니어링 시스템 협업, 공동 연구 및 솔루션 구축에 관심이 있으시면 언제든지 편하게 연락 주세요.
            </p>
          </div>

          {/* Primary Filled Button (SOLE Cobalt Spark action per viewport) */}
          <div className="relative">
            <button
              onClick={handleCopyEmail}
              className="px-8 py-3.5 bg-cobalt-spark text-porcelain text-[14px] font-semibold rounded-full shadow-md hover:shadow-xl hover:bg-[#1a7ee5] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Get in Touch
            </button>

            {/* Micro-toast popup */}
            <div
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-obsidian-bar text-porcelain text-[12px] font-semibold rounded-xl shadow-xl transition-all duration-300 origin-bottom ${
                copied
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-2 scale-95 pointer-events-none"
              }`}
            >
              kwonk0621@naver.com 복사 완료!
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="pt-12 text-[12px] text-ash space-y-1">
            <div>© {new Date().getFullYear()} 권순형. All rights reserved.</div>
            <div className="rogan-label tracking-widest">Seoul, South Korea</div>
          </div>
        </section>
      </div>
    </div>
  );
}
