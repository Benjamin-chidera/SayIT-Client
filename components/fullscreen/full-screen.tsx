import React from "react";

import { Maximize2, Minimize2 } from "lucide-react"; // optional, from lucide-react icons
import { toggleFullscreen } from "@/lib/fullscreen";
import { useCanvasStore } from "@/store/canvas.store";

export const ToggleFullscreen = () => {
  const { isFullscreen, setIsFullscreen } = useCanvasStore();

  const handleToggle = () => {
    toggleFullscreen();
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex justify-end items-center p-2  text-white">
      <button
        onClick={handleToggle}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-700/50 transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        {/* {isFullscreen ? "Fullscreen" : "Exit Fullscreen"} */}
      </button>
    </div>
  );
};
