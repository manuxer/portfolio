import aliceIntro from "@/assets/alice.png?responsive";
import asl from "@/assets/hermes/h26.png?responsive";
import essIntro from "@/assets/ess/ess.png?responsive";
import commsImage from "@/assets/comms-case-status.png?responsive";
import type { Project, ProjectSummary } from "./types";

const LEGACY = "https://manupeethambar.github.io/manuxer";

/** Every project, in display order (kept even when not listed on the site). */
const allProjects: ProjectSummary[] = [
  {
    id: 9,
    title: "Simplifying disability & leave management using AI",
    category: "UX | Product design | Research | Gen AI",
    description:
      "A conversational Gen AI system for streamlining disability and leave services intake, based on research with employees and ops associates",
    image: aliceIntro,
  },
  {
    id: 11,
    title: "AI Sign Language Interpretation Platform",
    category: "UX | Product Design | Research | AI Accessibility",
    description:
      "An AI-powered sign language interpretation service supporting workplace accessibility for Amazon's global operations",
    image: asl,
  },
  {
    id: 10,
    title: "Personal information management in AtoZ",
    category: "UX | Product design | Research",
    description:
      "Self-service personal information management system for Amazon's global workforce, improving discoverability and employee autonomy",
    image: essIntro,
  },
  {
    id: 8,
    title: "Communication on case status",
    category: "UX | Product design | Research",
    description:
      "Improving communication transparency between case managers and employees in the disability leave process",
    image: commsImage,
  },
  {
    id: 2,
    title: "Usability evaluation and interaction design",
    category: "UX | Research",
    description: "Usability analysis and redesign of the Postal Service website",
    image: `${LEGACY}/files/USPS/Logo/USPS_logo.png`,
  },
  {
    id: 3,
    title: "Accessibility evaluation and inclusive design",
    category: "Accessibility",
    description: "Accessibility evaluation and remediation of the MBTA intranet website",
    image: `${LEGACY}/files/MBTA/img/MBTA-hero.jpeg`,
  },
  {
    id: 4,
    title: "My experiments",
    category: "UI/UX",
    description: "A collection of my design experiments",
    image: `${LEGACY}/files/Experiments/VisualSearch.png`,
  },
  {
    id: 5,
    title: "Usability engineering",
    category: "UX specialist",
    description: "Design - Evaluate - Iterate",
    image: `${LEGACY}/img/UW.png`,
  },
  {
    id: 6,
    title: "My artwork",
    category: "Artwork / Paintings",
    description: "An artist is a simplifier.. Art is the elimination of the unnecessary!",
    image: `${LEGACY}/files/MyPaintings/1.jpg`,
  },
];

/** How many projects the site lists; the rest stay in the data, unlisted. */
const LISTED_COUNT = 4;

/** The Work page, in display order: only the first LISTED_COUNT projects. */
export const projects: ProjectSummary[] = allProjects.slice(0, LISTED_COUNT);

/** Home page "Featured projects". */
export const featured: ProjectSummary[] = projects.slice(0, 4).map((p) =>
  p.id === 10
    ? { ...p, description: "Self-service personal information management system for Amazon's global workforce" }
    : p,
);

/** Next project in Work order; unlisted projects lead back to the first. */
export function nextProjectOf(id: number): ProjectSummary {
  const index = projects.findIndex((p) => p.id === id);
  return projects[(index + 1) % projects.length];
}

/** Loads a project's full write-up on demand so each case study is its own chunk. */
export async function loadProject(id: number): Promise<Project | null> {
  switch (id) {
    case 8:
      return (await import("./case-studies/case-status")).default;
    case 9:
      return (await import("./case-studies/alice")).default;
    case 10:
      return (await import("./case-studies/atoz")).default;
    case 11:
      return (await import("./case-studies/hermes")).default;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      return (await import("./case-studies/legacy")).legacyProjects[id] ?? null;
    default:
      return null;
  }
}
