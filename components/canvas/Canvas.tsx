import { useCanvasStore } from "@/store/canvas.store";
import { Eraser, Undo } from "lucide-react";
import React, { useRef, useEffect } from "react";
import { ToggleFullscreen } from "../fullscreen/full-screen";
import { CanvasMode } from "./Mode";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const { setCanvasRef, mode } = useCanvasStore();

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasRef(canvasRef.current); // Store the canvas reference in Zustand
    }
  }, [canvasRef, setCanvasRef]);

  const {
    isDrawing,
    showButtons,
    // strokes,
    setIsDrawing,
    setShowButtons,
    addStroke,
    undoLastStroke,
    clearStrokes,
  } = useCanvasStore();

  // track active pointer so other pointers (different pointerType) are ignored
  const activePointerIdRef = useRef<number | null>(null);
  const activePointerTypeRef = useRef<string | null>(null);
  const isRenderingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(1, 0, 0, 1, 0, 0); // reset transforms
    context.scale(scale, scale);
    context.lineCap = "round";
    context.strokeStyle = "#a78bfa";
    context.lineWidth = 3;
    contextRef.current = context;
  }, []);

  // Helper to get coords relative to canvas (CSS pixels)
  const getCoordsFromClient = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // Accept pointer only if its type matches current mode
  const isPointerAllowedByMode = (pointerType: string) => {
    if (mode === "pen") {
      return pointerType === "pen";
    }
    // hand mode: accept touch and mouse (finger or stylus in touch mode should be 'touch')
    return pointerType === "touch" || pointerType === "mouse";
  };

  const startDrawingPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Only start if pointer type is allowed by mode
    if (!isPointerAllowedByMode(e.pointerType)) return;

    e.preventDefault();
    const coords = getCoordsFromClient(e.clientX, e.clientY);
    const ctx = contextRef.current;
    if (!ctx) return;

    // set active pointer so we ignore other pointer types/ids
    activePointerIdRef.current = e.pointerId;
    activePointerTypeRef.current = e.pointerType;

    // capture pointer so move/up events continue even if pointer leaves element
    try {
      canvasRef.current?.setPointerCapture(e.pointerId);
    } catch {}
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setShowButtons(true);
  };

  const drawPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // ignore if not the active pointer
    if (
      activePointerIdRef.current == null ||
      e.pointerId !== activePointerIdRef.current
    )
      return;
    if (e.pointerType !== activePointerTypeRef.current) return; // extra guard
    if (!isDrawing || !contextRef.current) return;

    e.preventDefault();
    const coords = getCoordsFromClient(e.clientX, e.clientY);
    contextRef.current.lineTo(coords.x, coords.y);
    contextRef.current.stroke();
  };

  const endDrawingPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // only end if it's the active pointer
    if (
      activePointerIdRef.current == null ||
      e.pointerId !== activePointerIdRef.current
    )
      return;

    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    activePointerIdRef.current = null;
    activePointerTypeRef.current = null;

    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);

    // snapshot canvas once the stroke finishes
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      addStroke(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    // clear using CSS-size coordinates because context is scaled
    context.clearRect(0, 0, rect.width, rect.height);
    setShowButtons(false);
    clearStrokes();
  };

  // Undo: remove last snapshot from store and redraw remaining top snapshot (or clear)
  const handleUndo = () => {
    if (isRenderingRef.current) return; // avoid overlapping undos

    // stop any drawing in progress
    setIsDrawing(false);
    const activeId = activePointerIdRef.current;
    if (activeId && canvasRef.current) {
      try {
        canvasRef.current.releasePointerCapture(activeId);
      } catch {}
    }
    activePointerIdRef.current = null;
    activePointerTypeRef.current = null;

    const remainingTop = undoLastStroke(); // store now returns remaining top snapshot or null
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();

    // Prevent user interactions while we redraw to avoid visual glitches
    isRenderingRef.current = true;
    const prevPointerEvents = canvas.style.pointerEvents;
    canvas.style.pointerEvents = "none";

    // ensure drawing style and crisp redraw
    ctx.lineCap = "round";
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 3;
    ctx.imageSmoothingEnabled = false;

    if (!remainingTop) {
      // clear and finish
      ctx.clearRect(0, 0, rect.width, rect.height);
      setShowButtons(false);
      isRenderingRef.current = false;
      canvas.style.pointerEvents = prevPointerEvents || "auto";
      return;
    }

    // Load the snapshot and draw it inside rAF to avoid layout thrash/flicker
    const img = new Image();
    img.onload = () => {
      requestAnimationFrame(() => {
        // draw over canvas (no intermediate clear needed — drawImage replaces pixels)
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setShowButtons(true);
        isRenderingRef.current = false;
        canvas.style.pointerEvents = prevPointerEvents || "auto";
      });
    };
    img.onerror = () => {
      console.error("Failed to load snapshot for undo.");
      isRenderingRef.current = false;
      canvas.style.pointerEvents = prevPointerEvents || "auto";
    };
    img.src = remainingTop;
  };

  return (
    <div className="relative w-full h-full overflow-visible">
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawingPointer}
        onPointerMove={drawPointer}
        onPointerUp={endDrawingPointer}
        onPointerCancel={endDrawingPointer}
        onPointerLeave={endDrawingPointer}
        className={`w-full h-full rounded-xl ${
          mode === "hand" ? "cursor-grab" : "cursor-crosshair"
        }`}
        style={{ touchAction: "none", display: "block" }}
      />
      <section>
        {showButtons && (
          <div className="absolute top-3 right-1 flex gap-4 z-20">
            <button
              type="button"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-sm border  text-white border-gray-700/50 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handleUndo}
              title="Undo"
            >
              <Undo size={18} />
            </button>
            <button
              type="button"
              onClick={clearCanvas}
              title="Clear"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50  text-white"
            >
              <Eraser size={18} />
            </button>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-4 z-20">
          <ToggleFullscreen />
        </div>

        <div className="absolute bottom-4 left-4 z-20">
          <CanvasMode />
        </div>
      </section>
    </div>
  );
};

export default Canvas;
