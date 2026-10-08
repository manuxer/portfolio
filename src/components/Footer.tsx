import { Link } from "react-router";
import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/Logo";
import { MAILTO, navLinks } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className="mt-10 pb-10">
      <div className="container-x">
        <div className="hairline-t flex flex-col items-center justify-between gap-6 pt-10 md:flex-row">
          <Link to="/" viewTransition className="logo-link text-fg" aria-label="manuxer — home">
            <Logo className="h-7" />
          </Link>
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} viewTransition className="link-underline text-sm text-fg-2 hover:text-fg">
                {link.label}
              </Link>
            ))}
            <a href={MAILTO} className="link-underline text-sm text-fg-2 hover:text-fg">
              Contact
            </a>
          </nav>
        </div>
        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-fg-3">© {year} Manu. All rights reserved.</p>
          <button type="button" onClick={toTop} className="group inline-flex items-center gap-1.5 text-xs text-fg-3 transition-colors hover:text-fg">
            Back to top <ArrowUp size={14} className="transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
