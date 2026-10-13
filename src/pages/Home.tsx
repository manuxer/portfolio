import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Ambient, Aurora } from "@/components/Aurora";
import { ButtonAnchor, ButtonLink } from "@/components/Button";
import { ContactCTA } from "@/components/ContactCTA";
import { HeroCharacter } from "@/components/HeroCharacter";
import { LogoCarousel } from "@/components/LogoCarousel";
import { ManuWordmark, QrCode } from "@/components/ManuWordmark";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { WordsReveal } from "@/components/WordsReveal";
import { featured } from "@/data/projects";
import { useTilt } from "@/hooks/useTilt";
import { useTitle } from "@/hooks/useTitle";
import { MAILTO } from "@/lib/site";

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // As the page scrolls, the headline recedes: it drifts, shrinks and dims.
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32">
      <Aurora />
      <div className="aurora-fade" aria-hidden="true" />
      {/* TEMPORARY: character render; remove this line to take it out. */}
      <HeroCharacter opacity={opacity} />

      {/* Desktop: text on the left, character on the right. */}
      <motion.div style={{ y, scale, opacity }} className="container-x relative z-10 text-center lg:text-left">
        <div className="lg:max-w-[52%]">
          <WordsReveal
            as="h1"
            // One line; a touch smaller on desktop so it fits beside the character.
            className="t-display whitespace-nowrap lg:!text-[clamp(3.4rem,1rem+6.4vw,7.5rem)]"
            delay={0.15}
            stagger={0.09}
            text={[{ text: "I am" }, { text: "Manu", className: "text-gradient-brand pr-[0.05em]" }]}
          />
          <Reveal delay={0.55}>
            <p className="t-lead mx-auto mt-6 max-w-[30ch] md:mt-8 lg:mx-0">Product designer</p>
          </Reveal>
          <Reveal delay={0.7}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-12 lg:justify-start">
              <ButtonLink to="/projects" size="lg">
                View work <ArrowRight size={18} className="nudge-x" />
              </ButtonLink>
              <ButtonAnchor href={MAILTO} variant="glass" size="lg">
                Get in touch
              </ButtonAnchor>
            </div>
          </Reveal>
          <Reveal delay={0.82} blur={false}>
            <LogoCarousel className="mt-12 md:mt-14" />
          </Reveal>
        </div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })}
        style={{ opacity: cueOpacity }}
        initial={{ y: -6 }}
        animate={{ y: 4 }}
        transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="glass glass-soft absolute bottom-8 left-1/2 z-10 -ml-5 grid h-10 w-10 place-items-center rounded-full text-fg-2"
        aria-label="Scroll to featured projects"
      >
        <ChevronDown size={18} />
      </motion.button>
    </section>
  );
}

function QrCard() {
  const tilt = useTilt(5);
  return (
    <motion.div
      {...tilt.handlers}
      style={tilt.style}
      className="group relative overflow-hidden rounded-[32px] bg-white p-6 text-[#1d1d1f] shadow-[var(--shadow-card-hover)] md:p-10 dark:bg-surface dark:text-fg dark:shadow-[var(--shadow-card)]"
    >
      {/* Vector logo + QR (same artwork as the PNG) so the card can go dark in dark mode. */}
      <div role="img" aria-label="Manu logo and QR code" className="flex aspect-[1920/1086] flex-col items-center justify-center gap-[6%]">
        <ManuWordmark className="h-auto w-[66%]" />
        <QrCode className="block h-auto w-[26%]" />
      </div>
      <motion.span className="card-glare" style={{ background: tilt.glare }} aria-hidden="true" />
    </motion.div>
  );
}

export default function Home() {
  useTitle();

  return (
    <>
      <Hero />

      <section id="featured" className="section pt-10">
        <div className="container-x">
          <Reveal>
            <h2 className="t-title mb-14 text-center md:mb-20">Featured projects</h2>
          </Reveal>
          <div className="project-grid">
            {featured.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
          <Reveal className="mt-16 flex justify-center md:mt-20">
            <ButtonLink to="/projects" variant="glass" size="lg">
              View all projects <ArrowRight size={18} className="nudge-x" />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt overflow-hidden">
        <Ambient variant="a" />
        <div className="container-x relative grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <Reveal>
              <h2 className="t-title">About me</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="t-body-lg mt-6">
                Product, User experience, and Interaction designer currently working at Amazon, specializing in
                enterprise products that impact over 1.6M users.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="t-body-lg mt-5">
                I focus on creating inclusive and accessible design solutions through usability engineering, research,
                and iterative design processes.
              </p>
            </Reveal>
            <Reveal delay={0.24} className="mt-9">
              <ButtonLink to="/about">
                More about me <ArrowRight size={17} className="nudge-x" />
              </ButtonLink>
            </Reveal>
          </div>
          <Reveal delay={0.1} blur={false}>
            <QrCard />
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
