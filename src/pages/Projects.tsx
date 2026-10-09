import { Aurora } from "@/components/Aurora";
import { ContactCTA } from "@/components/ContactCTA";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { WordsReveal } from "@/components/WordsReveal";
import { projects } from "@/data/projects";
import { useTitle } from "@/hooks/useTitle";

export function Component() {
  useTitle("Work");

  return (
    <>
      <section className="relative overflow-hidden pb-6 pt-40 md:pt-52">
        <Aurora interactive={false} className="opacity-70" />
        <div className="aurora-fade" aria-hidden="true" />
        <div className="container-x hero-copy relative text-center">
          <WordsReveal as="h1" className="t-headline" text="Work" />
          <Reveal delay={0.2}>
            <p className="t-lead mx-auto mt-6 max-w-2xl">
              A collection of my work spanning UX research, product design, accessibility, and creative experiments.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-6 pt-14 md:pt-20">
        <div className="container-x">
          <div className="project-grid">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} headingLevel={2} />
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
