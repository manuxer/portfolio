/**
 * The AtoZ case study (/projects/10): personal information management (ESS) in Amazon's
 * AtoZ app. Its copy and layout live here, built from the site's own parts: the scroll-zoom
 * hero, meta card, reveals, lightbox, next-project card and section dock.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Ambient } from "@/components/Aurora";
import { CaseHero, CheckBadge, MetaCard, NextProject, TechChips } from "@/components/CaseStudyParts";
import { ContactCTA } from "@/components/ContactCTA";
import { CountUp } from "@/components/CountUp";
import { Img } from "@/components/Img";
import type { LightboxItem } from "@/components/lightbox-context";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionDock } from "@/components/SectionDock";
import { Heading, SummaryCard, ZoomImage } from "@/components/StoryParts";
import { WordsReveal } from "@/components/WordsReveal";
import { nextProjectOf } from "@/data/projects";
import type { PageCaseStudy } from "@/data/types";
import { useTitle } from "@/hooks/useTitle";
import { cn } from "@/lib/cn";
import a11ySpecs from "@/assets/atoz/accessibility-specs.webp?responsive";
import directionA from "@/assets/atoz/direction-a.webp?responsive";
import directionB from "@/assets/atoz/direction-b.webp?responsive";
import directionC from "@/assets/atoz/direction-c.webp?responsive";
import liveWeb from "@/assets/atoz/live-web.webp?responsive";
import personaCorporateInPerson from "@/assets/atoz/persona-corporate-in-person.webp?responsive";
import personaCorporateRemote from "@/assets/atoz/persona-corporate-remote.webp?responsive";
import personaCorporateTraveller from "@/assets/atoz/persona-corporate-traveller.webp?responsive";
import personaFieldManager from "@/assets/atoz/persona-fc-field-manager.webp?responsive";
import personaFulfillment from "@/assets/atoz/persona-fulfillment-center.webp?responsive";
import personaMiddleMile from "@/assets/atoz/persona-middle-mile-delivery.webp?responsive";
import photoTable from "@/assets/atoz/photo-corporate-table.webp?responsive";
import photoWalk from "@/assets/atoz/photo-corporate-walk.webp?responsive";
import photoAssociate from "@/assets/atoz/photo-fc-associate.webp?responsive";
import screenCategories from "@/assets/atoz/screen-categories.webp?responsive";
import screenEdit from "@/assets/atoz/screen-edit.webp?responsive";
import screenNames from "@/assets/atoz/screen-names.webp?responsive";
import screenProfile from "@/assets/atoz/screen-profile.webp?responsive";
import wireCategories from "@/assets/atoz/wire-categories.webp?responsive";
import wireEdit from "@/assets/atoz/wire-edit.webp?responsive";
import wireNames from "@/assets/atoz/wire-names.webp?responsive";
import wireProfile from "@/assets/atoz/wire-profile.webp?responsive";
import prototypePoster from "@/assets/atoz/prototype-poster.webp";
import prototypeVideo from "@/assets/atoz/prototype.mp4";

const HERO_ALT =
  "Three tilted AtoZ phone screens on a navy background: the personal information category list, the Profile screen with Manage personal information, and a name edit form with a Save button";

const DOCK = [
  { id: "overview", label: "Overview" },
  { id: "goals", label: "Goals" },
  { id: "research", label: "Research" },
  { id: "structure", label: "Structure" },
  { id: "design", label: "Design" },
  { id: "accessibility", label: "Accessibility" },
  { id: "impact", label: "Impact" },
];

/** Phone screens keep their own rounded corners; the image is clipped to the same shape. */
const SCREEN_SHAPE = "overflow-hidden rounded-[4%/1.64%]";
const SCREEN_SIZES = "(min-width: 1024px) 270px, (min-width: 768px) 22vw, 46vw";
const display = "font-[family-name:var(--font-display)] font-semibold tracking-[-0.045em] tabular-nums";
const cardTitle = "text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-fg";
/** Inverted panel: dark in the light theme, a raised surface in the dark theme. */
const inverted = "bg-fg text-bg dark:bg-surface dark:text-fg dark:shadow-[inset_0_0_0_1px_var(--hairline-strong)]";

const group = (id: string, images: Array<{ src: LightboxItem["src"]; alt: string }>): LightboxItem[] =>
  images.map((img, i) => ({ key: `${id}-${i}`, ...img }));

const WIREFRAMES = group("wire", [
  { src: wireProfile, alt: "Wireframe of the Profile screen with a Personal information entry" },
  { src: wireCategories, alt: "Wireframe of the category list" },
  { src: wireNames, alt: "Wireframe of the Names screen with Edit links" },
  { src: wireEdit, alt: "Wireframe of the preferred name form" },
]);
const WIREFRAME_CAPTIONS: Array<[string, string]> = [
  ["Profile", "A clear starting point"],
  ["Categories", "Every category in a list"],
  ["Names", "Values with Edit links"],
  ["Edit", "One simple form"],
];

