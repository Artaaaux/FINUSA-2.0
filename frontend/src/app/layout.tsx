import type { Metadata } from "next";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://finusa.web.id"),
  title: "FINUSA - Finance Nusantara",
  description:
    "Solusi literasi dan pengelolaan finansial untuk pelajar dan generasi muda Indonesia.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/Assets/logo-mark-80.webp", type: "image/webp" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: "FINUSA - Finance Nusantara",
    description:
      "Solusi literasi dan pengelolaan finansial untuk pelajar dan generasi muda Indonesia.",
    url: "https://finusa.web.id",
    siteName: "FINUSA",
    images: [
      {
        url: "/Assets/logo-full-trans.png",
        width: 696,
        height: 205,
        alt: "FINUSA - Finance Nusantara",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  verification: {
    google: "u6crRizJRBxe3tYTV75j4rqH0qDZhielj23ypAUGT4I",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="dark font-sans">
      <body className="min-h-screen bg-bg-dark font-sans text-white antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
