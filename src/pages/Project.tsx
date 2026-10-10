import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Lock } from "lucide-react";
import { Ambient } from "@/components/Aurora";
import {
  CaseHero,
  ImpactCard,
  KeyFeatures,
  MetaCard,
  NextProject,
  ResearchBlock,
  TechChips,
} from "@/components/CaseStudyParts";
import { ContactCTA } from "@/components/ContactCTA";
import { Gallery } from "@/components/Gallery";
import { Img } from "@/components/Img";
import { Logo } from "@/components/Logo";
import { HERO_SIZES, preloadImage } from "@/lib/image";
import { Reveal } from "@/components/Reveal";
import { SectionDock } from "@/components/SectionDock";
import { WordsReveal } from "@/components/WordsReveal";
import { ButtonAnchor } from "@/components/Button";
import { loadProject, nextProjectOf } from "@/data/projects";
import type { CaseStudy, LegacyProject, SubProject } from "@/data/types";
import { useTitle } from "@/hooks/useTitle";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";
import { lockScroll } from "@/lib/scrollLock";
import { MAILTO } from "@/lib/site";
import NotFound from "@/pages/NotFound";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  const project = Number.isInteger(id) ? await loadProject(id) : null;
  // Give the hero a moment to decode so the shared-element morph lands on a
  // real frame; never hold navigation hostage to a slow network.
  if (project) await Promise.race([preloadImage(project.hero, HERO_SIZES), new Promise((r) => setTimeout(r, 600))]);
  return project;
}

export function Component() {
  const project = useLoaderData<typeof loader>();
  if (!project) return <NotFound />;
  return project.kind === "case-study" ? (
    <CaseStudyView key={project.id} project={project} />
  ) : (
    <LegacyView key={project.id} project={project} />
  );
}

/* ───────────────────────── case study ───────────────────────── */

