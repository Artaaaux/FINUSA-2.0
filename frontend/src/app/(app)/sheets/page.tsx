"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  INITIAL_GOOGLE_ACCOUNT, 
  INITIAL_SYNCED_SHEETS, 
  INITIAL_SYNC_HISTORY 
} from "./constants";
import { 
  GoogleAccountInfo, 
  SyncedSheetItem, 
  SyncHistoryEntry, 
  SheetTemplate, 
  ColumnMappingItem,
  SharedUser 
} from "./types";
import SheetsHeader from "./components/SheetsHeader";
import GoogleAccountBanner from "./components/GoogleAccountBanner";
import QuickSyncStats from "./components/QuickSyncStats";
import SyncedSheetsGrid from "./components/SyncedSheetsGrid";
import TemplateShowcase from "./components/TemplateShowcase";
import SyncHistoryTable from "./components/SyncHistoryTable";

// Modals
import CreateSheetWizardModal from "./components/modals/CreateSheetWizardModal";
import ColumnMapperModal from "./components/modals/ColumnMapperModal";
import SheetSettingsModal from "./components/modals/SheetSettingsModal";
import SheetShareModal from "./components/modals/SheetShareModal";
import TemplatePreviewModal from "./components/modals/TemplatePreviewModal";
import SyncLogDetailModal from "./components/modals/SyncLogDetailModal";

import { SheetsService } from "@/lib/services/sheets.service";

