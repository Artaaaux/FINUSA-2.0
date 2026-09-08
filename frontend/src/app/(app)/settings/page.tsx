"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_PROFILE } from "./constants";
import { UserProfileSettings } from "./types";

// Services & Auth
import { SettingsService } from "@/lib/services/settings.service";
import { useAuth } from "@/lib/auth/hooks";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import { supabase } from "@/lib/auth/supabase";

// Single-page responsive views
import DesktopSettingsView from "./components/DesktopSettingsView";
import MobileSettingsView from "./components/MobileSettingsView";

// Modals
import TimezoneModal from "./components/modals/TimezoneModal";
import MobileProfileModal from "./components/modals/MobileProfileModal";
import MobilePasswordModal from "./components/modals/MobilePasswordModal";
import DataExportModal from "./components/modals/DataExportModal";
import DeleteAccountModal from "./components/modals/DeleteAccountModal";
import KeyboardShortcutsModal from "./components/modals/KeyboardShortcutsModal";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshProfile } = useUserProfile();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Profile data
  const [profile, setProfile] = useState<UserProfileSettings>(INITIAL_PROFILE);

  // Modal open states
  const [isTimezoneModalOpen, setIsTimezoneModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [deleteModalType, setDeleteModalType] = useState<"transactions" | "account" | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Initial Load: LocalStorage cached profile
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("finusa_settings_profile");
      if (savedProfile) setProfile(JSON.parse(savedProfile));
    } catch (e) {
      console.error("Error reading settings from localStorage", e);
    }
  }, []);

  // Fetch Live Supabase Profile
  useEffect(() => {
    async function loadCloudSettings() {
      try {
        const cloudProfile = await SettingsService.getProfile();
        if (cloudProfile) {
          setProfile(cloudProfile);
          try {
            localStorage.setItem("finusa_settings_profile", JSON.stringify(cloudProfile));
          } catch {}
        }
      } catch (err) {
        console.warn("Could not sync settings from cloud:", err);
      }
    }

    if (user) {
      loadCloudSettings();
    }
  }, [user]);

  // Profile Save
  const handleSaveProfile = async (updated: UserProfileSettings) => {
    setIsSavingProfile(true);
    setProfile(updated);
    try {
      localStorage.setItem("finusa_settings_profile", JSON.stringify(updated));
      await SettingsService.updateProfile(updated);
      await refreshProfile();
      showToast("Profil pengguna berhasil disimpan!");
    } catch (e: unknown) {
      console.error("Save profile error:", e);
      showToast("Profil tersimpan lokal. Gagal sinkron ke database.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Timezone Save
  const handleSelectTimezone = async (newTz: string) => {
    const updated = { ...profile, timezone: newTz };
    setProfile(updated);
    try {
      localStorage.setItem("finusa_settings_profile", JSON.stringify(updated));
      await SettingsService.updateProfile(updated);
      await refreshProfile();
      showToast(`Zona waktu aktif: ${newTz}`);
    } catch (e: unknown) {
      console.error("Save timezone error:", e);
      showToast("Zona waktu tersimpan lokal.");
    }
  };

  // Password Change Handler for Desktop
  const handleChangePassword = async (current: string, next: string) => {
    return await SettingsService.changePassword(current, next);
  };

  const handleChangePasswordSuccess = () => {
    showToast("Kata sandi akun berhasil diperbarui!");
  };

  // Danger Confirm (Reset Transactions / Delete Account)
  const handleConfirmDelete = async () => {
    if (deleteModalType === "transactions") {
      try {
        await SettingsService.clearUserTransactions();
        showToast("Seluruh riwayat transaksi berhasil dikosongkan.");
      } catch (err) {
        console.error("Clear transactions error:", err);
        showToast("Gagal mengosongkan transaksi.");
      }
    } else if (deleteModalType === "account") {
      try {
        await SettingsService.deleteUserAccount();
        showToast("Akun Anda telah dihapus. Mengalihkan...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } catch (err) {
        console.error("Delete account error:", err);
        showToast("Gagal memproses penghapusan akun.");
      }
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("finusa_settings_profile");
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/auth/login");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-28 lg:bottom-6 right-4 lg:right-6 z-50 px-4 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-2xl border border-blue-400/40 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* ── MOBILE VIEW (< lg) ── */}
      {/* Faithful replication of Android settings screenshot (media_1788699020399.png) */}
      <div className="block lg:hidden">
        <MobileSettingsView
          profile={profile}
          onOpenTimezoneModal={() => setIsTimezoneModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenDeleteTransactions={() => setDeleteModalType("transactions")}
          onOpenDeleteAccount={() => setDeleteModalType("account")}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      {/* ── DESKTOP VIEW (>= lg) ── */}
      {/* Unified 1-Page Layout with Timezone Hero at top */}
      <div className="hidden lg:block">
        <DesktopSettingsView
          profile={profile}
          onSaveProfile={handleSaveProfile}
          isSavingProfile={isSavingProfile}
          onSelectTimezone={handleSelectTimezone}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenDeleteTransactions={() => setDeleteModalType("transactions")}
          onOpenDeleteAccount={() => setDeleteModalType("account")}
          onChangePasswordSuccess={handleChangePasswordSuccess}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
        />
      </div>

      {/* ── SHARED MODALS ── */}
      {/* Timezone Modal (Mobile & Quick-picker) */}
      <TimezoneModal
        isOpen={isTimezoneModalOpen}
        onClose={() => setIsTimezoneModalOpen(false)}
        currentTimezone={profile.timezone}
        onSelectTimezone={handleSelectTimezone}
      />

      {/* Mobile Profile Editor Sheet */}
      <MobileProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Mobile Password Sheet */}
      <MobilePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handleChangePasswordSuccess}
      />

      {/* Data Export Modal */}
      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Danger Zone Confirm Modal */}
      <DeleteAccountModal
        isOpen={deleteModalType !== null}
        type={deleteModalType || "account"}
        onClose={() => setDeleteModalType(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}
