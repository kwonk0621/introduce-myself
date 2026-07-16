export interface Project {
  id: string;
  title: string;
  category: "Systems" | "Research" | "Demos";
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string; // For photography and UI captures
  features: string[];
  challenges: string;
  troubleshooting: string;
  date: string;
  location?: string;
}

