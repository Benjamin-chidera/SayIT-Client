import { create } from "zustand";
import axios from "axios";
// for the Text to Speech
// import { KokoroTTS } from "kokoro-js";
import { toast } from "sonner";

interface CanvasState {
  loading: boolean;
  text: string;
  setText: (text: string) => void;
  isDrawing: boolean;
  showButtons: boolean;
  strokes: string[]; // store data URLs
  canvasRef: HTMLCanvasElement | null;
  setIsDrawing: (isDrawing: boolean) => void;
  setShowButtons: (show: boolean) => void;
  addStroke: (stroke: string) => void;
  undoLastStroke: () => string | null; // returns current top snapshot or null
  clearStrokes: () => void;
  setCanvasRef: (canvas: HTMLCanvasElement) => void;
  uploadCanvas: (language: string, gender: string) => Promise<void>;
  uploadText: (language: string, gender: string) => Promise<void>;
  speech_text: string; // for TTS
  // getTTS: () => Promise<KokoroTTS>;

  // this is to switch btw pen and hand mode
  mode: "pen" | "hand";
  setMode: (mode: "pen" | "hand") => void;

  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;

  //
  // Speak: () => Promise<void>;
  // speak: () => void;
}

// let tts: KokoroTTS | null = null;

export const useCanvasStore = create<CanvasState>((set, get) => ({
  loading: false,
  text: "",
  setText: (text: string) => set({ text }),
  speech_text: "",
  isDrawing: false,
  showButtons: false,
  strokes: [],
  canvasRef: null,
  mode: "pen",
  setMode: (mode: "pen" | "hand") => set({ mode }),
  isFullscreen: false,
  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setShowButtons: (show) => set({ showButtons: show }),
  addStroke: (stroke) =>
    set((state) => ({ strokes: [...state.strokes, stroke] })),
  undoLastStroke: () => {
    const strokes = [...get().strokes];
    strokes.pop();
    set({ strokes });
    const last = strokes.length ? strokes[strokes.length - 1] : null;
    return last;
  },
  clearStrokes: () => set({ strokes: [] }),
  setCanvasRef: (canvas) => set({ canvasRef: canvas }),

  // // load the TTS model
  // getTTS: async () => {
  //   if (!tts) {
  //     tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-ONNX", {
  //       dtype: "q8",
  //     });
  //   }
  //   return tts;
  // },

  uploadCanvas: async (language: string, gender: string) => {
    set({ loading: true });
    // console.log("🎨 uploadCanvas called with language:", language);

    const canvas = get().canvasRef;
    if (!canvas) {
      console.error("❌ Canvas element is not available.");
      set({ loading: false });
      return;
    }

    // console.log("✅ Canvas ref exists:", canvas);

    // Prefer env override, fallback to page host + port
    const envUrl = (process.env.NEXT_PUBLIC_UPLOAD_URL || "")
      .trim()
      .replace(/\/$/, "");
    const fallbackPort = process.env.NEXT_PUBLIC_UPLOAD_PORT || "8000";
    let uploadUrl = envUrl;

    if (envUrl) {
      // If env URL is provided, use it directly with the endpoint
      uploadUrl = `${envUrl}/uploadCanvasImg-to-text`;
    } else if (typeof window !== "undefined") {
      // Fallback to localhost/same-host for development
      const proto = window.location.protocol;
      const host = window.location.hostname;
      uploadUrl = `${proto}//${host}:${fallbackPort}/uploadCanvasImg-to-text`;
    }

    // console.log("🌐 Upload URL:", uploadUrl);

    // Mixed content guard
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      uploadUrl.startsWith("http:")
    ) {
      set({ loading: false });
      toast.error("Upload blocked", {
        description:
          "Page served over HTTPS but upload URL uses HTTP. Use an HTTPS backend or set NEXT_PUBLIC_UPLOAD_URL to an https:// URL.",
        duration: 5000,
      });
      set({ loading: false });
      return;
    }

    // Quick connectivity check (fails fast if server unreachable / CORS will still be possible)
    try {
      // await fetch(uploadUrl, { method: "HEAD", mode: "cors" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (headErr) {
      
      // console.error("Upload server unreachable (HEAD check failed):", headErr);
      toast.error("Cannot reach upload server", {
        description:
          "Ensure backend is running, reachable from your tablet (same network), and the URL is correct. If testing from mobile/tablet, set NEXT_PUBLIC_UPLOAD_URL to your machine's LAN IP (e.g. http://192.168.x.y:8000) or use ngrok.",
        duration: 5000,
      });
      set({ loading: false });
      return;
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        // console.error("❌ Failed to convert canvas to Blob.");
        toast.error("Failed to read canvas image", {
          duration: 5000,
        });
        
        set({ loading: false });
        return;
      }

      // console.log("📦 Blob created, size:", blob.size, "bytes");

      const formData = new FormData();
      formData.append("file", blob, "canvas-image.png");

      try {
        // console.log("🚀 Sending request to:", uploadUrl);
        const response = await axios.post(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 15000,
        });

        // console.log("📥 Response received:", response.status);

        if (response.status === 201 || response.status === 200) {
          // console.log("✅ Canvas uploaded successfully!");
          const data = response.data;
          // console.log("📝 Response data:", data);

          // alert(data?.text ?? "Upload succeeded");

          const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: data?.text ?? "", language, gender }),
          });

          if (!res.ok) {
            throw new Error("TTS request failed");
          }

          const audioBlob = await res.blob();
          const audioUrl = URL.createObjectURL(audioBlob);

          const audio = new Audio(audioUrl);
          audio.play();
          set({ loading: false });
        } else {
            // console.error(
            //   "Failed to upload canvas:",
            //   response.status,
            //   response.statusText,
            // );
          toast.error("Upload failed", {
            description: `Server returned status: ${response.status}`,
            duration: 5000,
          });
          set({ loading: false });
        }
      } catch (err: unknown) {
        // console.error("❌ Error uploading canvas:", err);

        set({ loading: false });

        // Enhanced error handling for upload errors

        // clearer user messages
        if (axios.isAxiosError(err)) {
          // axios-specific error
          if (err.response) {
            // server responded with non-2xx
            toast.error("Server error", {
              description: `${err.response.data.detail}`,
              duration: 5000,
            });
          } else if (err.request) {
            // request made but no response -> network / CORS
            toast.error("Network/CORS error", {
              description:
                "No response from server. Check server CORS headers, firewall, and that the backend is reachable from your device.",
              duration: 5000,
            });
          } else {
            toast.error("Upload error", {
              description: err.message ?? "unknown",
              duration: 5000,
            });
          }
        } else if (err instanceof Error) {
          // generic Error
          toast.error("Upload error", {
            description: err.message,
            duration: 5000,
          });
        } else {
          // unknown non-Error value
          toast.error("Upload error", {
            description: "An unknown error occurred",
            duration: 5000,
          });
        }
      }
    }, "image/png");
  },

  uploadText: async (language: string, gender: string) => {
    set({ loading: true });
    const text = get().text;
    // this is the user selected language for TTS
    console.log(text);

    if (!text) {
      console.warn("No text to speak.");
      set({ loading: false });
      return;
    }

    console.log("Zustand", language);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language, gender }),
      });

      if (!res.ok) {
        throw new Error("TTS request failed");
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.play();
      set({ loading: false });
    } catch (err) {
      console.error("TTS failed:", err);
      set({ loading: false });
      toast.error("TTS failed", {
        description: err instanceof Error ? err.message : "unknown error",
        duration: 5000,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