export default function SheetsPage() {
  const [accountInfo, setAccountInfo] = useState<GoogleAccountInfo>(INITIAL_GOOGLE_ACCOUNT);
  const [sheets, setSheets] = useState<SyncedSheetItem[]>(INITIAL_SYNCED_SHEETS);
  const [history, setHistory] = useState<SyncHistoryEntry[]>(INITIAL_SYNC_HISTORY);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Modals State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardInitialTemplate, setWizardInitialTemplate] = useState<SheetTemplate | null>(null);

  const [selectedSheetForSettings, setSelectedSheetForSettings] = useState<SyncedSheetItem | null>(null);
  const [selectedSheetForMapper, setSelectedSheetForMapper] = useState<SyncedSheetItem | null>(null);
  const [selectedSheetForShare, setSelectedSheetForShare] = useState<SyncedSheetItem | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<SheetTemplate | null>(null);
  const [selectedLogDetail, setSelectedLogDetail] = useState<SyncHistoryEntry | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      const [acc, sheetList, histList] = await Promise.all([
        SheetsService.getAccountInfo(forceRefresh),
        SheetsService.getSyncedSheets(forceRefresh),
        SheetsService.getSyncHistory(forceRefresh),
      ]);

      if (acc) setAccountInfo(acc);
      if (sheetList) setSheets(sheetList);
      if (histList) setHistory(histList);
    } catch (e) {
      console.warn("Failed to load Google Sheets backend data:", e);
    }
  }, []);

  // Load from Backend on mount & check query params
  useEffect(() => {
    loadData();

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("connected") === "true") {
        showToast("Akun Google berhasil terhubung & siap digunakan!");
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (urlParams.get("error")) {
        showToast(`Gagal menghubungkan akun Google (${urlParams.get("error")}).`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [loadData]);

  // Toggle Auto-Sync
  const handleToggleAutoSync = (enabled: boolean) => {
    setAccountInfo((prev) => ({ ...prev, autoSyncEnabled: enabled }));
    showToast(enabled ? "Sinkronisasi otomatis diaktifkan." : "Sinkronisasi otomatis dimatikan.");
  };

  // Connect or Disconnect Google
  const handleToggleConnection = async () => {
    if (!accountInfo.isConnected) {
      try {
        const url = await SheetsService.getAuthUrl();
        window.location.href = url;
      } catch (err: unknown) {
        const e = err as Error;
        showToast(e.message || "Gagal memulai otorisasi Google. Periksa GOOGLE_CLIENT_ID di konfigurasi.");
      }
    } else {
      if (confirm("Apakah Anda yakin ingin memutuskan integrasi akun Google ini?")) {
        try {
          await SheetsService.disconnectAccount();
          setAccountInfo(INITIAL_GOOGLE_ACCOUNT);
          showToast("Koneksi Akun Google berhasil diputuskan.");
          loadData();
        } catch (err: unknown) {
          const e = err as Error;
          showToast(e.message || "Gagal memutuskan koneksi Google.");
        }
      }
    }
  };

  const handleReconnect = async () => {
    try {
      const url = await SheetsService.getAuthUrl();
      window.location.href = url;
    } catch (err: unknown) {
      const e = err as Error;
      showToast(e.message || "Gagal memperbarui token otorisasi.");
    }
  };

  // Trigger Sync Single Sheet
  const handleSyncNow = async (sheetId: string) => {
    const target = sheets.find((s) => s.id === sheetId);
    if (!target) return;

    setSheets((prev) => prev.map((s) => (s.id === sheetId ? { ...s, syncStatus: "syncing" as const } : s)));

    try {
      await SheetsService.syncSheets(sheetId);
      await loadData();
      showToast(`Spreadsheet "${target.sheetTitle}" berhasil disinkronkan ke Google Drive.`);
    } catch (err: unknown) {
      const e = err as Error;
      setSheets((prev) => prev.map((s) => (s.id === sheetId ? { ...s, syncStatus: "error" as const, lastError: e.message } : s)));
      showToast(e.message || "Gagal menyinkronkan spreadsheet.");
    }
  };

  // Sync All
  const handleSyncAll = async () => {
    if (!accountInfo.isConnected) {
      showToast("Hubungkan akun Google terlebih dahulu sebelum sinkronisasi.");
      return;
    }

    setIsSyncingAll(true);
    setSheets((prev) => prev.map((s) => ({ ...s, syncStatus: "syncing" as const })));

    try {
      await SheetsService.syncSheets();
      await loadData();
      showToast("Seluruh spreadsheet berhasil disinkronkan!");
    } catch (err: unknown) {
      const e = err as Error;
      showToast(e.message || "Gagal menyinkronkan seluruh spreadsheet.");
    } finally {
      setIsSyncingAll(false);
    }
  };

  // Create new sheet
  const handleCreateSheet = async (newSheetPayload: SyncedSheetItem) => {
    if (!accountInfo.isConnected) {
      showToast("Hubungkan akun Google terlebih dahulu untuk membuat Spreadsheet di Google Drive Anda.");
      // Add local preview
      setSheets((prev) => [newSheetPayload, ...prev]);
      return;
    }

    try {
      showToast("Sedang membuat Spreadsheet di Google Drive Anda...");
      await SheetsService.createSpreadsheet({
        title: newSheetPayload.sheetTitle,
        templateCategory: newSheetPayload.templateCategory,
      });
      await loadData();
      showToast(`Spreadsheet "${newSheetPayload.sheetTitle}" berhasil dibuat dan ditautkan.`);
    } catch (err: unknown) {
      const e = err as Error;
      showToast(e.message || "Gagal membuat spreadsheet di Google Drive.");
    }
  };

  // Delete sheet
  const handleDeleteSheet = async (sheetId: string) => {
    const target = sheets.find((s) => s.id === sheetId);
    if (!target) return;
    if (confirm(`Apakah Anda yakin ingin memutuskan integrasi spreadsheet "${target.sheetTitle}"? File di Google Drive Anda tidak akan terhapus.`)) {
      try {
        await SheetsService.deleteSyncedSheet(sheetId);
        await loadData();
        showToast("Integrasi spreadsheet berhasil dihapus.");
      } catch (err: unknown) {
        const e = err as Error;
        showToast(e.message || "Gagal menghapus tautan spreadsheet.");
      }
    }
  };

  // Update sheet settings
  const handleSaveSettings = (sheetId: string, updates: Partial<SyncedSheetItem>) => {
    setSheets((prev) => prev.map((s) => (s.id === sheetId ? { ...s, ...updates } : s)));
    showToast("Pengaturan spreadsheet berhasil diperbarui.");
  };

  // Update Column Mapping
  const handleSaveColumnMapping = (sheetId: string, updatedMappings: ColumnMappingItem[]) => {
    setSheets((prev) => prev.map((s) => (s.id === sheetId ? { ...s, columnMappings: updatedMappings } : s)));
    showToast("Pemetaan kolom berhasil disimpan.");
  };

  // Update Collaborators
  const handleUpdateSharedUsers = (sheetId: string, users: SharedUser[]) => {
    setSheets((prev) => prev.map((s) => (s.id === sheetId ? { ...s, sharedUsers: users } : s)));
    showToast("Daftar akses kolaborator diperbarui.");
  };

  // Use Template Trigger
  const handleSelectTemplate = (template: SheetTemplate) => {
    setWizardInitialTemplate(template);
    setIsWizardOpen(true);
  };

  const scrollToTemplates = () => {
    const el = document.getElementById("templates-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHistory = () => {
    const el = document.getElementById("history-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-28 lg:bottom-6 right-4 lg:right-6 z-50 px-4 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-2xl border border-blue-400/40 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <SheetsHeader
        accountInfo={accountInfo}
        isSyncingAll={isSyncingAll}
        onSyncAll={handleSyncAll}
        onOpenCreateWizard={() => {
          setWizardInitialTemplate(null);
          setIsWizardOpen(true);
        }}
        onScrollToTemplates={scrollToTemplates}
        onOpenHistory={scrollToHistory}
      />

      {/* Google Account OAuth Status Banner */}
      <GoogleAccountBanner
        accountInfo={accountInfo}
        onToggleAutoSync={handleToggleAutoSync}
        onToggleConnection={handleToggleConnection}
        onReconnect={handleReconnect}
      />

      {/* Quick Summary KPIs */}
      <QuickSyncStats sheets={sheets} autoSyncEnabled={accountInfo.autoSyncEnabled} />

      {/* Main Connected Sheets Grid & List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Spreadsheet Terhubung ({sheets.length})
          </h2>
        </div>
        <SyncedSheetsGrid
          sheets={sheets}
          onSyncNow={handleSyncNow}
          onOpenSettings={(sheet) => setSelectedSheetForSettings(sheet)}
          onOpenColumnMapper={(sheet) => setSelectedSheetForMapper(sheet)}
          onOpenShare={(sheet) => setSelectedSheetForShare(sheet)}
          onDelete={handleDeleteSheet}
          onOpenCreate={() => {
            setWizardInitialTemplate(null);
            setIsWizardOpen(true);
          }}
        />
      </div>

      {/* Pre-built Templates Showcase */}
      <TemplateShowcase
        onSelectTemplate={handleSelectTemplate}
        onPreviewTemplate={(tpl) => setPreviewTemplate(tpl)}
      />

      {/* Sync History & Audit Log */}
      <SyncHistoryTable
        history={history}
        onOpenLogDetail={(log) => setSelectedLogDetail(log)}
      />

      {/* Modals */}
      <CreateSheetWizardModal
        isOpen={isWizardOpen}
        initialTemplate={wizardInitialTemplate}
        onClose={() => {
          setIsWizardOpen(false);
          setWizardInitialTemplate(null);
        }}
        onCreated={handleCreateSheet}
      />

      <ColumnMapperModal
        isOpen={!!selectedSheetForMapper}
        sheet={selectedSheetForMapper}
        onClose={() => setSelectedSheetForMapper(null)}
        onSaveMapping={handleSaveColumnMapping}
      />

      <SheetSettingsModal
        isOpen={!!selectedSheetForSettings}
        sheet={selectedSheetForSettings}
        onClose={() => setSelectedSheetForSettings(null)}
        onSaveSettings={handleSaveSettings}
      />

      <SheetShareModal
        isOpen={!!selectedSheetForShare}
        sheet={selectedSheetForShare}
        onClose={() => setSelectedSheetForShare(null)}
        onUpdateSharedUsers={handleUpdateSharedUsers}
      />

      <TemplatePreviewModal
        isOpen={!!previewTemplate}
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleSelectTemplate}
      />

      <SyncLogDetailModal
        isOpen={!!selectedLogDetail}
        entry={selectedLogDetail}
        onClose={() => setSelectedLogDetail(null)}
      />
    </div>
  );
}
