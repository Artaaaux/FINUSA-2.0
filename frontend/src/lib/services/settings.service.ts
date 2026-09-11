import { supabase } from "../auth/supabase";
import { UserProfileSettings } from "@/app/(app)/settings/types";

export const SettingsService = {
  async getProfile(): Promise<UserProfileSettings | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    
    // Default fallback from user metadata if profile row has blank fields
    const meta = user.user_metadata || {};
    const firstName = data?.first_name || meta.first_name || meta.name || "";
    const lastName = data?.last_name || meta.last_name || "";

    // If profile row doesn't exist yet in Supabase, auto-create it gracefully
    if (!data && user) {
      try {
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email || "",
          first_name: firstName || user.email?.split("@")[0] || "Pengguna FINUSA",
          role: "Pemilik Akun",
        });
      } catch (err) {
        console.warn("Auto-create profile fallback notice:", err);
      }
    }

    return {
      firstName,
      lastName,
      email: data?.email || user.email || "",
      phoneNumber: data?.phone_number || "",
      companyName: data?.company_name || meta.company_name || "",
      role: data?.role || "Pemilik Akun",
      bio: data?.bio || "",
      avatarUrl: data?.avatar_url || meta.avatar_url || "",
      timezone: data?.timezone || "Asia/Jakarta (WIB)",
    };
  },

  async updateProfile(profile: UserProfileSettings): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: profile.email,
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone_number: profile.phoneNumber,
        company_name: profile.companyName,
        role: profile.role,
        bio: profile.bio,
        avatar_url: profile.avatarUrl,
        timezone: profile.timezone,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    // Also update auth user metadata so greeting/header updates immediately
    try {
      await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          avatar_url: profile.avatarUrl,
          company_name: profile.companyName,
        }
      });
    } catch {
      // ignore metadata update errors if any
    }

    return true;
  },

  async uploadAvatar(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Pengguna belum login.");

    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `${user.id}/avatar-${Date.now()}.${ext}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type || "image/jpeg",
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("receipts")
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          return urlData.publicUrl;
        }
      }
    } catch (e) {
      console.warn("Direct storage upload failed, converting to data URL fallback", e);
    }

    // Fallback: convert file to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
      return { success: false, error: "Sesi telah berakhir. Silakan login kembali." };
    }

    // Verify current password by signing in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { success: false, error: "Kata sandi saat ini yang Anda masukkan salah." };
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { success: false, error: updateError.message || "Gagal memperbarui kata sandi." };
    }

    return { success: true };
  },

  async clearUserTransactions(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;
    return true;
  },

  async deleteUserAccount(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Remove user transaction and preference records
    try {
      await supabase.from("transactions").delete().eq("user_id", user.id);
      await supabase.from("user_preferences").delete().eq("user_id", user.id);
      await supabase.from("profiles").delete().eq("id", user.id);
    } catch (e) {
      console.warn("Cleanup before signout warning:", e);
    }

    await supabase.auth.signOut();
    return true;
  },

  async getUserExportData(): Promise<{
    transactions: Record<string, unknown>[];
    savingsGoals: Record<string, unknown>[];
    preferences: Record<string, unknown> | null;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { transactions: [], savingsGoals: [], preferences: null };

    const [txRes, goalsRes, prefRes] = await Promise.all([
      supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false }),
      supabase.from("savings_goals").select("*").eq("user_id", user.id),
      supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    return {
      transactions: (txRes.data as Record<string, unknown>[]) || [],
      savingsGoals: (goalsRes.data as Record<string, unknown>[]) || [],
      preferences: (prefRes.data as Record<string, unknown>) || null,
    };
  },
};
