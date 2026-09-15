"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useToast } from "@/components/ui/toast";
import { updateProfileName } from "@/lib/repositories/auth";
import { hasErrors, validateProfileForm } from "@/lib/validation";
import type { User } from "@/types";

export function AccountForm({ user }: { user: User }) {
  const toast = useToast();
  const { setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const errors = validateProfileForm({ name });
  const visibleErrors = submitted ? errors : {};

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors(errors)) return;

    setSaving(true);
    try {
      setUser(await updateProfileName(name));
      toast("Alterações salvas.");
    } catch {
      toast("Não foi possível salvar. Tente novamente.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4">
      <TextField
        label="Nome"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={visibleErrors.name}
      />
      {/* Trocar o e-mail pelo Supabase dispara e-mail de confirmação, então fica só leitura. */}
      <TextField
        label="E-mail"
        type="email"
        value={user.email}
        readOnly
        hint="O e-mail de acesso não pode ser alterado pelo painel."
        className="mt-3.5"
      />
      <div className="mt-4 flex justify-end">
        <Button type="submit" loading={saving} className="w-full sm:w-auto">
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
