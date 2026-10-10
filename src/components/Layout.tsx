import { Outlet, ScrollRestoration } from "react-router";
import { MotionConfig } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NavProgress } from "@/components/NavProgress";
import { LightboxProvider } from "@/components/Lightbox";

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
      </LightboxProvider>
    </MotionConfig>
  );
}
