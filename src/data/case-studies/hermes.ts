import type { Picture } from "@/lib/image";
import asl from "@/assets/hermes/h26.png?responsive";
import { publicUrl } from "@/lib/site";
import type { CaseStudy } from "../types";

// h1…h26, in slide order.
const slides = Object.entries(
  import.meta.glob<Picture>("@/assets/hermes/h*.png", { eager: true, import: "default", query: "?responsive" }),
)
  .sort(([a], [b]) => slideNumber(a) - slideNumber(b))
  .map(([, src]) => ({ src, alt: "project overview" }));

function slideNumber(path: string) {
  return Number(path.match(/h(\d+)\.png/)?.[1] ?? 0);
}

const hermes: CaseStudy = {
  kind: "case-study",
  id: 11,
  title: "AI Sign Language Interpretation Platform",
  category: "UX | Product Design | Research | AI Accessibility",
  client: "Amazon - Disability and Leave Services",
  duration: "10 months",
  year: "2025",
  role: "Lead Product Designer, UX Researcher",
  description:
    "An AI-powered sign language interpretation service supporting Deaf and Hard of Hearing employees across Amazon's global operations",
  overview:
    "Hermes is an AI-powered Sign Language interpretation service designed to support Deaf and Hard of Hearing (DHH) employees across Amazon's global operations. The platform provides real-time AI-generated sign language interpretation, closed captions, transcription, and translation - scaling access to communication resources where human interpreters remain scarce. As the lead Product Designer, I shaped the end-to-end experience from defining the problem through research, prototyping, usability testing, and delivery of the MLP (Minimum Lovable Product) set for pilot deployment.",
  challenge:
    "Despite millions spent annually on sign language services, Amazon struggles with a severe shortage of interpreters - particularly for night shifts, training sessions, and high-volume sites. This results in 20-40% unfilled interpretation requests (3P vendor-based), up to 79% unfilled requests in certain use cases, and entire sites experiencing 0% fill rate. The shortage delays onboarding, misses training, and reduces inclusion for 3,500+ DHH associates. Additionally, there is a lack of deaf-culture awareness among managers and the broader workforce, and an absence of standardized tools or workflows to support DHH employees in Start-Up Meetings, New Hire Orientation, trainings, and floor interactions.",
  solution:
    "We designed Hermes, an AI-driven interpretation platform with AI-generated signing avatar, closed captions, real-time transcription, English ↔ ASL/SEE/PSE translation, and a web-based interface for SUM coordinators and managers. The solution integrates with MAVIS carts and laptops for trainings, allowing sites to reliably support DHH employees regardless of time of day, interpreter availability, or location.",
  outcome:
    "Hermes MLP product was launched at sites, directly impacting 3,500+ DHH Amazon employees across site operations spanning SUM, onboarding, training, and daily communication. By integrating AI interpretation with existing workflows, Hermes establishes a scalable accessibility foundation for global operations while closing critical gaps in interpreter reliance and advancing workplace inclusion, belonging, and career progression for DHH associates.",
  hero: asl,
  prototype: { src: publicUrl("prototypes/hermes-avatar.html"), title: "Hermes prototype: a live AI-interpreted session" },
  impact: "Scaled accessibility support for 3,500+ DHH users, closing critical gaps in sign language interpretation",
  research: {
    methodology:
      "Contextual inquiry across Amazon fulfillment centers, semi-structured interviews with DHH associates and leaders, stakeholder workshops, comparative evaluation of existing ASL avatar technologies, artifact walkthroughs, and experience mapping of the DHH journey through orientation, training, and daily operations",
    participants: [
      {
        title: "DHH Associates",
        demographics: "Deaf and Hard of Hearing associates using ASL, SEE, or PSE across various Amazon locations",
        methods: [
          "Contextual inquiry sessions",
          "Semi-structured interviews",
          "Usability testing",
          "Journey mapping workshops",
        ],
      },
      {
        title: "Managers & Leaders",
        demographics: "Managers, SUM leaders, Learning Ambassadors, and HR partners",
        methods: ["Stakeholder interviews", "Workflow analysis", "Co-design sessions"],
      },
      {
        title: "Interpreters",
        demographics: "Remote and in-person interpreters (for benchmarking and validation)",
        methods: ["Expert interviews", "Service benchmarking"],
      },
    ],
    keyFindings: [
      {
        finding: "Onboarding delays due to lack of advance notice",
        details:
          "Sites often receive no advance notice of incoming DHH employees, slowing training and job assignment processes.",
        impact: "Integrated DHH employee notification system into hiring workflow to enable advance preparation",
      },
      {
        finding: "Severe gaps in interpretation access",
        details:
          "Trainings are often unscheduled or cancelled due to interpreter shortages. Night shift support is almost nonexistent.",
        impact: "Designed 24/7 AI-powered backup to ensure consistent access regardless of shift or location",
      },
      {
        finding: "Low awareness of available tools",
        details:
          "Managers lacked understanding of available solutions (MAVIS, VRI, etc.). A brief 5-minute demo dramatically increased successful tool usage.",
        impact: "Developed embedded education and onboarding flows into Hermes platform",
      },
      {
        finding: "Communication barrier patterns",
        details:
          "Employees rely on personal phones, captioning apps, and ad-hoc tools. Clear, large, high-contrast captions are strongly preferred.",
        impact: "Built accessibility-first UI with large, adjustable captions and high contrast options",
      },
      {
        finding: "Mixed use of sign language systems",
        details: "Employees use ASL, SEE, or PSE - requiring adaptable communication modes.",
        impact: "Implemented multi-sign-system support with user preference settings",
      },
      {
        finding: "Preference for in-person interpreters remains strong",
        details:
          "Facial expressions, body language, and contextual awareness are critical. Limitations of virtual interpreting include background noise, distance to screens, and limited field of view.",
        impact:
          "Positioned Hermes as supplement, not replacement - focused on high-impact use cases where human interpreters unavailable",
      },
    ],
    insights: [
      "Hermes must supplement - not replace - human interpreters",
      "The most impactful use case is Start-Up Meetings, where real-time information changes frequently",
      "Captions and transcription are equally important for employees who do not use ASL",
      "Avatar comprehension increases significantly when animation is smooth, facial expressions match signing intent, and screen size is large",
      "A successful launch requires manager education and buy-in, not only product deployment",
      "Trust must be built through accuracy, clarity, and cultural authenticity",
    ],
  },
  sections: [
    { id: "research", title: "Research & Discovery", nav: "Research", research: true, images: [] },
    { id: "project-overview", title: "Project Overview", nav: "Walkthrough", images: slides },
  ],
  keyFeatures: [
    "AI-generated ASL interpretation avatar",
    "Real-time audio-to-signing pipeline",
    "Closed captions with adjustable size and contrast",
    "Live transcription and real-time translation",
    "English ↔ ASL/SEE/PSE translation support",
    "Web-based session management interface",
    "MAVIS cart integration for large-screen visibility",
    "Rapid feedback mechanism after each session",
    "Manager education and onboarding flows",
  ],
  technologies: [
    "Gen AI/LLM",
    "Avatar Animation",
    "Speech Recognition",
    "Unreal",
    "Web Application",
    "Mobile Optimization",
    "Accessibility Standards",
  ],
};

export default hermes;
