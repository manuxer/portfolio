/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "memory" for embedded builds that must not touch the URL. */
  readonly VITE_ROUTER?: string;
  readonly VITE_START_PATH?: string;
}

declare module "*?responsive" {
  const picture: import("./lib/image").Picture;
  export default picture;
}

/** vite-imagetools: a single transformed image URL (`?w=…&format=…&imagetools`). */
declare module "*&imagetools" {
  const src: string;
  export default src;
}
