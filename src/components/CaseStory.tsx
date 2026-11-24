/**
 * A case study told as a longer story (ALICE): summary, the problem, research, the main
 * idea, personas, principles, how it works, three walkthroughs, how the AI behaves, the
 * outcome, what's next and what I learned. It shares the hero, meta card, key features,
 * next-project card and section dock with the other case studies.
 */
import { useMemo, type ReactNode } from "react";
import { ArrowDown, ArrowRight, Maximize2 } from "lucide-react";
import { Ambient } from "@/components/Aurora";
import { AcceptanceBar, AcceptanceLegend, CaseHero, KeyFeatures, MetaCard, NextProject, TechChips } from "@/components/CaseStudyParts";
import { ContactCTA } from "@/components/ContactCTA";
import { CountUp } from "@/components/CountUp";
import { Img } from "@/components/Img";
import { useLightbox, type LightboxItem } from "@/components/lightbox-context";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionDock } from "@/components/SectionDock";
import { WordsReveal } from "@/components/WordsReveal";
import { nextProjectOf } from "@/data/projects";
import type { Labelled, Point, Story, StoryCaseStudy } from "@/data/types";
import { useSpecular } from "@/hooks/useSpecular";
import { useTitle } from "@/hooks/useTitle";
import { cn } from "@/lib/cn";

const DOCK = [
  { id: "overview", label: "Overview" },
  { id: "research", label: "Research" },
  { id: "approach", label: "Approach" },
  { id: "walkthrough", label: "Walkthrough" },
  { id: "behavior", label: "AI behavior" },
  { id: "outcome", label: "Outcome" },
];

/* The portraits are dark line drawings: they sit on a light panel in either theme. */
const PORTRAIT_PANEL = "bg-[#f2f2f5] dark:bg-[#e6e6eb]";

const display = "font-[family-name:var(--font-display)] font-semibold tracking-[-0.045em] tabular-nums";

