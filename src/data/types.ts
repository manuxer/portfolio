import type { ImageSource } from "@/lib/image";

export interface ProjectSummary {
  id: number;
  title: string;
  category: string;
  description: string;
  image: ImageSource;
}

export interface GalleryImage {
  src: ImageSource;
  alt: string;
}

export interface Participant {
  title: string;
  /** A number is animated as a count; text such as "Multiple segments" is shown as-is. */
  count?: number | string;
  demographics: string;
  methods: string[];
}

export interface Finding {
  finding: string;
  details: string;
  impact: string;
}

export interface AcceptanceLevel {
  label: string;
  percentage: number;
  tone: "positive" | "neutral" | "negative";
  characteristics: string;
  feedback: string;
}

export interface Research {
  methodology: string;
  participants: Participant[];
  keyFindings: Finding[];
  insights: string[];
  aiAcceptance?: AcceptanceLevel[];
}

export interface CaseStudySection {
  /** Anchor id, also used by the section dock. */
  id: string;
  title: string;
  /** Short label for the section dock. */
  nav: string;
  /** Render the research write-up at the top of this section. */
  research?: boolean;
  images: GalleryImage[];
}

export interface CaseStudy {
  kind: "case-study";
  id: number;
  title: string;
  category: string;
  client: string;
  duration: string;
  year: string;
  role: string;
  description: string;
  overview: string;
  challenge: string;
  solution: string;
  outcome: string;
  hero: ImageSource;
  impact: string;
  introImages?: GalleryImage[];
  research: Research;
  sections: CaseStudySection[];
  keyFeatures: string[];
  technologies: string[];
  pdfUrl?: string;
}

export interface SubProject {
  title: string;
  description: string;
  image: ImageSource;
  isPasswordProtected?: boolean;
}

export interface LegacyProject {
  kind: "legacy";
  id: number;
  title: string;
  category: string;
  client: string;
  duration: string;
  year: string;
  role: string;
  description: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
  hero: ImageSource;
  isNDA?: boolean;
  methodology?: string[];
  tools?: string[];
  figmaEmbed?: string;
  subProjects?: SubProject[];
  processImages: string[];
}

export type Project = CaseStudy | LegacyProject;
