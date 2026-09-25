import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2.5rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "accent-cyan": "#00D9FF",
        "accent-green": "#00FF88",
        "accent-purple": "#A78BFA",
        "bg-dark": "#0A0E27",
        "card-dark": "#1a1f3a",
        "bg-section": "#0F172A",
        navy: {
          950: '#020817',
          900: '#030f2b',
          850: '#05163a',
          800: '#0a1d4a',
          700: '#0f2963',
        },
        finusa: {
          blue: '#1687ff',
          cyan: '#00d2ff',
          emerald: '#10b981',
          violet: '#8b5cf6',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Plus Jakarta Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: [
          "var(--font-roboto-mono)",
          "Roboto Mono",
          "ui-monospace",
          "monospace",
        ],
      },
      boxShadow: {
        "dark-sm": "0 2px 8px rgba(0,0,0,0.1)",
        "dark-md": "0 4px 16px rgba(0,0,0,0.12)",
        "dark-lg": "0 8px 24px rgba(0,0,0,0.15)",
        "premium-blue": "0 0 20px rgba(37,99,235,0.15)",
        "premium-emerald": "0 0 20px rgba(16,185,129,0.15)",
        "premium-red": "0 0 20px rgba(239,68,68,0.15)",
        "premium-purple": "0 0 20px rgba(167,139,250,0.15)",
        'glow-blue': '0 0 40px -10px rgba(22, 135, 255, 0.45)',
        'glow-cyan': '0 0 35px -8px rgba(0, 210, 255, 0.35)',
        'glass-card': '0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
        'glass-float': '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "dot-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        scanLine: {
          "0%": { top: "0%", opacity: "0" },
          "15%": { opacity: "1" },
          "85%": { opacity: "1" },
          "100%": { top: "96%", opacity: "0" },
        },
        subtleFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        subtleFloatDelayed: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(8px)" },
        },
        floatDashboard: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -8px, 0)" },
        },
        floatCardLeft: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(0, -14px, 0) rotate(0.8deg)" },
        },
        floatCardRight: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(0, 12px, 0) rotate(-1deg)" },
        },
        marqueeAnimation: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "dot-blink": "dot-blink 1.5s ease-in-out infinite",
        scan: "scanLine 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        float: "subtleFloat 6s ease-in-out infinite",
        "float-delayed": "subtleFloatDelayed 7s ease-in-out infinite",
        "float-dashboard": "floatDashboard 7.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
        "float-card-left": "floatCardLeft 5.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
        "float-card-right": "floatCardRight 6.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
        "laser-scan": "laserScanBeam 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        marquee: "marqueeAnimation 28s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
