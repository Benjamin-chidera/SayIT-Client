import React from "react";

import {
  MicrophoneIcon,
  SettingsIcon,
  LogoutIcon,
  KeyboardIcon,
  PenIcon,
} from "@/constants";
import { WritingMode } from "@/types/toolbar.types";
import IconButton from "./iconBtn";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/store/settings.store";
import { useCanvasStore } from "@/store/canvas.store";

interface ToolbarProps {
  mode: WritingMode;
  isListening: boolean;
  onModeToggle: () => void;
  onSpeechAction: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  isListening,
  onModeToggle,
  onSpeechAction,
}) => {
  const router = useRouter();
  const { setOpen } = useSettingsStore();
  const { uploadCanvas } = useCanvasStore();

  const handleUpload = () => {
    uploadCanvas();
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 rounded-full bg-[#1a1a1a]/80 border border-gray-700/50 backdrop-blur-sm p-2 sm:p-0 sm:bg-transparent sm:border-none sm:backdrop-blur-none sm:flex-col sm:left-auto sm:right-8 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 md:mx-5 mb-20 md:mb-0">
      {/* display only when the user uses the canvas to write */}
      <IconButton onClick={handleUpload} tooltip="Speak">
        <Send />
      </IconButton>
      {/* display only when the user uses the canvas to write */}

      <IconButton
        onClick={onSpeechAction}
        isActive={isListening}
        tooltip={isListening ? "Stop Listening" : "Start Listening"}
      >
        <MicrophoneIcon />
      </IconButton>

      <IconButton
        onClick={onModeToggle}
        tooltip={
          mode === WritingMode.Canvas ? "Switch to Typing" : "Switch to Canvas"
        }
      >
        {mode === WritingMode.Canvas ? <KeyboardIcon /> : <PenIcon />}
      </IconButton>
      <IconButton onClick={() => setOpen(true)} tooltip="Settings">
        <SettingsIcon />
      </IconButton>
      <IconButton onClick={() => alert("Logout clicked!")} tooltip="Logout">
        <LogoutIcon />
      </IconButton>
    </div>
  );
};

export default Toolbar;
