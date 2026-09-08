"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/hooks";
import { SettingsService } from "@/lib/services/settings.service";
import type { UserProfileSettings } from "@/app/(app)/settings/types";

interface UserProfileContextValue {
  profile: UserProfileSettings | null;
  loading: boolean;
  /** Re-fetch profile from Supabase and update all consumers */
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue>({
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

const CACHE_KEY = "finusa_settings_profile";

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Load cached profile from localStorage immediately
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setProfile(JSON.parse(cached));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Fetch live profile from Supabase when user is available
  const fetchProfile = useCallback(async () => {
    try {
      const cloudProfile = await SettingsService.getProfile();
      if (cloudProfile) {
        setProfile(cloudProfile);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(cloudProfile));
        } catch {
          // ignore storage errors
        }
      }
    } catch (err) {
      console.warn("UserProfileContext: could not load profile", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user, fetchProfile]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return (
    <UserProfileContext.Provider value={{ profile, loading, refreshProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
