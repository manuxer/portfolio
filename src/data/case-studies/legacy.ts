import amazonLogo from "@/assets/amazon-phone-logo.png?responsive";
import type { LegacyProject } from "../types";

const LEGACY = "https://manupeethambar.github.io/manuxer";

const range = (count: number, url: (n: number) => string) => Array.from({ length: count }, (_, i) => url(i + 1));

const list: LegacyProject[] = [
  {
    kind: "legacy",
    id: 1,
    title: "User experience design | NDA",
    category: "UX | Product design | Research",
    client: "Amazon",
    duration: "Ongoing",
    year: "2021 - Present",
    role: "Product, User experience, Interaction designer",
    description: "User experience design and product strategy of enterprise products impacting over 1.5M users at Amazon.",
    challenge:
      "Designing enterprise products for a massive scale while maintaining usability and meeting the diverse needs of over 1.6 million users across various roles and workflows.",
    solution:
      "Applied user-centered design principles, conducted extensive research, and created scalable design systems that work across multiple product lines. Collaborated with cross-functional teams to ensure design solutions align with business goals and user needs.",
    outcome:
      "Successfully delivered user experience design for enterprise products serving 1.6M+ users, improving productivity and user satisfaction across Amazon's internal tools.",
    hero: amazonLogo,
    isNDA: true,
    processImages: [],
    subProjects: [1, 2, 3, 4].map((n) => ({
      title: `Project Ingress ${n}`,
      description: "Password protected project",
      isPasswordProtected: true,
    })),
  },
  {
    kind: "legacy",
    id: 2,
    title: "Usability evaluation and interaction design",
    category: "UX | Research",
    client: "USPS",
    duration: "Multiple projects",
    year: "2020",
    role: "UX Designer",
    description: "Usability analysis and redesign of the Postal Service website",
    overview:
      "USPS.com is the digital storefront for United States Postal Service®. The site is an important and ever-growing part of the daily USPS® delivery system, providing 24-hour access to USPS® products and services.",
    challenge:
      "USPS.com needed continuous improvement to handle increased traffic (especially during COVID), improve customer experience, and reduce burden on Post Office™ locations. The site serves the American public (residential consumers), small and medium businesses, as well as foreign shippers.",
    solution:
      "Implemented a comprehensive UX strategy including usability testing, heuristic evaluations, and continuous improvement processes. Created Digital Style Guide (DSG) and UX Heuristics to ensure consistent customer experience. Worked with 10 domain-specific teams including Content Strategy, Design, Digital Analytics, and User Experience & UX Design.",
    outcome:
      "Successfully improved USPS.com's digital experience, helping it handle significant traffic increases during COVID-19. Delivered projects including PO Locator redesign and USPS® Online Postal Store improvements.",
    hero: `${LEGACY}/files/USPS/Logo/USPS_logo.png`,
    processImages: [
      `${LEGACY}/files/USPS/usps_ux/usps-hero1.png`,
      `${LEGACY}/files/USPS/usps_ux/cx-at-usps.png`,
      `${LEGACY}/files/USPS/usps_ux/ux-steps.png`,
      `${LEGACY}/files/USPS/usps_ux/usps-heuristic.png`,
      `${LEGACY}/files/USPS/usps_ux/usability-testing.png`,
    ],
    subProjects: [
      {
        title: "PO Locator - Find USPS® Locations",
        description: "A tool to find USPS Locations on USPS.com (or send directions) and hours of operation.",
        image: `${LEGACY}/files/USPS/PO_Locator/img/po-banner.png`,
      },
      {
        title: "USPS® Online Postal Store",
        description:
          "Online Postal Store - Order stamps, shipping supplies, and unique items only available from the United States Postal Service.",
        image: `${LEGACY}/files/USPS/usps_ux/usps-store.png`,
      },
    ],
  },
  {
    kind: "legacy",
    id: 3,
    title: "Accessibility evaluation and inclusive design",
    category: "Accessibility",
    client: "MBTA",
    duration: "3 months",
    year: "2021",
    role: "UX Designer & Accessibility Specialist",
    description: "Accessibility evaluation and remediation of the MBTA intranet website",
    overview:
      "The MBTA intranet system is an internal application for MBTA employees that enables communication, information sharing, and job task fulfillment. The system includes features such as discussion forums, surveys, directories, content management, and analytics.",
    challenge:
      "The accessibility audit identified areas where the system could introduce barriers or cause difficulty for people with disabilities. Testing covered 41 pages and use cases using WCAG 2.1 Level AA as a guide.",
    solution:
      "Conducted comprehensive accessibility evaluation using multiple assistive technologies including JAWS screen reader, Dragon Naturally Speaking, keyboard-only navigation, and color contrast tools. Tested across Chrome, Internet Explorer, and Firefox browsers. Provided detailed findings and recommendations for remediation.",
    outcome:
      "Delivered comprehensive accessibility report with severity ratings and actionable recommendations. Identified key issues including missing alt text, keyboard accessibility problems, focus indicators, and WCAG compliance gaps. Provided clear remediation strategies for each finding.",
    hero: `${LEGACY}/files/MBTA/img/MBTA-hero.jpeg`,
    processImages: [
      `${LEGACY}/files/MBTA/img/MBTA-hero2.jpeg`,
      `${LEGACY}/files/MBTA/img/wcag2-1.png`,
      `${LEGACY}/files/MBTA/img/tools.png`,
      `${LEGACY}/files/MBTA/img/MBTA-main.png`,
      `${LEGACY}/files/MBTA/img/report.png`,
    ],
    methodology: [
      "Access the intranet system via web browser using user accounts provided by the MBTA team",
      "Test selection of 41 pages and use cases (AKA tasks), as identified by the client",
      "Use W3C's Web Content Accessibility Guidelines (WCAG 2.1) Level AA as a guide for this evaluation",
      "Explore all areas of the screen, including the menus, forms, and other components, to ensure a complete accessibility review",
    ],
    tools: [
      "Chrome's Accessibility Dev tools auditor - Lighthouse",
      "JAWS - Screen Reader",
      "Dragon Naturally Speaking - Speech Recognition Software",
      "Color Contrast evaluation tool",
      "Keyboard only evaluation",
    ],
  },
  {
    kind: "legacy",
    id: 4,
    title: "My experiments",
    category: "UI/UX",
    client: "Personal Projects",
    duration: "Ongoing",
    year: "2019 - Present",
    role: "Designer",
    description: "A collection of my design experiments",
    overview:
      "This portfolio showcases various UI/UX design experiments exploring different design patterns, interactions, and visual styles across mobile and web applications.",
    challenge:
      "Exploring new design trends, experimenting with different interaction patterns, and pushing creative boundaries while maintaining usability and accessibility standards.",
    solution:
      "Created diverse design concepts including SwiftPay (payment app), Visual Search interface, Furniture app, CinePass (movie booking), Food ordering app, and e-commerce signup flows. Each experiment focuses on solving specific UX challenges with innovative approaches.",
    outcome:
      "Built a comprehensive portfolio of design experiments demonstrating versatility across different domains and design challenges. These experiments inform real-world project decisions and showcase design thinking capabilities.",
    hero: `${LEGACY}/files/Experiments/VisualSearch.png`,
    processImages: [
      `${LEGACY}/files/Experiments/SwiftPay.png`,
      `${LEGACY}/files/Experiments/VisualSearch.png`,
      `${LEGACY}/files/Experiments/Furniture%20app.png`,
      `${LEGACY}/files/Experiments/cinePass.png`,
      `${LEGACY}/files/Experiments/Food%20ordering%20app.png`,
      `${LEGACY}/files/Experiments/e-commerce%20signup.png`,
    ],
  },
  {
    kind: "legacy",
    id: 5,
    title: "Design consulting at UserWorks",
    category: "UX Specialist",
    client: "UserWorks",
    duration: "15 months",
    year: "2019",
    role: "UX Specialist",
    description: "Design - Evaluate - Iterate",
    overview:
      "A comprehensive exploration of usability engineering principles and methodologies through design, research and practical application.",
    challenge:
      "Understanding and applying systematic usability engineering processes including user research, iterative design, evaluation methods, and design refinement.",
    solution:
      "Applied structured usability engineering methodology covering the complete design lifecycle: user research, persona development, task analysis, prototyping, usability testing, and iterative improvements based on findings.",
    outcome:
      "Developed deep understanding of usability engineering principles and delivered practical design solutions validated through systematic evaluation methods.",
    hero: `${LEGACY}/img/UW.png`,
    processImages: range(15, (n) => `${LEGACY}/files/UW/${n}.png`),
  },
  {
    kind: "legacy",
    id: 6,
    title: "My artwork",
    category: "Artwork / Paintings",
    client: "Personal Collection",
    duration: "Ongoing",
    year: "2001 - Present",
    role: "Artist",
    description: "An artist is a simplifier.. Art is the elimination of the unnecessary!",
    overview:
      "A personal collection of artwork and paintings exploring various styles, mediums, and artistic expressions. This collection represents the creative foundation that informs my design work.",
    hero: `${LEGACY}/files/MyPaintings/1.jpg`,
    processImages: range(17, (n) => `${LEGACY}/files/MyPaintings/${n}.${n <= 12 ? "jpg" : "png"}`),
  },
  {
    kind: "legacy",
    id: 7,
    title: "Accommodations intake redesign",
    category: "UX | Product Design | Research",
    client: "Amazon",
    duration: "6 months",
    year: "2024",
    role: "Product Designer, UX Researcher",
    description: "Redesigning the accommodations intake process to improve user experience and efficiency",
    overview:
      "A comprehensive redesign of the accommodations intake process to streamline workflows, improve accessibility, and enhance the overall user experience for both employees and administrators.",
    hero: amazonLogo,
    figmaEmbed:
      "https://embed.figma.com/deck/LhXIPj37x2N7kwbKGY8NTP/Accommodations-intake-redesign--Copy-?node-id=1-536&viewport=-95%2C-20%2C0.46&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share",
    figmaUrl: "https://www.figma.com/deck/LhXIPj37x2N7kwbKGY8NTP/Accommodations-intake-redesign--Copy-",
    processImages: [],
  },
];

export const legacyProjects: Record<number, LegacyProject> = Object.fromEntries(list.map((p) => [p.id, p]));
