import { create } from "zustand";

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
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  isDrawing: false,
  showButtons: false,
  strokes: [],
  canvasRef: null,
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

    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("Failed to convert canvas to Blob.");
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, "canvas-image.png");

      try {
        const response = await fetch("http://127.0.0.1:8000/uploadCanvasImg-to-text", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Canvas uploaded successfully!");
          const data = await response.json();
          console.log("Response from server:", data.text);
          alert(data.text);

        } else {
          console.error("Failed to upload canvas.");
        }
      } catch (error) {
        console.error("Error uploading canvas:", error);
      }
    }, "image/png");
  },
}));
