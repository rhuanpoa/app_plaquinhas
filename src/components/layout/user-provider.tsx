"use client";

import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useToast } from "@/components/ui/toast";
import { getCurrentUser } from "@/lib/repositories/users";
import type { User } from "@/types";

interface CurrentUserContextValue {
  user: User | null;
  setUser: (user: User) => void;
  signOut: () => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((currentUser) => {
      if (active) setUser(currentUser);
    });
    return () => {
      active = false;
    };
  }, []);

  // Sem autenticação real no MVP: sair apenas informa que a ação é simulada.
  const signOut = useCallback(() => toast("Sessão encerrada (simulado).", "info"), [toast]);

  const value = useMemo(() => ({ user, setUser, signOut }), [user, signOut]);

  return <CurrentUserContext value={value}>{children}</CurrentUserContext>;
}

export function useCurrentUser(): CurrentUserContextValue {
  const context = use(CurrentUserContext);
  if (!context) throw new Error("useCurrentUser precisa estar dentro de UserProvider.");
  return context;
}
