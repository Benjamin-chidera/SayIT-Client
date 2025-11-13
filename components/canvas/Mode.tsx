import { useCanvasStore } from "@/store/canvas.store";
import { PenTool, Hand } from "lucide-react";

export const CanvasMode = () => {
  const { mode, setMode } = useCanvasStore();

  return (
    <div className="flex gap-3 bg-gray-800 text-white p-2 rounded-lg ">
      <button
        onClick={() => setMode("pen")}
        className={`px-3 py-2 rounded-md flex items-center gap-2 ${
          mode === "pen" ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        <PenTool size={16} />

      </button>

      <button
        onClick={() => setMode("hand")}
        className={`px-3 py-2 rounded-md flex items-center gap-2 ${
          mode === "hand" ? "bg-green-600" : "bg-gray-700"
        }`}
      >
        <Hand size={16} />
 
      </button>
    </div>
  );
};
