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
    processAlts: [
      "USPS.com homepage: main navigation (Quick Tools, Send, Receive, Shop, Business, International, Help), a navy Informed Delivery banner beside a phone showing a mail digest, and a package-tracking search bar.",
      "Strategy slide on customer experience at USPS.com in two columns: imperatives of CX (audience, expectations, value, mission) and CX priorities (service, listening, consistency, sustainability, inform, promote), each briefly defined.",
      "Slide setting out a five-step, UX-focused CI approach for USPS.com: Discover objectives and requirements, Analyze data, Advocate for the user, Design for simplicity and low cognitive load, and Assess by testing iteratively.",
      "Heuristic evaluation scorecard rating ten heuristics from 5 (Excellent) to 1 (Bad), with notes: Credible and Valuable score 5, Controllable 2, and Accessible 1 because the form fails 508 review; overall 3.3. Behind it, the USPS Digital Style Guide homepage.",
      "Slide on usability testing and user interviews: red arrows show nav labels Mail & Ship, Track & Manage and Postal Store renamed Send, Receive and Shop. Below, a participant works at a lab workstation beside icons of desktop and mobile testing.",
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
    processAlts: [
      "Grain-textured digital illustration of a cream MBTA train with the T logo, its windows drawn as blue speech bubbles, nearing a platform where a woman reads under her own bubble. Peach, plum and mustard palette.",
      "Teal circular badge reading 'Web Content Accessibility Guidelines, WCAG 2.1 AA Compliant' with the EqualWeb Digital Accessibility logo and a check mark, representing the standard the audit tested against.",
      "Logos of the testing tools: Google Lighthouse (a striped lighthouse under a night sky), the JAWS screen reader (a blue shark), Dragon NaturallySpeaking speech recognition, and a colour wheel representing contrast checking.",
      "MBTA intranet homepage under test: a carousel featuring a GM video update from General Manager Steve Poftak, a Latest Updates list of JAWS and Dragon test pages, and a poll to vote on a new intranet name.",
      "Cover page of the UserWorks findings and recommendations report for the Massachusetts Bay Transportation Authority Intranet Accessibility Evaluation, with the UserWorks logo and office address.",
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
    processAlts: [
      "Two blue and white SwiftPay mobile screens: a landing page with the logo, a Welcome message and a Register button, and an onboarding screen titled Instant Money Transfer, with illustrated people sending money between their phones.",
      "Four visual search screens on a yellow background: an intro with Take a photo and Upload an image buttons, a camera view of an illustrated woman, a crop frame around her top, and a Finding similar results loader.",
      "Two minimal furniture app screens on grey: a product page for a mustard armchair at $199.99 with colour swatches and an Add to cart button, and a Trending list showing a dog sofa and woven storage baskets.",
      "Four movie booking screens on a blue background: picking a cinema from a list and map, choosing a date and showtime, a seat map with two seats selected, and a Tickets booked confirmation with a cinePass card.",
      "Four orange and white food ordering screens: a No Contact Delivery prompt, a burger detail page at $10.99, a checkout screen with payment, address and delivery options including drone delivery, and a card entry form.",
      "Three sign-up flow screens with red buttons on a blue background: Sign up with a validated name field, Login with Google and Facebook options, and Forgot password showing an invalid email error.",
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
    processAlts: [
      "Title slide with the coral and orange UserWorks logo, where a figure with raised arms forms the W, above a coral banner that reads For a better User Experience.",
      "Slide titled Overview of UserWorks: a consulting firm specialising in usability and human factors engineering, UX design and evaluation, and interaction design. It was founded in 1989 by Dick Horst and has 11 staff plus partner consultants.",
      "Slide titled Typical Methods, in three columns: Research (interviews, focus groups, surveys, analytics, contextual inquiry), Design (task analysis, card sorting, personas, wireframes, prototyping, style guides) and Evaluation (usability testing, expert reviews, accessibility, eye tracking).",
      "Slide titled Usability Evaluation Setup listing lab testing, focus groups, remote and portable testing, web surveys and eye tracking. Photos show a lab observation room and a camera recording a participant's hands using a phone and a printout.",
      "Section divider reading Project Specific Experiences on a coral banner, with flat illustrations of a designer at an easel of wireframe sketches, a tablet showing a screen flow, a man beside phone mockups and a man at a laptop.",
      "Slide on usability research and redesign for AAMC, a Washington DC non-profit, for the app medical students use to apply for electives. Flow diagrams show a student's document upload updating all their applications, and a host viewing a profile to approve or reject them.",
      "Redesigned AAMC VSAS 'My Documents' page: a table of a student's uploads (CV, photo, board scores) with Download, Update and Remove buttons, and a success banner confirming an updated resume applies to all applications.",
      "Redesigned AAMC VSAS admin view of a student's applications: profile details and tabs above an Emergency Medicine elective application, with nested tables of required documents, each marked Complete with Open and Update buttons.",
      "Section divider 'Accessibility Review and Remediation': a flat coral-and-slate illustration of a man in dark glasses with a cane on a zebra crossing and a wheelchair user having coffee with a friend, beside an orange figure logo.",
      "'Accessibility at UserWorks' slide: 'Usability' and 'Accessibility' joined by a chain link, with bullets saying accessible design improves experience for everyone, beside Microsoft's inclusive design grid of permanent, temporary and situational impairments.",
      "'Accessibility Tools' slide mapping assistive tech to impairments: screen readers, contrast checks and magnifiers for vision; Dragon voice control and keyboard-only use for motor; captions for hearing; plain language for cognition, with JAWS, ZoomText and Dragon logos.",
      "'Accessibility Standards' text slide summarising WCAG 2.0 and 2.1 from the W3C's Web Accessibility Initiative and Section 508 of the US Rehabilitation Act, noting its 2017 update adopted most WCAG 2.0 level A and AA criteria.",
      "'Accessibility Compliance Testing' slide listing methods: testing with and without JavaScript across browsers, automated tools like WebAIM, sighted specialists using screen readers, blind reviewers, and usability testing with blind users.",
      "Timeline of the MassDOT ATLAS accessibility project, 2017–2019: UserWorks' Round 1 evaluation of Release 1, RMV fixes alongside Release 2, then a 2019 retest and Round 2 evaluation, framed by JAWS, ZoomText, Dragon and keyboard images.",
      "MassDOT ATLAS screens under evaluation: a staff-facing 'New Manager' dashboard with a long menu and list of recent records, and the public myRMV Online Service Center home page with Featured Services buttons.",
    ],
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
    processAlts: [
      "Black-and-white pencil drawing of a mother with long dark hair, eyes closed, tenderly kissing the head of a sleeping newborn she cradles in her hands.",
      "Painting of fishing families on a beach at golden hour: a man carries fish past a wooden boat where others sort nets, with a basket of fish in front and a yellow sky over blue sea.",
      "Loose watercolour landscape of large rounded boulders and shrubs, with a tree at left and a stone slab on two pillars in the distance, washed in pink, orange, purple and green.",
      "Painting of a pillared house courtyard where two women in green and yellow saris pound grain with long wooden pestles, while others sift grain and fill sacks on a blue tiled floor.",
      "Vivid painting of a winding dirt path leading to wooden stilt huts among red, orange and yellow autumn trees, with a white waterfall and purple mountains at right.",
      "Painting of a forest stream flowing between smooth boulders, framed by tall trees with yellow-green leaves, with misty blue mountains and pines behind.",
      "Painting of a desert village: a veiled woman in yellow sits with two children and goats under a large tree as a turbaned man drives a camel cart past a small hut.",
      "Painting of a long road under arching green and yellow trees that form a tunnel, with a few small figures walking along it beneath a pale blue sky.",
      "Three hand-painted ceramic plates on black: one shows Libra and Cancer zodiac symbols on orange, the others a smiling cartoon groom and bride in traditional Indian dress, named Sreeni and Madhu.",
      "Loosely painted street scene of a dense crowd, rendered in quick dabs, gathered beneath a row of tall green trees between old grey buildings with arched windows.",
      "Painting of a road with a dashed yellow line running toward jagged grey mountain peaks, past a golden field and white milestones on the left and red and yellow shrubs on the right.",
      "Painted rendition of the Ajanta mural of Bodhisattva Padmapani: a golden-skinned figure in a tall ornate crown and pearl necklace holds a white lotus, eyes lowered, against mottled red and green.",
      "Digital painting of an orange dirt path running straight through bright green fields, lined by tall, slender palm trees, under a hazy orange sky above a purple treeline.",
      "Digital painting of a full moon in a starry night sky, framed by billowing white clouds and casting a shimmering silver path across a deep blue sea.",
      "Digital painting of a glowing amber sky with soft clouds over a dark field; a winding path leads to a thatched hut at right, and two slender trees stand silhouetted on the horizon.",
      "Digital painting of a black city skyline silhouetted against a flat orange sky with a pale glowing sun, its towers reflected in rippling brown water below.",
      "Digital painting of two birds perched side by side on a bare branch, silhouetted in black against a fiery red-orange sky that fades to a white glow.",
    ],
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
