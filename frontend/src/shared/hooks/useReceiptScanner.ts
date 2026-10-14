"use client";

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/auth/supabase";
import { useAuth } from "@/lib/auth/hooks";
import type { ExtractedReceiptData, ReceiptItem } from "@/shared/lib/receipt/types";
import { getCurrentScanTime } from "@/shared/lib/receipt/utils";
import { useImageOptimizer } from "./useImageOptimizer";
import { PembukuanService } from "@/lib/services/pembukuan.service";

export type ScannerStep =
  | "camera"
  | "preview"
  | "processing"
  | "confirm"
  | "success"
  | "error"
  | "gallery";

export type ScannerErrorType =
  | "blurry"
  | "quota"
  | "ocr_failed"
  | "network"
  | "unauthorized"
  | "not_receipt"
  | "general";

export interface QuotaInfo {
  totalUsedBytes: number;
  maxQuotaBytes: number;
  usedPercentage: number;
  isQuotaExceeded: boolean;
  totalReceipts: number;
}

export interface PastReceipt {
  id: string;
  file_path: string;
  file_size: number;
  resolution?: string;
  uploaded_at: string;
  extracted_data?: ExtractedReceiptData | Record<string, unknown>;
  publicUrl?: string;
}

const DEFAULT_QUOTA: QuotaInfo = {
  totalUsedBytes: 0,
  maxQuotaBytes: 5 * 1024 * 1024, // 5MB
  usedPercentage: 0,
  isQuotaExceeded: false,
  totalReceipts: 0,
};

