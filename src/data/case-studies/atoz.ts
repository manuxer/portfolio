import essIntro from "@/assets/ess/ess.png?responsive";
import users from "@/assets/ess/users.png?responsive";
import personas from "@/assets/ess/personas.png?responsive";
import ia from "@/assets/ess/ia.png?responsive";
import userflow from "@/assets/ess/userflow.png?responsive";
import designSystem from "@/assets/ess/ds.png?responsive";
import wireframes from "@/assets/ess/wireframes.png?responsive";
import hifi from "@/assets/ess/hifi.png?responsive";
import type { CaseStudy } from "../types";

const atoz: CaseStudy = {
  kind: "case-study",
  id: 10,
  title: "Personal information management in AtoZ",
  category: "UX | Product Design | Research",
  client: "Amazon",
  duration: "6 months",
  year: "2022-2023",
  role: "Product Designer, UX Researcher",
  description: "Self-service personal information management system for Amazon's global workforce",
  overview:
    "Designed a comprehensive self-service personal information management system for Amazon's worldwide workforce of 1.6M+ employees. The project aimed to deprecate a third-party tool (PeopleSoft) and build an in-house HCM tool that provides global employees with the ability to manage their personal information through intuitive self-service capabilities.",
  challenge:
    "Employees' personal information management experience was fragmented across different products and modalities that were inconsistent with each other. Discoverability was a major issue, and employees were bound to rely on HR associates to make changes to their personal information. The existing system lacked a unified, accessible interface for managing diverse types of personal data.",
  solution:
    "Created a centralized, mobile-first personal information management hub within the AtoZ app. The solution provides employees with one place to manage all their personal information including names, contact details, emergency contacts, addresses, job details, work authorization, and education information. The design emphasizes intuitive information architecture, self-service capabilities, and accessibility across all user segments.",
  outcome:
    "Successfully enabled self-service personal information management for 1.6M+ global Amazon employees. Deprecated third-party PeopleSoft tool, moving to in-house HCM solution. Improved discoverability through clear information categorization and reduced dependency on HR associates for routine updates.",
  hero: essIntro,
  impact: "Empowered 1.6M+ users globally with self-service capabilities",
  research: {
    methodology:
      "Foundational research combining historic data analysis, persona development, employee anecdotes, and iterative usability testing",
    participants: [
      {
        title: "Employees",
        count: "Multiple segments",
        demographics:
          "Hourly Fulfillment Center workers, Corporate Remote employees, Hourly Middle-Mile Delivery, Corporate In-Person, FC Field managers, Corporate Travellers",
        methods: [
          "Persona development and validation",
          "User interviews and anecdotes collection",
          "Usability testing sessions",
          "Feedback analysis from existing systems",
        ],
      },
    ],
    keyFindings: [
      {
        finding: "Mobile-First Requirement",
        details:
          "Employees, especially hourly workers, need easy access to manage personal information from mobile devices, away from service centers.",
        impact: "Designed mobile-optimized experience as primary interface",
      },
      {
        finding: "One-Stop-Shop Demand",
        details:
          "Users wanted a convenient, centralized location for accessing all their personal information instead of navigating multiple systems.",
        impact: "Created unified personal information hub with clear categorization",
      },
      {
        finding: "Self-Service Expectation",
        details: "Employees desired easier ways to find, edit, and save personal information without HR assistance.",
        impact: "Implemented intuitive self-service capabilities for all information types",
      },
      {
        finding: "Discoverability Issues",
        details:
          "Users struggled to find where different types of personal information could be updated across fragmented systems.",
        impact: "Developed clear information architecture with logical categorization",
      },
      {
        finding: "Diverse User Needs",
        details:
          "Different employee segments (hourly FC, corporate, field managers) had varying access patterns and technology comfort levels.",
        impact: "Ensured consistent experience across all user types and devices",
      },
    ],
    insights: [
      "Personal information management must be accessible from anywhere, not just desks or service centers",
      "Clear information architecture reduces cognitive load and improves task completion",
      "Self-service capabilities empower employees and reduce HR administrative burden",
      "Consistency across mobile and desktop platforms ensures accessibility for all employee types",
      "Integration with established design systems (Stencil) accelerates adoption and familiarity",
    ],
  },
  sections: [
    {
      id: "research",
      title: "Research & Discovery",
      nav: "Research",
      research: true,
      images: [
        { src: users, alt: "End users" },
        { src: personas, alt: "Employee personas" },
      ],
    },
    {
      id: "information-architecture",
      title: "Information Architecture",
      nav: "IA",
      images: [
        { src: ia, alt: "IA structure" },
        { src: userflow, alt: "User flows" },
      ],
    },
    {
      id: "design-system",
      title: "Design System Integration",
      nav: "Design system",
      images: [{ src: designSystem, alt: "Design system components" }],
    },
    {
      id: "design-prototyping",
      title: "Design & Prototyping",
      nav: "Prototyping",
      images: [
        { src: wireframes, alt: "Wireframes" },
        { src: hifi, alt: "High fidelity designs" },
      ],
    },
  ],
  keyFeatures: [
    "Centralized personal information hub with clear categorization",
    "Self-service editing and changes",
    "Mobile-optimized responsive design",
  ],
  technologies: ["Amazon Stencil Design System", "Figma", "Mobile-first responsive design", "Accessibility guidelines"],
};

export default atoz;
