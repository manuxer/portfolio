import { createContext, useContext } from "react";
import type { ImageSource } from "@/lib/image";

export interface LightboxItem {
  /** Unique across the page; ties a slide back to its thumbnail. */
  key: string;
  src: ImageSource;
  alt: string;
}

export interface LightboxContextValue {
  open: (items: LightboxItem[], index: number) => void;
  register: (key: string, el: HTMLElement | null) => void;
  hiddenKey: string | null;
}

export const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used inside <LightboxProvider>");
  return ctx;
}
