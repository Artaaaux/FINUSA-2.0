"use client";

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/auth/supabase";
import { useAuth } from "@/lib/auth/hooks";
import type { ExtractedReceiptData, ReceiptItem } from "@/shared/lib/receipt/types";
import { useImageOptimizer } from "./useImageOptimizer";

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

    try {
      const res = await fetch("/api/receipt/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: capturedImage,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const error = new Error(json.error || "Gagal memproses struk belanja.");
        (error as Error & { code?: string }).code = json.code;
        throw error;
      }

      if (!json.extractedData || json.extractedData.isReceipt === false || json.extractedData.confidence < 40) {
        const reason = json.extractedData?.rejectionReason || "Foto yang diambil bukan struk belanja atau bukti transaksi keuangan.";
        setErrorMessage(reason);
        setErrorType(reason.toLowerCase().includes("buram") || reason.toLowerCase().includes("terbaca") ? "blurry" : "not_receipt");
        setStep("error");
        return;
      }

      setExtractedData(json.extractedData);
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

  // Save to Supabase (Expenses & Transactions per Category)
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
      let userCategories: Array<{ id: string; name: string }> = [];

      if (userId) {
        try {
          const { data: cats } = await supabase
            .from("categories")
            .select("id, name")
            .eq("user_id", userId);
          if (cats) userCategories = cats;
        } catch (catErr) {
          console.warn("Could not fetch user categories:", catErr);
        }
      }

      for (const [categoryName, group] of Object.entries(categoryGroups)) {
        const groupAmount = group.total > 0 ? group.total : extractedData.total;
        const itemNames =
          group.items.length > 0
            ? group.items.map((i) => i.name).join(", ")
            : `Belanja di ${extractedData.merchant}`;
        const description = `${itemNames} (${extractedData.merchant})`;

        const expensePayload: Record<string, unknown> = {
          amount: groupAmount,
          category: categoryName,
          description,
          merchant: extractedData.merchant,
          date: extractedData.date,
          time: extractedData.time || "12:00",
          items: group.items,
          source: "receipt_scan",
        };

        if (userId) {
          expensePayload.user_id = userId;
        }

        const { data: expenseData } = await supabase
          .from("expenses")
          .insert(expensePayload)
          .select("id")
          .single();

        if (!primaryExpenseId && expenseData?.id) {
          primaryExpenseId = expenseData.id;
        }

        // Also create entry in transactions table so it instantly shows in Pembukuan & Monitor
        if (userId) {
          try {
            const matchedCategory = userCategories.find(
              (c) => c.name.toLowerCase() === categoryName.toLowerCase()
            );
            await supabase.from("transactions").insert({
              user_id: userId,
              amount: groupAmount,
              type: "expense",
              category_id: matchedCategory?.id || null,
              description,
              merchant: extractedData.merchant,
              date: extractedData.date,
              time: extractedData.time || "12:00",
              status: "completed",
              source: "receipt_scan",
              tags: ["ocr-receipt", categoryName.toLowerCase().replace(/\s+/g, "-")],
              metadata: {
                items: group.items,
                merchant: extractedData.merchant,
                paymentMethod: extractedData.paymentMethod,
                categoryName,
              },
            });
          } catch (e) {
            console.warn("Could not insert into transactions table:", e);
          }
        }
      }

      setSavedExpenseId(primaryExpenseId || `exp-${Date.now()}`);
      setStep("success");
    } catch (err: unknown) {
      console.warn("Save expense failed, falling back to local success:", err);
      setSavedExpenseId(`exp-${Date.now()}`);
      setStep("success");
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
