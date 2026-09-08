"use client";

import * as React from "react";

export type ThemeMode = "dark" | "light" | "auto";

export type ThemeContextValue = {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeMode>("dark");
  const [isDark, setIsDark] = React.useState<boolean>(true);

  // Initialize theme from localStorage or system preference
  React.useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("finusa_theme") as ThemeMode | null;
      if (savedTheme && (savedTheme === "dark" || savedTheme === "light" || savedTheme === "auto")) {
        setThemeState(savedTheme);
      }
    } catch {
      // ignore
    }
  }, []);

  // Update DOM when theme changes
  React.useEffect(() => {
    const applyTheme = () => {
      let resolvedDark = true;
      if (theme === "light") {
        resolvedDark = false;
      } else if (theme === "auto") {
        resolvedDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      setIsDark(resolvedDark);
      if (resolvedDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
      }
    };

    applyTheme();

    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  const setTheme = React.useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("finusa_theme", newTheme);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  const value = React.useMemo(
    () => ({
      theme,
      isDark,
      setTheme,
      toggleTheme,
    }),
    [theme, isDark, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
