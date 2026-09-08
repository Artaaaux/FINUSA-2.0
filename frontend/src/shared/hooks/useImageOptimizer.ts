"use client";

import { useState, useCallback } from "react";

export interface ClientOptimizedImage {
  dataUrl: string;
  sizeBytes: number;
  width: number;
  height: number;
  formattedSize: string;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function useImageOptimizer() {
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Resizes an image via HTML Canvas on the client side
   */
  const compressClientImage = useCallback(
    async (
      source: File | Blob | string,
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.82
    ): Promise<ClientOptimizedImage> => {
      setIsCompressing(true);
      setError(null);

      return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          try {
            let width = img.width;
            let height = img.height;

            // Maintain aspect ratio
            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              throw new Error("Gagal menginisialisasi canvas untuk kompresi gambar.");
            }

            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

            // Calculate approximate size in bytes
            const base64Str = compressedDataUrl.split(",")[1] || "";
            const sizeBytes = Math.round((base64Str.length * 3) / 4);

            setIsCompressing(false);
            resolve({
              dataUrl: compressedDataUrl,
              sizeBytes,
              width,
              height,
              formattedSize: formatBytes(sizeBytes),
            });
          } catch (err: unknown) {
            setIsCompressing(false);
            const errObj = err as Error;
            setError(errObj.message || "Gagal mengompres gambar.");
            reject(errObj);
          }
        };

        img.onerror = () => {
          setIsCompressing(false);
          setError("Gagal membaca file gambar.");
          reject(new Error("File gambar rusak atau format tidak didukung."));
        };

        if (typeof source === "string") {
          img.src = source;
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target?.result as string;
          };
          reader.onerror = () => {
            setIsCompressing(false);
            setError("Gagal membaca file.");
            reject(new Error("Gagal membaca file dari disk."));
          };
          reader.readAsDataURL(source);
        }
      });
    },
    []
  );

  return {
    compressClientImage,
    isCompressing,
    error,
    formatBytes,
  };
}
