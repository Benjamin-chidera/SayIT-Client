import { Eraser, Undo } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [strokes, setStrokes] = useState<CanvasRenderingContext2D[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high-DPI screens
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

    // Removed the default "How are you?" text
    // You can leave this blank or add a placeholder if needed
  }, []);

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
      setShowButtons(true); // Show buttons when drawing starts
    }
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Save the current state of the canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const context = contextRef.current;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      setStrokes([...strokes, imageData]);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setShowButtons(false); // Hide buttons after clearing
  };

  const undoLastStroke = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context || strokes.length === 0) return;

    // Restore the last saved state
    const lastStroke = strokes.pop();
    context.putImageData(lastStroke, 0, 0);
    setStrokes([...strokes]);
  };

  const clearOnce = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Clear only if the sample text is still there.
    // A simple check is to see if drawing has occurred.
    // This is a proxy for "first touch".
    const hasDrawnPaths = context
      .getImageData(0, 0, 1, 1)
      .data.some((channel) => channel !== 0);
    if (!hasDrawnPaths) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    startDrawing(e);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={clearOnce}
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
