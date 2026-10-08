import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "@fontsource-variable/inter";
import "./styles/index.css";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter(
  [
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
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" },
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