export function useReceiptScanner() {
  const { user } = useAuth();
  const { compressClientImage } = useImageOptimizer();

  const [step, setStep] = useState<ScannerStep>("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<{
    base64: string;
    sizeBytes: number;
    resolution?: string;
    mimeType?: string;
  } | null>(null);

  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedExpenseId, setSavedExpenseId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ScannerErrorType | null>(null);

  const [quota, setQuota] = useState<QuotaInfo>(DEFAULT_QUOTA);
  const [pastReceipts, setPastReceipts] = useState<PastReceipt[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Fetch Quota info
  const fetchQuota = useCallback(async () => {
    try {
      const res = await fetch("/api/receipt/quota");
      if (res.ok) {
        const data = await res.json();
        setQuota(data);
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch Past Receipts
  const fetchPastReceipts = useCallback(async () => {
    if (!user) return;
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("receipt_photos")
        .select("*")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false });

      if (!error && data) {
        // Map public URLs if available
        const receiptsWithUrls = data.map((r) => {
          let publicUrl = "";
          if (r.file_path) {
            const { data: urlData } = supabase.storage
              .from("receipts")
              .getPublicUrl(r.file_path);
            publicUrl = urlData?.publicUrl || "";
          }
          return {
            ...r,
            publicUrl,
          };
        });
        setPastReceipts(receiptsWithUrls);
      }
    } catch (err) {
      console.warn("Failed to fetch past receipts:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchQuota();
    }
  }, [user, fetchQuota]);

  // Handle Photo Capture from camera
  const handleCapture = useCallback((dataUrl: string) => {
    setCapturedImage(dataUrl);
    setStep("preview");
  }, []);

  // Handle File Upload from gallery
  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        const compressed = await compressClientImage(file, 1400, 1400, 0.85);
        setCapturedImage(compressed.dataUrl);
        setStep("preview");
      } catch (err: unknown) {
        const errorObj = err as Error;
        setErrorMessage(errorObj.message || "Gagal memuat file gambar.");
        setErrorType("general");
        setStep("error");
      }
    },
    [compressClientImage]
  );

  // Process OCR Scan
  const processScan = useCallback(async () => {
    if (!capturedImage) return;

    setIsScanning(true);
    setStep("processing");
    setErrorMessage(null);
    setErrorType(null);

    const clientTime = getCurrentScanTime();
    let clientTimezone = "Asia/Jakarta";
    try {
      clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta";
    } catch {
      // fallback
    }

    try {
      const res = await fetch("/api/receipt/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: capturedImage,
          clientTime,
          clientTimezone,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const error = new Error(json.error || "Gagal memproses struk belanja.");
        (error as Error & { code?: string }).code = json.code;
        throw error;
      }

      if (!json.extractedData || json.extractedData.isReceipt === false) {
        const reason = json.extractedData?.rejectionReason || "Foto yang diambil bukan struk belanja atau bukti transaksi keuangan.";
        setErrorMessage(reason);
        setErrorType(
          json.extractedData?.rejectionCode === "UNREADABLE" ||
            reason.toLowerCase().includes("buram") ||
            reason.toLowerCase().includes("terbaca")
            ? "blurry"
            : "not_receipt"
        );
        setStep("error");
        return;
      }

      const resultData: ExtractedReceiptData = json.extractedData;
      // Guarantee client local scan time if time is missing or blank
      if (!resultData.time || !resultData.time.trim()) {
        resultData.time = clientTime;
      }

      setExtractedData(resultData);
      setStep("confirm");
    } catch (err: unknown) {
      console.error("Scan processing error:", err);
      const errorObj = err as Error & { code?: string };
      setErrorMessage(
        errorObj.message ||
          "Gagal memproses struk belanja. Periksa konfigurasi NVIDIA_API_KEY atau koneksi internet Anda."
      );
      if (errorObj.code === "NOT_A_RECEIPT") {
        setErrorType("not_receipt");
      } else if (errorObj.code === "RECEIPT_ILLEGIBLE") {
        setErrorType("blurry");
      } else {
        setErrorType("ocr_failed");
      }
      setStep("error");
    } finally {
      setIsScanning(false);
    }
  }, [capturedImage]);

  // Update extracted fields
  const updateExtractedData = useCallback(
    (partial: Partial<ExtractedReceiptData>) => {
      setExtractedData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...partial,
        };
      });
    },
    []
  );

  // Items manipulation
  const addItem = useCallback(() => {
    setExtractedData((prev) => {
      if (!prev) return null;
      const newItem: ReceiptItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: "Item Baru",
        category: prev.category || "Makan",
        quantity: 1,
        price: 0,
        totalPrice: 0,
      };
      return {
        ...prev,
        items: [...prev.items, newItem],
      };
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setExtractedData((prev) => {
      if (!prev) return null;
      const filtered = prev.items.filter((item) => item.id !== id);
      const subtotal = filtered.reduce((sum, item) => sum + item.totalPrice, 0);
      const total = subtotal + prev.tax + prev.serviceCharge - prev.discount;
      return {
        ...prev,
        items: filtered,
        subtotal,
        total: Math.max(0, total),
      };
    });
  }, []);

  const updateItem = useCallback(
    (id: string, partial: Partial<ReceiptItem>) => {
      setExtractedData((prev) => {
        if (!prev) return null;
        const updated = prev.items.map((item) => {
          if (item.id !== id) return item;
          const updatedItem = { ...item, ...partial };
          if (partial.quantity !== undefined || partial.price !== undefined) {
            updatedItem.totalPrice = (updatedItem.quantity || 1) * (updatedItem.price || 0);
          }
          return updatedItem;
        });

        const subtotal = updated.reduce((sum, item) => sum + item.totalPrice, 0);
        const total = subtotal + prev.tax + prev.serviceCharge - prev.discount;

        return {
          ...prev,
          items: updated,
          subtotal,
          total: Math.max(0, total),
        };
      });
    },
    []
  );

  // Save to Supabase (Unified via PembukuanService to synchronize accounts balance and Monitor analytics)
  const saveExpense = useCallback(async () => {
    if (!extractedData) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const userId = user?.id;

      // Group items by category to split multi-category receipts (e.g. Makan vs Kebutuhan)
      const categoryGroups: Record<string, { total: number; items: ReceiptItem[] }> = {};

      if (extractedData.items && extractedData.items.length > 0) {
        for (const item of extractedData.items) {
          const cat = item.category || extractedData.category || "Makan";
          if (!categoryGroups[cat]) {
            categoryGroups[cat] = { total: 0, items: [] };
          }
          categoryGroups[cat].total += item.totalPrice || item.price || 0;
          categoryGroups[cat].items.push(item);
        }
      } else {
        const cat = extractedData.category || "Makan";
        categoryGroups[cat] = { total: extractedData.total, items: [] };
      }

      let primaryExpenseId: string | null = null;

      // Fetch user accounts & categories via PembukuanService to guarantee seeding & default values
      const [availableAccounts, availableCategories] = await Promise.all([
        PembukuanService.getAccounts(),
        PembukuanService.getCategories(),
      ]);

      // Match account based on selected paymentMethod
      let matchedAccount = availableAccounts.length > 0 ? availableAccounts[0] : null;
      if (extractedData.paymentMethod && availableAccounts.length > 0) {
        const pm = extractedData.paymentMethod.toLowerCase().trim();
        let targetKeywords: string[] = [pm];
        if (pm.includes("cash") || pm.includes("tunai")) targetKeywords = ["cash", "tunai", "kas"];
        else if (pm.includes("qris")) targetKeywords = ["qris"];
        else if (pm.includes("wallet") || pm.includes("gopay") || pm.includes("ovo") || pm.includes("dana") || pm.includes("shopee")) targetKeywords = ["wallet", "e-wallet", "qris"];
        else if (pm.includes("transfer") || pm.includes("bank") || pm.includes("debit") || pm.includes("non-tunai") || pm.includes("tf")) targetKeywords = ["transfer", "tf", "bank", "non-tunai", "bca", "mandiri", "bri"];

        const found = availableAccounts.find((a) => {
          const accName = a.name.toLowerCase();
          const accType = (a.type || "").toLowerCase();
          return targetKeywords.some((kw) => accName.includes(kw) || accType.includes(kw));
        });
        matchedAccount = found || availableAccounts.find((a) => a.is_default) || availableAccounts[0];
      }

      const scanTime = extractedData.time || getCurrentScanTime();
      const createdTxs: unknown[] = [];

      for (const [categoryName, group] of Object.entries(categoryGroups)) {
        const groupAmount = group.total > 0 ? group.total : extractedData.total;
        const itemNames =
          group.items.length > 0
            ? group.items.map((i) => i.name).join(", ")
            : `Belanja di ${extractedData.merchant}`;
        const description = `${itemNames} (${extractedData.merchant})`;

        // Find or match category
        const catLower = categoryName.toLowerCase().trim();
        let matchedCategory = availableCategories.find(
          (c) => c.name.toLowerCase().trim() === catLower
        );
        if (!matchedCategory) {
          matchedCategory = availableCategories.find(
            (c) => c.name.toLowerCase().includes(catLower) || catLower.includes(c.name.toLowerCase())
          );
        }
        if (!matchedCategory) {
          matchedCategory = availableCategories.find((c) => c.type === "expense") || availableCategories[0];
        }

        // UNIFIED EXPENSE RECORDER:
        // Titik masuk tunggal pengeluaran yang secara otomatis memvalidasi tanggal aktif,
        // memperbarui saldo rekening kas, dan menyinkronkan data dengan Monitor Keuangan
        const createdTx = await PembukuanService.recordExpense({
          amount: groupAmount,
          categoryId: matchedCategory?.id || "",
          categoryName: matchedCategory?.name || categoryName,
          categoryIcon: matchedCategory?.iconName || "Layers",
          categoryColor: matchedCategory?.colorClass || "#4B7BFF",
          accountId: matchedAccount?.id || "",
          accountName: matchedAccount?.name || extractedData.paymentMethod || "Rekening Kas",
          description,
          merchant: extractedData.merchant,
          date: extractedData.date,
          time: scanTime,
          source: "receipt_scan",
          tags: ["ocr-receipt", categoryName.toLowerCase().replace(/\s+/g, "-")],
          metadata: {
            items: group.items,
            merchant: extractedData.merchant,
            paymentMethod: extractedData.paymentMethod,
            categoryName,
          },
        });

        if (createdTx) {
          createdTxs.push(createdTx);
          if (!primaryExpenseId) {
            primaryExpenseId = createdTx.id;
          }
        }

        // SECONDARY (non-critical backup): Also insert into legacy expenses table if userId present
        if (userId) {
          try {
            await supabase.from("expenses").insert({
              user_id: userId,
              amount: groupAmount,
              category: categoryName,
              description,
              merchant: extractedData.merchant,
              date: extractedData.date,
              time: scanTime,
              items: group.items,
              source: "receipt_scan",
            });
          } catch (expErr) {
            console.warn("Could not insert into expenses backup table (non-critical):", expErr);
          }
        }
      }

      // Recalibrate accounts balances so Monitor and Home balances are 100% synchronized
      await PembukuanService.recalibrateAccountBalances();

      // Update localStorage cache for instant display in Catat
      if (typeof window !== "undefined" && createdTxs.length > 0) {
        try {
          const raw = localStorage.getItem("finusa_pembukuan_transactions");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              localStorage.setItem(
                "finusa_pembukuan_transactions",
                JSON.stringify([...createdTxs, ...parsed])
              );
            }
          }
        } catch {
          // ignore localStorage error
        }
      }

      setSavedExpenseId(primaryExpenseId || `exp-${Date.now()}`);
      setStep("success");
    } catch (err: unknown) {
      const errorObj = err as Error;
      console.error("Save expense failed:", errorObj);
      setErrorMessage(errorObj.message || "Gagal menyimpan transaksi. Silakan coba lagi.");
      setErrorType("general");
      setStep("error");
    } finally {
      setIsSaving(false);
    }
  }, [extractedData, user]);

  // Delete a receipt from storage & table
  const deleteReceipt = useCallback(
    async (photoId: string, filePath?: string) => {
      try {
        if (filePath) {
          await supabase.storage.from("receipts").remove([filePath]);
        }
        await supabase.from("receipt_photos").delete().eq("id", photoId);

        setPastReceipts((prev) => prev.filter((r) => r.id !== photoId));
        fetchQuota();
      } catch (err) {
        console.warn("Failed to delete receipt:", err);
      }
    },
    [fetchQuota]
  );

  const resetScanner = useCallback(() => {
    setCapturedImage(null);
    setOptimizedImage(null);
    setExtractedData(null);
    setErrorMessage(null);
    setErrorType(null);
    setSavedExpenseId(null);
    setStep("camera");
  }, []);

  return {
    step,
    setStep,
    capturedImage,
    optimizedImage,
    extractedData,
    isScanning,
    isSaving,
    savedExpenseId,
    errorMessage,
    errorType,
    quota,
    pastReceipts,
    isLoadingHistory,
    handleCapture,
    handleFileUpload,
    processScan,
    updateExtractedData,
    addItem,
    removeItem,
    updateItem,
    saveExpense,
    deleteReceipt,
    resetScanner,
    fetchQuota,
    fetchPastReceipts,
  };
}
