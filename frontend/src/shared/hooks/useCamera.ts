"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type CameraFacingMode = "environment" | "user";
export type CameraPermissionState = "idle" | "granted" | "denied" | "unsupported" | "error";

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  permission: CameraPermissionState;
  facingMode: CameraFacingMode;
  hasMultipleCameras: boolean;
  isTorchOn: boolean;
  hasTorch: boolean;
  isLoading: boolean;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  toggleFacingMode: () => Promise<void>;
  toggleTorch: () => Promise<void>;
  takeSnapshot: () => string | null;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [permission, setPermission] = useState<CameraPermissionState>("idle");
  const [facingMode, setFacingMode] = useState<CameraFacingMode>("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if multiple camera devices exist
  useEffect(() => {
    async function checkDevices() {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
        return;
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoDevices.length > 1);
      } catch {
        // ignore
      }
    }
    checkDevices();
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsTorchOn(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPermission("unsupported");
      // Detect if the issue is non-secure context (HTTP on non-localhost)
      if (
        typeof window !== "undefined" &&
        window.location.protocol === "http:" &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ) {
        setError(
          "Akses kamera memerlukan koneksi HTTPS yang aman. Pastikan kamu mengakses website ini melalui HTTPS, bukan HTTP."
        );
      } else {
        setError("Browser kamu tidak mendukung akses kamera secara langsung.");
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    stopCamera();

    try {
      // Pre-check permission status for better UX messaging
      if (navigator.permissions) {
        try {
          const permStatus = await navigator.permissions.query({ name: "camera" as PermissionName });
          if (permStatus.state === "denied") {
            setPermission("denied");
            setError(
              "Izin kamera telah diblokir sebelumnya. Buka pengaturan situs di browser kamu, lalu izinkan akses kamera untuk website ini."
            );
            setIsLoading(false);
            return;
          }
        } catch {
          // permissions.query for camera not supported in all browsers, continue normally
        }
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      setPermission("granted");

      // Check if torch/flashlight is supported
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities?.() || {}) as { torch?: boolean };
        setHasTorch(Boolean(capabilities.torch));
      }
    } catch (err: unknown) {
      console.warn("Camera access error:", err);
      const errorObj = err as Error;
      if (errorObj.name === "NotAllowedError" || errorObj.name === "PermissionDeniedError") {
        setPermission("denied");
        setError(
          "Izin akses kamera ditolak. Buka pengaturan situs di browser kamu, lalu izinkan akses kamera untuk website ini."
        );
      } else if (errorObj.name === "NotFoundError" || errorObj.name === "DevicesNotFoundError") {
        setPermission("unsupported");
        setError("Kamera tidak ditemukan pada perangkat kamu.");
      } else if (errorObj.name === "NotReadableError" || errorObj.name === "AbortError") {
        setPermission("error");
        setError("Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi tersebut dan coba lagi.");
      } else {
        setPermission("error");
        setError(errorObj.message || "Gagal memulai kamera.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, stopCamera]);

  const toggleFacingMode = useCallback(async () => {
    const nextMode: CameraFacingMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
  }, [facingMode]);

  // Restart camera when facingMode changes if active
  useEffect(() => {
    if (permission === "granted") {
      startCamera();
    }
  }, [facingMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTorch = useCallback(async () => {
    if (!streamRef.current || !hasTorch) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextState = !isTorchOn;
      const mediaTrack = track as MediaStreamTrack & {
        applyConstraints: (constraints: MediaTrackConstraints) => Promise<void>;
      };
      await mediaTrack.applyConstraints({
        advanced: [{ torch: nextState } as MediaTrackConstraintSet],
      });
      setIsTorchOn(nextState);
    } catch (err) {
      console.warn("Torch toggle failed:", err);
    }
  }, [hasTorch, isTorchOn]);

  const takeSnapshot = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, width, height);

    // Get JPEG data URL with quality 0.85
    return canvas.toDataURL("image/jpeg", 0.85);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    permission,
    facingMode,
    hasMultipleCameras,
    isTorchOn,
    hasTorch,
    isLoading,
    error,
    startCamera,
    stopCamera,
    toggleFacingMode,
    toggleTorch,
    takeSnapshot,
  };
}
