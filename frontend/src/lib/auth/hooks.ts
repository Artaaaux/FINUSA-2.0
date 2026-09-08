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

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      setSuccess(true);
      return data;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat masuk. Silakan coba lagi.";
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

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    setSent(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/auth/callback` }
      );

      if (resetError) throw resetError;

      setSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim email reset. Coba lagi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error, sent, setError };
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      setSuccess(true);
      return data;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar. Silakan coba lagi.";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error, success, setError };
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
      const errMsg =
        err instanceof Error
          ? err.message
          : "Gagal menghubungkan ke Google. Silakan coba lagi.";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading, error, setError };
}