export function CaseStoryView({ project }: { project: StoryCaseStudy }) {
  useTitle(project.title);
  const next = nextProjectOf(project.id);
  const { problem, research, mainIdea, personas, principles, howItWorks, walkthrough, behavior, outcome } = project;

  return (
    <article>
      <CaseHero id={project.id} image={project.hero} alt={project.title} />

      <section className="relative pb-20 pt-14 md:pb-28 md:pt-20">
        <div className="container-x relative">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
            <div className="lg:col-span-2">
              <Reveal>
                <p className="t-eyebrow">{project.category}</p>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="t-label mt-6 !text-fg">{project.product}</p>
              </Reveal>
              <WordsReveal as="h1" text={project.title} className="t-headline mt-3" delay={0.05} stagger={0.05} />
              <Reveal delay={0.25}>
                <p className="t-lead mt-6 max-w-2xl">{project.description}</p>
              </Reveal>
            </div>
            <Reveal delay={0.2} blur={false}>
              <MetaCard items={project.meta} />
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
            {project.summary.map((item) => (
              <StaggerItem key={item.label} className="h-full">
                <SummaryCard item={item} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Overview: the problem ── */}
      <section id="overview" className="section section-alt">
        <div className="container-x">
          <Heading eyebrow="Overview" title={problem.title} />
          <div className="mt-8 max-w-3xl space-y-5">
            {problem.paragraphs.map((p) => (
              <Reveal key={p}>
                <p className="t-body-lg">{p}</p>
              </Reveal>
            ))}
          </div>
          <Stagger className="mt-14 grid gap-8 md:mt-20 md:grid-cols-3 md:gap-10">
            {problem.stats.map((s) => (
              <StaggerItem key={s.label} className="hairline-t pt-6">
                <CountUp value={s.value} suffix={s.suffix} className={cn(display, "text-[3.6rem] leading-none text-fg")} />
                <p className="mt-3 max-w-[26ch] leading-relaxed text-fg-2">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Research ── */}
      <section id="research" className="section overflow-hidden">
        <Ambient variant="b" />
        <div className="container-x relative">
          <Heading eyebrow="Research" title={research.title}>
            {research.intro}
          </Heading>

          <Stagger className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2">
            {research.groups.map((g) => (
              <StaggerItem key={g.title} className="h-full">
                <MethodsCard title={g.title} methods={g.methods} />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-20 md:mt-28">
            <h3 className="t-subtitle">What we learned</h3>
          </Reveal>
          <Stagger as="ol" className="mt-6 grid gap-x-12 md:mt-8 md:grid-cols-2" stagger={0.06}>
            {research.findings.map((f) => (
              <StaggerItem as="li" key={f.title} className="hairline-t py-7">
                <h4 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-fg">{f.title}</h4>
                <p className="t-body mt-2">{f.text}</p>
                {f.acceptance && (
                  <div className="mt-5">
                    <div aria-hidden="true">
                      <AcceptanceBar levels={f.acceptance} className="h-2.5" />
                    </div>
                    <div className="mt-3">
                      <AcceptanceLegend levels={f.acceptance} />
                    </div>
                  </div>
                )}
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-10 md:mt-12">
            <p className="glass glass-soft glass-rim max-w-3xl rounded-[22px] p-6 leading-relaxed text-fg md:p-7">{research.note}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Approach: the main idea, personas, principles, how it works ── */}
      <section id="approach" className="section section-alt">
        <div className="container-x space-y-28 md:space-y-36">
          <div>
            <Heading eyebrow="The main idea" title={mainIdea.title} />
            <div className="mt-10 grid items-center gap-4 md:mt-14 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
              <Reveal blur={false} className="h-full">
                <figure className="surface-card flex h-full flex-col justify-center p-7 md:p-9">
                  <figcaption className="t-label">{mainIdea.quoteLabel}</figcaption>
                  <blockquote className="mt-4 text-[1.15rem] leading-relaxed tracking-[-0.012em] text-fg md:text-[1.25rem]">
                    {mainIdea.quote}
                  </blockquote>
                </figure>
              </Reveal>
              <Reveal blur={false} delay={0.1} className="flex justify-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-fg text-bg dark:bg-surface dark:text-fg dark:shadow-[inset_0_0_0_1px_var(--hairline-strong)]">
                  <ArrowRight size={20} className="hidden lg:block" aria-hidden="true" />
                  <ArrowDown size={20} className="lg:hidden" aria-hidden="true" />
                </span>
              </Reveal>
              <Reveal blur={false} delay={0.15}>
                <div className="surface-card p-7 md:p-9">
                  <p className="t-label">{mainIdea.fieldsLabel}</p>
                  <dl className="mt-4">
                    {mainIdea.fields.map(([label, value]) => (
                      <div key={label} className="hairline-t grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] gap-4 py-3.5">
                        <dt className="text-[0.95rem] text-fg-2">{label}</dt>
                        <dd className="text-[0.97rem] font-semibold leading-snug text-fg">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
            <Reveal className="mt-6">
              <p className="t-body">{mainIdea.caption}</p>
            </Reveal>
          </div>

          <div>
            <Heading eyebrow="Personas" title={personas.title} />
            <Stagger className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-6">
              {personas.items.map((p) => (
                <StaggerItem key={p.name}>
                  <div className={cn("overflow-hidden rounded-[26px]", PORTRAIT_PANEL)}>
                    <Img
                      src={p.portrait}
                      alt={p.alt}
                      sizes="(min-width: 768px) 360px, 92vw"
                      className="mx-auto block aspect-[1035/1260] w-[62%] object-contain"
                    />
                  </div>
                  <h3 className="t-subtitle mt-6">{p.name}</h3>
                  <p className="mt-2">
                    <span className="inline-block rounded-full bg-[color-mix(in_srgb,var(--brand-blue)_14%,transparent)] px-3 py-1 text-[0.85rem] font-semibold text-fg">
                      {p.tag}
                    </span>
                  </p>
                  <p className="t-body mt-3">{p.text}</p>
                  <p className="mt-3 text-[0.95rem] text-fg-2">
                    <span className="font-semibold text-fg">Tests:</span> {p.tests}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div>
            <Heading eyebrow="Design principles" title={principles.title} />
            <NumberedList items={principles.items} className="mt-10 md:mt-14" />
          </div>

          <div>
            <Heading eyebrow="How it works" title={howItWorks.title} />
            <Stagger as="ol" className="mt-10 space-y-3 md:mt-14" stagger={0.06}>
              {howItWorks.layers.map((layer, i) => (
                <StaggerItem as="li" key={layer.label}>
                  {/* The last layer, the safeguards, wraps everything above it. */}
                  <div
                    className={cn(
                      "grid gap-2 rounded-[22px] p-6 md:grid-cols-[180px_minmax(0,1fr)] md:items-baseline md:gap-8 md:px-8",
                      i === howItWorks.layers.length - 1
                        ? "bg-fg text-bg dark:bg-surface dark:text-fg dark:shadow-[inset_0_0_0_1px_var(--hairline-strong)]"
                        : "glass glass-soft glass-rim text-fg",
                    )}
                  >
                    <p className="t-label !text-current opacity-70">{layer.label}</p>
                    <p className="leading-relaxed">{layer.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-8">
              <ol aria-label="Steps in every conversation" className="flex flex-wrap items-center gap-x-2 gap-y-3">
                {howItWorks.steps.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    {i > 0 && <ArrowRight size={16} className="text-fg-3" aria-hidden="true" />}
                    <span className="chip glass glass-soft">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal className="mt-6">
              <p className="t-body">{howItWorks.caption}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Walkthrough ── */}
      <section id="walkthrough" className="section">
        <div className="container-x">
          <Heading eyebrow="Walkthrough" title={walkthrough.title} />
          <div className="mt-12 space-y-20 md:mt-16 md:space-y-28">
            {walkthrough.stories.map((story, i) => (
              <StoryFlow key={story.label} story={story} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How the AI behaves ── */}
      <section id="behavior" className="section section-alt">
        <div className="container-x">
          <Heading eyebrow="AI behavior" title={behavior.title}>
            {behavior.intro}
          </Heading>

          <SubBlock title="Chat patterns">
            <TechChips items={behavior.patterns} />
          </SubBlock>

          <SubBlock title="Tone of voice">
            <TechChips items={behavior.tone} />
            <Pairs className="mt-8" head={["Typical wording", `What ${project.product} says`]} rows={behavior.toneExamples} />
          </SubBlock>

          <SubBlock title="When the AI makes a mistake">
            <Pairs head={["If…", `${project.product}…`]} rows={behavior.mistakes} />
          </SubBlock>

          <SubBlock title="Trust, privacy and accessibility">
            <Stagger className="grid gap-5 md:grid-cols-3">
              {behavior.safeguards.map((item) => (
                <StaggerItem key={item.label} className="h-full">
                  <SummaryCard item={item} soft />
                </StaggerItem>
              ))}
            </Stagger>
          </SubBlock>
        </div>
      </section>

      {/* ── Outcome ── */}
      <section id="outcome" className="section overflow-hidden">
        <Ambient variant="c" />
        <div className="container-x relative">
          <Heading eyebrow="Outcome" title={outcome.title} />
          <Reveal delay={0.1}>
            <p className="t-lead mt-6 max-w-3xl !text-fg">{outcome.text}</p>
          </Reveal>

          <Reveal className="mt-12 md:mt-16" blur={false}>
            <div className="rounded-[28px] bg-fg p-7 text-bg md:p-10 dark:bg-surface dark:text-fg dark:shadow-[inset_0_0_0_1px_var(--hairline-strong)]">
              <p className="t-label !text-current opacity-70">Main goal</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-[clamp(1.6rem,1.1rem+2vw,2.6rem)] font-semibold leading-tight tracking-[-0.035em]">
                {outcome.goal}
              </p>
            </div>
          </Reveal>
          <Stagger className="mt-5 grid gap-5 md:grid-cols-3">
            {outcome.measures.map((m) => (
              <StaggerItem key={m.title} className="h-full">
                <div className="glass glass-soft glass-rim h-full rounded-[26px] p-7">
                  <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-fg">{m.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {m.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.97rem] text-fg-2">
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-blue)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-20 md:mt-24">
            <h3 className="t-subtitle">Key features</h3>
          </Reveal>
          <div className="mt-8">
            <KeyFeatures features={project.keyFeatures} />
          </div>
        </div>
      </section>

      {/* ── What's next, what I learned ── */}
      <section className="section section-alt">
        <div className="container-x space-y-28 md:space-y-36">
          <div>
            <Heading eyebrow="What’s next" title={project.roadmap.title} />
            <Stagger className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3">
              {project.roadmap.items.map((item) => (
                <StaggerItem key={item.label} className="h-full">
                  <div className="glass glass-soft glass-rim h-full rounded-[26px] p-7">
                    <p className="t-label">{item.label}</p>
                    <h3 className="mt-3 text-[1.2rem] font-semibold tracking-[-0.022em] text-fg">{item.title}</h3>
                    <p className="t-body mt-2">{item.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div>
            <Heading title="What I learned" />
            <Stagger className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-10">
              {project.learned.map((item) => (
                <StaggerItem key={item.title} className="hairline-t pt-6">
                  <h3 className="text-[1.2rem] font-semibold tracking-[-0.022em] text-fg">{item.title}</h3>
                  <p className="t-body mt-2">{item.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <NextProject next={next} />
      <ContactCTA />
      <SectionDock items={DOCK} />
    </article>
  );
}

/* ───────────────────────── parts ───────────────────────── */

function Heading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <Reveal>
          <p className="t-label">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className={cn("t-title", eyebrow && "mt-3")}>{title}</h2>
      </Reveal>
      {children && (
        <Reveal delay={0.1}>
          <p className="t-lead mt-5">{children}</p>
        </Reveal>
      )}
    </div>
  );
}

function SubBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-16 md:mt-20">
      <Reveal>
        <h3 className="t-subtitle">{title}</h3>
      </Reveal>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function SummaryCard({ item, soft = false }: { item: Labelled; soft?: boolean }) {
  const onPointerMove = useSpecular<HTMLDivElement>();
  return (
    <div
      onPointerMove={onPointerMove}
      className={cn("glass glass-rim specular h-full rounded-[28px] p-7", soft && "glass-soft rounded-[26px]")}
    >
      <p className="t-label">{item.label}</p>
      <p className="mt-3 text-[1.06rem] font-medium leading-snug tracking-[-0.016em] text-fg">{item.text}</p>
    </div>
  );
}

function MethodsCard({ title, methods }: { title: string; methods: Array<[string, number]> }) {
  const onPointerMove = useSpecular<HTMLDivElement>();
  return (
    <div onPointerMove={onPointerMove} className="glass glass-soft glass-rim specular h-full rounded-[26px] p-7">
      <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-fg">{title}</h3>
      <dl className="mt-4">
        {methods.map(([method, count]) => (
          <div key={method} className="hairline-t flex items-baseline justify-between gap-4 py-3">
            <dt className="text-[0.97rem] text-fg-2">{method}</dt>
            <dd>
              <CountUp value={count} className={cn(display, "text-[1.35rem] text-fg")} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function NumberedList({ items, className }: { items: Point[]; className?: string }) {
  return (
    <Stagger as="ol" className={cn("border-b border-[var(--hairline)]", className)} stagger={0.06}>
      {items.map((item, i) => (
        <StaggerItem
          as="li"
          key={item.title}
          className="hairline-t grid gap-2 py-6 md:grid-cols-[64px_minmax(0,0.9fr)_minmax(0,1.3fr)] md:gap-8 md:py-7"
        >
          <span className="font-[family-name:var(--font-display)] text-[0.95rem] font-semibold tabular-nums text-fg-3">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-[1.2rem] font-semibold tracking-[-0.022em] text-fg">{item.title}</h3>
          <p className="t-body">{item.text}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** On phones each cell is preceded by its column's name (from data-label), styled like t-label. */
const CELL_LABEL =
  "max-md:before:mb-1 max-md:before:block max-md:before:text-[0.72rem] max-md:before:font-semibold max-md:before:uppercase max-md:before:tracking-[0.08em] max-md:before:text-fg-3 max-md:before:content-[attr(data-label)]";

/** A two-column comparison as a real table; on phones each row stacks, its column named above it. */
function Pairs({ head, rows, className }: { head: [string, string]; rows: Array<[string, string]>; className?: string }) {
  return (
    <Reveal blur={false} className={className}>
      <div className="glass glass-rim overflow-hidden rounded-[24px]">
        <table className="w-full border-collapse text-left">
          <thead className="max-md:sr-only">
            <tr>
              {head.map((h) => (
                <th key={h} scope="col" className="t-label w-1/2 px-6 pb-3 pt-5 font-semibold md:px-7">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([a, b], i) => (
              <tr key={a} className={cn("hairline-t max-md:block max-md:px-6 max-md:py-5", i === 0 && "max-md:border-t-0")}>
                <td
                  data-label={head[0]}
                  className={cn("align-top leading-relaxed text-fg-2 max-md:block md:px-7 md:py-4", CELL_LABEL)}
                >
                  {a}
                </td>
                <td
                  data-label={head[1]}
                  className={cn("align-top font-medium leading-relaxed text-fg max-md:mt-3 max-md:block md:px-7 md:py-4", CELL_LABEL)}
                >
                  {b}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

const SCREEN_SIZES = "(min-width: 1024px) 300px, (min-width: 768px) 28vw, 72vw";

/**
 * One persona's flow: three screens, each with the decision it shows. Phones scroll the
 * three sideways; wider screens show them side by side. Screens open in the lightbox.
 */
function StoryFlow({ story, index }: { story: Story; index: number }) {
  const { open, register, hiddenKey } = useLightbox();
  const items: LightboxItem[] = useMemo(
    () => story.screens.map((s, i) => ({ key: `story-${index}-${i}`, src: s.src, alt: s.alt })),
    [story.screens, index],
  );

  return (
    <div>
      <Reveal className="flex items-center gap-4">
        <span className={cn("h-14 w-14 shrink-0 overflow-hidden rounded-full", PORTRAIT_PANEL)}>
          <Img src={story.portrait} alt="" sizes="56px" className="h-full w-full scale-[1.6] object-cover object-[50%_32%]" />
        </span>
        <div>
          <p className="t-label">{story.label}</p>
          <h3 className="t-subtitle mt-1">{story.title}</h3>
        </div>
      </Reveal>

      <div className="-mx-[clamp(20px,5vw,44px)] mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,5vw,44px)] pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
        {items.map((item, i) => (
          <Reveal key={item.key} blur={false} delay={i * 0.08} className="w-[76%] shrink-0 snap-center md:w-auto">
            <figure>
              <div className="rounded-[28px] bg-[var(--bg-2)] p-4 md:p-6">
                <button
                  type="button"
                  ref={(el) => {
                    register(item.key, el);
                    return () => register(item.key, null);
                  }}
                  onClick={() => open(items, i)}
                  className="gallery-item group media-frame mx-auto block w-full max-w-[300px]"
                  style={{ visibility: hiddenKey === item.key ? "hidden" : undefined }}
                  aria-label={`Expand screen ${i + 1} of ${items.length}: ${item.alt}`}
                >
                  <Img src={item.src} alt={item.alt} sizes={SCREEN_SIZES} className="block h-auto w-full" />
                  <span className="hover-chip glass glass-soft absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-fg">
                    <Maximize2 size={15} strokeWidth={2} />
                  </span>
                </button>
              </div>
              <figcaption className="mt-5 px-1">
                <h4 className="text-[1.1rem] font-semibold tracking-[-0.02em] text-fg">{story.decisions[i].title}</h4>
                <p className="t-body mt-1.5">{story.decisions[i].text}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
