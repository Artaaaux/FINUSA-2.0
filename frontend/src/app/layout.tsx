import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finusa.web.id"),
  title: {
    default: "FINUSA - Aplikasi Keuangan Pintar, Catat Kas & Struk Scan",
    template: "%s | FINUSA",
  },
  description:
    "Kelola keuangan lebih cerdas dengan FINUSA. Catat pengeluaran harian, scan struk otomatis, capai target tabungan, dan sinkronkan ke Google Sheets.",
  keywords: [
    "aplikasi keuangan",
    "catat pengeluaran",
    "struk scan",
    "ocr struk belanja",
    "kelola keuangan pribadi",
    "target tabungan",
    "google sheets keuangan",
    "buku kas harian",
    "finusa",
    "finance nusantara",
  ],
  authors: [{ name: "FINUSA" }],
  creator: "FINUSA",
  publisher: "FINUSA",
  alternates: {
    canonical: "https://finusa.web.id",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    title: "FINUSA - Aplikasi Keuangan Pintar, Catat Kas & Struk Scan",
    description:
      "Kelola keuangan lebih cerdas dengan FINUSA. Catat pengeluaran harian, scan struk otomatis, capai target tabungan, dan sinkronkan ke Google Sheets.",
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
  twitter: {
    card: "summary_large_image",
    title: "FINUSA - Aplikasi Keuangan Pintar, Catat Kas & Struk Scan",
    description:
      "Kelola keuangan lebih cerdas dengan FINUSA. Catat pengeluaran harian, scan struk otomatis, dan capai target tabungan impian.",
    images: ["/Assets/logo-full-trans.png"],
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
    <html
      lang="id"
      suppressHydrationWarning
      className={`dark font-sans ${plusJakartaSans.variable} ${robotoMono.variable}`}
    >
      <body className="min-h-screen bg-bg-dark font-sans text-white antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