const DIRECTIONS = group("direction", [
  { src: directionA, alt: "Direction A: profile with tabs and a flat list of locked and editable fields" },
  { src: directionB, alt: "Direction B: profile with a single Personal information row" },
  { src: directionC, alt: "Direction C: one long personal information page with sections" },
]);
const DIRECTION_CAPTIONS: Array<[string, string]> = [
  ["A · Tabs and one list", "Everything was visible but hard to scan. Lock icons didn’t explain how to change locked fields."],
  ["B · A single row", "It looked clean, but one row didn’t tell people what was inside."],
  ["C · One long page", "It mixed viewing and editing, and would get too long as more categories were added."],
];

const FINAL = group("final", [
  { src: screenProfile, alt: "Profile screen with Manage personal information as the first option" },
  { src: screenCategories, alt: "Personal information screen listing categories with previews" },
  { src: screenNames, alt: "Names screen showing legal and preferred names with Edit links" },
  { src: screenEdit, alt: "Edit preferred name screen with filled-in fields and a Save button" },
]);
const FINAL_LABELS = ["Profile", "Categories", "Details", "Edit"];

const DECISION_SCREENS = group("decision", [
  { src: screenCategories, alt: "Personal information screen listing categories with previews" },
  { src: screenNames, alt: "Names screen showing legal and preferred names with Edit, Add and Delete actions" },
  {
    src: screenEdit,
    alt: "Edit preferred name screen with a short explanation, filled-in fields, optional labels and a Save button",
  },
]);

const A11Y = group("a11y", [
  { src: a11ySpecs, alt: "Accessibility specs on three screens: skip link, H1 headings, button labels and numbered tab order" },
]);

const LIVE = group("live", [
  { src: liveWeb, alt: "The live AtoZ Profile page on the web, listing sixteen personal information categories" },
]);

const PERSONA_GROUPS = [
  {
    title: "Hourly employees",
    color: "var(--brand-green)",
    personas: [
      {
        image: personaFulfillment,
        alt: "Persona card for @sofialopez: the quote above a blurred photo of an associate in a hard hat and safety vest",
        name: "Hourly fulfillment center",
        quote: "“It should be easy to change my personal information.”",
      },
      {
        image: personaMiddleMile,
        alt: "Persona card for @ajaydeep: the quote above a blurred photo of a delivery associate in a face mask carrying a box",
        name: "Hourly middle-mile delivery",
        quote: "“I wish it was easier to manage my personal information from my phone, away from the SC.”",
      },
    ],
  },
  {
    title: "Corporate employees",
    color: "var(--brand-blue)",
    personas: [
      {
        image: personaCorporateRemote,
        alt: "Persona card for @samsmith: the quote above a blurred photo of a corporate employee in a dark sweater",
        name: "Corporate remote",
        quote: "“I need a convenient, one-stop-shop for accessing my personal info.”",
      },
      {
        image: personaCorporateInPerson,
        alt: "Persona card for @aliahjones: the quote above a blurred photo of a corporate employee with long curly hair, chin resting on one hand",
        name: "Corporate in-person",
        quote: "“I wish it was easier to find, edit, and save my personal info at Amazon.”",
      },
    ],
  },
  {
    title: "Other",
    color: "var(--fg-3)",
    personas: [
      {
        image: personaFieldManager,
        alt: "Persona card for @owendavis: the quote above a blurred photo of a field manager in a yellow hard hat and safety vest",
        name: "FC field manager",
        quote: "“I need more efficient ways to manage my personal info without the help of HR.”",
      },
      {
        image: personaCorporateTraveller,
        alt: "Persona card for @jenmiller: the quote above a blurred photo of a corporate employee in a white jacket",
        name: "Corporate traveller",
        quote: "“I want quick and easy access to Amazon sites, tools, and information while on the road.”",
      },
    ],
  },
];

const CATEGORY_GROUPS: Array<{ title: string; items: string[]; sensitive?: boolean }> = [
  { title: "Identity", items: ["Names", "Pronouns", "Birth information", "Other personal information"] },
  { title: "Contact", items: ["Contact information", "Addresses", "Emergency contacts"] },
  { title: "Legal and work", items: ["Marital status", "National IDs", "Work authorization and citizenship"] },
  { title: "Background", items: ["Education", "Languages"] },
  {
    title: "Self-ID (optional)",
    items: ["Gender and sexual orientation", "Race and ethnicity", "Military", "Disability"],
    sensitive: true,
  },
];

const STEPS = ["Open AtoZ", "Go to Profile", "Personal information", "Choose a category", "Choose the item", "Edit", "Save", "See the change"];

