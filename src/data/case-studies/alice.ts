import aliceIntro from "@/assets/alice.png?responsive";
import aliceResponsive from "@/assets/alice-responsive.png?responsive";
import alice1 from "@/assets/alice/alice1.png?responsive";
import alice2 from "@/assets/alice/alice2.png?responsive";
import alice3 from "@/assets/alice/alice3.png?responsive";
import alice4 from "@/assets/alice/alice4.png?responsive";
import alice5 from "@/assets/alice/alice5.png?responsive";
import alice6 from "@/assets/alice/alice6.png?responsive";
import { altFor } from "../alt-text";
import type { CaseStudy } from "../types";

const alice: CaseStudy = {
  kind: "case-study",
  id: 9,
  title: "Simplifying disability and leave management using AI",
  category: "UX | Product Design | Research | Gen AI",
  client: "Amazon - Disability Leave Services (DLS)",
  duration: "6 months",
  year: "2024-2025",
  role: "Lead Product Designer, UX Researcher",
  description: "A conversational Gen AI system for streamlining disability and leave services intake at Amazon",
  overview:
    "This product is a conversational Gen AI solution designed to transform the accommodation and leave request intake process at Amazon. Based on extensive research with employees and operations associates, ALICE provides an intelligent, empathetic chat experience that simplifies a complex bureaucratic process.",
  challenge:
    "The traditional accommodation and leave request intake process was fragmented, confusing, and time-consuming. Employees struggled to navigate complex forms, understand their options, and provide the correct documentation. Operations associates were overwhelmed with incomplete requests and repetitive questions. This led to delays in processing, employee frustration, and increased administrative burden on DLS teams.",
  solution:
    "Through comprehensive research involving employees and ops associates at Amazon, we proposed ALICE - a Gen AI-powered conversational assistant that guides users through the intake process naturally. ALICE understands context from employee situations, asks clarifying questions, extracts information from uploaded documents using OCR, and automatically populates requests with accurate information. The system provides personalized guidance based on employee type (associate vs. corporate), condition type, and individual circumstances.",
  outcome:
    "Research validated strong user need for an AI-assisted intake system. While user acceptance of AI solutions varied - ranging from enthusiastic early adopters to cautious skeptics - the majority of participants saw value in having an intelligent assistant to navigate the complex process. Key benefits include reduced intake time, fewer incomplete requests, and improved employee experience during stressful life events.",
  hero: aliceIntro,
  impact:
    "Streamlined accommodation intake process by improved employee experience during stressful life events, scaled adoption of AI",
  introImages: [{ src: aliceResponsive, alt: altFor("alice-responsive.png", "ALICE on both mobile and desktop") }],
  research: {
    methodology:
      "Mixed-methods research combining interviews, usability testing, and surveys with employees and operations associates",
    participants: [
      {
        title: "Employees",
        count: 52,
        demographics:
          "Both warehouse associates and corporate employees across multiple Amazon locations in the US, representing diverse accommodation and leave scenarios",
        methods: [
          "Contextual interviews (n=18)",
          "Concept testing sessions (n=15)",
          "Prototype usability testing (n=19)",
          "Survey responses (n=52)",
        ],
      },
      {
        title: "Operations Associates",
        count: 14,
        demographics:
          "DLS operations associates responsible for processing accommodation and leave requests, with 1-10 years of experience",
        methods: [
          "Workflow analysis sessions (n=8)",
          "Pain point interviews (n=10)",
          "Solution co-design workshops (n=6)",
          "Survey responses (n=14)",
        ],
      },
    ],
    keyFindings: [
      {
        finding: "Complex Process Confusion",
        details:
          "73% of employees found the existing intake process confusing and overwhelming. Many didn't know which type of accommodation or leave to request, or what documentation was required.",
        impact: "High rates of incomplete or incorrect requests, requiring multiple rounds of back-and-forth communication",
      },
      {
        finding: "Documentation Challenges",
        details:
          "Employees struggled with understanding what medical documentation was needed. 65% of initial requests lacked proper supporting documentation.",
        impact: "Significant delays in case processing and frustrated employees waiting for decisions",
      },
      {
        finding: "Varied AI Acceptance Levels",
        details:
          "User acceptance of AI solutions ranged significantly: 35% were enthusiastic early adopters, 45% were cautiously optimistic with specific concerns, and 20% were skeptical. Trust, privacy, and accuracy were key concerns.",
        impact:
          "Need for transparent AI communication, human oversight options, and clear privacy protections in the solution design",
      },
      {
        finding: "Associate vs. Employee Differences",
        details:
          "Warehouse associates had different needs and technology comfort levels compared to corporate employees. Associates preferred mobile-first, simple interactions with voice input options.",
        impact: "Solution needed to adapt to different user contexts and technology access patterns",
      },
      {
        finding: "Ops Associate Processing Burden",
        details:
          "Operations associates spent 60% of their time on intake-related issues: clarifying requests, requesting additional documentation, and correcting form errors.",
        impact: "Reduced capacity for complex case work and longer processing times for all requests",
      },
      {
        finding: "Emotional Context Matters",
        details:
          "Employees are often going through stressful life situations (injury, illness, family care) when requesting accommodations. They valued empathetic, patient guidance.",
        impact: "AI tone and interaction design needed to be supportive and understanding, not robotic or transactional",
      },
    ],
    insights: [
      "Users want AI assistance but with clear human escalation paths for complex situations",
      "Conversational guidance reduces cognitive load during an already stressful time",
      "Document intelligence (OCR + understanding) can eliminate manual form filling",
      "Trust in AI grows when users see accurate, helpful responses in their specific situation",
      "AI acceptance increases when users understand what the AI can/cannot do",
      "Personalization based on employee type and situation improves relevance and adoption",
    ],
    aiAcceptance: [
      {
        label: "Enthusiastic Adopters",
        percentage: 35,
        tone: "positive",
        characteristics: "Early adopters who valued efficiency and were comfortable with AI technology",
        feedback: "Loved the idea of not filling out forms manually, appreciated intelligent suggestions",
      },
      {
        label: "Cautiously Optimistic",
        percentage: 45,
        tone: "neutral",
        characteristics:
          "Open to AI assistance but had specific concerns about accuracy, privacy, and whether the AI truly understood their situation",
        feedback:
          "Wanted to see AI responses before submission, valued transparency about AI limitations, needed reassurance about data privacy",
      },
      {
        label: "Skeptical",
        percentage: 20,
        tone: "negative",
        characteristics: "Preferred human interaction, concerned about AI making mistakes in sensitive situations",
        feedback:
          "Wanted option to bypass AI entirely, needed strong human oversight, valued clear escalation to human case managers",
      },
    ],
  },
  sections: [
    { id: "research", title: "Research & Discovery", nav: "Research", research: true, images: [] },
    {
      id: "journey",
      title: "User Journey Walkthrough",
      nav: "Walkthrough",
      images: [alice1, alice2, alice3, alice4, alice5, alice6].map((src, i) => ({
        src,
        alt: altFor(`alice/alice${i + 1}.png`, `ALICE journey walkthrough, step ${i + 1} of 6.`),
      })),
    },
  ],
  keyFeatures: [
    "Conversational Gen AI-powered intake system",
    "Document intelligence with OCR capabilities",
    "Smart recommendations based on employee situation",
    "Personalized guidance for different user types",
    "Multi-request handling recognition",
    "Human escalation pathways",
    "Mobile-optimized interface",
  ],
  technologies: [
    "Gen AI/LLM",
    "Document extraction",
    "Predictive UX",
    "Intelligent Assistive Interfaces",
    "Conversation design",
    "Figma",
  ],
};

export default alice;
