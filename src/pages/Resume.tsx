import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Download } from "lucide-react";
import { Ambient, Aurora } from "@/components/Aurora";
import { ButtonAnchor } from "@/components/Button";
import { ContactCTA } from "@/components/ContactCTA";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { WordsReveal } from "@/components/WordsReveal";
import { useTitle } from "@/hooks/useTitle";
import { EMAIL, LINKEDIN, MAILTO, publicUrl } from "@/lib/site";
import { spring } from "@/lib/motion";

interface Role {
  title: string;
  period: string;
  company: string;
  summary: string;
  highlights?: string[];
}

const experience: Role[] = [
  {
    title: "Lead UX/Product Designer",
    period: "Oct 2021 - Present",
    company: "Amazon",
    summary:
      "Led strategy and design execution across enterprise products serving 1.5M+ users translating complexity into clarity, influencing impact on a global scale. Delivered intuitive, inclusive, and scalable solutions that improved productivity and accessibility across Amazon operations.",
    highlights: [
      "Designed and launched 10+ major technology products and workflows across Amazon services delivering measurable impact on efficiency, accessibility, and customer satisfaction",
      "Scaled self-service product adoption across 55 countries (87% in the first month), reduced manual dependency by thousands of tickets monthly",
      "Led AI & Accessibility innovation, an AI-powered solution to help People with Disabilities (PWDs), and GenAI document extraction and analysis solutions that reduced decision times by 30%",
      "Conducted user research and usability testing with diverse user populations to inform design decisions, ensuring global inclusivity",
    ],
  },
  {
    title: "User Experience Specialist",
    period: "May 2019 - Oct 2021",
    company: "UserWorks",
    summary:
      "Delivered research-driven UX consulting across healthcare, education, and enterprise systems - conducting user research, usability and accessibility evaluations. Influenced data-informed design decisions that improved USPS.com 2.3B+ user sessions/year.",
  },
  {
    title: "UX Consultant & Product Designer",
    period: "Mar 2016 - Jan 2018",
    company: "Deloitte",
    summary:
      "Led end-to-end product design for Standard Chartered Bank's \"Straight2Bank\" platform - that improved transaction efficiency, aligned roadmap strategy, and unlocked 4,000+ hours of productivity.",
  },
  {
    title: "UX Consultant & Product Designer",
    period: "Aug 2011 - Mar 2016",
    company: "Infosys",
    summary:
      "Led product design for NetBenefits at Fidelity - improving customer engagement by 35% and elevated design consistency across products.",
  },
];

const skills = [
  { title: "Design", body: "Product Design, Interaction Design, Visual Design, Accessible Design" },
  { title: "User Experience", body: "Prototyping, Journey Mapping, Storyboarding, Information Architecture" },
  { title: "User Research", body: "User Interviews, Usability Testing, Surveys, A/B Testing, Data Synthesis & Analysis" },
  { title: "Tools", body: "Figma, Adobe Suite, AI design products" },
];

