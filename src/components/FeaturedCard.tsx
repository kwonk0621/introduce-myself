"use client";

import Link from "next/link";
import { Project } from "@/types/project";
import { Cpu, BookOpen, Sparkles } from "lucide-react";

interface FeaturedCardProps {
  project: Project;
}

export default function FeaturedCard({ project }: FeaturedCardProps) {
  // Map images for categories
  let displayImage = project.imageUrl;
  if (project.category === "Systems") {
    if (project.id === "aether-stream") displayImage = "/images/aether-stream.jpg";
    else if (project.id === "gravity-rag") displayImage = "/images/gravity-rag.jpg";
    else displayImage = "/images/aether-stream.jpg";
  } else if (project.category === "Research") {
    if (project.id === "neuro-morph") displayImage = "/images/neuro-morph.jpg";
    else if (project.id === "semantics-100b") displayImage = "/images/semantics-100b.jpg";
    else displayImage = "/images/neuro-morph.jpg";
  } else if (project.category === "Demos") {
    if (project.id === "aigravity-vision") displayImage = "/images/aigravity-vision.jpg";
    else if (project.id === "synthsound-lab") displayImage = "/images/synthsound-lab.jpg";
    else displayImage = "/images/synthsound-lab.jpg";
  }

  // Map category icons
  const getIcon = () => {
    const iconClass = "w-4 h-4 text-porcelain stroke-[2]";
    switch (project.category) {
      case "Systems":
        return <Cpu className={iconClass} />;
      case "Research":
        return <BookOpen className={iconClass} />;
      case "Demos":
        return <Sparkles className={iconClass} />;
      default:
        return <Cpu className={iconClass} />;
    }
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="relative aspect-[1/1.2] w-[290px] sm:w-[320px] rounded-3xl overflow-hidden group shadow-xl hover:shadow-[0px_30px_60px_-12px_rgba(0,0,0,0.3)] transition-all duration-500 cursor-pointer snap-start shrink-0 bg-bone border border-frost/20 select-none block"
    >
      {/* Background Image / Render */}
      {displayImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayImage}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out filter grayscale-[10%] group-hover:grayscale-0"
        />
      )}

      {/* Dark Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-bar/80 via-transparent to-obsidian-bar/40 opacity-90 transition-opacity duration-300" />

      {/* Top Overlay: Category Label & Icon */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian-bar/60 backdrop-blur-md border border-frost/10">
        {getIcon()}
        <span className="text-porcelain text-[12px] font-medium tracking-wide">
          {project.category}
        </span>
      </div>

      {/* Bottom Overlay: Title & Description */}
      <div className="absolute bottom-5 left-5 right-5 text-porcelain space-y-1.5">
        <span className="text-porcelain/60 text-[11px] font-medium uppercase tracking-[0.05em]">
          {project.date} {project.location ? `· ${project.location}` : ""}
        </span>
        <h3 className="text-[17px] font-semibold tracking-tight leading-snug group-hover:text-cobalt-spark transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-porcelain/80 text-[12px] font-normal leading-relaxed line-clamp-2">
          {project.shortDescription}
        </p>
      </div>
    </Link>
  );
}