export default function AtozCaseStudy({ project }: { project: PageCaseStudy }) {
  useTitle(project.title);
  const next = nextProjectOf(project.id);

  return (
    <article>
      <CaseHero id={project.id} image={project.hero} alt={HERO_ALT} />

      {/* ── Header and the short version ── */}
      <section className="relative pb-20 pt-14 md:pb-28 md:pt-20">
        <div className="container-x relative">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
            <div className="lg:col-span-2">
              <Reveal>
                <p className="t-eyebrow">UX | Product design | Research</p>
              </Reveal>
              <WordsReveal as="h1" text={project.title} className="t-headline mt-4" delay={0.05} stagger={0.05} />
              <Reveal delay={0.25}>
                <p className="t-lead mt-6 max-w-2xl">
                  How 1.6 million Amazon employees view and update their own personal information.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.2} blur={false}>
              <MetaCard
                items={[
                  ["Company", "Amazon", "AtoZ app"],
                  ["My role", "Product Designer, UX Researcher", "Research through launch"],
                  ["Timeline", "2022–2023", "5 releases in 12 months"],
                  ["Platforms", "Mobile and web", "Designed in Figma with Stencil"],
                  ["Audience", "1.6M+ employees", "Hourly, corporate and field"],
                ]}
              />
            </Reveal>
          </div>

          <Reveal className="mt-14 md:mt-20">
            <h2 className="t-subtitle">The short version</h2>
          </Reveal>
          <Stagger className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              {
                label: "Problem",
                text: "Employees couldn’t update their own personal information. Their details were spread across different tools, and changes had to go through HR.",
              },
              {
                label: "What I did",
                text: "I led the UX from research to launch. I organized 16 categories of personal data, designed the flows and screens, and wrote the accessibility specs.",
              },
              {
                label: "Result",
                text: "More than 100,000 changes made by employees themselves, and 10,000 new self-identification submissions worldwide.",
              },
            ].map((item) => (
              <StaggerItem key={item.label} className="h-full">
                <SummaryCard item={item} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Context and the problem ── */}
      <section id="overview" className="section section-alt">
        <div className="container-x">
          <Heading eyebrow="Context" title="AtoZ is the app Amazon employees use for work.">
            People use it to check schedules, see pay, request time off and get help from HR. Most people use it on
            their phone, and for many hourly employees the phone is the only device they use for work. Employee Self
            Service (ESS) lives inside AtoZ, under Profile, next to each employee’s job details and manager.
          </Heading>

          <div className="mt-24 md:mt-32">
            <Heading eyebrow="The problem" title="Employees couldn’t update their own personal information.">
              Even a name change or a new emergency contact meant asking an HR associate to do it. That was frustrating
              for employees, and at Amazon’s size it created a lot of work for HR.
            </Heading>
            <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
              <StaggerItem className="h-full">
                <Card title="Spread out">Personal information lived in several products, and each one worked differently.</Card>
              </StaggerItem>
              <StaggerItem className="h-full">
                <Card title="Hard to find">In feedback, employees said they often didn’t know where to look.</Card>
              </StaggerItem>
              <StaggerItem className="h-full">
                <Card title="Dependent on HR">Even small changes needed an HR associate to make them.</Card>
              </StaggerItem>
            </Stagger>
            <Reveal className="mt-5" blur={false}>
              <div className={cn("grid gap-2 rounded-[26px] p-7 md:grid-cols-[220px_minmax(0,1fr)] md:items-baseline md:gap-8", inverted)}>
                <p className="t-label !text-current opacity-70">The underlying issue</p>
                <p className="text-[1.15rem] font-medium leading-snug tracking-[-0.016em]">
                  There was no single place that held an employee’s own information.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-24 md:mt-32">
            <SubHead eyebrow="Why the timing was right" title="Amazon was replacing its old HR system.">
              I planned the design work alongside the migration. Every category I designed for self-service could also
              move off the old system, so engineering and business partners had their own reasons to support the design.
            </SubHead>
            <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-6">
              <Reveal blur={false} className="h-full">
                <BeforeAfter
                  label="Before"
                  title="A third-party HR system"
                  items={["PeopleSoft, through PeoplePortal", "Changes handled by HR", "Hard to add new fields"]}
                />
              </Reveal>
              <Reveal blur={false} delay={0.1} className="flex justify-center">
                <span className="grid h-12 w-12 rotate-90 place-items-center rounded-full glass glass-soft text-fg lg:rotate-0">
                  <ArrowRight size={20} aria-hidden="true" />
                </span>
              </Reveal>
              <Reveal blur={false} delay={0.15} className="h-full">
                <BeforeAfter
                  inverted
                  label="After"
                  title="An in-house HR system (HCM) inside AtoZ"
                  items={["One place for all personal data", "Employees make their own changes", "Room to add self-identification"]}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Goals ── */}
      <section id="goals" className="section">
        <div className="container-x">
          <Heading eyebrow="Goals" title="Four goals, and how I measured them.">
            I worked with product to agree on the measures early. That kept reviews focused on results, and it’s why I
            can share real numbers at the end.
          </Heading>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
            {[
              ["Self-service worldwide", "Let employees anywhere update their own personal information.", "Changes employees submitted themselves"],
              ["Replace the old tool", "Move off PeopleSoft and build the system in-house.", "Number of categories moved into AtoZ"],
              ["Include everyone", "Add self-identification and other sensitive fields.", "Self-ID page views and submissions"],
              ["Make it easy to find", "Organize information into clear categories.", "People finding the right category on their own"],
            ].map(([title, text, measure]) => (
              <StaggerItem key={title} className="h-full">
                <div className="glass glass-soft glass-rim flex h-full flex-col rounded-[26px] p-7">
                  <h3 className={cardTitle}>{title}</h3>
                  <p className="t-body mt-2">{text}</p>
                  <div className="hairline-t mt-auto pt-4">
                    <p className="t-label mt-2">Measured by</p>
                    <p className="mt-1.5 font-medium leading-snug text-fg">{measure}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Users and research ── */}
      <section id="research" className="section section-alt overflow-hidden">
        <Ambient variant="b" />
        <div className="container-x relative">
          <Heading eyebrow="Users" title="I designed for every employee.">
            A fulfillment center associate might check AtoZ on a short break. A delivery driver might use it between
            stops. A corporate employee might be at a desk or travelling. So I started with the person with the least
            time and the smallest screen, then made sure it still worked well on desktop.
          </Heading>

          <Reveal blur={false} className="mt-12 grid gap-3 md:mt-16 md:gap-4">
            <div className="media-frame">
              <Img
                src={photoTable}
                alt="Two corporate employees working at a long wooden table, seen from above"
                sizes="(min-width: 1200px) 1120px, 94vw"
                className="block aspect-[2040/500] h-auto w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-[1470fr_1120fr] gap-3 md:gap-4">
              <div className="media-frame">
                <Img
                  src={photoAssociate}
                  alt="Fulfillment center associate scanning a cart of packages"
                  sizes="(min-width: 1200px) 640px, 54vw"
                  className="block aspect-[1470/880] h-full w-full object-cover"
                />
              </div>
              <div className="media-frame">
                <Img
                  src={photoWalk}
                  alt="Two corporate employees walking and talking outside an office"
                  sizes="(min-width: 1200px) 490px, 42vw"
                  className="block h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2 md:mt-14">
            <p className={cn(display, "text-[clamp(3.4rem,2rem+5vw,5.5rem)] leading-none text-[var(--brand-blue)]")}>1.6M+</p>
            <p className="t-body-lg max-w-xl">employees, from fulfillment centers and delivery stations to corporate offices.</p>
          </Reveal>

          <div className="mt-20 md:mt-28">
            <SubHead title="The six personas I built.">
              I built and validated six personas across hourly, corporate and other roles, each with an anecdote from
              employee feedback. Their jobs and devices were different, but the need was the same.
            </SubHead>
            <Stagger className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
              {PERSONA_GROUPS.map((g) => (
                <StaggerItem key={g.title}>
                  <h4 className="border-b-2 pb-2.5 text-[1.05rem] font-semibold tracking-[-0.016em] text-fg" style={{ borderColor: g.color }}>
                    {g.title}
                  </h4>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {g.personas.map((p) => (
                      <figure key={p.name}>
                        <Img src={p.image} alt={p.alt} sizes="200px" className="mx-auto block h-auto w-full max-w-[200px]" />
                        <figcaption className="mt-3">
                          <span className="t-label block">{p.name}</span>
                          <span className="mt-1.5 block text-[0.95rem] font-medium leading-snug text-fg">{p.quote}</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="mt-20 md:mt-28">
            <SubHead title="What I learned from research." />
            <Reveal className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              <p className="t-label">Methods</p>
            </Reveal>
            <div className="mt-3">
              <TechChips
                items={[
                  "Past research and data",
                  "Persona building and validation",
                  "User interviews",
                  "Employee stories",
                  "Feedback on the old tools",
                  "Review of the old flows",
                  "Rounds of usability testing",
                ]}
              />
            </div>
            <Stagger className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                ["Many people use their phone.", "Hourly employees often aren’t near a computer or a service center, so I designed for mobile first."],
                ["People want one place.", "Employees didn’t want to search several tools or ask HR, so everything lives under Profile and they can make changes themselves."],
                ["People look for topics.", "They think “my address,” so I grouped information the way employees talk about it."],
                ["People check before they change.", "Employees want to see what’s on file first, so current values come before any edit option."],
                ["Needs differ by role.", "Hourly, corporate and field employees work in different places and with different devices, so I kept the steps the same for everyone."],
                ["Sensitive questions need care.", "Self-identification has to be optional and clearly explained."],
              ].map(([title, text]) => (
                <StaggerItem key={title} className="h-full">
                  <Card title={title} as="h4">
                    {text}
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── Design principles ── */}
      <section id="principles" className="section">
        <div className="container-x">
          <Heading eyebrow="Design principles" title="Four principles that guided my design.">
            Each one came from a research finding. In reviews with product, engineering and HR, I asked which principle a
            design supported. That made decisions faster.
          </Heading>
          <Stagger className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-14 lg:grid-cols-4 lg:gap-8">
            {[
              ["One place for everything", "All personal details live in one place, under Profile."],
              ["Easy to find", "Clear category names, each with a short preview of what’s inside."],
              ["See it, then edit it", "Current values come first. Editing happens on its own screen."],
              ["Safe and accessible", "Works with assistive technology, keeps data private and makes personal questions optional."],
            ].map(([title, text]) => (
              <StaggerItem key={title} className="border-t-2 border-fg pt-5">
                <h3 className={cardTitle}>{title}</h3>
                <p className="t-body mt-2">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Information architecture ── */}
      <section id="structure" className="section section-alt">
        <div className="container-x">
          <Heading eyebrow="Information architecture" title="How the information is organized.">
            This was one of the most important parts of the project. Most of the improvement came from naming and
            grouping, before any visual design.
          </Heading>

          <Stagger as="ol" className="mt-10 space-y-3 md:mt-14" stagger={0.06}>
            <IaLevel label="Bottom tabs">
              {["Home", "Schedule", "Pay", "More"].map((t) => (
                <span key={t} className={cn("chip", inverted)}>
                  {t}
                </span>
              ))}
            </IaLevel>
            <IaLevel label="Sub-navigation">
              <span className="chip glass glass-soft">Profile</span>
              <Note>Reached from Home and from More</Note>
            </IaLevel>
            <IaLevel label="Pages">
              <span className="chip glass glass-soft">Personal information</span>
              <Arrow />
              <span className="chip glass glass-soft">
                <Num n={1} />
                Category: Names
              </span>
              <Arrow />
              <span className="chip glass glass-soft">
                <Num n={2} />
                Details: Preferred name
              </span>
            </IaLevel>
            <IaLevel label="Full-screen edit">
              <span className="chip bg-[color-mix(in_srgb,var(--brand-blue)_16%,transparent)] text-fg">
                <Num n={3} />
                Edit preferred name
              </span>
              <Note>Opens on top of the details page</Note>
            </IaLevel>
          </Stagger>

          <Stagger className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              ["Two ways to reach Profile.", "Home and More are the two places people already look for their own information, so Profile is in both."],
              ["Viewing and editing are separate.", "People can look around without changing something by mistake."],
              ["Edits open on their own screen.", "It’s clear what’s being changed, and easy to cancel."],
            ].map(([lead, text]) => (
              <StaggerItem key={lead}>
                <p className="t-body">
                  <b className="font-semibold text-fg">{lead}</b> {text}
                </p>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-20 md:mt-28">
            <SubHead title="16 categories, grouped by topic.">
              I turned scattered fields into sixteen categories with simple names that translate well across countries.
              Common items come first. Sensitive, optional questions are at the end of the list.
            </SubHead>
            <Stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {CATEGORY_GROUPS.map((g) => (
                <StaggerItem key={g.title} className="h-full">
                  <div className={cn("h-full rounded-[22px] p-5", g.sensitive ? inverted : "glass glass-soft glass-rim text-fg")}>
                    <h4 className="t-label !text-current opacity-70">{g.title}</h4>
                    <ul className="mt-3">
                      {g.items.map((item) => (
                        <li key={item} className="border-t border-current/15 py-2 text-[0.97rem] leading-snug first:border-t-0">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="mt-20 md:mt-28">
            <SubHead title="The same steps on every device.">
              Each screen asks one simple question: where is it, which one is it, and what should it say. The flow is the
              same on phone and desktop, so people only have to learn it once.
            </SubHead>
            <Stagger as="ol" className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4" stagger={0.05}>
              {STEPS.map((step, i) => (
                <StaggerItem
                  as="li"
                  key={step}
                  className={cn(
                    "rounded-[20px] p-5",
                    i === STEPS.length - 1
                      ? "bg-[color-mix(in_srgb,var(--positive)_14%,transparent)]"
                      : "glass glass-soft glass-rim",
                  )}
                >
                  <span className="t-label !text-[var(--brand-blue)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-1.5 font-semibold leading-snug tracking-[-0.016em] text-fg">{step}</p>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-6">
              <p className="t-body max-w-3xl">
                The new value shows right away after saving. When people can see that the change worked, they trust
                self-service and don’t need to call HR to check.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Wireframes and early directions ── */}
      <section id="design" className="section">
        <div className="container-x">
          <Heading eyebrow="Wireframes" title="I started with simple wireframes.">
            Research happened between each phase. I tested the structure with wireframes before any visual design, and
            checked designs with employees and stakeholders before engineering started building.
          </Heading>
          <div className="mt-10 grid grid-cols-2 gap-5 md:mt-14 md:grid-cols-4">
            {WIREFRAMES.map((item, i) => (
              <Shot key={item.key} group={WIREFRAMES} index={i} title={WIREFRAME_CAPTIONS[i][0]} text={WIREFRAME_CAPTIONS[i][1]} />
            ))}
          </div>

          <div className="mt-20 md:mt-28">
            <SubHead title="I explored three early directions.">
              Each had a problem that showed up in testing. The final design keeps what worked: a clear list of
              categories, a preview on each row, and a separate screen for editing.
            </SubHead>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {DIRECTIONS.map((item, i) => (
                <Shot key={item.key} group={DIRECTIONS} index={i} title={DIRECTION_CAPTIONS[i][0]} text={DIRECTION_CAPTIONS[i][1]} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final design ── */}
      <section className="section section-alt">
        <div className="container-x">
          <Heading eyebrow="Final design" title="The final design in four screens." />
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 md:mt-14 md:grid-cols-4 md:gap-6">
            {FINAL.map((item, i) => (
              <Reveal key={item.key} blur={false} delay={i * 0.06}>
                <figure>
                  <ZoomImage
                    group={FINAL}
                    index={i}
                    sizes={SCREEN_SIZES}
                    label="screen"
                    plain
                    className={cn("mx-auto w-full max-w-[270px] shadow-[var(--shadow-card)]", SCREEN_SHAPE)}
                  />
                  <figcaption className="mt-4 flex items-center justify-center gap-2 font-semibold text-fg">
                    <Num n={i + 1} />
                    {FINAL_LABELS[i]}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-14">
            <Reveal blur={false}>
              <LoopVideo
                src={prototypeVideo}
                poster={prototypePoster}
                width={720}
                height={1752}
                label="Prototype video: from Profile, tap Manage personal information, choose Names, tap Edit next to the preferred name, change Anthony to Tony, tap Save, see Tony Stark on the Names screen, then go back to Profile"
              />
            </Reveal>
            <div>
              <SubHead eyebrow="Prototype" title="The whole flow, start to finish.">
                Changing a preferred name takes five taps and a few keystrokes.
              </SubHead>
              <Stagger as="ol" className="mt-6 border-b border-[var(--hairline)]" stagger={0.06}>
                {[
                  <>
                    Tap <b className="font-semibold text-fg">Manage personal information</b> on Profile.
                  </>,
                  <>
                    Choose <b className="font-semibold text-fg">Names</b> from the category list.
                  </>,
                  <>
                    Tap <b className="font-semibold text-fg">Edit</b> next to the preferred name.
                  </>,
                  <>
                    Change the first name and tap <b className="font-semibold text-fg">Save</b>.
                  </>,
                  <>Back on Names, the new preferred name is already there.</>,
                ].map((step, i) => (
                  <StaggerItem as="li" key={i} className="hairline-t flex gap-4 py-3.5">
                    <span className="w-5 shrink-0 font-semibold tabular-nums text-[var(--brand-blue)]">{i + 1}</span>
                    <span className="t-body">{step}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>

          <div className="mt-20 space-y-16 md:mt-28 md:space-y-24">
            <Decision
              index={0}
              eyebrow="Decision 1 · The category list"
              title="Each row shows what’s inside."
              points={[
                ["Title and preview", "“Names · Legal name, Preferred name” tells people what they’ll find before they tap."],
                ["The same row everywhere", "I used the same Stencil list row for every category, so the page is easy to scan and works well with screen readers."],
                ["Help on every screen", "The “My HR help” button is in every header, so help is always one tap away."],
              ]}
            />
            <Decision
              index={1}
              eyebrow="Decision 2 · View, then edit"
              title="People see their details before they edit."
              points={[
                ["Current values first", "Legal and preferred names are shown up front, so people can check them before changing anything."],
                ["Actions next to the data", "Edit and Add sit beside the name they change. Delete has its own labelled icon."],
                ["Legal and preferred names together", "The preferred name is how someone wants to be known at work. The legal name is still used for pay and compliance."],
              ]}
            />
            <Decision
              index={2}
              eyebrow="Decision 3 · The edit screen"
              title="Editing happens on its own screen."
              points={[
                ["A short explanation", "A plain-language definition of “preferred name” sits at the top of the form."],
                ["Pre-filled fields", "Current values are already filled in, and optional fields are marked “optional.”"],
                ["One main button", "Save is the only primary button. Cancel is always in the top right."],
              ]}
            />
          </div>

          <Stagger className="mt-20 grid gap-5 md:mt-28 md:grid-cols-2">
            <StaggerItem className="h-full">
              <LabelledCard label="Design system" title="I designed ESS with Stencil.">
                Stencil is Amazon’s design system for employee-facing products. It gave the team accessible, consistent
                components from the start and helped engineering build faster. Employees already knew it from other Amazon
                tools, so ESS felt familiar right away. I designed new pieces, like the category row with a preview, so
                other teams could use them too.
              </LabelledCard>
            </StaggerItem>
            <StaggerItem className="h-full">
              <LabelledCard label="Layout" title="One layout for every screen size.">
                4 columns on mobile and 6 on tablet. On desktop the same 6 columns sit in the center, so forms stay at a
                comfortable width on wide screens.
              </LabelledCard>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ── Sensitive information and accessibility ── */}
      <section id="accessibility" className="section">
        <div className="container-x">
          <Heading eyebrow="Sensitive information" title="I designed the sensitive questions with care.">
            ESS added self-identification for the first time: gender and sexual orientation, race and ethnicity, military
            status and disability. People share these details when they understand why we ask and who will see them.
          </Heading>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
            {[
              ["Always optional", "Self-ID is never required, and people can choose not to answer."],
              ["Explain why we ask", "Each screen explains how the data is used and who can see it."],
              ["Follow local rules", "What we can ask is different in each country, so some options launched country by country."],
              ["Clear about timing", "Some changes apply right away and others need verification. The screen says which."],
            ].map(([title, text]) => (
              <StaggerItem key={title} className="h-full">
                <Card title={title}>{text}</Card>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-20 md:mt-28">
            <SubHead eyebrow="Accessibility" title="Accessibility was planned from the start.">
              I wrote accessibility specs for each screen as part of the handoff to engineering. Since I was also designing
              disability self-identification, it was especially important that the experience itself was fully accessible.
            </SubHead>
            <Reveal blur={false} className="mt-8">
              <ZoomImage group={A11Y} index={0} sizes="(min-width: 1200px) 1120px, 94vw" label="image" />
            </Reveal>
            <Stagger as="ul" className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2" stagger={0.05}>
              {[
                ["Skip link and headings.", "A hidden “Skip to content” link and one H1 on each screen."],
                ["Clear button labels.", "Screen readers say “Edit preferred name” instead of just “Edit.”"],
                ["Keyboard order.", "Tab moves between sections, and arrow keys move within them."],
                ["Labels included.", "Stencil components come with ARIA labels by default."],
              ].map(([lead, text]) => (
                <StaggerItem as="li" key={lead} className="flex items-start gap-4">
                  <CheckBadge />
                  <p className="t-body">
                    <b className="font-semibold text-fg">{lead}</b> {text}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── Launch and impact ── */}
      <section id="impact" className="section section-alt overflow-hidden">
        <Ambient variant="c" />
        <div className="container-x relative">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div>
              <Heading eyebrow="Launch" title="ESS is live in AtoZ.">
                We released it in five stages over twelve months, and I supported engineering through each one. The live
                page now has sixteen categories, from names to self-identification.
              </Heading>
              <Points
                className="mt-6"
                items={[
                  ["Lower risk.", "Each area moved off the old system only when it was ready."],
                  ["Time to learn.", "Feedback from each release shaped the next one."],
                  ["Local rules.", "Country-specific options launched once they were approved."],
                ]}
              />
            </div>
            <Reveal blur={false}>
              <div className="surface-card mx-auto max-w-[460px] overflow-hidden">
                <div className="flex gap-1.5 border-b border-[var(--hairline)] px-4 py-3" aria-hidden="true">
                  <i className="h-2.5 w-2.5 rounded-full bg-fg-3/40" />
                  <i className="h-2.5 w-2.5 rounded-full bg-fg-3/40" />
                  <i className="h-2.5 w-2.5 rounded-full bg-fg-3/40" />
                </div>
                <ZoomImage group={LIVE} index={0} sizes="(min-width: 1024px) 460px, 92vw" label="image" plain />
              </div>
            </Reveal>
          </div>

          <div className="mt-24 md:mt-32">
            <Heading eyebrow="Impact" title="What changed after launch." />
            <Stagger className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3">
              {[
                { value: 100, suffix: "K+", text: "personal information changes submitted by employees since launch" },
                { value: 26, suffix: "%", text: "of ESS page views are for self-identification" },
                { value: 10, suffix: "K", text: "new self-identification submissions worldwide" },
              ].map((s) => (
                <StaggerItem key={s.text} className="h-full">
                  <div className="glass glass-rim h-full rounded-[28px] p-7 md:p-8">
                    <CountUp value={s.value} suffix={s.suffix} className={cn(display, "text-[clamp(3rem,2.2rem+2.6vw,4.2rem)] leading-none text-fg")} />
                    <p className="t-body mt-3">{s.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Stagger className="mt-5 grid gap-5 md:grid-cols-2">
              {[
                ["All goals met", "We met every product and business goal for 2022 and 2023."],
                ["Stretch goal met", "We expanded gender and disability options worldwide, and added sexual orientation and transgender identification in several countries."],
                ["Old tool replaced", "Personal information moved off PeopleSoft and into Amazon’s own HR system (HCM)."],
                ["Less work for HR", "Routine updates no longer go through an HR associate, and clear categories make each one easy to find."],
              ].map(([title, text]) => (
                <StaggerItem key={title} className="h-full">
                  <Card title={title}>{text}</Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── What's next ── */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div>
            <Heading eyebrow="What’s next" title="ESS made new guided journeys possible.">
              Because all categories now live in one system, I could design guided flows on top of them.
            </Heading>
            <Points
              className="mt-6"
              items={[
                ["Life events.", "Step-by-step help for things like getting married or having a child. I designed this as a concept, and it has its own case study."],
                ["Keeping details current.", "Reminders to review emergency contacts and addresses."],
                ["Better measurement.", "Tracking task completion and HR cases avoided for each category."],
              ]}
            />
          </div>
          <Reveal blur={false}>
            <div className="glass glass-rim rounded-[28px] p-7 md:p-8">
              <p className="t-label">Life event · concept</p>
              <h3 className={cn(cardTitle, "mt-3")}>Marital status change</h3>
              <p className="t-body mt-2">
                Changes in marital status can affect your benefits. You can finish all the related steps in one place.
              </p>
              <ol className="mt-5">
                {[
                  "Update marital status",
                  "Check personal information",
                  "Update benefits and beneficiaries",
                  "Update login or alias",
                  "Finish the life change",
                ].map((step, i) => (
                  <li key={step} className="hairline-t flex items-baseline justify-between gap-4 py-3 text-[0.97rem] text-fg">
                    {step}
                    {i === 0 && <span className="text-[0.85rem] text-fg-3">Required</span>}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What I learned ── */}
      <section className="section section-alt">
        <div className="container-x">
          <Heading eyebrow="Reflection" title="What I learned." />
          <Stagger className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-10">
            {[
              ["Structure matters most.", "Most of the improvement came from naming and grouping, before any visual polish."],
              ["Trust matters with sensitive data.", "People share personal details when they understand why we ask and who will see them."],
              ["Releasing in stages helps.", "Each release gave me a chance to learn and adjust the design."],
            ].map(([title, text]) => (
              <StaggerItem key={title} className="hairline-t pt-6">
                <h3 className={cardTitle}>{title}</h3>
                <p className="t-body mt-2">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <NextProject next={next} />
      <ContactCTA />
      <SectionDock items={DOCK} />
    </article>
  );
}

/* ───────────────────────── parts ───────────────────────── */

/** A heading inside a section: an optional eyebrow, an h3 and a short paragraph. */
function SubHead({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <Reveal>
          <p className="t-label">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h3 className={cn("t-subtitle", eyebrow && "mt-3")}>{title}</h3>
      </Reveal>
      {children && (
        <Reveal delay={0.1}>
          <p className="t-body mt-3">{children}</p>
        </Reveal>
      )}
    </div>
  );
}

function Card({ title, as: H = "h3", children }: { title: string; as?: "h3" | "h4"; children: ReactNode }) {
  return (
    <div className="glass glass-soft glass-rim h-full rounded-[26px] p-7">
      <H className={cardTitle}>{title}</H>
      <p className="t-body mt-2">{children}</p>
    </div>
  );
}

function LabelledCard({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <div className="glass glass-soft glass-rim h-full rounded-[26px] p-7 md:p-8">
      <p className="t-label">{label}</p>
      <h3 className={cn(cardTitle, "mt-3")}>{title}</h3>
      <p className="t-body mt-2">{children}</p>
    </div>
  );
}

function BeforeAfter({ label, title, items, inverted: dark = false }: { label: string; title: string; items: string[]; inverted?: boolean }) {
  return (
    <div className={cn("h-full rounded-[26px] p-7", dark ? inverted : "glass glass-soft glass-rim text-fg")}>
      <p className="t-label !text-current opacity-70">{label}</p>
      <h4 className="mt-3 text-[1.15rem] font-semibold leading-snug tracking-[-0.02em]">{title}</h4>
      <ul className="mt-4">
        {items.map((item) => (
          <li key={item} className="border-t border-current/15 py-2.5 text-[0.97rem] opacity-85">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function IaLevel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <StaggerItem
      as="li"
      className="glass glass-soft glass-rim grid gap-3 rounded-[20px] p-5 md:grid-cols-[170px_minmax(0,1fr)] md:items-center md:gap-6 md:px-6"
    >
      <p className="t-label">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </StaggerItem>
  );
}

function Num({ n }: { n: number }) {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--brand-blue)] text-[0.72rem] font-semibold tabular-nums text-white">
      {n}
    </span>
  );
}

function Arrow() {
  return <ArrowRight size={16} className="text-fg-3" aria-hidden="true" />;
}

function Note({ children }: { children: ReactNode }) {
  return <span className="px-1 text-[0.92rem] text-fg-2">{children}</span>;
}

/** A framed image with a title and a sentence under it, opening in the lightbox. */
function Shot({ group: items, index, title, text }: { group: LightboxItem[]; index: number; title: string; text: string }) {
  return (
    <Reveal blur={false} delay={index * 0.06}>
      <figure>
        <div className="rounded-[24px] bg-[var(--bg-2)] p-3 md:p-4">
          <ZoomImage group={items} index={index} sizes="(min-width: 1024px) 300px, 46vw" label="image" />
        </div>
        <figcaption className="mt-4 px-1">
          <h4 className={cardTitle}>{title}</h4>
          <p className="t-body mt-1">{text}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function Points({ items, className }: { items: Array<[lead: string, text: string]>; className?: string }) {
  return (
    <Stagger as="ul" className={cn("space-y-3", className)} stagger={0.05}>
      {items.map(([lead, text]) => (
        <StaggerItem as="li" key={lead} className="t-body">
          <b className="font-semibold text-fg">{lead}</b> {text}
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** A key decision: its screen beside the reasoning. */
function Decision({
  index,
  eyebrow,
  title,
  points,
}: {
  index: number;
  eyebrow: string;
  title: string;
  points: Array<[title: string, text: string]>;
}) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-14">
      <Reveal blur={false}>
        <ZoomImage
          group={DECISION_SCREENS}
          index={index}
          sizes="(min-width: 768px) 280px, 70vw"
          label="screen"
          plain
          className={cn("mx-auto w-[70%] max-w-[280px] shadow-[var(--shadow-card)] md:w-full", SCREEN_SHAPE)}
        />
      </Reveal>
      <div>
        <SubHead eyebrow={eyebrow} title={title} />
        <Stagger as="ul" className="mt-6 border-b border-[var(--hairline)]" stagger={0.06}>
          {points.map(([pointTitle, text]) => (
            <StaggerItem as="li" key={pointTitle} className="hairline-t py-4">
              <h4 className="font-semibold leading-snug tracking-[-0.016em] text-fg">{pointTitle}</h4>
              <p className="t-body mt-1">{text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

/**
 * The prototype video: muted and looping, playing only while it's on screen. With reduced
 * motion it waits for the viewer; the button under it pauses or plays it.
 */
function LoopVideo({ src, poster, width, height, label }: { src: string; poster: string; width: number; height: number; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const [visible, setVisible] = useState(false);
  const wantsPlay = choice === "play" || (choice === "auto" && !reduced);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (wantsPlay && visible) el.play().catch(() => {});
    else el.pause();
  }, [wantsPlay, visible]);

  return (
    <figure className="mx-auto w-full max-w-[300px]">
      <video
        ref={ref}
        src={src}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className={cn("block h-auto w-full bg-[var(--bg-2)] shadow-[var(--shadow-card)]", SCREEN_SHAPE)}
      />
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setChoice(wantsPlay ? "pause" : "play")}
          className="btn btn-sm btn-glass glass glass-soft"
          aria-label={wantsPlay ? "Pause the prototype video" : "Play the prototype video"}
        >
          {wantsPlay ? "Pause" : "Play"}
        </button>
      </div>
    </figure>
  );
}
