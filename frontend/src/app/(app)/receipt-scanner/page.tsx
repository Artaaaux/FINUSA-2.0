"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReceiptScanner } from "@/shared/hooks/useReceiptScanner";
import CameraView from "./components/CameraView";
import ImagePreview from "./components/ImagePreview";
import ProcessingScreen from "./components/ProcessingScreen";
import ConfirmScreen from "./components/ConfirmScreen";
import SuccessScreen from "./components/SuccessScreen";
import ErrorScreen from "./components/ErrorScreen";
import ReceiptGallery from "./components/ReceiptGallery";
import { generateSimulatedReceipt } from "@/shared/lib/receipt/sample";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: "easeOut" },
};

export default function ReceiptScannerPage() {
  const {
    step,
    setStep,
    capturedImage,
    extractedData,
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
    fetchPastReceipts,
  } = useReceiptScanner();

  // Load past receipts when gallery step is triggered
  const handleOpenGallery = () => {
    fetchPastReceipts();
    setStep("gallery");
  };

  const handleManualEntry = () => {
    const blankReceipt = generateSimulatedReceipt();
    blankReceipt.merchant = "Toko / Merchant Baru";
    blankReceipt.items = [
      { id: "item-1", name: "Pengeluaran", quantity: 1, price: 0, totalPrice: 0 },
    ];
    blankReceipt.total = 0;
    blankReceipt.subtotal = 0;
    blankReceipt.tax = 0;
    blankReceipt.discount = 0;
    blankReceipt.confidence = 100;
    blankReceipt.isSimulated = false;

    updateExtractedData(blankReceipt);
    setStep("confirm");
  };

  return (
    <div className="w-full py-2">
      <AnimatePresence mode="wait">
        {step === "camera" && (
          <motion.div key="camera" {...pageTransition}>
            <CameraView
              onCapture={handleCapture}
              onFileUpload={handleFileUpload}
              onOpenGallery={handleOpenGallery}
              quotaExceeded={quota.isQuotaExceeded}
            />
          </motion.div>
        )}

        {step === "preview" && capturedImage && (
          <motion.div key="preview" {...pageTransition}>
            <ImagePreview
              imageSrc={capturedImage}
              onRetake={resetScanner}
              onConfirm={processScan}
            />
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div key="processing" {...pageTransition}>
            <ProcessingScreen imageSrc={capturedImage} />
          </motion.div>
        )}

        {step === "confirm" && extractedData && (
          <motion.div key="confirm" {...pageTransition}>
            <ConfirmScreen
              imageSrc={capturedImage}
              data={extractedData}
              isSaving={isSaving}
              onUpdateData={updateExtractedData}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onUpdateItem={updateItem}
              onSave={saveExpense}
              onRetake={resetScanner}
            />
          </motion.div>
        )}

        {step === "success" && extractedData && (
          <motion.div key="success" {...pageTransition}>
            <SuccessScreen
              data={extractedData}
              expenseId={savedExpenseId}
              onScanAnother={resetScanner}
            />
          </motion.div>
        )}

        {step === "error" && (
          <motion.div key="error" {...pageTransition}>
            <ErrorScreen
              errorType={errorType}
              errorMessage={errorMessage}
              onRetry={resetScanner}
              onManualEntry={handleManualEntry}
              onOpenGallery={handleOpenGallery}
            />
          </motion.div>
        )}

        {step === "gallery" && (
          <motion.div key="gallery" {...pageTransition}>
            <ReceiptGallery
              quota={quota}
              receipts={pastReceipts}
              isLoading={isLoadingHistory}
              onBackToScanner={() => setStep("camera")}
              onDeleteReceipt={deleteReceipt}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
