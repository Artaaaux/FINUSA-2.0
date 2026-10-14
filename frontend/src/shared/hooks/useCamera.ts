"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type CameraFacingMode = "environment" | "user";
export type CameraPermissionState = "idle" | "granted" | "denied" | "unsupported" | "error";

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  attachVideoRef: (node: HTMLVideoElement | null) => void;
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
  /** Capture a JPEG frame. If `guideEl` is given, crop to that on-screen guide box (+ padding). */
  takeSnapshot: (guideEl?: HTMLElement | null) => string | null;
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

  // Safely hook video DOM element to the current stream
  const hookVideoToStream = useCallback((video: HTMLVideoElement, stream: MediaStream) => {
    try {
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.muted = true;
      video.autoplay = true;

      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }

      const handleReady = () => {
        video.play().catch((playErr) => {
          console.warn("video.play() deferred/failed:", playErr);
        });
      };

      video.onloadedmetadata = handleReady;
      video.oncanplay = handleReady;

      // Immediate play attempt
      video.play().catch(() => {});
    } catch (e) {
      console.warn("Failed to hook video stream:", e);
    }
  }, []);

  // Callback ref for the <video> element so whenever it mounts or remounts,
  // it immediately binds to the active camera stream.
  const attachVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      hookVideoToStream(node, streamRef.current);
    }
  }, [hookVideoToStream]);

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

      // Constraints: Request facingMode with progressive fallbacks
      const constraintsList: MediaStreamConstraints[] = [
        {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        },
        {
          video: {
            facingMode: { ideal: facingMode },
          },
          audio: false,
        },
        {
          video: true,
          audio: false,
        },
      ];

      let stream: MediaStream | null = null;
      let lastErr: unknown = null;

      for (const constraints of constraintsList) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (stream) break;
        } catch (cErr) {
          lastErr = cErr;
          console.warn("getUserMedia constraint attempt failed, trying next:", cErr);
        }
      }

      if (!stream) {
        throw lastErr || new Error("Tidak dapat menginisialisasi kamera.");
      }

      streamRef.current = stream;

      if (videoRef.current) {
        hookVideoToStream(videoRef.current, stream);
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
  }, [facingMode, hookVideoToStream, stopCamera]);

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

  const takeSnapshot = useCallback((guideEl?: HTMLElement | null): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;

    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 720;

    // Default: full frame
    let sx = 0;
    let sy = 0;
    let sw = vw;
    let sh = vh;

    // Crop to the on-screen guide box if provided
    if (guideEl && video.videoWidth && video.videoHeight) {
      const vr = video.getBoundingClientRect();
      const gr = guideEl.getBoundingClientRect();
      if (vr.width > 0 && vr.height > 0 && gr.width > 0 && gr.height > 0) {
        const scale = Math.max(vr.width / vw, vr.height / vh);
        const offsetX = (vw * scale - vr.width) / 2;
        const offsetY = (vh * scale - vr.height) / 2;

        let cx = (gr.left - vr.left + offsetX) / scale;
        const cy = (gr.top - vr.top + offsetY) / scale;
        const cw = gr.width / scale;
        const ch = gr.height / scale;

        // Front camera preview is mirrored via CSS; flip X back to sensor coordinates
        if (facingMode === "user") {
          cx = vw - cx - cw;
        }

        // Exact 1:1 clamp to sensor coordinates without artificial bloating padding
        const x0 = Math.max(0, Math.round(cx));
        const y0 = Math.max(0, Math.round(cy));
        const x1 = Math.min(vw, Math.round(cx + cw));
        const y1 = Math.min(vh, Math.round(cy + ch));

        // Only apply if the crop is a valid positive region
        if (x1 > x0 && y1 > y0 && x1 - x0 >= 80 && y1 - y0 >= 80) {
          sx = x0;
          sy = y0;
          sw = x1 - x0;
          sh = y1 - y0;
        }
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // If front camera full frame without crop, mirror to match display
    if (facingMode === "user" && !guideEl) {
      ctx.translate(sw, 0);
      ctx.scale(-1, 1);
    }

    // Draw (cropped or full) video frame to canvas
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    // Get JPEG data URL with quality 0.9 (small receipt text survives better)
    return canvas.toDataURL("image/jpeg", 0.9);
  }, [facingMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    attachVideoRef,
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
