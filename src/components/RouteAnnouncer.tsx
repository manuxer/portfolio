import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { focusTarget } from "@/lib/focus";

/**
 * Client-side navigation doesn't reload the page, so screen readers hear
 * nothing and focus stays on the link that was clicked. After each route
 * change, move focus to the new page's h1 (which announces it) or, failing
 * that, to <main> while a polite status message reads the page title.
 */
export function RouteAnnouncer() {
  const { pathname } = useLocation();
  const last = useRef(pathname);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (last.current === pathname) return; // first load
    last.current = pathname;
    // Wait a frame so the lazy page and its document.title have committed.
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("main h1");
      if (heading) {
        focusTarget(heading);
        setMessage("");
      } else {
        focusTarget(document.getElementById("main"));
        setMessage(document.title);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <p role="status" className="sr-only">
      {message}
    </p>
  );
}
