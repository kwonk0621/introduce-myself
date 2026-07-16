"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselSectionProps {
  id: string;
  title: string;
  exploreUrl?: string;
  children: React.ReactNode;
}

export default function CarouselSection({ id, title, exploreUrl, children }: CarouselSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 464; // Card width (320px) + gap (144px)
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id={id} className="w-full space-y-8 pt-16 md:pt-24">
      {/* Section Header with Controls */}
      <div className="flex justify-between items-end border-b border-frost pb-4">
        {/* Left Side: Title */}
        <h2 className="text-heading font-semibold text-ink tracking-tracking-heading leading-leading-heading">
          {title}
        </h2>

        {/* Right Side: Link & Arrows */}
        <div className="flex items-center gap-6 select-none">
          {exploreUrl && (
            <Link
              href={exploreUrl}
              className="text-[14px] font-medium text-ink hover:text-cobalt-spark transition-colors"
            >
              Explore more
            </Link>
          )}

          {/* Carousel Control Arrows */}
          <div className="hidden md:flex items-center gap-1">
            {/* Left Button */}
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full bg-porcelain border border-frost flex items-center justify-center hover:bg-bone hover:border-ash active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-carbon stroke-[1.5]" />
            </button>
            {/* Right Button */}
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full bg-porcelain border border-frost flex items-center justify-center hover:bg-bone hover:border-ash active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-carbon stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel View */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-36 overflow-x-auto no-scrollbar scroll-smooth pb-8 px-2 -mx-2 snap-x snap-mandatory justify-start md:justify-center"
        >
          {children}
        </div>
      </div>
    </section>
  );
}

