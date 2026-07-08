import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { SmoothScrollProvider } from "@/shared/components/providers/SmoothScrollProvider";
import "lenis/dist/lenis.css";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "FINUSA - Finance Nusantara",
  description:
    "Solusi literasi dan pengelolaan finansial untuk mahasiswa dan UMKM Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`dark ${nunito.variable}`}>
      <body className="min-h-screen bg-bg-dark font-sans text-white">
        <ThemeProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
