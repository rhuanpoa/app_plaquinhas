"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextField } from "@/components/ui/text-field";
import { getErrorMessage } from "@/lib/errors";
import { signIn } from "@/lib/repositories/auth";
import { hasErrors, validateLoginForm } from "@/lib/validation";
import type { LoginFormValues } from "@/types";
import { useAuth } from "./auth-provider";
import { SupabaseNotConfigured } from "./full-screen-state";

/** Aceita só caminhos internos no redirecionamento pós-login. */
function getSafeNextPath(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export function LoginView() {
  const router = useRouter();
  const nextPath = getSafeNextPath(useSearchParams().get("next"));
  const { user, status } = useAuth();

  const [values, setValues] = useState<LoginFormValues>({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "ready" && user) router.replace(nextPath);
  }, [status, user, nextPath, router]);

  const errors = validateLoginForm(values);
  const visibleErrors = submitted ? errors : {};

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setFormError(null);
    if (hasErrors(errors)) return;

    setSubmitting(true);
    try {
      await signIn(values.email, values.password);
      // O redirecionamento acontece quando a sessão é atualizada.
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  if (status === "misconfigured") return <SupabaseNotConfigured />;

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px] animate-fade-up">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card className="p-6">
          <h1 className="text-xl font-[640] tracking-[-0.02em]">Entrar</h1>
          <p className="mt-1 text-sm text-muted">Acesse o painel das suas placas.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-5">
            <TextField
              label="E-mail"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
              error={visibleErrors.email}
            />
            <TextField
              label="Senha"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
              error={visibleErrors.password}
              className="mt-3.5"
            />

            {formError && (
              <p
                role="alert"
                className="mt-3.5 rounded-control border border-danger-line bg-danger-bg px-3 py-2.5 text-[13.5px] text-danger"
              >
                {formError}
              </p>
            )}

            <Button type="submit" className="mt-5 w-full" loading={submitting}>
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
