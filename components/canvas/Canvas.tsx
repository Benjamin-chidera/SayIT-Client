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
    const scale = window.devicePixelRatio;
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(scale, scale);
    context.lineCap = "round";
    context.strokeStyle = "#a78bfa";
    context.lineWidth = 3;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
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
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
      addStroke(imageData);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setShowButtons(false);
    clearStrokes();
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseLeave={finishDrawing}
      className="w-full h-full rounded-xl cursor-crosshair"
    />

      // <main>

    //     {showButtons && (
    //       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-4">
    //         <button
    //           onClick={clearCanvas}
    //           className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    //         >
    //           <Eraser size={30} color="white" />
    //         </button>
    //         <button
    //           onClick={undoLastStroke}
    //           className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    //         >
    //           <Undo size={30} color="white" />
    //         </button>
    //       </div>
    //     )}
    // </main>
  );
};

export default Canvas;
