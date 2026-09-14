"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  HELP_CATEGORIES,
  getAllArticles,
  getArticleById,
} from "@/lib/data/help-data";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

interface HelpCenterLayoutProps {
  isAppShell?: boolean; // true if inside (app)/help, false if in standalone /bantuan
}

export function HelpCenterLayout({ isAppShell = false }: HelpCenterLayoutProps) {
  const searchParams = useSearchParams();
  const initialArticleId = searchParams.get("article") || "tambah-target-tabungan";

  const allArticles = useMemo(() => getAllArticles(), []);

  // State for active article
  const [activeArticleId, setActiveArticleId] = useState<string>(initialArticleId);

  // State for expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    nabung: true,
    "scan-ai": true,
    catat: true,
    monitor: true,
    sheets: false,
    pengaturan: false,
  });

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for mobile drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync active article if URL param changes
  useEffect(() => {
    const articleParam = searchParams.get("article");
    if (articleParam && getArticleById(articleParam)) {
      setActiveArticleId(articleParam);
      // Auto expand parent category
      const art = getArticleById(articleParam);
      if (art) {
        setExpandedCategories((prev) => ({ ...prev, [art.categoryId]: true }));
      }
    }
  }, [searchParams]);

  // Current active article object
  const currentArticle = useMemo(() => {
    return getArticleById(activeArticleId) || allArticles[0];
  }, [activeArticleId, allArticles]);

  // Navigation: previous and next articles
  const { prevArticle, nextArticle } = useMemo(() => {
    const currentIndex = allArticles.findIndex((a) => a.id === currentArticle.id);
    return {
      prevArticle: currentIndex > 0 ? allArticles[currentIndex - 1] : null,
      nextArticle: currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null,
    };
  }, [allArticles, currentArticle]);

  // Toggle category collapse
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Select article
  const handleSelectArticle = (articleId: string) => {
    setActiveArticleId(articleId);
    setMobileMenuOpen(false);
    // update URL without full page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("article", articleId);
      window.history.pushState({}, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return HELP_CATEGORIES;
    }
    const query = searchQuery.toLowerCase();
    return HELP_CATEGORIES.map((cat) => {
      const matchingArticles = cat.articles.filter(
        (art) =>
          art.title.toLowerCase().includes(query) ||
          art.description.toLowerCase().includes(query) ||
          art.categoryTitle.toLowerCase().includes(query) ||
          art.steps.some(
            (s) =>
              s.title.toLowerCase().includes(query) || s.instruction.toLowerCase().includes(query)
          )
      );
      return {
        ...cat,
        articles: matchingArticles,
      };
    }).filter((cat) => cat.articles.length > 0);
  }, [searchQuery]);

  return (
    <div className={`min-h-screen bg-[#0A0D14] text-slate-200 ${!isAppShell ? "pt-16" : ""}`}>
      {/* Top Banner / Breadcrumb Bar on Standalone page */}
      {!isAppShell && (
        <div className="border-b border-slate-800 bg-[#0D111A] px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali ke FINUSA
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-semibold text-blue-400">Pusat Bantuan & Panduan</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/perbandingan"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Perbandingan Fitur
              </Link>
              <Link
                href="/auth/signup"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Buka Aplikasi
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Documentation Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Header Bar with Hamburger */}
        <div className="flex items-center justify-between lg:hidden mb-6 pb-4 border-b border-slate-800">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <Menu className="h-4 w-4" />
            <span>Daftar Panduan</span>
          </button>

          <span className="text-xs text-slate-400 truncate max-w-[200px]">
            {currentArticle.categoryTitle}
          </span>
        </div>

        <div className="flex gap-10 items-start">
          {/* ── Left Sidebar (Dark collapsible accordion matching screenshot) ── */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-50 w-72 bg-[#0A0D14] border-r border-slate-800 p-5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block lg:w-72 lg:p-0 lg:border-r-0 lg:bg-transparent shrink-0
              ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between lg:hidden mb-4 pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pusat Bantuan FINUSA
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sticky Navigation Box */}
            <div className="lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 custom-scrollbar">
              {/* Search Box */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari panduan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Hierarchy matching the user's reference image */}
              <nav className="space-y-4" aria-label="Navigasi Dokumentasi">
                {filteredCategories.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    Tidak ada panduan yang cocok dengan &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredCategories.map((category) => {
                    const isExpanded = expandedCategories[category.id] !== false;
                    const hasActiveArticle = category.articles.some(
                      (a) => a.id === activeArticleId
                    );

                    return (
                      <div key={category.id} className="space-y-1">
                        {/* Section Header (Accordion Toggle) */}
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between py-1.5 px-2 text-left group"
                        >
                          <span
                            className={`text-xs font-bold tracking-tight transition-colors ${
                              hasActiveArticle ? "text-white" : "text-slate-300 group-hover:text-white"
                            }`}
                          >
                            {category.title}
                          </span>
                          <span className="text-slate-500 group-hover:text-slate-300 transition-transform">
                            {isExpanded ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5" />
                            )}
                          </span>
                        </button>

                        {/* Collapsible Sub-Articles */}
                        {isExpanded && (
                          <div className="pl-2 space-y-0.5 border-l border-slate-800/80 ml-2 mt-1">
                            {category.articles.map((article) => {
                              const isActive = article.id === activeArticleId;

                              return (
                                <button
                                  key={article.id}
                                  onClick={() => handleSelectArticle(article.id)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                                    isActive
                                      ? "bg-[#1A2234] text-white font-semibold shadow-sm border border-blue-500/20"
                                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                                  }`}
                                >
                                  <span className="truncate">{article.title}</span>
                                  {isActive && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </nav>
            </div>
          </aside>

          {/* Backdrop for Mobile Drawer */}
          {mobileMenuOpen && (
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-xs"
            />
          )}

          {/* ── Main Content Area ── */}
          <main className="flex-1 min-w-0 max-w-4xl pb-20">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium">
              <span>Bantuan</span>
              <span>/</span>
              <span className="text-slate-400">{currentArticle.categoryTitle}</span>
              <span>/</span>
              <span className="text-blue-400 truncate">{currentArticle.title}</span>
            </div>

            {/* Article Title & Intro */}
            <header className="mb-8 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {currentArticle.categoryTitle}
                </span>
                <span className="text-xs text-slate-500 tabular-nums">
                  Estimasi waktu baca: {currentArticle.readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                {currentArticle.title}
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
                {currentArticle.description}
              </p>
            </header>

            {/* Section: Tujuan & Kapan Menggunakan */}
            <section className="mb-10 rounded-xl border border-slate-800 bg-[#0F141F] p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                Fungsi & Konsep Fitur
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentArticle.purpose}
              </p>
            </section>

            {/* Section: Panduan Langkah demi Langkah */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Panduan Langkah demi Langkah
              </h2>

              <div className="space-y-4">
                {currentArticle.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="rounded-xl border border-slate-800 bg-[#0E131E] p-5 sm:p-6 transition-colors hover:border-slate-700"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30 text-xs font-bold text-blue-400 tabular-nums mt-0.5">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white mb-1.5">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed mb-3">
                          {step.instruction}
                        </p>

                        {step.details && step.details.length > 0 && (
                          <ul className="space-y-1.5 text-xs text-slate-400 border-l border-slate-800 pl-3">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="leading-relaxed">
                                • {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Rincian Kolom / Formulir (jika ada) */}
            {currentArticle.formFields && currentArticle.formFields.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4">
                  Rincian Kolom & Formulir Input
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  Berikut penjelasan setiap input data yang tersedia pada antarmuka fitur ini:
                </p>

                <div className="rounded-xl border border-slate-800 bg-[#0E131E] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Nama Kolom</th>
                          <th className="py-3 px-4 font-semibold">Wajib/Opsional</th>
                          <th className="py-3 px-4 font-semibold">Tipe Data</th>
                          <th className="py-3 px-4 font-semibold">Penjelasan & Panduan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {currentArticle.formFields.map((field, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/30">
                            <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                              {field.name}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {field.required ? (
                                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  Wajib
                                </span>
                              ) : (
                                <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                                  Opsional
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                              {field.type}
                            </td>
                            <td className="py-3.5 px-4 text-slate-300 leading-relaxed">
                              {field.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Section: Screenshot Container Placeholder (Siap Diisi Foto Belakangan Sesuai Instruksi User) */}
            <section className="mb-12">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                Area Pratinjau Tampilan Antarmuka
              </h2>

              <div className="rounded-xl border-2 border-dashed border-slate-800 bg-[#0C1018] p-8 sm:p-12 text-center relative overflow-hidden">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-500 mb-3">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300 mb-1">
                  {currentArticle.screenshotPlaceholder?.title || "Pratinjau Layar Fitur"}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {currentArticle.screenshotPlaceholder?.caption ||
                    "Slot dokumentasi visual antarmuka FINUSA. Aset tangkapan layar dapat disematkan di sini pada pembaruan mendatang."}
                </p>
                <div className="mt-4 inline-flex items-center px-2.5 py-1 rounded bg-slate-900 text-[11px] font-mono text-slate-500 border border-slate-800">
                  Slot Tangkapan Layar: {currentArticle.id}.png
                </div>
              </div>
            </section>

            {/* Section: Tips & Praktik Terbaik */}
            {currentArticle.bestPractices && currentArticle.bestPractices.length > 0 && (
              <section className="mb-12 rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-6">
                <h2 className="text-base font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Tips & Praktik Terbaik Finansial
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentArticle.bestPractices.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Section: Troubleshooting / FAQ */}
            {currentArticle.troubleshooting && currentArticle.troubleshooting.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-amber-400" />
                  Pertanyaan Umum & Solusi Kendala
                </h2>

                <div className="space-y-3">
                  {currentArticle.troubleshooting.map((qa, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-[#0E131E] p-5"
                    >
                      <h3 className="text-sm font-bold text-white mb-2 flex items-start gap-2">
                        <span className="text-amber-400 font-mono text-xs mt-0.5">Tanya:</span>
                        <span>{qa.issue}</span>
                      </h3>
                      <div className="text-xs sm:text-sm text-slate-400 leading-relaxed pl-6 border-l border-slate-800 ml-2">
                        <strong className="text-slate-300 block mb-1">Solusi:</strong>
                        {qa.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom Pagination: Previous & Next Article */}
            <nav
              className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4"
              aria-label="Navigasi Artikel Sebelumnya dan Berikutnya"
            >
              {prevArticle ? (
                <button
                  onClick={() => handleSelectArticle(prevArticle.id)}
                  className="rounded-xl border border-slate-800 bg-[#0E131E] p-4 text-left transition-all hover:border-slate-700 group"
                >
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                    <ArrowLeft className="h-3 w-3" />
                    Sebelumnya
                  </span>
                  <span className="text-sm font-bold text-white block truncate">
                    {prevArticle.title}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5 truncate">
                    {prevArticle.categoryTitle}
                  </span>
                </button>
              ) : (
                <div />
              )}

              {nextArticle ? (
                <button
                  onClick={() => handleSelectArticle(nextArticle.id)}
                  className="rounded-xl border border-slate-800 bg-[#0E131E] p-4 text-right transition-all hover:border-slate-700 group"
                >
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1 flex items-center justify-end gap-1 group-hover:text-blue-400 transition-colors">
                    Selanjutnya
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="text-sm font-bold text-white block truncate">
                    {nextArticle.title}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5 truncate">
                    {nextArticle.categoryTitle}
                  </span>
                </button>
              ) : (
                <div />
              )}
            </nav>
          </main>
        </div>
      </div>
    </div>
  );
}
