import { createFileRoute, redirect } from "@tanstack/react-router";

// The portfolio is authored as a plain HTML/CSS/JS site under `public/site/`.
// Opening "/" hands off to that static entry point.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/site/index.html" });
  },
  component: () => null,
});
