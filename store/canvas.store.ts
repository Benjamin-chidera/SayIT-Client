import { create } from "zustand";

interface CanvasState {
  isDrawing: boolean;
  showButtons: boolean;
  strokes: ImageData[];
  canvasRef: HTMLCanvasElement | null;
  setIsDrawing: (isDrawing: boolean) => void;
  setShowButtons: (show: boolean) => void;
  addStroke: (stroke: ImageData) => void;
  undoLastStroke: () => ImageData | null;
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
  undoLastStroke: () =>
    set((state) => {
      const strokes = [...state.strokes];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const lastStroke = strokes.pop() || null;
      return { strokes };
    }),
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
      formData.append("image", blob, "canvas-image.png");

      try {
        const response = await fetch("https://your-backend-url.com/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Canvas uploaded successfully!");
        } else {
          console.error("Failed to upload canvas.");
        }
      } catch (error) {
        console.error("Error uploading canvas:", error);
      }
    }, "image/png");
  },
}));
