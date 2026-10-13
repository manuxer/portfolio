export const EMAIL = "manuxdesign@gmail.com";
export const MAILTO = `mailto:${EMAIL}`;
export const LINKEDIN = "https://www.linkedin.com/in/manu-peethambar/";

/** Resolves a file in /public against the deploy base path. */
export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const navLinks = [
  { to: "/projects", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/resume", label: "Resume" },
] as const;
