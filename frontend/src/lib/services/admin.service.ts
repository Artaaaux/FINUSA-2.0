import { supabase } from "@/lib/auth/supabase";
import { isUserAdmin } from "@/lib/auth/admin";

export interface AdminUserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  systemRole: "user" | "admin" | "super_admin";
  avatarUrl: string;
  timezone: string;
  createdAt: string;
}

export interface ProfileRecord {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: string | null;
  system_role?: string | null;
  avatar_url?: string | null;
  timezone?: string | null;
  created_at?: string | null;
}

export interface AdminStatsSummary {
  totalUsers: number;
  totalTransactions: number;
  totalReceiptPhotos: number;
  totalSavingsGoals: number;
}

export const AdminService = {
  /**
   * Cek apakah user yang sedang login memiliki hak akses admin
   */
  async checkAdminAccess(): Promise<{
    isAdmin: boolean;
    user: { id: string; email: string } | null;
    profile: ProfileRecord | null;
  }> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { isAdmin: false, user: null, profile: null };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = isUserAdmin(
      user.email,
      profile?.system_role,
      profile?.role
    );

    return {
      isAdmin,
      user: { id: user.id, email: user.email },
      profile,
    };
  },

  /**
   * Ambil ringkasan statistik platform sederhana
   */
  async getStats(): Promise<AdminStatsSummary> {
    try {
      const [
        { count: userCount },
        { count: txCount },
        { count: receiptCount },
        { count: goalCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("transactions").select("*", { count: "exact", head: true }),
        supabase.from("receipt_photos").select("*", { count: "exact", head: true }),
        supabase.from("savings_goals").select("*", { count: "exact", head: true }),
      ]);

      return {
        totalUsers: userCount || 0,
        totalTransactions: txCount || 0,
        totalReceiptPhotos: receiptCount || 0,
        totalSavingsGoals: goalCount || 0,
      };
    } catch (err) {
      console.error("AdminService.getStats error:", err);
      return {
        totalUsers: 0,
        totalTransactions: 0,
        totalReceiptPhotos: 0,
        totalSavingsGoals: 0,
      };
    }
  },

  /**
   * Ambil daftar pengguna untuk tabel admin sederhana
   */
  async getUsers(search = ""): Promise<AdminUserItem[]> {
    try {
      let query = supabase
        .from("profiles")
        .select("id, email, first_name, last_name, role, system_role, avatar_url, timezone, created_at")
        .order("created_at", { ascending: false });

      if (search.trim()) {
        const s = search.trim();
        query = query.or(`email.ilike.%${s}%,first_name.ilike.%${s}%,last_name.ilike.%${s}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((row: ProfileRecord) => ({
        id: row.id,
        email: row.email,
        firstName: row.first_name || "",
        lastName: row.last_name || "",
        role: row.role || "Pemilik Akun",
        systemRole: (row.system_role as "user" | "admin" | "super_admin") || "user",
        avatarUrl: row.avatar_url || "",
        timezone: row.timezone || "Asia/Jakarta (WIB)",
        createdAt: row.created_at || "",
      }));
    } catch (err) {
      console.error("AdminService.getUsers error:", err);
      return [];
    }
  },

  /**
   * Ubah role sistem pengguna (user <-> admin)
   */
  async updateUserSystemRole(
    userId: string,
    newSystemRole: "user" | "admin" | "super_admin"
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ system_role: newSystemRole })
        .eq("id", userId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("AdminService.updateUserSystemRole error:", err);
      return false;
    }
  },
};
