import { ArrowLeft } from "lucide-react";
import { Aurora } from "@/components/Aurora";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { useTitle } from "@/hooks/useTitle";

export default function NotFound() {
  useTitle("Page not found");

  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 py-32">
      <Aurora />
      <div className="aurora-fade" aria-hidden="true" />
      <Reveal blur={false} className="relative z-10 w-full max-w-md">
        <div className="glass glass-rim rounded-[36px] px-8 py-14 text-center">
          <h1 className="t-display text-gradient-brand">404</h1>
          <p className="t-lead mt-4">Oops! Page not found</p>
          <ButtonLink to="/" className="group mt-9">
            <ArrowLeft size={17} className="nudge-left" /> Return to Home
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
