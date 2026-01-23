// Zustand store for theme state management
// Supports light, dark, and system preference modes

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;

  // Actions
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

// Get system preference
function getSystemPreference(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Resolve theme based on mode
function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") {
    return getSystemPreference();
  }
  return mode;
}

// Apply theme to document
function applyTheme(theme: ResolvedTheme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      resolvedTheme: "dark", // Default to dark since HueGo was already dark

      setMode: (mode: ThemeMode) => {
        const resolvedTheme = resolveTheme(mode);
        applyTheme(resolvedTheme);
        set({ mode, resolvedTheme });
      },

      toggleTheme: () => {
        const { mode, resolvedTheme } = get();
        // If system mode, toggle to explicit dark/light
        // Otherwise toggle between dark/light
        let newMode: ThemeMode;
        if (mode === "system") {
          newMode = resolvedTheme === "dark" ? "light" : "dark";
        } else {
          newMode = mode === "dark" ? "light" : "dark";
        }
        const newResolvedTheme = resolveTheme(newMode);
        applyTheme(newResolvedTheme);
        set({ mode: newMode, resolvedTheme: newResolvedTheme });
      },

      initializeTheme: () => {
        const { mode } = get();
        const resolvedTheme = resolveTheme(mode);
        applyTheme(resolvedTheme);
        set({ resolvedTheme });

        // Listen for system preference changes
        if (typeof window !== "undefined") {
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          const handleChange = () => {
            const { mode } = get();
            if (mode === "system") {
              const newResolvedTheme = getSystemPreference();
              applyTheme(newResolvedTheme);
              set({ resolvedTheme: newResolvedTheme });
            }
          };
          mediaQuery.addEventListener("change", handleChange);
        }
      },
    }),
    {
      name: "huego-theme",
      partialize: (state) => ({
        mode: state.mode,
      }),
    }
  )
);

// Selector hooks
export const useThemeMode = () => useThemeStore((state) => state.mode);
export const useResolvedTheme = () => useThemeStore((state) => state.resolvedTheme);
export const useIsDarkMode = () => useThemeStore((state) => state.resolvedTheme === "dark");
