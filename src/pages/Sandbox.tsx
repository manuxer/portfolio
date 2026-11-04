import { ArrowRight } from "lucide-react";
import { Aurora } from "@/components/Aurora";
import { ContactCTA } from "@/components/ContactCTA";
import { PhonePlayer } from "@/components/PhonePlayer";
import { Reveal } from "@/components/Reveal";
import { WordsReveal } from "@/components/WordsReveal";
import { sandbox, type SandboxStudy } from "@/data/sandbox";
import { useTitle } from "@/hooks/useTitle";

function Brief({ study }: { study: SandboxStudy }) {
  return (
    <div>
      <p className="t-eyebrow flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: study.accent }} aria-hidden="true" />
        {study.domain} · {study.name}
      </p>
      <h2 className="t-title mt-4 !text-[clamp(1.9rem,1.2rem+2.2vw,2.9rem)]">{study.headline}</h2>

      <div className="mt-9 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="t-label">User pain point</h3>
          <p className="t-body mt-2.5">{study.pain}</p>
        </div>
        <div>
          <h3 className="t-label">Business case</h3>
          <p className="t-body mt-2.5">{study.business}</p>
        </div>
      </div>

      <h3 className="t-label mt-9">Key design decisions</h3>
      <ol className="mt-4 space-y-3.5">
        {study.decisions.map((d, i) => (
          <li key={i} className="flex gap-3.5">
            <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-fg/[0.06] text-[0.8rem] font-semibold text-fg">
              {i + 1}
            </span>
            <span className="leading-relaxed text-fg">{d}</span>
          </li>
        ))}
      </ol>

      <h3 className="t-label mt-9">Flow</h3>
      <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label="Flow">
        {study.flow.map((step, i) => (
          <li key={step} className="flex items-center gap-1.5">
            {i > 0 && <ArrowRight size={14} className="text-fg-3" aria-hidden="true" />}
            <span className="rounded-full bg-fg/[0.06] px-3.5 py-1.5 text-[0.9rem] font-medium text-fg">{step}</span>
          </li>
        ))}
      </ol>

      <div className="hairline-t mt-9 pt-6">
        <h3 className="t-label">What I'd measure</h3>
        <ul className="mt-3 space-y-1.5 text-[0.95rem] text-fg-2">
          {study.measure.map((m) => (
            <li key={m} className="flex gap-2.5">
              <span className="mt-[0.6em] h-1 w-1 flex-none rounded-full bg-fg-3" aria-hidden="true" />
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Component() {
  useTitle("Sandbox");

  return (
    <>
      <section className="relative overflow-hidden pb-6 pt-40 md:pt-52">
        <Aurora interactive={false} className="opacity-70" />
        <div className="aurora-fade" aria-hidden="true" />
        <div className="container-x relative text-center">
          <WordsReveal as="h1" className="t-headline" text="Sandbox" />
          <Reveal delay={0.2}>
            <p className="t-lead mx-auto mt-6 max-w-2xl">
              Small design experiments across different industries. Each one pairs a short brief with a prototype that
              plays the whole flow.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <nav aria-label="Experiments" className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
              {sandbox.map((s) => (
                <a key={s.slug} href={`#${s.slug}`} className="chip glass glass-soft specular text-[0.9rem]">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.accent }} aria-hidden="true" />
                  {s.name}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      <div className="container-x pb-10">
        {sandbox.map((study) => (
          <section
            key={study.slug}
            id={study.slug}
            aria-label={`${study.name}, ${study.domain}`}
            className="scroll-mt-28 border-t border-[var(--hairline)] py-16 first:border-t-0 md:py-24"
          >
            <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_300px] md:gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-24">
              <Reveal>
                <Brief study={study} />
              </Reveal>
              <Reveal delay={0.1} blur={false}>
                <PhonePlayer file={study.file} label={study.name} />
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <ContactCTA />
    </>
  );
}
