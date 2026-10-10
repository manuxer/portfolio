import { useRef, type ReactNode } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BackPill } from "@/components/BackPill";
import { CountUp } from "@/components/CountUp";
import { Img } from "@/components/Img";
import { HERO_SIZES, mediaTransitionName, preloadImage, type ImageSource } from "@/lib/image";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import type { AcceptanceLevel, Finding, Participant, ProjectSummary, Research } from "@/data/types";
import { useSpecular } from "@/hooks/useSpecular";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

/* ───────────────────────── hero ───────────────────────── */

/**
 * Inset hero media. It carries the same view-transition name as the project
 * card, so the card image grows into it, then parallaxes as you scroll.
 */
export function CaseHero({
  id,
  image,
  alt,
  overlay,
  caption,
  className,
}: {
  id: number;
  image: ImageSource;
  alt: string;
  /** Painted inside the media (e.g. a scrim) — morphs with the image. */
  overlay?: ReactNode;
  /** Text laid over the media but outside the morphing element. */
  caption?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div className="container-x pt-[92px] md:pt-28">
      <div ref={ref} className="relative">
        <div
          className={cn("card-media h-[52vh] min-h-[320px] md:h-[66vh]", className)}
          style={{ viewTransitionName: mediaTransitionName(id) }}
        >
          <motion.div className="absolute inset-0" style={{ scale, y }}>
            <Img src={image} alt={alt} sizes={HERO_SIZES} priority className="h-full w-full object-cover" />
          </motion.div>
          {overlay}
        </div>
        {caption && <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-12">{caption}</div>}
        <BackPill className="absolute left-4 top-4 md:left-6 md:top-6" />
      </div>
    </div>
  );
}

/* ───────────────────────── header ───────────────────────── */

export function MetaCard({ items }: { items: Array<[string, string]> }) {
  const onPointerMove = useSpecular<HTMLDListElement>();
  return (
    <dl onPointerMove={onPointerMove} className="glass glass-rim specular rounded-[28px] px-7 py-3">
      {items.map(([label, value], i) => (
        <div key={label} className={cn("py-4", i > 0 && "hairline-t")}>
          <dt className="t-label">{label}</dt>
          <dd className="mt-1.5 text-[1.06rem] font-semibold leading-snug tracking-[-0.018em] text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ImpactCard({ text }: { text: string }) {
  const onPointerMove = useSpecular<HTMLDivElement>();
  return (
    <div onPointerMove={onPointerMove} className="glass glass-rim specular group overflow-hidden rounded-[28px] p-7 md:p-9">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-28 -z-10 h-72 w-72 rounded-full opacity-40"
        style={{ background: "radial-gradient(closest-side, var(--brand-yellow), transparent)" }}
      />
      <div className="flex items-start gap-5">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-[0_8px_20px_-8px_var(--brand-red)]"
          style={{ background: "linear-gradient(135deg, var(--brand-yellow), var(--brand-red))" }}
        >
          <ArrowUpRight size={22} strokeWidth={2.2} className="nudge-up" />
        </span>
        <div>
          <p className="t-label !text-[var(--brand-red)]">Impact</p>
          <p className="mt-2 text-[1.2rem] font-semibold leading-snug tracking-[-0.022em] text-fg md:text-[1.45rem]">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── research ───────────────────────── */

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <Reveal>
        <h3 className="t-subtitle">{title}</h3>
      </Reveal>
      <div className="mt-6 md:mt-8">{children}</div>
    </div>
  );
}

function ParticipantCard({ participant }: { participant: Participant }) {
  const onPointerMove = useSpecular<HTMLDivElement>();
  const { title, count, demographics, methods } = participant;
  return (
    <StaggerItem className="h-full">
      <div onPointerMove={onPointerMove} className="glass glass-soft glass-rim specular h-full rounded-[26px] p-7">
        <h4 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-fg">{title}</h4>
        {typeof count === "number" ? (
          <p className="mt-4 flex items-baseline gap-2">
            <CountUp
              value={count}
              className="font-[family-name:var(--font-display)] text-[3.2rem] font-semibold leading-none tracking-[-0.045em] text-fg tabular-nums"
            />
            <span className="text-fg-2">participants</span>
          </p>
        ) : count ? (
          <p className="mt-3 font-medium text-fg">{count}</p>
        ) : null}
        <p className="mt-4 text-[0.97rem] leading-relaxed text-fg-2">{demographics}</p>
        <ul className="mt-5 space-y-2">
          {methods.map((m) => (
            <li key={m} className="flex gap-2.5 text-[0.95rem] text-fg-2">
              <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-blue)]" />
              {m}
            </li>
          ))}
        </ul>
      </div>
    </StaggerItem>
  );
}

function Findings({ findings }: { findings: Finding[] }) {
  return (
    <Stagger as="ol" className="border-b border-[var(--hairline)]" stagger={0.06}>
      {findings.map((f, i) => (
        <StaggerItem
          as="li"
          key={f.finding}
          className="hairline-t grid gap-4 py-7 md:grid-cols-[64px_minmax(0,1.1fr)_minmax(0,1fr)] md:gap-8 md:py-9"
        >
          <span className="font-[family-name:var(--font-display)] text-[0.95rem] font-semibold tabular-nums text-fg-3">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h4 className="text-[1.2rem] font-semibold tracking-[-0.022em] text-fg">{f.finding}</h4>
            <p className="t-body mt-2">{f.details}</p>
          </div>
          <div className="self-start rounded-[20px] bg-[color-mix(in_srgb,var(--brand-red)_8%,transparent)] p-5">
            <p className="t-label !text-[var(--brand-red)]">Design Impact</p>
            <p className="mt-1.5 text-[0.97rem] leading-relaxed text-fg">{f.impact}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

const toneColor: Record<AcceptanceLevel["tone"], string> = {
  positive: "var(--positive)",
  neutral: "var(--neutral)",
  negative: "var(--negative)",
};

function Acceptance({ levels }: { levels: AcceptanceLevel[] }) {
  return (
    <div>
      {/* One bar, three segments growing in turn: the whole split at a glance. */}
      <div className="flex h-3.5 w-full gap-1.5" role="img" aria-label={levels.map((l) => `${l.label} ${l.percentage}%`).join(", ")}>
        {levels.map((l, i) => (
          <motion.span
            key={l.label}
            className="h-full origin-left rounded-full"
            style={{ flexBasis: `${l.percentage}%`, background: toneColor[l.tone] }}
            initial={{ scaleX: 0, opacity: 0.4 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.1, ease: ease.out, delay: 0.15 + i * 0.18 }}
          />
        ))}
      </div>
      <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
        {levels.map((l) => (
          <StaggerItem key={l.label} className="h-full">
            <div className="glass glass-soft glass-rim h-full rounded-[26px] p-7">
              <CountUp
                value={l.percentage}
                suffix="%"
                className="font-[family-name:var(--font-display)] text-[3.2rem] font-semibold leading-none tracking-[-0.045em] tabular-nums"
              />
              <span className="mt-4 block h-1 w-10 rounded-full" style={{ background: toneColor[l.tone] }} />
              <h4 className="mt-4 text-[1.1rem] font-semibold tracking-[-0.02em] text-fg">{l.label}</h4>
              <p className="mt-2 text-[0.97rem] leading-relaxed text-fg-2">{l.characteristics}</p>
              <p className="mt-4 text-[0.92rem] italic leading-relaxed text-fg-3">“{l.feedback}”</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function Insights({ insights }: { insights: string[] }) {
  return (
    <Stagger className="grid gap-4 md:grid-cols-2" stagger={0.05}>
      {insights.map((insight, i) => (
        <StaggerItem key={insight} className="h-full">
          <div className="glass glass-soft glass-rim flex h-full gap-4 rounded-[22px] p-6">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fg text-[0.85rem] font-semibold tabular-nums text-bg dark:bg-surface dark:text-fg dark:shadow-[inset_0_0_0_1px_var(--hairline-strong)]">
              {i + 1}
            </span>
            <p className="pt-1 leading-relaxed text-fg">{insight}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function ResearchBlock({ research }: { research: Research }) {
  const cols = research.participants.length;
  return (
    <div className="mt-12 space-y-20 md:mt-16 md:space-y-28">
      <Block title="Methodology">
        <Reveal>
          <p className="t-lead max-w-4xl !text-fg">{research.methodology}</p>
        </Reveal>
      </Block>

      <Block title="Research Participants">
        <Stagger className={cn("grid gap-5", cols === 2 && "md:grid-cols-2", cols >= 3 && "md:grid-cols-3")}>
          {research.participants.map((p) => (
            <ParticipantCard key={p.title} participant={p} />
          ))}
        </Stagger>
      </Block>

      <Block title="Key Findings">
        <Findings findings={research.keyFindings} />
      </Block>

      {research.aiAcceptance && (
        <Block title="AI Acceptance Levels">
          <Acceptance levels={research.aiAcceptance} />
        </Block>
      )}

      <Block title="Research Insights">
        <Insights insights={research.insights} />
      </Block>
    </div>
  );
}

/* ───────────────────────── outcome ───────────────────────── */

function CheckBadge() {
  return (
    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--positive)_14%,transparent)] text-[var(--positive)]">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: ease.out, delay: 0.3 }}
        />
      </svg>
    </span>
  );
}

export function KeyFeatures({ features }: { features: string[] }) {
  return (
    <Stagger as="ul" className="grid gap-x-10 gap-y-5 md:grid-cols-2" stagger={0.05}>
      {features.map((f) => (
        <StaggerItem as="li" key={f} className="flex items-start gap-4">
          <CheckBadge />
          <span className="text-[1.08rem] font-medium leading-snug text-fg">{f}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function TechChips({ items }: { items: string[] }) {
  return (
    <Stagger className="flex flex-wrap gap-3" stagger={0.04}>
      {items.map((t) => (
        <StaggerItem key={t}>
          <span className="chip glass glass-soft transition-transform duration-500 ease-[var(--ease-spring)] hover:-translate-y-0.5">
            {t}
          </span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ───────────────────────── next project ───────────────────────── */

export function NextProject({ next }: { next: ProjectSummary }) {
  const warm = () => void preloadImage(next.image, HERO_SIZES);

  return (
    <section className="section pb-0">
      <div className="container-x">
        <Reveal blur={false} y={40}>
          <Link
            to={`/projects/${next.id}`}
            viewTransition
            className="group relative block rounded-[30px] outline-offset-[6px]"
            onPointerEnter={warm}
            onFocus={warm}
            onTouchStart={warm}
          >
            <div
              className="card-media aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
              style={{ viewTransitionName: mediaTransitionName(next.id) }}
            >
              <Img src={next.image} alt="" sizes={HERO_SIZES} className="h-full w-full object-cover" />
            </div>
            {/* Frosted caption: the artwork stays visible but never fights the type. */}
            <div className="glass glass-rim absolute inset-x-3 bottom-3 flex flex-col gap-5 rounded-[22px] p-5 text-white [--glass-bg:rgb(12_12_14/0.42)] [--glass-blur:28px] [--glass-highlight:rgb(255_255_255/0.22)] [--glass-stroke:rgb(255_255_255/0.16)] sm:flex-row sm:items-center sm:justify-between md:inset-x-5 md:bottom-5 md:p-7">
              <div className="min-w-0">
                <p className="t-label !text-white/65">Next project</p>
                <h2 className="mt-1.5 text-[clamp(1.35rem,1rem+1.6vw,2.25rem)] font-semibold leading-tight tracking-[-0.03em] text-white">
                  {next.title}
                </h2>
              </div>
              <span className="btn btn-sm shrink-0 self-start bg-white text-[#1d1d1f] sm:self-auto dark:bg-[var(--btn-bg)] dark:text-[var(--btn-fg)] dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)]">
                View Project <ArrowRight size={16} className="nudge-x" />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
