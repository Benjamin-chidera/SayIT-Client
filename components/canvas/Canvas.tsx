import { useCanvasStore } from "@/store/canvas.store";
import { Eraser, Undo } from "lucide-react";
import React, { useRef, useEffect } from "react";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const { setCanvasRef } = useCanvasStore();

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasRef(canvasRef.current); // Store the canvas reference in Zustand
    }
  }, [canvasRef, setCanvasRef]);

  const {
    isDrawing,
    showButtons,
    strokes,
    setIsDrawing,
    setShowButtons,
    addStroke,
    undoLastStroke,
    clearStrokes,
  } = useCanvasStore();

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

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
      setShowButtons(true);
    }
  };

  const finishDrawing = () => {
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

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
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

  // Touch handlers (prevent default to stop scrolling/up gestures)
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch || !contextRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(
      touch.clientX - rect.left,
      touch.clientY - rect.top
    );
    setIsDrawing(true);
    setShowButtons(true);
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !contextRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    contextRef.current.lineTo(
      touch.clientX - rect.left,
      touch.clientY - rect.top
    );
    contextRef.current.stroke();
  };

  const finishDrawingTouch = () => {
    finishDrawing();
  };

  // Undo: remove last snapshot from store and redraw remaining top snapshot (or clear)
  const handleUndo = () => {
    const remainingTop = undoLastStroke(); // store now returns remaining top snapshot or null
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    // clear first
    ctx.clearRect(0, 0, rect.width, rect.height);
    if (remainingTop) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = remainingTop;
      setShowButtons(true);
    } else {
      // nothing left after undo
      setShowButtons(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawingTouch}
        onTouchMove={drawTouch}
        onTouchEnd={finishDrawingTouch}
        className="w-full h-full rounded-xl cursor-crosshair"
        style={{ touchAction: "none", display: "block" }}
      />
      {showButtons && (
        <div className="absolute -top-9 left-3 flex gap-4">
          <button
            type="button"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleUndo}
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            title="Clear"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <Eraser size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Canvas;
