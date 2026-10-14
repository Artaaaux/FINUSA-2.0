import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/shared/components/layout/navbar";
import { Footer } from "@/shared/components/layout/footer";
import { getAllArticles, getArticleById } from "@/lib/data/help-data";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  ListOrdered,
} from "lucide-react";

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleById(slug);

  if (!article) {
    return {
      title: "Panduan Tidak Ditemukan | FINUSA",
      description: "Halaman panduan FINUSA yang Anda cari tidak dapat ditemukan.",
    };
  }

  const url = `https://finusa.web.id/bantuan/${slug}`;

  return {
    title: `${article.title} - Panduan FINUSA`,
    description: article.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${article.title} - Panduan FINUSA`,
      description: article.description,
      url: url,
      siteName: "FINUSA",
      locale: "id_ID",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} - Panduan FINUSA`,
      description: article.description,
    },
  };
}

export default async function HelpArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleById(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles();
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const currentUrl = `https://finusa.web.id/bantuan/${article.id}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "https://finusa.web.id" },
          { name: "Pusat Bantuan", url: "https://finusa.web.id/bantuan" },
          { name: article.title, url: currentUrl },
        ]}
      />
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        url={currentUrl}
      />

      <Navbar />

      <main className="min-h-screen bg-[#070B13] text-slate-200 pt-24 pb-20 font-sans selection:bg-blue-600 selection:text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* Breadcrumb Navigation Bar */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <Link href="/bantuan" className="hover:text-white transition-colors">
              Pusat Bantuan
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-cyan-400 font-medium truncate max-w-[200px] sm:max-w-none">
              {article.categoryTitle}
            </span>
          </nav>

          {/* Article Header */}
          <header className="border-b border-slate-800 pb-8 mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-300 border border-cyan-500/20">
                <BookOpen className="w-3 h-3" />
                {article.categoryTitle}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {article.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
              {article.description}
            </p>

            {/* Purpose Highlight Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-slate-300 text-sm leading-relaxed flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-1">
                  Tujuan Panduan:
                </strong>
                <span>{article.purpose}</span>
              </div>
            </div>
          </header>

          {/* Step-by-Step Instructions */}
          <section className="space-y-6 mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <ListOrdered className="w-5 h-5 text-cyan-400" />
              Langkah demi Langkah
            </h2>

            <div className="space-y-6">
              {article.steps.map((step) => (
                <article
                  key={step.stepNumber}
                  className="rounded-xl border border-slate-800/90 bg-[#0C121D] p-5 sm:p-6 transition-colors hover:border-slate-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-xs font-bold font-mono text-cyan-300">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed pl-10 mb-3">
                    {step.instruction}
                  </p>

                  {step.details && step.details.length > 0 && (
                    <ul className="pl-10 space-y-1.5 list-disc list-outside text-xs sm:text-sm text-slate-400">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Form Fields Table if exists */}
          {article.formFields && article.formFields.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 pb-3 border-b border-slate-800">
                Keterangan Kolom Formulir
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0C121D]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3">Nama Kolom</th>
                      <th className="px-4 py-3">Wajib</th>
                      <th className="px-4 py-3">Tipe</th>
                      <th className="px-4 py-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {article.formFields.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-900/40">
                        <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                          {f.name}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              f.required
                                ? "bg-rose-500/15 text-rose-300 border border-rose-500/20"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {f.required ? "Ya" : "Opsional"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-cyan-300 text-xs">
                          {f.type}
                        </td>
                        <td className="px-4 py-3 text-slate-400 leading-relaxed">
                          {f.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Best Practices */}
          {article.bestPractices && article.bestPractices.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Praktik Terbaik (Best Practices)
              </h2>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-5 space-y-3">
                {article.bestPractices.map((bp, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <p className="leading-relaxed">{bp}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Troubleshooting Section */}
          {article.troubleshooting && article.troubleshooting.length > 0 && (
            <section className="mb-14">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Kendala yang Sering Terjadi &amp; Solusi
              </h2>
              <div className="space-y-4">
                {article.troubleshooting.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-[#0C121D] p-5 space-y-2"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-start gap-2">
                      <span className="text-amber-400 font-mono">Q:</span>
                      {item.issue}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                      <span className="text-emerald-400 font-bold mr-1">Solusi:</span>
                      {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Next / Previous Article Navigation */}
          <nav aria-label="Navigasi Panduan Terkait" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-slate-800 mb-12">
            {prevArticle ? (
              <Link
                href={`/bantuan/${prevArticle.id}`}
                className="group p-4 rounded-xl border border-slate-800 bg-[#0C121D] hover:border-slate-700 transition-all text-left flex flex-col justify-between"
              >
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  Sebelumnya
                </span>
                <span className="text-sm font-semibold text-white mt-1 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {prevArticle.title}
                </span>
              </Link>
            ) : <div />}

            {nextArticle ? (
              <Link
                href={`/bantuan/${nextArticle.id}`}
                className="group p-4 rounded-xl border border-slate-800 bg-[#0C121D] hover:border-slate-700 transition-all text-right flex flex-col justify-between sm:items-end"
              >
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
                  Selanjutnya
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-sm font-semibold text-white mt-1 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {nextArticle.title}
                </span>
              </Link>
            ) : <div />}
          </nav>

          {/* Back to Guides Directory CTA */}
          <div className="text-center pt-4">
            <Link
              href="/bantuan"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Seluruh Daftar Panduan
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
