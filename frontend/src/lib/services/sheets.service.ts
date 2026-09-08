import { GoogleAccountInfo, SyncedSheetItem, SyncHistoryEntry } from "@/app/(app)/sheets/types";

// In-Memory Cache Store with TTL (3 minutes)
let cachedAccount: { data: GoogleAccountInfo; timestamp: number } | null = null;
let cachedSheets: { data: SyncedSheetItem[]; timestamp: number } | null = null;
let cachedHistory: { data: SyncHistoryEntry[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 3 * 60 * 1000;

export const SheetsService = {
  invalidateCache() {
    cachedAccount = null;
    cachedSheets = null;
    cachedHistory = null;
  },

  async getAuthUrl(): Promise<string> {
    const res = await fetch("/api/auth/google/url");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal mendapatkan URL login Google.");
    return data.url;
  },

  async getAccountInfo(forceRefresh = false): Promise<GoogleAccountInfo> {
    if (!forceRefresh && cachedAccount && Date.now() - cachedAccount.timestamp < CACHE_TTL_MS) {
      return cachedAccount.data;
    }

    const res = await fetch("/api/sheets/account");
    if (!res.ok) {
      const fallback: GoogleAccountInfo = {
        isConnected: false,
        email: "",
        name: "",
        avatarUrl: "",
        connectedAt: "",
        lastUsedAt: "",
        autoSyncEnabled: false,
        quotaUsedPercent: 0,
        grantedScopes: [],
      };
      cachedAccount = { data: fallback, timestamp: Date.now() };
      return fallback;
    }
    const data: GoogleAccountInfo = await res.json();
    cachedAccount = { data, timestamp: Date.now() };
    return data;
  },

  async disconnectAccount(): Promise<void> {
    SheetsService.invalidateCache();
    const res = await fetch("/api/auth/google/disconnect", { method: "POST" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Gagal memutuskan akun Google.");
    }
  },

  async getSyncedSheets(forceRefresh = false): Promise<SyncedSheetItem[]> {
    if (!forceRefresh && cachedSheets && Date.now() - cachedSheets.timestamp < CACHE_TTL_MS) {
      return cachedSheets.data;
    }

    const res = await fetch("/api/sheets/list");
    if (!res.ok) return [];
    const data = await res.json();
    const sheets: SyncedSheetItem[] = data.sheets || [];
    cachedSheets = { data: sheets, timestamp: Date.now() };
    return sheets;
  },

  async createSpreadsheet(params: { title: string; templateCategory?: string }): Promise<SyncedSheetItem> {
    SheetsService.invalidateCache();
    const res = await fetch("/api/sheets/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal membuat spreadsheet.");
    return data.sheet;
  },

  async syncSheets(sheetId?: string): Promise<void> {
    SheetsService.invalidateCache();
    const res = await fetch("/api/sheets/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sheetId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal menyinkronkan spreadsheet.");
  },

  async getSyncHistory(forceRefresh = false): Promise<SyncHistoryEntry[]> {
    if (!forceRefresh && cachedHistory && Date.now() - cachedHistory.timestamp < CACHE_TTL_MS) {
      return cachedHistory.data;
    }

    const res = await fetch("/api/sheets/history");
    if (!res.ok) return [];
    const data = await res.json();
    const history: SyncHistoryEntry[] = data.history || [];
    cachedHistory = { data: history, timestamp: Date.now() };
    return history;
  },

  async deleteSyncedSheet(id: string): Promise<void> {
    SheetsService.invalidateCache();
    const res = await fetch(`/api/sheets/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Gagal menghapus tautan spreadsheet.");
    }
  },
};
