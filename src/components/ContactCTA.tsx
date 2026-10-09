import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ButtonAnchor } from "@/components/Button";
import { EMAIL, MAILTO } from "@/lib/site";
import { spring } from "@/lib/motion";
import { useSpecular } from "@/hooks/useSpecular";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const onPointerMove = useSpecular<HTMLButtonElement>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      window.location.href = MAILTO;
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <motion.button
        layout
        transition={spring.smooth}
        type="button"
        onClick={copy}
        onPointerMove={onPointerMove}
        className="btn btn-lg btn-glass glass glass-soft specular max-w-full overflow-hidden"
        aria-label={copied ? undefined : `Copy email address ${EMAIL}`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={spring.smooth}
            // Wraps only when the address can't fit (320px, 400% zoom).
            className="inline-flex min-w-0 items-center gap-2 whitespace-normal [overflow-wrap:anywhere]"
          >
            {copied ? (
              <>
                <Check size={18} strokeWidth={2.2} className="shrink-0 text-[var(--positive)]" /> Copied to clipboard
              </>
            ) : (
              <>
                <Copy size={17} strokeWidth={1.9} className="shrink-0 text-fg-2" /> {EMAIL}
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
      {/* Announced once per copy; the button's own name stays stable. */}
      <span role="status" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </>
  );
}

/** "Interested in working together?" — closes every page. */
export function ContactCTA() {
  return (
    <section className="section pb-10">
      <div className="container-x">
        <Reveal blur={false}>
          <div className="relative rounded-[40px]">
            <div className="halo" aria-hidden="true" />
            <div className="glass glass-rim rounded-[40px] px-6 py-16 text-center sm:px-12 md:py-24">
              <h2 className="t-title mx-auto max-w-[16ch]">Interested in working together?</h2>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonAnchor href={MAILTO} size="lg">
                  Let's talk <ArrowRight size={18} className="nudge-x" />
                </ButtonAnchor>
                <CopyEmail />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
