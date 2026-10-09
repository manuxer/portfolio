import { useId } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Img } from "@/components/Img";
import { CARD_SIZES, HERO_SIZES, mediaTransitionName, preloadImage } from "@/lib/image";
import { Reveal } from "@/components/Reveal";
import { useTilt } from "@/hooks/useTilt";
import type { ProjectSummary } from "@/data/types";

interface ProjectCardProps {
  project: ProjectSummary;
  index?: number;
  /** h2 where the cards sit directly under the page h1 (Work), h3 under a section h2 (Home). */
  headingLevel?: 2 | 3;
}

/**
 * Whole-card link done as a "stretched link": the title is the only link (so
 * its name is exactly the visible title) and its ::after covers the card.
 */
export function ProjectCard({ project, index = 0, headingLevel = 3 }: ProjectCardProps) {
  const tilt = useTilt(3.5);
  const uid = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  // Warm the hero image so the view transition lands on a decoded frame.
  const warm = () => void preloadImage(project.image, HERO_SIZES);

  return (
    <Reveal delay={(index % 2) * 0.08} blur={false} y={40}>
      <div
        className="group relative rounded-[30px] outline-offset-[6px] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--focus)]"
        onPointerEnter={warm}
        onTouchStart={warm}
        {...tilt.handlers}
      >
        <motion.div
          className="card-media aspect-[16/10]"
          style={{ ...tilt.style, viewTransitionName: mediaTransitionName(project.id) }}
        >
          <Img src={project.image} alt="" sizes={CARD_SIZES} className="h-full w-full object-cover" />
          <motion.span className="card-glare" style={{ background: tilt.glare }} aria-hidden="true" />
          <span
            aria-hidden="true"
            className="hover-chip glass glass-soft absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-fg [--glass-bg:var(--glass-bg-strong)]"
          >
            <ArrowUpRight size={20} strokeWidth={1.9} />
          </span>
        </motion.div>

        <div className="px-1 pt-6">
          <p className="t-eyebrow">{project.category}</p>
          <Heading className="t-subtitle mt-2">
            <Link
              to={`/projects/${project.id}`}
              viewTransition
              aria-describedby={`${uid}-summary`}
              className="after:absolute after:inset-0 after:z-10 after:rounded-[30px] after:content-[''] focus-visible:outline-none"
              onFocus={warm}
            >
              {project.title}
            </Link>
          </Heading>
          <p id={`${uid}-summary`} className="t-body mt-2 line-clamp-2">
            {project.description}
          </p>
          {/* Visual affordance only: the title link above is what's announced and activated. */}
          <span aria-hidden="true" className="link-chevron mt-4">
            View case study <ChevronRight size={17} strokeWidth={2.2} className="nudge-x" />
          </span>
        </div>
      </div>
    </Reveal>
  );
}
