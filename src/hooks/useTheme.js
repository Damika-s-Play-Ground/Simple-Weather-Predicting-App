import { useEffect, useState } from "react";

export const THEME_ORDER = ["system", "light", "dark"];

const THEME_COLORS = { light: "#4682b4", dark: "#16222c" };

const systemPrefersDark = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const resolve = (theme) =>
  theme === "system" ? (systemPrefersDark() ? "dark" : "light") : theme;

// Tri-state theme preference (system/light/dark), persisted, applied as a
// data-theme attribute on <html> so CSS token overrides take effect. The
// no-flash script in index.html applies the same logic before first paint.
export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      return THEME_ORDER.includes(stored) ? stored : "system";
    } catch {
      return "system";
    }
  });
  const [resolved, setResolved] = useState(() => resolve(theme));

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Ignore storage errors (e.g. private mode / quota).
    }
    setResolved(resolve(theme));

    // Follow live OS changes only while in system mode.
    if (theme === "system" && typeof window.matchMedia === "function") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => setResolved(resolve("system"));
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLORS[resolved]);
  }, [resolved]);

  const cycleTheme = () =>
    setTheme(
      (prev) =>
        THEME_ORDER[(THEME_ORDER.indexOf(prev) + 1) % THEME_ORDER.length]
    );

  return { theme, resolved, setTheme, cycleTheme };
}
