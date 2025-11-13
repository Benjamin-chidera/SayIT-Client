// import { create } from "zustand";
// import axios from "axios";

// interface CanvasState {
//   isDrawing: boolean;
//   showButtons: boolean;
//   strokes: string[]; // store data URLs
//   canvasRef: HTMLCanvasElement | null;
//   setIsDrawing: (isDrawing: boolean) => void;
//   setShowButtons: (show: boolean) => void;
//   addStroke: (stroke: string) => void;
//   undoLastStroke: () => string | null; // returns current top snapshot or null
//   clearStrokes: () => void;
//   setCanvasRef: (canvas: HTMLCanvasElement) => void;
//   uploadCanvas: () => Promise<void>;
// }

// export const useCanvasStore = create<CanvasState>((set, get) => ({
//   isDrawing: false,
//   showButtons: false,
//   strokes: [],
//   canvasRef: null,
//   setIsDrawing: (isDrawing) => set({ isDrawing }),
//   setShowButtons: (show) => set({ showButtons: show }),
//   addStroke: (stroke) =>
//     set((state) => ({ strokes: [...state.strokes, stroke] })),
//   undoLastStroke: () => {
//     const strokes = [...get().strokes];
//     strokes.pop();
//     set({ strokes });
//     const last = strokes.length ? strokes[strokes.length - 1] : null;
//     return last;
//   },
//   clearStrokes: () => set({ strokes: [] }),
//   setCanvasRef: (canvas) => set({ canvasRef: canvas }),
//   uploadCanvas: async () => {
//     const canvas = get().canvasRef;
//     if (!canvas) {
//       console.error("Canvas element is not available.");
//       return;
//     }

//     canvas.toBlob(async (blob) => {
//       if (!blob) {
//         console.error("Failed to convert canvas to Blob.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("file", blob, "canvas-image.png");

//       try {
//         const response = await axios.post("http://0.0.0.0:8000/uploadCanvasImg-to-text", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });

//         if (response.status === 201) {
//           console.log("Canvas uploaded successfully!");
//           const data = response.data;
//           console.log("Response from server:", data.text);
//           alert(data.text);

//         } else {
//           console.error("Failed to upload canvas.");
//         }
//       } catch (error) {
//         console.error("Error uploading canvas:", error);
//         alert("Error uploading canvas: " + error);
//       }
//     }, "image/png");
//   },
// }));

import { create } from "zustand";
import axios from "axios";

interface CanvasState {
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
  uploadCanvas: () => Promise<void>;

  // this is to switch btw pen and hand mode
  mode: "pen" | "hand";
  setMode: (mode: "pen" | "hand") => void;

  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
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
  uploadCanvas: async () => {
    const canvas = get().canvasRef;
    if (!canvas) {
      console.error("Canvas element is not available.");
      return;
    }

    // Prefer env override, fallback to page host + port
    const envUrl = (process.env.NEXT_PUBLIC_UPLOAD_URL || "")
      .trim()
      .replace(/\/$/, "");
    const fallbackPort = process.env.NEXT_PUBLIC_UPLOAD_PORT || "8000";
    let uploadUrl = envUrl;
    if (!uploadUrl && typeof window !== "undefined") {
      const proto = window.location.protocol;
      const host = window.location.hostname;
      uploadUrl = `${proto}//${host}:${fallbackPort}/uploadCanvasImg-to-text`;
    } else if (envUrl) {
      uploadUrl = `${envUrl}/uploadCanvasImg-to-text`;
    }

    // Mixed content guard
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      uploadUrl.startsWith("http:")
    ) {
      console.error(
        "Mixed content: frontend is HTTPS but upload URL is HTTP",
        uploadUrl
      );
      alert(
        "Upload blocked: page served over HTTPS but upload URL uses HTTP. Use an HTTPS backend or set NEXT_PUBLIC_UPLOAD_URL to an https:// URL."
      );
      return;
    }

    // Quick connectivity check (fails fast if server unreachable / CORS will still be possible)
    try {
      await fetch(uploadUrl, { method: "HEAD", mode: "cors" });
    } catch (headErr) {
      console.error("Upload server unreachable (HEAD check failed):", headErr);
      alert(
        "Cannot reach upload server. Ensure backend is running, reachable from your tablet (same network), and the URL is correct. " +
          "If testing from mobile/tablet, set NEXT_PUBLIC_UPLOAD_URL to your machine's LAN IP (e.g. http://192.168.x.y:8000) or use ngrok."
      );
      return;
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("Failed to convert canvas to Blob.");
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, "canvas-image.png");

      try {
        const response = await axios.post(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 15000,
        });

        if (response.status === 201 || response.status === 200) {
          console.log("Canvas uploaded successfully!");
          const data = response.data;
          alert(data?.text ?? "Upload succeeded");
        } else {
          console.error(
            "Failed to upload canvas:",
            response.status,
            response.statusText
          );
          alert(`Upload failed: ${response.status}`);
        }
      } catch (err: unknown) {
        console.error("Error uploading canvas:", err);

        // clearer user messages
        if (axios.isAxiosError(err)) {
          // axios-specific error
          if (err.response) {
            // server responded with non-2xx
            alert(
              `Server error: ${err.response.status} ${err.response.statusText}`
            );
          } else if (err.request) {
            // request made but no response -> network / CORS
            alert(
              "Network/CORS error: no response from server. Check server CORS headers, firewall, and that the backend is reachable from your device."
            );
          } else {
            alert(`Upload error: ${err.message ?? "unknown"}`);
          }
        } else if (err instanceof Error) {
          // generic Error
          alert(`Upload error: ${err.message}`);
        } else {
          // unknown non-Error value
          alert("Upload error: unknown");
        }
      }
    }, "image/png");
  },
}));
