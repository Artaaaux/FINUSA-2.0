"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Global smooth scroll provider using Lenis.
 * Wraps the entire app to provide buttery-smooth scrolling on all pages.
 *
 * The `root` prop makes Lenis use the <html> element as the scroll container
 * and makes the Lenis instance accessible globally via `useLenis()`.
 *
 * @see https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
