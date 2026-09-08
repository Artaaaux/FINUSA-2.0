"use client";

import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Phone, 
  Building, 
  Upload, 
  Trash2, 
  Save, 
  Camera,
  Loader2 
} from "lucide-react";
import { UserProfileSettings } from "../../types";
import { SettingsService } from "@/lib/services/settings.service";

interface ProfileSectionProps {
  profile: UserProfileSettings;
  onSave: (updated: UserProfileSettings) => void;
  isSaving?: boolean;
}

export default function ProfileSection({
  profile,
  onSave,
  isSaving = false,
}: ProfileSectionProps) {
  const [formData, setFormData] = useState<UserProfileSettings>(profile);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatarUrl);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    setFormData(profile);
    setAvatarPreview(profile.avatarUrl);
  }, [profile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show temporary local preview immediately
    const tempUrl = URL.createObjectURL(file);
    setAvatarPreview(tempUrl);
    setIsUploadingAvatar(true);

    try {
      const uploadedUrl = await SettingsService.uploadAvatar(file);
      setAvatarPreview(uploadedUrl);
      setFormData((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
    } catch (err) {
      console.warn("Avatar upload error:", err);
      // Fallback: keep preview
      setFormData((prev) => ({ ...prev, avatarUrl: tempUrl }));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview("");
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Profil & Identitas Pengguna
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Kelola informasi personal, avatar tampilan, dan profil entitas usaha Anda di Finusa.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-md overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Foto Profil"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-xl font-bold text-blue-400">
                    {formData.firstName.charAt(0)}
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                title="Ganti Foto"
              >
                <Camera className="w-5 h-5" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Foto Profil</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                PNG, JPG atau WEBP hingga 5MB.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600/80 hover:bg-blue-600 cursor-pointer transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>Unggah Baru</span>
                </label>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400">
            <span className="font-semibold text-slate-200 block">ID Finusa: #FN-84920</span>
            <span className="text-[11px] text-slate-400">Member Sejak Jan 2024</span>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Nama Depan
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Nama Belakang
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Nomor Telepon / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Nama Usaha / Perusahaan
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.companyName || ""}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Contoh: CV Maju Lancar"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Peran / Jabatan
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Bio Ringkas
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Zona Waktu
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Asia/Jakarta (WIB)">Asia/Jakarta (WIB - UTC+7)</option>
              <option value="Asia/Makassar (WITA)">Asia/Makassar (WITA - UTC+8)</option>
              <option value="Asia/Jayapura (WIT)">Asia/Jayapura (WIT - UTC+9)</option>
              <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT - UTC+8)</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving || isUploadingAvatar}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer active:scale-95"
          >
            {isSaving || isUploadingAvatar ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isUploadingAvatar ? "Mengunggah Foto..." : "Menyimpan..."}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
