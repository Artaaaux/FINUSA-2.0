import type { Metadata } from "next";
import { Nunito, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto-mono",
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
    <html lang="id" suppressHydrationWarning className={`dark ${nunito.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen bg-bg-dark font-sans text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
