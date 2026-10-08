import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, FileText } from "lucide-react";
import { Ambient } from "@/components/Aurora";
import { ButtonLink } from "@/components/Button";
import { ContactCTA } from "@/components/ContactCTA";
import { Img } from "@/components/Img";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { WordsReveal } from "@/components/WordsReveal";
import { useTitle } from "@/hooks/useTitle";

const PROFILE = "https://manupeethambar.github.io/manuxer/img/profile1.png";
const QUOTE =
  "A simple design isn't just an obvious solution - it's one that solves the problem while leaving room for elegance and emotional connection.";

function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The photo drifts inside its frame — a window, not a sticker.
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div ref={ref} className="media-frame aspect-[4/5] rounded-[36px] shadow-[var(--shadow-card-hover)]">
      <motion.div className="absolute inset-[-8%]" style={{ y }}>
        <Img src={PROFILE} alt="Manu, UX Designer" sizes="(min-width: 768px) 520px, 92vw" priority className="h-full w-full object-cover" />
      </motion.div>
    </div>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </>
  );
}

/** The quote lights up word by word as it is read (scroll-linked). */
function ScrollQuote() {
  const ref = useRef<HTMLQuoteElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = QUOTE.split(" ");

  return (
    <blockquote ref={ref} className="mx-auto max-w-5xl text-center">
      <p className="t-title !font-semibold" aria-label={QUOTE}>
        <span aria-hidden="true">
          <span className="text-fg-3">“</span>
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
          <span className="text-fg-3">”</span>
        </span>
      </p>
      <Reveal delay={0.1}>
        <footer className="mt-8 text-lg font-medium text-fg-2">— manuxer</footer>
      </Reveal>
    </blockquote>
  );
}

export function Component() {
  useTitle("About");

  return (
    <>
      <section className="section-alt relative overflow-hidden pb-24 pt-36 md:pb-32 md:pt-44">
        <Ambient variant="a" />
        <div className="container-x relative grid items-center gap-14 md:grid-cols-2 md:gap-20">
          <div className="order-2 md:order-1">
            <WordsReveal as="h1" className="t-headline" text="About me" />
            <Reveal delay={0.15}>
              <p className="t-lead mt-5 !text-fg">Hi, I am Manu</p>
            </Reveal>
            <Stagger className="t-body-lg mt-6 space-y-4" stagger={0.06}>
              <StaggerItem>
                <p>
                  My journey began in front-end engineering, where I discovered my true passion,{" "}
                  <strong>User Experience Design</strong>. Over time, I've bridged the gap between technology and design,
                  combining analytical thinking with creativity to craft products that truly serve people.
                </p>
              </StaggerItem>
              <StaggerItem>
                <p>
                  As an <strong>artist at heart</strong>, I developed strong visual literacy: the ability to understand how
                  color, form, and aesthetics shape meaning and emotion. This artistic foundation, paired with my empathy
                  for people, drives me to create experiences that are not only functional but deeply human.
                </p>
              </StaggerItem>
              <StaggerItem>
                <p>
                  With <strong>14+ years of experience</strong> across tech, consulting, and agency environments, I've
                  learned to thrive in ambiguity - transforming undefined, complex systems into intuitive, inclusive, and
                  scalable experiences that simplify workflows and empower millions of users worldwide. My process is
                  grounded in curiosity, collaboration, and a user-centric mindset that ensures every solution has real
                  impact.
                </p>
              </StaggerItem>
              <StaggerItem>
                <p>
                  Outside of work, you'll find me on the basketball court, with a paintbrush in hand, or experimenting in
                  the kitchen - constantly exploring new ways to create, connect, and bring ideas to life.
                </p>
              </StaggerItem>
              <StaggerItem>
                <p>
                  I'm excited to continue{" "}
                  <strong>designing experiences that shape the future of AI and human-centered technology</strong>, making
                  life simpler, smarter, and more meaningful for people everywhere.
                </p>
              </StaggerItem>
            </Stagger>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/projects">
                  View my work <ArrowRight size={17} className="nudge-x" />
                </ButtonLink>
                <ButtonLink to="/resume" variant="glass">
                  <FileText size={17} /> Resume
                </ButtonLink>
              </div>
            </Reveal>
          </div>
          <Reveal className="order-1 md:order-2" blur={false}>
            <Portrait />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <ScrollQuote />
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
