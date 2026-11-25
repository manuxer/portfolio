import type { ComponentType } from "react";
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
  /** Interactive prototype (an HTML page in public/) shown at the end of the Overview. */
  prototype?: { src: string; title: string };
  research: Research;
  sections: CaseStudySection[];
  keyFeatures: string[];
  technologies: string[];
  pdfUrl?: string;
}

/* ───── story case study: a longer write-up told in sections (ALICE) ───── */

/** A label with a sentence or two: summary cards, system layers, trust notes. */
export interface Labelled {
  label: string;
  text: string;
}

/** A short title with a sentence or two: findings, principles, decisions, lessons. */
export interface Point {
  title: string;
  text: string;
}

export interface Persona {
  name: string;
  /** Request type, shown as a tag. */
  tag: string;
  text: string;
  /** What this persona's flow puts to the test. */
  tests: string;
  portrait: ImageSource;
  alt: string;
}

export interface Story {
  /** e.g. "Story 1 · John · Accommodation". */
  label: string;
  title: string;
  portrait: ImageSource;
  /** Three screens, each paired with the decision below it. */
  screens: GalleryImage[];
  decisions: Point[];
}

export interface StoryCaseStudy {
  kind: "story";
  id: number;
  title: string;
  /** Product name, shown above the title. */
  product: string;
  category: string;
  description: string;
  hero: ImageSource;
  meta: Array<[label: string, value: string]>;
  summary: Labelled[];
  problem: {
    title: string;
    paragraphs: string[];
    stats: Array<{ value: number; suffix: string; label: string }>;
  };
  research: {
    title: string;
    intro: string;
    groups: Array<{ title: string; methods: Array<[method: string, count: number]> }>;
    /** What we learned; a finding may carry the AI-acceptance split as a bar. */
    findings: Array<Point & { acceptance?: Array<Pick<AcceptanceLevel, "label" | "percentage" | "tone">> }>;
    note: string;
  };
  mainIdea: {
    title: string;
    quoteLabel: string;
    quote: string;
    fieldsLabel: string;
    fields: Array<[label: string, value: string]>;
    caption: string;
  };
  personas: { title: string; items: Persona[] };
  principles: { title: string; items: Point[] };
  howItWorks: { title: string; layers: Labelled[]; steps: string[]; caption: string };
  walkthrough: { title: string; stories: Story[] };
  behavior: {
    title: string;
    intro: string;
    patterns: string[];
    tone: string[];
    /** Typical wording → what the assistant says. */
    toneExamples: Array<[typical: string, ours: string]>;
    /** If… → the assistant… */
    mistakes: Array<[when: string, then: string]>;
    safeguards: Labelled[];
  };
  outcome: {
    title: string;
    text: string;
    goal: string;
    measures: Array<{ title: string; items: string[] }>;
  };
  keyFeatures: string[];
  roadmap: { title: string; items: Array<Labelled & { title: string }> };
  learned: Point[];
}

/** A case study with its own page component: its copy and layout live in that component. */
export interface PageCaseStudy {
  kind: "page";
  id: number;
  title: string;
  /** Preloaded before navigation; the project card's image morphs into it. */
  hero: ImageSource;
  Page: ComponentType<{ project: PageCaseStudy }>;
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
  processImages: ImageSource[];
}

export type Project = CaseStudy | StoryCaseStudy | PageCaseStudy | LegacyProject;
