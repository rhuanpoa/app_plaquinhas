"use client";

import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useToast } from "@/components/ui/toast";
import { onUserChange, signOut as signOutRequest } from "@/lib/repositories/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@/types";

export type AuthStatus = "loading" | "ready" | "misconfigured";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() => (isSupabaseConfigured() ? "loading" : "misconfigured"));

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    return onUserChange((currentUser) => {
      setUser(currentUser);
      setStatus("ready");
    });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await signOutRequest();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Não foi possível sair.", "error");
    }
  }, [toast]);

  const value = useMemo(() => ({ user, status, setUser, signOut }), [user, status, signOut]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const context = use(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider.");
  return context;
}
