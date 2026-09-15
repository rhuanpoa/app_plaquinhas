"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "./auth-provider";
import { FullScreenLoader, SupabaseNotConfigured } from "./full-screen-state";

/** Só mostra o conteúdo para quem está logado; os demais vão para o login. */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "ready" || user) return;
    const next = pathname + window.location.search;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [status, user, pathname, router]);

  if (status === "misconfigured") return <SupabaseNotConfigured />;
  if (status !== "ready" || !user) return <FullScreenLoader />;
  return children;
}
