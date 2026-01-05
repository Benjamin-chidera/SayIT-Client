"use client";

import { createContext, useContext } from "react";

interface SessionContextType {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: boolean;
    email: string;
    name: string;
    // language: string | null;
    // gender: string | null;
  };
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionContextType | null;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
