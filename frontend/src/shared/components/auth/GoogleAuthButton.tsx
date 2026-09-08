"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useGoogleAuth } from "@/lib/auth/hooks";

interface GoogleAuthButtonProps {
  label?: string;
  nextPath?: string;
  disabled?: boolean;
  className?: string;
  onError?: (errorMsg: string) => void;
}

export function GoogleAuthButton({
  label = "Lanjutkan dengan Google",
  nextPath = "/home",
  disabled = false,
  className = "",
  onError,
}: GoogleAuthButtonProps) {
  const { signInWithGoogle, loading, error } = useGoogleAuth();

  const handleClick = async () => {
    try {
      await signInWithGoogle(nextPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal masuk dengan Google";
      if (onError) onError(msg);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        aria-label={label}
        className={`w-full h-11 px-4 flex items-center justify-center gap-3 bg-[#0F172A] hover:bg-[#1E293B] border border-slate-700/80 hover:border-slate-500 text-slate-200 hover:text-white font-medium text-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none ${className}`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        ) : (
          <svg
            className="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}
        <span>{loading ? "Menghubungkan..." : label}</span>
      </button>

      {error && (
        <p className="mt-1.5 text-xs text-rose-400 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
