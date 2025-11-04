"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Canvas from "@/components/canvas/Canvas";

import Toolbar from "@/components/toolbar/toolbar";
import { WritingMode } from "@/types/toolbar.types";
import Settings from "@/components/settings/Settings";

// Fix for TypeScript: Add Web Speech API types for browser compatibility
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
  const [text, setText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        // To avoid updating state on every interim result, we could debounce or just use final.
        // For a more responsive feel, we can show interim and replace with final.
        setText(
          (prevText) =>
            prevText.substring(0, prevText.length - interimTranscript.length) +
            finalTranscript +
            interimTranscript
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
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
      recognition.stop();
      setIsListening(false);
    } else {
      if (mode === WritingMode.Canvas) {
        setMode(WritingMode.Typing);
      }
      recognition.start();
      setIsListening(true);
    }
  }, [isListening, mode]);
  return (
    <main className=" min-h-screen w-full flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[24px_24px] opacity-30"></div>
      <div className="relative w-full h-[85vh] max-w-full flex items-center justify-center">
        <div className="bg-transparent rounded-2xl w-full h-full border border-gray-700/50 shadow-2xl shadow-black/30 p-2">
          {mode === WritingMode.Canvas ? (
            <Canvas />
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or use the microphone..."
              className="w-full h-full bg-transparent text-gray-200 text-lg p-6 rounded-xl focus:outline-none resize-none placeholder-gray-500"
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
    </main>
  );
}
