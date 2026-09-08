"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  User, 
  Upload, 
  Trash2, 
  Camera, 
  Loader2, 
  Save 
} from "lucide-react";
import { UserProfileSettings } from "../../types";
import { SettingsService } from "@/lib/services/settings.service";

interface MobileProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileSettings;
  onSave: (updated: UserProfileSettings) => Promise<void>;
}

export default function MobileProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: MobileProfileModalProps) {
  const [formData, setFormData] = useState<UserProfileSettings>(profile);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(profile);
    setAvatarPreview(profile.avatarUrl);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setAvatarPreview(tempUrl);
    setIsUploading(true);

    try {
      const uploadedUrl = await SettingsService.uploadAvatar(file);
      setAvatarPreview(uploadedUrl);
      setFormData((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
    } catch (err) {
      console.warn("Avatar upload error:", err);
      setFormData((prev) => ({ ...prev, avatarUrl: tempUrl }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview("");
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full sm:max-w-md bg-[#161c28] border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit Profil Saya</h3>
              <p className="text-xs text-slate-400">Kelola identitas dan usaha Anda</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#121722] border border-slate-800">
            <div className="relative group shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-md overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Foto Profil"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-lg font-bold text-blue-400">
                    {formData.firstName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <label
                htmlFor="mobile-avatar-upload"
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                title="Ganti Foto"
              >
                <Camera className="w-4 h-4" />
              </label>
              <input
                id="mobile-avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white">Foto Profil</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <label
                  htmlFor="mobile-avatar-upload"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>{isUploading ? "Mengunggah..." : "Ganti"}</span>
                </label>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Nama Depan
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#121722] border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Nama Belakang
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#121722] border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>


          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