/** Spec-sheet row: label on the left, content on the right. */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="hairline-t relative grid gap-6 pt-8 md:grid-cols-[200px_1fr] md:gap-10 md:pt-10">
      <Reveal>
        <h2 className="t-subtitle md:sticky md:top-28">{title}</h2>
      </Reveal>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function TimelineItem({ role }: { role: Role }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -45% 0px" });
  const reached = reduced || inView;

  return (
    <li ref={ref} className="relative pl-10">
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-[0.4em] grid h-[13px] w-[13px] place-items-center rounded-full border border-[var(--hairline-strong)] bg-bg"
        animate={reached && !reduced ? { scale: [1, 1.35, 1] } : undefined}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.span
          className="h-[7px] w-[7px] rounded-full"
          style={{ background: "linear-gradient(135deg, var(--brand-yellow), var(--brand-red))" }}
          initial={{ scale: reduced ? 1 : 0 }}
          animate={{ scale: reached ? 1 : 0 }}
          transition={spring.snappy}
        />
      </motion.span>
      <Reveal>
        <div className="flex flex-col justify-between gap-1 md:flex-row md:items-baseline md:gap-6">
          <h3 className="text-[1.25rem] font-semibold tracking-[-0.022em]">
            {role.title}
            <span className="sr-only">, {role.company}</span>
          </h3>
          <p className="shrink-0 text-[0.95rem] tabular-nums text-fg-3">{role.period}</p>
        </div>
        <p className="mt-1 font-medium text-fg">{role.company}</p>
        <p className="t-body mt-3">{role.summary}</p>
        {role.highlights && (
          <ul className="mt-4 space-y-2.5">
            {role.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[0.98rem] leading-relaxed text-fg-2">
                <span aria-hidden="true" className="mt-[0.62em] h-1 w-1 shrink-0 rounded-full bg-fg-3" />
                {h}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </li>
  );
}

/** Experience timeline whose spine fills as you read down it. */
function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // The spine sits beside the list, not inside it, so the <ol> holds only <li>s.
  return (
    <div ref={ref} className="relative">
      <span aria-hidden="true" className="absolute bottom-2 left-[6px] top-3 w-px bg-[var(--hairline-strong)]" />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-2 left-[6px] top-3 w-px origin-top"
        style={{
          scaleY: reduced ? 1 : fill,
          background: "linear-gradient(var(--brand-yellow), var(--brand-red), var(--brand-green), var(--brand-blue))",
        }}
      />
      <ol className="space-y-12">
        {experience.map((role) => (
          <TimelineItem key={role.company + role.period} role={role} />
        ))}
      </ol>
    </div>
  );
}

export function Component() {
  useTitle("Resume");

  return (
    <>
      <section className="relative overflow-hidden pb-10 pt-40 text-center md:pt-52">
        <Aurora interactive={false} className="opacity-70" />
        <div className="aurora-fade" aria-hidden="true" />
        <div className="container-x hero-copy relative">
          <WordsReveal as="h1" className="t-headline" text="Resume" />
          <Reveal delay={0.2}>
            <p className="t-lead mx-auto mt-6 max-w-2xl">
              My professional background, experience in building 0-1 human-first products
            </p>
          </Reveal>
          <Reveal delay={0.32}>
            <ButtonAnchor href={publicUrl("Manu_Resume.pdf")} size="lg" newTab className="group mt-10">
              <Download size={18} className="nudge-down" /> Download
              <span className="sr-only"> résumé (PDF)</span>
            </ButtonAnchor>
          </Reveal>
        </div>
      </section>

      <section className="pb-6 pt-16 md:pt-24">
        <div className="container-narrow space-y-16 md:space-y-24">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h2 className="t-title">Manu</h2>
                <p className="t-lead mt-2">UX & Product Designer</p>
              </div>
              <div className="flex flex-col gap-1.5 md:items-end">
                <a href={MAILTO} className="link-underline self-start text-fg md:self-end">
                  {EMAIL}
                </a>
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group link-chevron self-start md:self-end"
                >
                  LinkedIn<span className="sr-only"> profile (opens in a new tab)</span>
                  <ArrowUpRight size={16} className="nudge-up" />
                </a>
              </div>
            </div>
          </Reveal>

          <Block title="About">
            <Reveal>
              <p className="t-body-lg !text-fg">
                A successful Product and UX design leader with 14 years of design experience who thrives in ambiguity -
                transforming complex systems into intuitive, inclusive, and scalable experiences. Driving AI,
                accessibility, and enterprise design strategies that simplify workflows and shape human-first digital
                ecosystems.
              </p>
            </Reveal>
          </Block>

          <Block title="Work Experience">
            <Timeline />
          </Block>

          <Block title="Education">
            <Reveal>
              <div className="flex flex-col justify-between gap-1 md:flex-row md:items-baseline md:gap-6">
                <h3 className="text-[1.25rem] font-semibold tracking-[-0.022em]">M.S. Human-Computer Interaction</h3>
                <p className="shrink-0 text-[0.95rem] tabular-nums text-fg-3">2018 - 2019</p>
              </div>
              <p className="t-body mt-1">University of Maryland, Baltimore County (UMBC)</p>
            </Reveal>
          </Block>

          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 -inset-y-24 overflow-hidden md:-inset-x-24">
              <Ambient variant="b" />
            </div>
            <Block title="Skills">
              <Stagger className="grid gap-4 sm:grid-cols-2">
                {skills.map((s) => (
                  <StaggerItem key={s.title} className="glass glass-soft glass-rim rounded-[22px] p-6">
                    <h3 className="font-semibold tracking-[-0.018em] text-fg">{s.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-2">{s.body}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </Block>
          </div>

          <Block title="References">
            <Reveal>
              <p className="t-body-lg">Available upon request</p>
            </Reveal>
          </Block>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
