import { createFileRoute } from "@tanstack/react-router";
import { workMain } from "@/content/portfolio-body";
import { PortfolioShell, pageMeta, portfolioLinks } from "@/components/PortfolioShell";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: pageMeta(
      "Projects — Sai Sudarshan",
      "Cloud-native, developer tooling and network projects by Sai Sudarshan: EKS + Kafka order platform, Go log-analysis CLI and an HA ISP core network.",
    ),
    links: portfolioLinks,
  }),
  component: () => <PortfolioShell html={workMain} />,
});
