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
  const { open, setOpen } = useSettingsStore();

  return (
    <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4">
      <IconButton
        onClick={onSpeechAction}
        isActive={isListening}
        tooltip={isListening ? "Stop Listening" : "Start Listening"}
      >
        <MicrophoneIcon />
      </IconButton>

      <IconButton onClick={() => alert("Submit")} tooltip="Speak">
        <Send />
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
