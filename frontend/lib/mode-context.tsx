"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ScanMode = "free" | "pro";

interface ModeContextValue {
  mode: ScanMode;
  setMode: (mode: ScanMode) => void;
  toggle: () => void;
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ScanMode>("free");

  const toggle = useCallback(() => {
    setMode((prev) => (prev === "free" ? "pro" : "free"));
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within a ModeProvider");
  return ctx;
}
