import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, createMemoryRouter, type RouteObject } from "react-router";
import { RouterProvider } from "react-router/dom";
import "@fontsource-variable/inter";
import "./styles/index.css";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: Layout,
    HydrateFallback: () => null,
    children: [
      { index: true, Component: Home },
      { path: "projects", lazy: () => import("@/pages/Projects") },
      { path: "projects/:id", lazy: () => import("@/pages/Project") },
      { path: "about", lazy: () => import("@/pages/About") },
      { path: "resume", lazy: () => import("@/pages/Resume") },
      { path: "*", Component: NotFound },
    ],
  },
];

// `npm run build:embed` keeps routing in memory so the site works inside a
// host that owns the URL (e.g. a preview frame); the real site uses the URL.
const router =
  import.meta.env.VITE_ROUTER === "memory"
    ? createMemoryRouter(routes)
    : createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
