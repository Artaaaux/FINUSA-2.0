import React from "react";

export const metadata = {
  title: "Receipt Scanner OCR AI - FINUSA",
  description:
    "Pindai struk belanja otomatis dengan AI Vision dan catat pengeluaran finansial secara instan.",
};

export default function ReceiptScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full min-h-[calc(100vh-120px)]">{children}</div>;
}
