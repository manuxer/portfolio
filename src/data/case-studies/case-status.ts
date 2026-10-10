import type { Picture } from "@/lib/image";
import commsImage from "@/assets/comms-case-status.png?responsive";
import type { CaseStudy } from "../types";

// cs1…cs16, in journey order.
const journey = Object.entries(
  import.meta.glob<Picture>("@/assets/case_status/cs*.png", { eager: true, import: "default", query: "?responsive" }),
)
  .sort(([a], [b]) => slideNumber(a) - slideNumber(b))
  .map(([, src]) => ({ src, alt: "Employee case status user journey" }));

function slideNumber(path: string) {
  return Number(path.match(/cs(\d+)\.png/)?.[1] ?? 0);
}

const caseStatus: CaseStudy = {
  kind: "case-study",
  id: 8,
  title: "Communication on case status",
  category: "UX | Product Design | Research",
  client: "Amazon - Disability Leave Services (DLS)",
  duration: "8 months",
  year: "2023-2024",
  role: "Lead Product Designer, UX Researcher",
  description:
    "Improving communication transparency between case managers and employees in the disability leave process",
  overview:
    "A comprehensive research and design initiative to improve communication between employees on disability leave and their case managers. The project focused on reducing anxiety, increasing transparency, and streamlining the case status communication process.",
  challenge:
    "Employees on disability leave experienced high levels of anxiety and uncertainty due to poor communication about their case status. Case managers were overwhelmed with redundant inquiries, taking time away from actual case processing. The existing system lacked transparency, leading to employee frustration and decreased trust in the DLS process.",
  solution:
    "Through extensive research with both employees and case managers, we designed a transparent communication system that provides real-time case status updates, automated notifications, and clear next steps. The solution balances employee need for information with case manager workflow efficiency.",
  outcome:
    "Reduced case status inquiries by 45%, improved employee satisfaction scores by 60%, and decreased case manager administrative workload by 30%. The new system provided employees with proactive updates while allowing case managers to focus on complex case work.",
  hero: commsImage,
  impact: "Reduced inquiries by 45% and improved employee satisfaction by 60%",
  research: {
    methodology: "Mixed-methods research combining quantitative surveys and qualitative interviews",
    participants: [
      {
        title: "Employees",
        count: 47,
        demographics: "Employees on short-term and long-term disability leave across various Amazon sites",
        methods: [
          "One-on-one interviews (n=12)",
          "Remote usability testing (n=15)",
          "Survey responses (n=47)",
          "Journey mapping sessions (n=8)",
        ],
      },
      {
        title: "Case Managers",
        count: 18,
        demographics: "DLS case managers with 2-15 years of experience handling disability cases",
        methods: [
          "Contextual inquiry sessions (n=8)",
          "Workflow shadowing (n=6)",
          "Focus groups (n=2 groups, 5-6 participants each)",
          "Survey responses (n=18)",
        ],
      },
    ],
    keyFindings: [
      {
        finding: "Employee Anxiety & Uncertainty",
        details:
          "78% of employees reported high anxiety levels due to lack of communication about their case status. Many checked their email multiple times daily hoping for updates.",
        impact: "Employees felt 'in the dark' about their financial security and return-to-work timeline",
      },
      {
        finding: "Repetitive Inquiry Burden",
        details:
          "Case managers spent an average of 12 hours per week responding to status inquiries that could be automated. 65% of inquiries were about basic case status information.",
        impact: "Reduced time available for complex case work and meaningful employee support",
      },
      {
        finding: "Communication Gaps",
        details:
          "Critical case milestones were processed without employee notification. Employees learned about updates only when they proactively checked or called.",
        impact: "Created perception that 'nothing is happening' even when cases were actively being processed",
      },
      {
        finding: "Trust Issues",
        details:
          "Lack of transparency led to decreased trust in the DLS system. Employees questioned whether their cases were being handled properly.",
        impact: "Increased escalations and complaints to HR leadership",
      },
      {
        finding: "Information Asymmetry",
        details:
          "Case managers had detailed system information but lacked easy ways to share appropriate updates with employees. Employees had no visibility into case processing stages.",
        impact: "Misaligned expectations between what employees expected and what case managers could provide",
      },
    ],
    insights: [
      "Employees primarily want to know: 'Is my case being worked on?' and 'When can I expect a decision?'",
      "Case managers are willing to share status updates but need efficient, automated tools",
      "Proactive communication reduces anxiety more effectively than responsive communication",
      "Transparency about process stages helps employees understand realistic timelines",
      "Case managers value tools that reduce their administrative burden while improving employee experience",
    ],
  },
  sections: [
    { id: "research", title: "Research & Discovery", nav: "Research", research: true, images: [] },
    { id: "journey", title: "User Journey Walkthrough", nav: "Walkthrough", images: journey },
  ],
  keyFeatures: [
    "Real-time case status updates",
    "Automated proactive notifications",
    "Clear process stage visibility",
    "Mobile-optimized interface",
    "Case manager efficiency tools",
    "Secure messaging system",
    "Timeline transparency",
  ],
  technologies: ["Figma", "Gen AI", "User Research", "Accessibility", "Service design"],
};

export default caseStatus;
