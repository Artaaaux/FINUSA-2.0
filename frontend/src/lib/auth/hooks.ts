"use client";

import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const login = async (email: string, password: string, captchaToken?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: captchaToken || undefined,
        },
      });

      if (signInError) {
        throw signInError;
      }

      setSuccess(true);
      return data;
    } catch (err: unknown) {
      console.error("Login error detail:", err);
      const errMsg = formatAuthError(err, "Terjadi kesalahan saat masuk. Silakan coba lagi.");
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success, setError };
}

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const resetPassword = async (email: string, captchaToken?: string) => {
    setLoading(true);
    setError(null);
    setSent(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback`,
          captchaToken: captchaToken || undefined,
        }
      );

      if (resetError) throw resetError;

      setSent(true);
    } catch (err: unknown) {
      console.error("Forgot password error detail:", err);
      const msg = formatAuthError(err, "Gagal mengirim email reset. Coba lagi.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error, sent, setError };
}

function formatAuthError(err: unknown, defaultMessage: string): string {
  let message = defaultMessage;
  let rawMessage = "";

  if (err && typeof err === "object") {
    const anyErr = err as Record<string, unknown>;
    if (typeof anyErr.message === "string" && anyErr.message.trim() !== "" && anyErr.message !== "{}") {
      message = anyErr.message;
      rawMessage = anyErr.message;
    } else if (typeof anyErr.msg === "string" && anyErr.msg.trim() !== "" && anyErr.msg !== "{}") {
      message = anyErr.msg;
      rawMessage = anyErr.msg;
    } else if (typeof anyErr.error_description === "string" && anyErr.error_description.trim() !== "") {
      message = anyErr.error_description;
      rawMessage = anyErr.error_description;
    } else if (anyErr.status === 500 || anyErr.code === 500) {
      message = "Terjadi kesalahan pada database Supabase (Database error).";
    }
  } else if (typeof err === "string" && err.trim() !== "" && err !== "{}") {
    message = err;
    rawMessage = err;
  }

  const lower = message.toLowerCase();
  if (lower.includes("user already registered")) {
    return "Email ini sudah terdaftar. Silakan langsung masuk atau gunakan opsi Lupa Password.";
  }
  if (lower.includes("captcha")) {
    return "Verifikasi CAPTCHA gagal atau kedaluwarsa. Silakan coba kembali.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Email atau password yang Anda masukkan salah.";
  }
  if (lower.includes("sending confirmation mail") || lower.includes("error sending") || lower.includes("smtp") || lower.includes("email provider")) {
    return "Gagal mengirim email verifikasi ke alamat tersebut. Domain/SMTP di Resend atau Supabase belum selesai diverifikasi DNS-nya.";
  }
  if (lower.includes("database error") || message === "{}") {
    const hint = rawMessage && rawMessage !== "Database error saving new user" ? ` (${rawMessage})` : "";
    return `Terjadi kendala pada database Supabase saat menyimpan pengguna baru.${hint} Silakan periksa SQL trigger database atau jalankan skrip drop trigger.`;
  }

  return message;
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const signup = async (email: string, password: string, captchaToken?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          captchaToken: captchaToken || undefined,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Supabase mengembalikan identitas kosong jika email sudah pernah terdaftar saat email confirmation aktif
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new Error("Email ini sudah terdaftar. Silakan langsung masuk atau gunakan opsi Lupa Password.");
      }

      setSuccess(true);
      return data;
    } catch (err: unknown) {
      console.error("Signup error detail:", err);
      const errMsg = formatAuthError(err, "Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error, success, setError };
}

export function useResendVerification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const resend = async (email: string) => {
    setLoading(true);
    setError(null);
    setSent(false);

    try {
      const { error: resendErr } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (resendErr) throw resendErr;
      setSent(true);
    } catch (err: unknown) {
      console.error("Resend error detail:", err);
      const msg = formatAuthError(err, "Gagal mengirim ulang email verifikasi.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { resend, loading, error, sent, setError };
}

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async (nextPath = "/home") => {
    setLoading(true);
    setError(null);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (oauthError) {
        throw oauthError;
      }

      return data;
    } catch (err: unknown) {
      console.error("Google auth error detail:", err);
      const errMsg = formatAuthError(err, "Gagal menghubungkan ke Google. Silakan coba lagi.");
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading, error, setError };
}
