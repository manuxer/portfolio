import aliceIntro from "@/assets/alice.png?responsive";
import john02 from "@/assets/alice/story/john_02.webp?responsive";
import john04 from "@/assets/alice/story/john_04.webp?responsive";
import john07 from "@/assets/alice/story/john_07.webp?responsive";
import sam02 from "@/assets/alice/story/sam_02.webp?responsive";
import sam07 from "@/assets/alice/story/sam_07.webp?responsive";
import sam11 from "@/assets/alice/story/sam_11.webp?responsive";
import jane04 from "@/assets/alice/story/jane_04.webp?responsive";
import jane05 from "@/assets/alice/story/jane_05.webp?responsive";
import jane09 from "@/assets/alice/story/jane_09.webp?responsive";
import portraitJohn from "@/assets/alice/story/portrait_john.webp?responsive";
import portraitSam from "@/assets/alice/story/portrait_sam.webp?responsive";
import portraitJane from "@/assets/alice/story/portrait_jane.webp?responsive";
import type { StoryCaseStudy } from "../types";

const alice: StoryCaseStudy = {
  kind: "story",
  id: 9,
  title: "Simplifying disability and leave requests with AI",
  product: "ALICE",
  category: "UX | Product design | Research | Gen AI",
  description:
    "ALICE is an AI assistant in Amazon’s A to Z app. Employees describe their situation in their own words, and ALICE turns it into the right request, then lets them check everything before it’s sent.",
  hero: aliceIntro,
  meta: [
    ["Company", "Amazon, Disability and Leave Services (DLS)"],
    ["Timeline", "6 months"],
    ["Year", "2024–2025"],
    ["My role", "Lead Product Designer, UX Researcher"],
    ["Platform", "A to Z mobile app, US"],
  ],
  summary: [
    { label: "The problem", text: "To ask for help, employees first had to understand HR policy." },
    {
      label: "What I did",
      text: "Led research with employees and DLS associates, designed the conversation and how the AI behaves, and designed three end-to-end flows.",
    },
    {
      label: "The result",
      text: "Testing confirmed strong demand for AI help, as long as people could see what the AI understood and reach a person when they needed one.",
    },
  ],
  problem: {
    title: "The problem",
    paragraphs: [
      "When people get hurt, get sick, care for a family member or deal with a disaster, they may need an accommodation or time off. The old intake asked them to choose an HR category first: accommodation, leave of absence, policy exception, FMLA or personal leave.",
      "Most people didn’t know which one fit. A wrong choice meant the case had to be moved and reworked, and missing documents left cases on hold.",
    ],
    stats: [
      { value: 73, suffix: "%", label: "of employees found the process confusing" },
      { value: 65, suffix: "%", label: "of first requests were missing the right documents" },
      { value: 60, suffix: "%", label: "of DLS associates’ time went to fixing intake issues" },
    ],
  },
  research: {
    title: "Talking to both sides of every request",
    intro:
      "I ran mixed-methods research with two groups: employees, including warehouse associates and corporate staff, and the DLS operations associates who process requests.",
    groups: [
      {
        title: "Employees",
        methods: [
          ["Contextual interviews", 18],
          ["Concept tests", 15],
          ["Prototype usability tests", 19],
          ["Survey responses", 52],
        ],
      },
      {
        title: "DLS operations associates",
        methods: [
          ["Workflow sessions", 8],
          ["Interviews", 10],
          ["Co-design workshops", 6],
          ["Survey responses", 14],
        ],
      },
    ],
    findings: [
      {
        title: "People don’t know the categories",
        text: "Many couldn’t tell which request type or which documents they needed.",
      },
      {
        title: "Trust in AI varies",
        text: "Most wanted to see what the AI understood and to have an easy way to reach a person.",
        acceptance: [
          { label: "enthusiastic", percentage: 35, tone: "positive" },
          { label: "cautiously optimistic", percentage: 45, tone: "neutral" },
          { label: "skeptical", percentage: 20, tone: "negative" },
        ],
      },
      {
        title: "Associates and corporate staff work differently",
        text: "Associates preferred short, mobile-first interactions, and some wanted voice input.",
      },
      {
        title: "Tone matters",
        text: "People are often stressed or in pain when they ask for help, and they wanted patient, supportive guidance.",
      },
    ],
    note: "After the first round of interviews, we moved to concept tests, prototype usability tests and co-design workshops with DLS associates. I wrote sample conversations for each persona, and worked with applied science on the tone rules, the card templates and a guide for scoring the AI’s answers.",
  },
  mainIdea: {
    title: "Turning a personal story into a complete request",
    quoteLabel: "What John wrote",
    quote:
      "“I have an injury in my left elbow, which makes it difficult for me to lift or hold heavy objects. My doctor has given me restrictions… I work in three areas: diver, full scan and small sort… Recently, my manager got upset…”",
    fieldsLabel: "What the case manager needs",
    fields: [
      ["Request type", "Accommodation, role change"],
      ["Limitation", "Motor (movement)"],
      ["Restrictions", "No lifting over 20 lbs, no bending or twisting"],
      ["Duration", "Indefinite"],
      ["Documents", "Doctor’s note, checked by John"],
    ],
    caption: "ALICE does the conversion, then shows the employee what it understood so they can confirm it.",
  },
  personas: {
    title: "Who we designed for",
    items: [
      {
        name: "John",
        tag: "Accommodation",
        text: "Operations associate with an elbow injury who wants to change his duties and keep working.",
        tests: "reading a doctor’s note",
        portrait: portraitJohn,
        alt: "Line illustration of John",
      },
      {
        name: "Sam",
        tag: "Disability & leave",
        text: "Employee with ADHD and anxiety who is also the only caregiver for his mother during chemo. Wants to work from home.",
        tests: "two needs in one message",
        portrait: portraitSam,
        alt: "Line illustration of Sam",
      },
      {
        name: "Jane",
        tag: "Personal leave",
        text: "Operations associate whose home was damaged by a hurricane. Wants to know what leave she can take.",
        tests: "picking the right leave",
        portrait: portraitJane,
        alt: "Line illustration of Jane",
      },
    ],
  },
  principles: {
    title: "Five principles for every conversation",
    items: [
      {
        title: "Start by listening",
        text: "Begin with an open question. People explain their situation in their own words, and ALICE picks out the details.",
      },
      {
        title: "Show what it understood",
        text: "Anything the AI works out is shown back as a short summary the employee can confirm or correct.",
      },
      {
        title: "Ask before submitting",
        text: "The AI never submits a request on its own. The employee always presses the button.",
      },
      {
        title: "Keep it calm and simple",
        text: "Acknowledge the situation once, then help. Plain words, one question at a time, no medical labels.",
      },
      {
        title: "Always show what’s next",
        text: "Every conversation ends with a status, something the person can do and a way to reach a human.",
      },
    ],
  },
  howItWorks: {
    title: "How ALICE builds a request",
    layers: [
      {
        label: "Experience",
        text: "The chat in A to Z, with summary cards, tap-to-answer buttons, document upload and a feedback button on every answer.",
      },
      {
        label: "AI",
        text: "Reads the employee’s message, spots each separate need, asks for anything missing and drafts the request.",
      },
      {
        label: "Data",
        text: "HR policies, the employee’s profile and time-off balances, document reading, and the case system (MyHR).",
      },
      {
        label: "Safeguards",
        text: "Answers based on policy, no medical or legal advice, only the data the case needs, asks when unsure, hands off to a person.",
      },
    ],
    steps: ["Open", "Reflect", "Clarify", "Confirm", "Submit", "Guide"],
    caption: "The AI writes the words. The design decides when to show a card, when to show buttons and when to ask for approval.",
  },
  walkthrough: {
    title: "Three people, three flows",
    stories: [
      {
        label: "Story 1 · John · Accommodation",
        title: "An injury, a doctor’s note and a role change",
        portrait: portraitJohn,
        screens: [
          { src: john02, alt: "John describes his elbow injury, restrictions and work areas in one message" },
          { src: john04, alt: "ALICE summarizes John’s doctor’s note and asks if it is accurate" },
          { src: john07, alt: "The full accommodation request with a Submit request button" },
        ],
        decisions: [
          {
            title: "Start with an open question",
            text: "“What can I help with?” lets John explain everything. He never has to pick a category.",
          },
          {
            title: "Check what the AI read",
            text: "ALICE summarizes his doctor’s note and asks if it’s accurate before using it.",
          },
          {
            title: "Submit when ready",
            text: "Only the Submit button creates the case. The AI can’t submit anything by itself.",
          },
        ],
      },
      {
        label: "Story 2 · Sam · Work from home",
        title: "Two needs in one message",
        portrait: portraitSam,
        screens: [
          {
            src: sam02,
            alt: "Sam explains his ADHD, anxiety and caregiving, and ALICE asks how long he needs to work from home",
          },
          { src: sam07, alt: "ALICE explains Sam needs two requests and shows the family care request" },
          { src: sam11, alt: "Confirmation cards, with the accommodation on hold pending documentation" },
        ],
        decisions: [
          {
            title: "Keep track of both needs",
            text: "Sam mentions his ADHD and anxiety, and caring for his mother. ALICE keeps both.",
          },
          {
            title: "Two requests from one conversation",
            text: "Family care and a disability accommodation follow different policies, so ALICE prepares two requests that Sam submits with one button.",
          },
          {
            title: "Documents can come later",
            text: "Sam doesn’t have his doctor’s note with him, so the request is filed as “On hold, pending documentation,” with clear next steps.",
          },
        ],
      },
      {
        label: "Story 3 · Jane · Personal leave",
        title: "Finding the right leave after a hurricane",
        portrait: portraitJane,
        screens: [
          { src: jane04, alt: "ALICE suggests Personal Leave and lists Jane’s PTO balances with options as buttons" },
          { src: jane05, alt: "Jane asks about FMLA and ALICE explains why it does not apply" },
          { src: jane09, alt: "Four numbered points about approvals, job protection, status and extensions" },
        ],
        decisions: [
          {
            title: "Suggest the right leave",
            text: "ALICE recommends Personal Leave, which covers natural disasters, and shows her real PTO balances.",
          },
          {
            title: "Answer side questions",
            text: "When Jane asks about FMLA, ALICE explains why it doesn’t apply and lists what does.",
          },
          {
            title: "Be clear about what happens next",
            text: "Approvals, job protection and how to extend her leave, in four short points.",
          },
        ],
      },
    ],
  },
  behavior: {
    title: "Designing how the AI behaves",
    intro:
      "The AI won’t say exactly the same thing every time, so we designed the building blocks, the tone and the safety rules it has to follow.",
    patterns: [
      "Open question",
      "Short recap",
      "One question at a time",
      "Quick answers",
      "Summary card",
      "Approval step",
      "Confirmation card",
      "Feedback on every answer",
    ],
    tone: ["Acknowledge once", "One question at a time", "Use their words", "Don’t diagnose", "Don’t promise outcomes"],
    toneExamples: [
      ["“Please specify the requested accommodation duration.”", "“For how long would you like to work from home?”"],
      ["“You qualify for FMLA.”", "“You may be eligible for FMLA, but it doesn’t cover natural disasters.”"],
    ],
    mistakes: [
      ["It misreads a document", "Shows a summary with a clear “No” button, so the employee can correct it."],
      ["It isn’t sure what someone needs", "Asks one follow-up question instead of guessing."],
      ["The case is complex", "Hands it to a DLS case manager, along with the conversation."],
      ["Someone mentions self-harm or danger", "Stops the request and shows support resources right away."],
      ["Someone asks if they’re eligible", "Answers only from policy and says “you may be eligible.”"],
    ],
    safeguards: [
      { label: "Trust", text: "Clearly labeled as AI. Shows what it understood and asks before submitting." },
      { label: "Privacy", text: "Collects only what the case needs. Medical documents are used only for that case." },
      {
        label: "Accessibility",
        text: "Screen-reader labels on every card, plain language, and tap or type for every choice.",
      },
    ],
  },
  outcome: {
    title: "What we learned from testing, and how we measure success",
    text: "Research and usability testing confirmed a strong need for an AI-assisted intake. Acceptance varied, but most participants saw value in getting help with a complex process, as long as they could check the AI’s work and reach a person.",
    goal: "Requests filed correctly the first time",
    measures: [
      {
        title: "Employee experience",
        items: ["Time to submit a request", "How many people finish", "“Was this helpful?” ratings"],
      },
      {
        title: "Case quality",
        items: ["Right request type on the first try", "Cases with complete documents", "Fewer cases moved or followed up"],
      },
      {
        title: "AI quality",
        items: ["Details checked by case managers", "Answers that match policy", "Safety cases handled correctly"],
      },
    ],
  },
  keyFeatures: [
    "Conversational intake",
    "Document reading",
    "Suggestions based on the employee’s situation",
    "More than one request per conversation",
    "Hand-off to a person",
    "Mobile-first design",
  ],
  roadmap: {
    title: "Where ALICE could go next",
    items: [
      {
        label: "Now",
        title: "US requests",
        text: "Accommodations, disability and leave, and personal leave, with document reading and case status in MyHR.",
      },
      {
        label: "Next",
        title: "Reaching out first",
        text: "Reminders for missing documents, status updates, return-to-work check-ins and Spanish support.",
      },
      {
        label: "Later",
        title: "More countries and users",
        text: "New countries and leave types, a version for managers, and voice input for associates on the floor.",
      },
    ],
  },
  learned: [
    {
      title: "Showing its work builds trust",
      text: "People trusted ALICE most when it showed what it understood and asked them to check.",
    },
    {
      title: "Tone needs testing too",
      text: "We wrote tone rules like requirements and tested them the same way we tested features.",
    },
    {
      title: "Designers should help define quality",
      text: "With AI, deciding what a good answer looks like is part of the design work.",
    },
  ],
};

export default alice;
