"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Canvas from "@/components/canvas/Canvas";

import Toolbar from "@/components/toolbar/toolbar";
import { WritingMode } from "@/types/toolbar.types";
import Settings from "@/components/settings/Settings";
import { useCanvasStore } from "@/store/canvas.store";
import { useSettingsStore } from "@/store/settings.store";
import { useSession } from "@/components/session-provider";
import { Toaster } from "sonner";

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function Home() {
  const [mode, setMode] = useState<WritingMode>(WritingMode.Canvas);
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastTranscriptRef = useRef<string>("");
  const { isFullscreen, text, setText } = useCanvasStore();
  const session = useSession();
  const { getUserSettings } = useSettingsStore();

  useEffect(() => {
    if (session?.user?.id) {
      getUserSettings(session.user.id);
    }
  }, [session?.user?.id, getUserSettings]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result[0].transcript.trim();

          if (result.isFinal) {
            finalTranscript += transcript + " ";
          }
        }

        // if (finalTranscript && finalTranscript !== lastTranscriptRef.current) {
        //   setText((prevText) => prevText + finalTranscript);
        //   lastTranscriptRef.current = finalTranscript;
        // }

        if (finalTranscript && finalTranscript !== lastTranscriptRef.current) {
          setText(text + finalTranscript);
          lastTranscriptRef.current = finalTranscript;
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModeToggle = useCallback(() => {
    setMode((prevMode) =>
      prevMode === WritingMode.Canvas ? WritingMode.Typing : WritingMode.Canvas
    );
  }, []);

  const handleSpeechAction = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition is not supported by your browser.");
      return;
    }

    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      if (mode === WritingMode.Canvas) {
        setMode(WritingMode.Typing);
      }
      recognition?.start();
      setIsListening(true);
    }
  }, [isListening, mode]);

  return (
    <main className=" min-h-screen w-full p-4 sm:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[24px_24px] opacity-30"></div>
      <div
        className={`relative w-full ${
          isFullscreen ? "sm:h-[70vh] md:h-[90vh] " : "lg:h-[90vh] h-[85vh]"
        } max-w-full`}
      >
        <div className="bg-transparent rounded-2xl w-full h-full border border-gray-700/50 shadow-2xl shadow-black/30 overflow-hidden">
          {mode === WritingMode.Canvas ? (
            <Canvas />
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or use the microphone..."
              className="w-full sm:h-[70vh] md:h-[95vh] bg-transparent text-gray-200 text-lg p-6 rounded-xl focus:outline-none resize-none placeholder-gray-500"
            />
          )}
        </div>
      </div>
      <Toolbar
        mode={mode}
        isListening={isListening}
        onModeToggle={handleModeToggle}
        onSpeechAction={handleSpeechAction}
      />

      <Settings />
      <Toaster />
    </main>
  );
}
