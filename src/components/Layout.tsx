import { Outlet, ScrollRestoration, useNavigation } from "react-router";
import { MotionConfig } from "motion/react";
import { useMotionPaused } from "@/lib/motionPref";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NavProgress } from "@/components/NavProgress";
import { LightboxProvider } from "@/components/Lightbox";
import { RouteAnnouncer } from "@/components/RouteAnnouncer";

export function Layout() {
  const loading = useNavigation().state === "loading";
  const paused = useMotionPaused();

  return (
    // The site's "Pause animations" switch counts as a reduced-motion preference.
    <MotionConfig reducedMotion={paused ? "always" : "user"}>
      <LightboxProvider>
        <a href="#main" className="skip-link btn btn-primary btn-sm">
          Skip to content
        </a>
        <RouteAnnouncer />
        <NavProgress />
        <Navbar />
        {/* tabIndex lets the skip link and route changes move focus here. */}
        <main id="main" tabIndex={-1} aria-busy={loading || undefined}>
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
      </LightboxProvider>
    </MotionConfig>
  );
}
