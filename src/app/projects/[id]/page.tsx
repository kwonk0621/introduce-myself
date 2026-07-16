import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const isThoughts = false;

  // Map premium images for categories (matching FeaturedCard)
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

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20 space-y-10 selection:bg-frost/45 select-none">
      {/* Top Navigation Row */}
      <div className="flex justify-between items-center border-b border-frost pb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-frost text-xs font-semibold text-ink bg-porcelain hover:bg-bone hover:border-ash active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>목록으로</span>
        </Link>

        {/* Muted Metadata */}
        <span className="rogan-label text-[12px] text-smoke">
          {project.category} · {project.date} {project.location ? `· ${project.location}` : ""}
        </span>
      </div>

      {/* Main Content Layout */}
      <div className="space-y-10">
        <div className="space-y-3">
          <h1 className="text-[32px] sm:text-[40px] font-bold text-ink tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="text-[15px] sm:text-[16px] text-smoke leading-relaxed max-w-3xl">
            {project.shortDescription}
          </p>
        </div>

        {/* Visual Media (Photography & UI captures only) */}
        {displayImage && (
          <div className="relative overflow-hidden w-full bg-bone rounded-3xl shadow-md border border-frost/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt={project.title}
              className="w-full object-cover filter grayscale-[10%] hover:grayscale-0 transition-all duration-500"
              style={{ maxHeight: "500px" }}
            />
          </div>
        )}

        {/* Project Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-10 border-t border-frost">
          {/* Left panel: Info & Tech Stack */}
          <div className="md:col-span-4 space-y-8">
            <div className="space-y-4">
              <h2 className="rogan-label text-[12px] text-ink">
                상세 정보
              </h2>
              <div className="text-[14px] text-smoke space-y-2.5">
                <div>
                  <span className="text-ash font-medium">분류:</span> {project.category}
                </div>
                <div>
                  <span className="text-ash font-medium">시기:</span> {project.date}
                </div>
                {project.location && (
                  <div>
                    <span className="text-ash font-medium">장소:</span> {project.location}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="rogan-label text-[12px] text-ink">
                관련 키워드
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-[11px] font-medium text-ink border border-frost rounded-full bg-bone"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Plain Link Buttons */}
            <div className="flex flex-col space-y-3 pt-4 border-t border-frost/50">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-[13px] font-semibold text-ink hover:text-cobalt-spark transition-colors duration-200"
                >
                  <Github className="w-4 h-4 text-carbon" />
                  <span>GitHub 소스코드</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-[13px] font-semibold text-ink hover:text-cobalt-spark transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 text-carbon" />
                  <span>라이브 프로젝트 방문</span>
                </a>
              )}
            </div>
          </div>

          {/* Right panel: Deep-dive Descriptions */}
          <div className="md:col-span-8 space-y-10">
            {/* Overview */}
            <div className="space-y-4">
              <h3 className="rogan-label text-[12px] text-ink">
                상세 개요
              </h3>
              <p className="text-[15px] sm:text-[16px] text-smoke leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="rogan-label text-[12px] text-ink">
                  주요 특징 및 기능
                </h3>
                <ul className="space-y-3">
                  {project.features.map((feature, i) => (
                    <li key={i} className="text-[14px] text-smoke leading-relaxed flex items-start space-x-2">
                      <span className="text-ash mt-1 shrink-0 font-bold">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Troubleshooting & Challenges */}
            {!isThoughts && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-frost">
                <div className="space-y-3">
                  <h4 className="rogan-label text-[12px] text-ink">
                    도전 과제 (Challenge)
                  </h4>
                  <p className="text-[14px] text-smoke leading-relaxed">
                    {project.challenges}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="rogan-label text-[12px] text-ink">
                    해결 결과 (Troubleshooting)
                  </h4>
                  <p className="text-[14px] text-smoke leading-relaxed">
                    {project.troubleshooting}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

