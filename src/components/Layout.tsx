import { lazy, Suspense } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { MotionConfig } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NavProgress } from "@/components/NavProgress";
import { LightboxProvider } from "@/components/Lightbox";
import { endIntro, introWillPlay } from "@/lib/intro";

// The first-load logo intro (GSAP) is its own chunk, fetched only when it will play.
const Intro = lazy(() =>
  import("@/intro/Intro").catch(() => {
    endIntro();
    return { default: () => null };
  }),
);

export function Layout() {
  return (
    <MotionConfig reducedMotion="user">
      <LightboxProvider>
        <a href="#main" className="skip-link btn btn-primary btn-sm">
          Skip to content
        </a>
        <NavProgress />
        <Navbar />
        <main id="main">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        {introWillPlay && (
          <Suspense fallback={null}>
            <Intro />
          </Suspense>
        )}
      </LightboxProvider>
    </MotionConfig>
  );
}
