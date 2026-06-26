"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  displayName: string;
  email: string;
  avatarUrl: string | null;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => void;
  signInWithOAuth: (provider: "google" | "azure" | "saml") => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const json = await res.json();
      if (json.profile) setProfile(json.profile);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile();
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile();
      else setProfile(null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile((prev) => prev ? { ...prev, ...updates } : prev);
  }, []);

  const signInWithOAuth = async (provider: "google" | "azure" | "saml") => {
    const redirectTo = `${window.location.origin}/auth/callback`;

    if (provider === "saml") {
      await supabase.auth.signInWithSSO({ domain: "catcham.ai" });
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: provider === "azure" ? "azure" : "google",
      options: { redirectTo },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, profile, refreshProfile: fetchProfile, updateProfile, signInWithOAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
