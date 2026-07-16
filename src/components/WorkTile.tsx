import Link from "next/link";
import { Project } from "@/types/project";

interface WorkTileProps {
  project: Project;
}

export default function WorkTile({ project }: WorkTileProps) {
  const isThoughts = (project.category as string) === "Thoughts";

  if (isThoughts) {
    return (
      <Link
        href={`/projects/${project.id}`}
        className="block hairline-border p-6 bg-paper-white hover:border-graphite transition-all duration-300 group h-full flex flex-col justify-between min-h-[220px]"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-medium tracking-wider text-graphite uppercase">
              {project.category}
            </span>
            <span className="text-[11px] text-smoke">
              {project.date}
            </span>
          </div>
          <h3 className="text-[14px] font-medium text-ink-black leading-snug group-hover:text-graphite transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-[13px] text-smoke leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>
        </div>

        <span className="text-[11px] font-medium text-ink-black underline underline-offset-4 pt-4 block">
          에세이 읽기
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block bg-paper-white hover:opacity-95 transition-all duration-300 group"
    >
      <div className="relative overflow-hidden w-full bg-pencil-gray">
        {project.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full object-cover transition-transform duration-500 filter grayscale-[20%] group-hover:grayscale-0"
            style={{ maxHeight: "400px" }}
          />
        )}
      </div>

      {/* Caption Layout */}
      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-baseline">
          <h3 className="text-[13px] font-medium text-ink-black group-hover:text-graphite transition-colors duration-200">
            {project.title}
          </h3>
          <span className="text-[10px] text-smoke uppercase tracking-wider">
            {project.category}
          </span>
        </div>
        <p className="text-[12px] text-graphite leading-relaxed">
          {project.shortDescription}
        </p>
      </div>
    </Link>
  );
}

