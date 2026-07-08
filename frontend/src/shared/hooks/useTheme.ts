"use client";

import * as React from "react";

import { ThemeContext } from "@/shared/context/ThemeContext";

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
