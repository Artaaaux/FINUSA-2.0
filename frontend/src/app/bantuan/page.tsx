import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/shared/components/layout/navbar";
import { Footer } from "@/shared/components/layout/footer";
import { HelpCenterLayout } from "@/components/help/HelpCenterLayout";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { HELP_CATEGORIES } from "@/lib/data/help-data";
import { BookOpen, ChevronRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Pusat Bantuan & Panduan Penggunaan | FINUSA",
  description:
    "Dokumentasi lengkap dan panduan operasional seluruh fitur FINUSA: Target Tabungan, Struk Scan, Catat Kas, Monitor Arus Kas, dan Integrasi Google Sheets.",
  alternates: {
    canonical: "https://finusa.web.id/bantuan",
  },
  openGraph: {
    title: "Pusat Bantuan & Panduan Penggunaan | FINUSA",
    description:
      "Dokumentasi lengkap dan panduan operasional seluruh fitur FINUSA: Target Tabungan, Struk Scan, Catat Kas, Monitor Arus Kas, dan Integrasi Google Sheets.",
    url: "https://finusa.web.id/bantuan",
    siteName: "FINUSA",
    locale: "id_ID",
    type: "website",
  },
};

export default function BantuanPublicPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "https://finusa.web.id" },
          { name: "Pusat Bantuan", url: "https://finusa.web.id/bantuan" },
        ]}
      />
      <Navbar />

      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center text-slate-500 text-sm">
            Memuat panduan FINUSA...
          </div>
        }
      >
        <HelpCenterLayout isAppShell={false} />
      </Suspense>

      {/* Crawlable Public Guides Directory for Search Engines & Visitors */}
      <section className="bg-[#070B13] border-t border-slate-800/80 py-16 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-300 border border-cyan-500/20 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Indeks Dokumentasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Seluruh Kategori &amp; Topik Panduan FINUSA
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Jelajahi panduan langkah demi langkah untuk setiap modul dan fitur finansial FINUSA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HELP_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl border border-slate-800 bg-[#0C121D] p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-slate-800/80 flex items-center justify-between">
                    <span>{category.title}</span>
                    <span className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      {category.articles.length} topik
                    </span>
                  </h3>

                  <ul className="space-y-2.5">
                    {category.articles.map((article) => (
                      <li key={article.id}>
                        <Link
                          href={`/bantuan/${article.id}`}
                          className="group flex items-start gap-2 text-xs sm:text-sm text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0 group-hover:text-cyan-400 transition-colors" />
                          <span className="leading-snug line-clamp-1">{article.title}</span>
                          <ChevronRight className="w-3 h-3 text-slate-600 ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
