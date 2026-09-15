"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Site estático não tem redirecionamento no servidor, então a raiz redireciona no navegador.
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
}
