import { useEffect, type ReactNode } from "react";
import { shellTop, shellBottom } from "@/content/portfolio-body";

// Pages load the original behaviour script once per full page load
// (site links are plain anchors, so every page visit is a fresh load).
export function PortfolioShell({ html, children }: { html?: string; children?: ReactNode }) {
  useEffect(() => {
    if (document.getElementById("portfolio-script")) return;
    const s = document.createElement("script");
    s.id = "portfolio-script";
    s.src = "/portfolio/script.js";
    document.body.appendChild(s);
  }, []);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: shellTop }} />
      {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : children}
      <div dangerouslySetInnerHTML={{ __html: shellBottom }} />
    </>
  );
}

export const portfolioLinks = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700;800&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
  },
  { rel: "stylesheet", href: "/portfolio/styles.css" },
];

export function pageMeta(title: string, description: string) {
  return [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: "#071119" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
