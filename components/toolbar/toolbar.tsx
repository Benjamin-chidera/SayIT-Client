import React from "react";

import {
  MicrophoneIcon,
  SettingsIcon,
  // LogoutIcon,
  KeyboardIcon,
  PenIcon,
} from "@/constants";
import { WritingMode } from "@/types/toolbar.types";
import IconButton from "./iconBtn";
// import { Send } from "lucide-react";
import { useSettingsStore } from "@/store/settings.store";
import { useCanvasStore } from "@/store/canvas.store";
import { Send } from "../animate-ui/icons/send";
import { AnimateIcon } from "../animate-ui/icons/icon";

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
  const { setOpen, language } = useSettingsStore();
  const { uploadCanvas, uploadText, text } = useCanvasStore();

  const handleUpload = () => {
    uploadCanvas(language);
  };

  return (
    <div className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 flex gap-4 rounded-full bg-[#1a1a1a]/80 border border-gray-700/50 backdrop-blur-sm p-2 sm:p-0 sm:bg-transparent sm:border-none sm:backdrop-blur-none md:flex-col md:left-auto md:right-4 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:mx-6 md:py-2 md:space-y-2 max-w-full md:max-h-[calc(100vh-4rem)] md:overflow-auto overflow-visible">
      {/* display only when the user uses the canvas to write */}
      <IconButton
        onClick={
          mode === WritingMode.Canvas
            ? handleUpload
            : () => uploadText(language)
        }
        tooltip="Speak"
        disabled={!text}
      >
        <AnimateIcon animateOnHover>
          <Send />
        </AnimateIcon>
      </IconButton>
      {/* display only when the user uses the canvas to write */}

      <IconButton
        onClick={onSpeechAction}
        isActive={isListening}
        tooltip={isListening ? "Stop Listening" : "Start Listening"}
      >
        <AnimateIcon animateOnHover>
          {/* <Send /> */}
          <MicrophoneIcon />
        </AnimateIcon>
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
      {/* <IconButton onClick={() => alert("Logout clicked!")} tooltip="Logout">
        <LogoutIcon />
      </IconButton> */}
    </div>
  );
};

export default Toolbar;
