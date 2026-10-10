import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Img } from "@/components/Img";
import { CARD_SIZES, HERO_SIZES, mediaTransitionName, preloadImage } from "@/lib/image";
import { Reveal } from "@/components/Reveal";
import { useTilt } from "@/hooks/useTilt";
import type { ProjectSummary } from "@/data/types";

export function ProjectCard({ project, index = 0 }: { project: ProjectSummary; index?: number }) {
  const tilt = useTilt(3.5);
  // Warm the hero image so the view transition lands on a decoded frame.
  const warm = () => void preloadImage(project.image, HERO_SIZES);

  return (
    <Reveal delay={(index % 2) * 0.08} blur={false} y={40}>
      <Link
        to={`/projects/${project.id}`}
        viewTransition
        className="group block rounded-[30px] outline-offset-[6px]"
        onPointerEnter={warm}
        onFocus={warm}
        onTouchStart={warm}
        {...tilt.handlers}
      >
        <motion.div
          className="card-media aspect-[16/10]"
          style={{ ...tilt.style, viewTransitionName: mediaTransitionName(project.id) }}
        >
          <Img src={project.image} alt="" sizes={CARD_SIZES} className="h-full w-full object-cover" />
          <motion.span className="card-glare" style={{ background: tilt.glare }} aria-hidden="true" />
          <span className="hover-chip glass glass-soft absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-fg">
            <ArrowUpRight size={20} strokeWidth={1.9} />
          </span>
        </motion.div>

        <div className="px-1 pt-6">
          <p className="t-eyebrow">{project.category}</p>
          <h3 className="t-subtitle mt-2">{project.title}</h3>
          <p className="t-body mt-2 line-clamp-2">{project.description}</p>
          <span className="link-chevron mt-4">
            View case study <ChevronRight size={17} strokeWidth={2.2} className="nudge-x" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
