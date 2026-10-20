import { createFileRoute } from "@tanstack/react-router";
import { homeMain } from "@/content/portfolio-body";
import { PortfolioShell, pageMeta, portfolioLinks } from "@/components/PortfolioShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta(
      "Sai Sudarshan — Cloud & DevOps Engineer",
      "Portfolio of Sai Sudarshan Subramaniam — Cloud & DevOps Engineer in Dublin, Ireland. Terraform, Kubernetes, automation and service reliability.",
    ),
    links: portfolioLinks,
  }),
  component: () => <PortfolioShell html={homeMain} />,
});
