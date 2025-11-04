import { AnimatedPenIcon } from "@/constants";
import React from "react";

interface OnboardingScreenProps {
  onStart: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onStart }) => {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-center text-white font-sans relative overflow-hidden antialiased">
     

      <div className="relative z-10 flex flex-col items-center">
        <AnimatedPenIcon />

        <h1 className="text-4xl sm:text-6xl font-bold max-w-3xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
          Write or type — and AI will speak for you.
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-xl">
          SayIT turns your handwriting or text into real speech.
        </p>
        <button
          onClick={onStart}
          className="mt-12 px-8 py-4 bg-blue-600 rounded-full text-lg font-semibold text-white hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          Start Chatting
        </button>
      </div>
    </main>
  );
};

export default OnboardingScreen;
