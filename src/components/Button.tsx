import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/cn";
import { useSpecular } from "@/hooks/useSpecular";

type Variant = "primary" | "glass";
type Size = "sm" | "md" | "lg";

interface Common {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

const classes = (variant: Variant, size: Size, className?: string) =>
  cn(
    "btn",
    variant === "primary" ? "btn-primary" : "btn-glass glass glass-soft specular",
    size === "sm" && "btn-sm",
    size === "lg" && "btn-lg",
    className,
  );

/** In-app navigation styled as a pill button (with a view transition). */
export function ButtonLink({ to, children, variant = "primary", size = "md", className }: Common & { to: string }) {
  const onPointerMove = useSpecular<HTMLAnchorElement>();
  return (
    <Link to={to} viewTransition className={classes(variant, size, className)} onPointerMove={onPointerMove}>
      {children}
    </Link>
  );
}

/** External / mailto / file link styled as a pill button. */
export function ButtonAnchor({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  newTab = false,
}: Common & { href: string; newTab?: boolean }) {
  const onPointerMove = useSpecular<HTMLAnchorElement>();
  return (
    <a
      href={href}
      className={classes(variant, size, className)}
      onPointerMove={onPointerMove}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {newTab && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
