import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { focusTarget } from "@/lib/focus";

/**
 * Client-side navigation doesn't reload the page, so screen readers hear
 * nothing and focus stays on the link that was clicked. After each route
 * change, move focus to the new page's h1 (which announces it) or, failing
 * that, to <main> while a polite status message reads the page title.
 * Keyed on the navigation, not the path, so a link to the current page
 * (which re-renders it and scrolls to the top) also brings focus along.
 */
export function RouteAnnouncer() {
  const { key, hash } = useLocation();
  const last = useRef(key);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (last.current === key) return; // first load
    last.current = key;
    if (hash) return; // in-page anchor (e.g. the skip link) already placed focus
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
  }, [key, hash]);

  return (
    <p role="status" className="sr-only">
      {message}
    </p>
  );
}
