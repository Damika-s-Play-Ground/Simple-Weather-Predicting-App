import { renderHook, act } from "@testing-library/react";
import useTheme, { THEME_ORDER } from "./useTheme";

const mockMatchMedia = (prefersDark) => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: prefersDark,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
};

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  mockMatchMedia(false);
});

test("defaults to system and resolves via prefers-color-scheme", () => {
  mockMatchMedia(true);
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe("system");
  expect(result.current.resolved).toBe("dark");
  expect(document.documentElement.dataset.theme).toBe("dark");
});

test("cycles system -> light -> dark -> system and persists", () => {
  const { result } = renderHook(() => useTheme());
  act(() => result.current.cycleTheme());
  expect(result.current.theme).toBe("light");
  expect(localStorage.getItem("theme")).toBe("light");

  act(() => result.current.cycleTheme());
  expect(result.current.theme).toBe("dark");
  expect(document.documentElement.dataset.theme).toBe("dark");

  act(() => result.current.cycleTheme());
  expect(result.current.theme).toBe("system");
  expect(THEME_ORDER).toContain(result.current.theme);
});

test("restores a persisted explicit theme and syncs meta theme-color", () => {
  const meta = document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  document.head.appendChild(meta);
  localStorage.setItem("theme", "dark");

  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe("dark");
  expect(result.current.resolved).toBe("dark");
  expect(meta.getAttribute("content")).toBe("#16222c");

  document.head.removeChild(meta);
});

test("ignores an invalid persisted value", () => {
  localStorage.setItem("theme", "neon");
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe("system");
});
