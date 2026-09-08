"use client";

import React, { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Keyboard, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";
import { FAQ_LIST } from "../../constants";

interface HelpAboutSectionProps {
  onOpenKeyboardShortcuts: () => void;
  onSendFeedback: (subject: string, message: string) => void;
}

export default function HelpAboutSection({
  onOpenKeyboardShortcuts,
  onSendFeedback,
}: HelpAboutSectionProps) {
  const [searchFaq, setSearchFaq] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const filteredFaqs = FAQ_LIST.filter(
    (f) =>
      f.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchFaq.toLowerCase())
  );

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackSubject.trim() || !feedbackMessage.trim()) return;
    onSendFeedback(feedbackSubject, feedbackMessage);
    setFeedbackSent(true);
    setFeedbackSubject("");
    setFeedbackMessage("");
    setTimeout(() => setFeedbackSent(false), 4000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Bantuan, Dukungan & Tentang Finusa
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Temukan jawaban FAQ, hubungi tim developer, pelajari pintasan keyboard, dan cek info versi rilis.
        </p>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onOpenKeyboardShortcuts}
          className="p-4 rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 hover:border-blue-500/40 hover:bg-[#1a1f2e] transition-all flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                Pintasan Keyboard (Shortcuts)
              </div>
              <p className="text-[11px] text-slate-400">Tekan ⌘K atau lihat daftar cheatsheet</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-blue-400">Buka →</span>
        </button>

        <a
          href="https://github.com/Artaaaux/FINUSA-2.0"
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 hover:border-teal-500/40 hover:bg-[#1a1f2e] transition-all flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                Dokumentasi & GitHub
              </div>
              <p className="text-[11px] text-slate-400">Panduan teknis dan kontribusi proyek</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
        </a>
      </div>

      {/* FAQ Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Pertanyaan Sering Diajukan (FAQ)</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              placeholder="Cari FAQ..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-850"
                >
                  <span className="text-xs font-bold text-slate-200">{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact & Feedback Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Hubungi Dukungan & Saran Fitur</h3>
            <p className="text-xs text-slate-400">Kirim feedback atau laporkan kendala ke tim engineering Finusa.</p>
          </div>
        </div>

        {feedbackSent ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Terima kasih! Pesan Anda telah kami terima dan akan segera ditindaklanjuti.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-3 max-w-xl">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Subjek Pesan
              </label>
              <input
                type="text"
                value={feedbackSubject}
                onChange={(e) => setFeedbackSubject(e.target.value)}
                placeholder="Contoh: Masukan untuk Formula Google Sheets"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Isi Masukan / Detail Kendala
              </label>
              <textarea
                rows={3}
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Jelaskan kebutuhan atau saran Anda secara detail..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Masukan</span>
            </button>
          </form>
        )}
      </div>

      {/* About App Info Footer */}
      <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="font-bold text-slate-200">FINUSA (Finance Nusantara)</div>
          <div className="text-[11px] text-slate-500">Versi 2.0.0 (Build 2024.08) • Lisensi Apache 2.0</div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <a href="/help" className="hover:text-blue-400 transition-colors">Kebijakan Privasi</a>
          <a href="/help" className="hover:text-blue-400 transition-colors">Ketentuan Layanan</a>
          <a href="/help" className="hover:text-blue-400 transition-colors">Status Server</a>
        </div>
      </div>
    </div>
  );
}
