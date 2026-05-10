"use client";

import { useEffect } from "react";
import type { Theme } from "@/components/portfolio/themes";

export function PortfolioThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!theme?.colors) return;
    const c = theme.colors;
    const root = document.documentElement;

    root.style.setProperty("--p-primary", c.primary);
    root.style.setProperty("--p-accent", c.accent);
    root.style.setProperty("--p-bg", c.background);
    root.style.setProperty("--p-surface", c.surface);
    root.style.setProperty("--p-text", c.text);
    root.style.setProperty("--p-text-muted", c.textMuted);
    root.style.setProperty("--p-border", c.border);
    root.style.setProperty("--p-hero-from", c.heroFrom);
    root.style.setProperty("--p-hero-to", c.heroTo);
    root.style.setProperty("--p-section-bg", c.sectionBg);
    root.style.setProperty("--p-card-bg", c.cardBg);
    root.style.setProperty("--p-card-border", c.cardBorder);
    root.style.setProperty("--p-btn-bg", c.buttonBg);
    root.style.setProperty("--p-btn-text", c.buttonText);
    root.style.setProperty("--p-tag-bg", c.tagBg);
    root.style.setProperty("--p-tag-text", c.tagText);

    document.body.style.background = c.background;
    document.body.style.color = c.text;

    // Load fonts
    const fonts = [...new Set([theme.fonts.heading, theme.fonts.body])];
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${fonts.map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`).join("&")}&display=swap`;
    document.head.appendChild(link);

    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
      link.remove();
    };
  }, [theme]);

  return <>{children}</>;
}