function CaseStudyView({ project }: { project: CaseStudy }) {
  useTitle(project.title);
  const next = nextProjectOf(project.id);
  const dock = [
    { id: "overview", label: "Overview" },
    ...project.sections.map((s) => ({ id: s.id, label: s.nav })),
    { id: "outcome", label: "Outcome" },
  ];

  return (
    <article>
      <CaseHero id={project.id} image={project.hero} />

      <section className="relative pb-20 pt-14 md:pb-28 md:pt-20">
        <div className="container-x relative">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
            <div className="lg:col-span-2">
              <Reveal>
                <p className="t-eyebrow">{project.category}</p>
              </Reveal>
              <WordsReveal as="h1" text={project.title} className="t-headline mt-4" delay={0.05} stagger={0.05} />
              <Reveal delay={0.25}>
                <p className="t-lead mt-6 max-w-2xl">{project.description}</p>
              </Reveal>
            </div>
            <Reveal delay={0.2} blur={false}>
              <MetaCard
                items={[
                  ["Company", project.client],
                  ["Timeline", project.duration],
                  ["Year", project.year],
                  ["My Role", project.role],
                ]}
              />
            </Reveal>
          </div>

          <Reveal className="mt-12 md:mt-16" blur={false}>
            <ImpactCard text={project.impact} />
          </Reveal>

          {project.introImages && <Gallery id="intro" images={project.introImages} className="mt-12 md:mt-16" />}
        </div>
      </section>

      {/* Fixed on screen, but placed here so it is next in the tab order after the intro. */}
      <SectionDock items={dock} />

      <section id="overview" className="section section-alt">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 className="t-title">Overview</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-body-lg mt-6 !text-[1.2rem] !leading-[1.65]">{project.overview}</p>
            </Reveal>
          </div>
          <div className="space-y-12">
            <Reveal>
              <h3 className="t-subtitle">Challenge</h3>
              <p className="t-body mt-3">{project.challenge}</p>
            </Reveal>
            <Reveal>
              <h3 className="t-subtitle">Solution</h3>
              <p className="t-body mt-3">{project.solution}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {project.sections.map((section, i) => (
        <section key={section.id} id={section.id} className={cn("section overflow-hidden", i % 2 === 1 && "section-alt")}>
          {section.research && <Ambient variant="b" />}
          <div className="container-x relative">
            <Reveal>
              <h2 className="t-title">{section.title}</h2>
            </Reveal>
            {section.research && <ResearchBlock research={project.research} />}
            {section.images.length > 0 && (
              <Gallery
                id={section.id}
                images={section.images}
                className={section.research ? "mt-20 md:mt-28" : "mt-12 md:mt-16"}
              />
            )}
          </div>
        </section>
      ))}

      <section
        id="outcome"
        className={cn("section overflow-hidden", project.sections.length % 2 === 1 && "section-alt")}
      >
        <Ambient variant="c" />
        <div className="container-x relative">
          <Reveal>
            <h2 className="t-title">Outcome</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-lead mt-6 max-w-3xl !text-fg">{project.outcome}</p>
          </Reveal>

          <Reveal className="mt-20 md:mt-24">
            <h3 className="t-subtitle">Key Features</h3>
          </Reveal>
          <div className="mt-8">
            <KeyFeatures features={project.keyFeatures} />
          </div>

          <Reveal className="mt-20 md:mt-24">
            <h3 className="t-subtitle">Technologies & Tools</h3>
          </Reveal>
          <div className="mt-8">
            <TechChips items={project.technologies} />
          </div>

          {project.pdfUrl && (
            <Reveal className="mt-16">
              <div className="glass glass-rim flex flex-col items-start justify-between gap-5 rounded-[28px] p-8 sm:flex-row sm:items-center">
                <div>
                  <h4 className="text-lg font-semibold">Full Presentation</h4>
                  <p className="t-body mt-1">View the complete case study PDF</p>
                </div>
                <ButtonAnchor href={project.pdfUrl} newTab>
                  View PDF<span className="sr-only"> of the full case study</span>
                </ButtonAnchor>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <NextProject next={next} />
      <ContactCTA />
    </article>
  );
}

/* ───────────────────────── legacy project ───────────────────────── */

function TextBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="mt-12">
      <h3 className="t-subtitle">{title}</h3>
      <div className="mt-4">{children}</div>
    </Reveal>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-fg-2">
          <span className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-blue)]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function LegacyView({ project }: { project: LegacyProject }) {
  useTitle(project.title);
  const next = nextProjectOf(project.id);
  const isArt = project.category === "Artwork / Paintings";
  const [locked, setLocked] = useState<SubProject | null>(null);
  const closeLocked = useCallback(() => setLocked(null), []);
  const galleryLabel = isArt ? "Artwork" : "Design process";

  return (
    <article>
      <CaseHero
        id={project.id}
        image={project.hero}
        overlay={
          // Dense at the bottom where the white title sits, clear at the top: white text
          // stays above 6:1 even over a pure-white hero image.
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.85)_0%,rgb(0_0_0/0.66)_50%,rgb(0_0_0/0.1)_100%)]" />
        }
        caption={
          <>
            <Reveal>
              <p className="text-sm font-medium text-white md:text-base">{project.category}</p>
            </Reveal>
            <WordsReveal
              as="h1"
              text={project.title}
              className="t-headline mt-2 max-w-[18ch] !text-[clamp(2.1rem,1.3rem+3.6vw,4.5rem)]"
              stagger={0.05}
            />
          </>
        }
      />

      <section className="section pt-16 md:pt-24">
        <div className="container-x grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="min-w-0 lg:col-span-2">
            <Reveal>
              <h2 className="t-title">Overview</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="t-body-lg mt-6">{project.overview || project.description}</p>
            </Reveal>

            {project.figmaEmbed && (
              <Reveal className="my-12" blur={false}>
                <div className="media-frame aspect-video">
                  <iframe
                    src={project.figmaEmbed}
                    title={`${project.title} presentation (Figma)`}
                    className="absolute inset-0 h-full w-full"
                    // Matching the embed's own scheme keeps the frame transparent while it loads.
                    style={{ colorScheme: "normal" }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                {project.figmaUrl && (
                  <a href={project.figmaUrl} target="_blank" rel="noopener noreferrer" className="group link-chevron mt-4">
                    Open the presentation in Figma
                    <span className="sr-only"> (opens in a new tab)</span>
                    <ArrowUpRight size={16} className="nudge-up" />
                  </a>
                )}
              </Reveal>
            )}

            {project.isNDA ? (
              <Reveal className="mt-10">
                <div className="glass glass-rim flex items-start gap-4 rounded-[22px] p-6">
                  <Lock size={18} className="mt-0.5 shrink-0 text-fg-2" />
                  <p className="text-[0.97rem] font-medium text-fg">
                    Note: This project is under NDA. Details are limited to protect confidential information.
                  </p>
                </div>
              </Reveal>
            ) : (
              <>
                {project.challenge && (
                  <TextBlock title="The challenge">
                    <p className="t-body">{project.challenge}</p>
                  </TextBlock>
                )}
                {project.methodology && (
                  <TextBlock title="Methodology">
                    <BulletList items={project.methodology} />
                  </TextBlock>
                )}
                {project.tools && (
                  <TextBlock title="Tools & Technologies">
                    <BulletList items={project.tools} />
                  </TextBlock>
                )}
                {project.solution && (
                  <TextBlock title="The solution">
                    <p className="t-body">{project.solution}</p>
                  </TextBlock>
                )}
                {project.outcome && (
                  <TextBlock title="Outcome">
                    <p className="t-body">{project.outcome}</p>
                  </TextBlock>
                )}
              </>
            )}

            {project.subProjects && project.subProjects.length > 0 && (
              <TextBlock title="Related projects">
                <ul className="grid gap-5 sm:grid-cols-2">
                  {project.subProjects.map((sub) => (
                    <li key={sub.title}>
                      <SubProjectCard sub={sub} onLocked={() => setLocked(sub)} />
                    </li>
                  ))}
                </ul>
              </TextBlock>
            )}

            {project.processImages.length > 0 && (
              <div className="mt-16">
                <Reveal>
                  <h3 className="t-subtitle mb-8">{isArt ? "Gallery" : "Design process"}</h3>
                </Reveal>
                <Gallery
                  id="process"
                  layout={isArt ? "grid" : "stack"}
                  trueColor={isArt}
                  sizes={isArt ? undefined : "(min-width: 1024px) 740px, 94vw"}
                  images={project.processImages.map((src, i) => ({
                    src,
                    // The gallery already announces "image n of N", so the alt only describes.
                    alt: project.processAlts?.[i] ?? `${galleryLabel} for ${project.title}.`,
                  }))}
                />
              </div>
            )}
          </div>

          <div>
            <Reveal blur={false} className="lg:sticky lg:top-28">
              <MetaCard
                items={[
                  ["Company", project.client],
                  ["Year", project.year],
                  ["Duration", project.duration],
                  ["My role", project.role],
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <NextProject next={next} />
      <ContactCTA />
      <LockedDialog project={locked} onClose={closeLocked} />
    </article>
  );
}

function SubProjectCard({ sub, onLocked }: { sub: SubProject; onLocked: () => void }) {
  const descId = useId();
  const media = (
    <div className="relative h-48 overflow-hidden bg-bg-2">
      {sub.image ? (
        <Img
          src={sub.image}
          alt=""
          sizes="(min-width: 640px) 360px, 92vw"
          className="h-full w-full object-cover transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
      ) : (
        // Placeholder mark: the vector logo follows the theme instead of a black PNG.
        <div className="grid h-full place-items-center">
          <Logo className="h-20 text-fg transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
        </div>
      )}
      {sub.isPasswordProtected && (
        <span
          aria-hidden="true"
          className="glass glass-soft absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-fg [--glass-bg:var(--glass-bg-strong)]"
        >
          <Lock size={12} strokeWidth={2.4} /> Password Protected
        </span>
      )}
    </div>
  );

  if (!sub.isPasswordProtected) {
    return (
      <div className="surface-card group overflow-hidden">
        {media}
        <div className="p-5 text-left">
          <h4 className="font-semibold tracking-[-0.018em] text-fg">{sub.title}</h4>
          <p className="mt-1.5 text-[0.95rem] text-fg-2">{sub.description}</p>
        </div>
      </div>
    );
  }

  // A real heading with a button inside, stretched over the whole card.
  return (
    <div className="surface-card group relative overflow-hidden transition-[box-shadow,transform] duration-500 ease-[var(--ease-spring)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-[var(--focus)]">
      {media}
      <div className="p-5 text-left">
        <h4 className="font-semibold tracking-[-0.018em] text-fg">
          <button
            type="button"
            onClick={onLocked}
            aria-haspopup="dialog"
            aria-describedby={descId}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {sub.title}
            <span className="sr-only"> (password protected)</span>
          </button>
        </h4>
        <p id={descId} className="mt-1.5 text-[0.95rem] text-fg-2">
          {sub.description}
        </p>
      </div>
    </div>
  );
}

/**
 * The original gate had no destination to unlock, so this offers an honest path:
 * ask for access. Truly modal: rendered in a portal with the page made inert,
 * focus moved in on open and returned to the card on close.
 */
function LockedDialog({ project, onClose }: { project: SubProject | null; onClose: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");
    const unlock = lockScroll();
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
      root?.removeAttribute("inert");
      opener?.focus({ preventScroll: true });
    };
  }, [project, onClose]);

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          // Scrolls when taller than the viewport (400% zoom, landscape phones).
          className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto overscroll-contain p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="locked-title"
          aria-describedby="locked-desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <div aria-hidden="true" className="fixed inset-0 bg-black/30 backdrop-blur-[6px] dark:bg-black/60" onClick={onClose} />
          <motion.div
            className="glass glass-strong glass-rim relative w-full max-w-md rounded-[32px] p-8"
            initial={{ opacity: 0, scale: 0.92, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
            exit={{ opacity: 0, scale: 0.96, y: 8, filter: "blur(4px)" }}
            transition={spring.smooth}
          >
            <span
              aria-hidden="true"
              className="grid h-12 w-12 place-items-center rounded-2xl bg-badge text-on-badge shadow-[inset_0_0_0_1px_var(--hairline-strong)]"
            >
              <Lock size={20} />
            </span>
            <h2 id="locked-title" className="t-subtitle mt-5">
              Protected project
            </h2>
            <p id="locked-desc" className="t-body mt-2">
              {project.title} is password protected. Get in touch and I'll share access.
            </p>
            <div className="mt-8 flex flex-wrap justify-end gap-2">
              <button ref={cancelRef} type="button" onClick={onClose} className="btn btn-sm btn-glass glass glass-soft">
                Cancel
              </button>
              <a href={`${MAILTO}?subject=${encodeURIComponent(`Access request: ${project.title}`)}`} className="btn btn-sm btn-primary">
                Request access<span className="sr-only"> by email</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
