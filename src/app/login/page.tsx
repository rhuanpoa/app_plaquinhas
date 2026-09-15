import type { Metadata } from "next";
import { Suspense } from "react";
import { FullScreenLoader } from "@/components/auth/full-screen-state";
import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <LoginView />
    </Suspense>
  );
}
