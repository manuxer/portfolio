import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion, stagger } from "motion/react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/cn";
import { ease, spring } from "@/lib/motion";
import { MAILTO, navLinks } from "@/lib/site";
import { useScrolled } from "@/hooks/useScrolled";
import { lockScroll } from "@/lib/scrollLock";

export function Navbar() {
  const { pathname } = useLocation();
  const compact = useScrolled(24);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menu, setMenu] = useState({ open: false, path: pathname });

  // A route change closes the menu (derived during render, no effect needed).
  const open = menu.open && menu.path === pathname;
  const setOpen = (value: boolean) => setMenu({ open: value, path: pathname });

  const toggleRef = useRef<HTMLButtonElement>(null);

  const active = navLinks.find((l) => pathname.startsWith(l.to))?.to ?? null;
  // "page" only on the exact page; inside a section (a case study under Projects) it's "true".
  const currentFor = (to: string) => (pathname === to ? "page" : active === to ? "true" : undefined);

  const closeMenu = (returnFocus: boolean) => {
    setMenu((m) => ({ ...m, open: false }));
    if (returnFocus) toggleRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    // While the menu covers the page, the page behind it can't take focus.
    const behind = Array.from(document.querySelectorAll<HTMLElement>("#main, footer, a.skip-link"));
    behind.forEach((el) => (el.inert = true));
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu((m) => ({ ...m, open: false }));
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      behind.forEach((el) => (el.inert = false));
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="site-nav fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4">
      <nav aria-label="Primary" className={cn("nav-pill glass glass-rim", (compact || open) && "is-compact")}>
        <Link to="/" viewTransition className="logo-link flex h-10 items-center gap-2.5 rounded-full px-2 text-fg">
          <Logo className="h-7" />
          <span className="text-[0.95rem] font-semibold tracking-[-0.02em]">manuxer</span>
          <span className="sr-only">— home</span>
        </Link>

        <ul className="hidden items-center md:flex" onPointerLeave={() => setHovered(null)}>
          {navLinks.map((link) => {
            const isActive = active === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  viewTransition
                  className="nav-link"
                  aria-current={currentFor(link.to)}
                  onPointerEnter={() => setHovered(link.to)}
                  onFocus={() => setHovered(link.to)}
                  onBlur={() => setHovered(null)}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      // Only spring when the route changes, not while the pill resizes.
                      layoutDependency={active}
                      className="nav-indicator nav-indicator-active"
                      transition={spring.snappy}
                    />
                  )}
                  <AnimatePresence>
                    {hovered === link.to && !isActive && (
                      <motion.span
                        layoutId="nav-hover"
                        className="nav-indicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={spring.snappy}
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <a href={MAILTO} className="btn btn-primary btn-sm hidden md:inline-flex">
            Contact
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="btn btn-icon md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            <span className="relative block h-3 w-[18px]" aria-hidden="true">
              <motion.span
                className="absolute left-0 h-[1.75px] w-full rounded-full bg-fg"
                animate={open ? { top: 5, rotate: 45 } : { top: 1, rotate: 0 }}
                transition={spring.smooth}
              />
              <motion.span
                className="absolute left-0 h-[1.75px] w-full rounded-full bg-fg"
                animate={open ? { top: 5, rotate: -45 } : { top: 9, rotate: 0 }}
                transition={spring.smooth}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              aria-hidden="true"
              className="fixed inset-0 -z-10 bg-black/10 backdrop-blur-[2px] md:hidden dark:bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => closeMenu(true)}
            />
            <motion.nav
              id="mobile-menu"
              aria-label="Site menu"
              className="glass glass-strong glass-rim absolute inset-x-3 top-[76px] origin-top rounded-[28px] p-3 md:hidden"
              initial={{ opacity: 0, y: -12, scale: 0.96, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, scale: 0.98, filter: "blur(6px)", transition: { duration: 0.2, ease: ease.out } }}
              transition={spring.smooth}
            >
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { delayChildren: stagger(0.05, { startDelay: 0.06 }) } } }}
              >
                {navLinks.map((link) => (
                  <motion.li
                    key={link.to}
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: spring.smooth } }}
                  >
                    <Link
                      to={link.to}
                      viewTransition
                      onClick={() => closeMenu(false)}
                      aria-current={currentFor(link.to)}
                      className="flex min-h-14 items-center justify-between rounded-2xl px-4 text-[1.6rem] font-semibold tracking-[-0.03em] text-fg-2 transition-colors active:bg-fg/5 aria-[current]:text-fg"
                    >
                      {link.label}
                      {active === link.to && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-fg" />}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  className="p-2 pt-3"
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: spring.smooth } }}
                >
                  <a href={MAILTO} className="btn btn-primary w-full">
                    Contact
                  </a>
                </motion.li>
              </motion.ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
