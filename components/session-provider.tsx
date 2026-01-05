"use client";

import { createContext, useContext } from "react";

const SessionContext = createContext<unknown>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: unknown;
}) {

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
