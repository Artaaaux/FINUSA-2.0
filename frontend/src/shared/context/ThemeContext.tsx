"use client";

import * as React from "react";

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  }, []);

  const value = React.useMemo(
    () => ({
      isDark: true as const,
      toggleTheme: () => {},
    }),
    [],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
