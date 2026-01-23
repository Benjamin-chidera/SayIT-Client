"use client";

import React, { useState } from "react";
import { GoogleIcon, LogoIcon } from "@/constants";
import { signInWithGoogle } from "@/lib/auth-clients";

const AuthScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-center text-white font-sans relative overflow-y-auto overflow-hidden antialiased">
      {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.1)_0%,transparent_70%)]"></div> */}

      <div className="relative z-10 bg-[#1a1a1a] p-8 sm:p-12 rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/30 w-full max-w-sm md:mb-10">
        <div className="flex flex-col items-center mb-8">
          <LogoIcon />
          <h1 className="text-3xl font-bold text-gray-100 mt-4">SayIT</h1>
          <p className="mt-2 text-gray-400">Sign in to get started.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-gray-800/80 border border-gray-700 rounded-lg font-medium text-gray-200 hover:bg-gray-700/80 transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gray-500/50 cursor-pointer"
          >
            <GoogleIcon />
            Continue with Google
            {loading && (
              <svg
                className="animate-spin ml-2 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-400">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </main>
  );
};

export default AuthScreen;
