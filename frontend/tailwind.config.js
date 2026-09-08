/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)', ...fontFamily.sans],
        mono: ['var(--font-roboto-mono)', ...fontFamily.mono],
      },
      colors: {
        'primary': '#2563EB',
        'accent-purple': '#9333EA',
        'accent-cyan': '#00D9FF',
        'accent-green': '#10B981',
        'warning': '#F59E0B',
        'danger': '#EF4444',
        'bg-dark': '#0A0B1E',
        'bg-section': '#0F172A',
        'text-light': '#E2E8F0',
        'text-dark': '#1F2937',
        'border-light': '#334155',
      }
    },
  },
  plugins: [],
};