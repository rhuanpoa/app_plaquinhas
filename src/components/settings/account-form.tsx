"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useToast } from "@/components/ui/toast";
import { updateCurrentUser } from "@/lib/repositories/users";
import { hasErrors, validateAccountForm } from "@/lib/validation";
import type { User, UserUpdate } from "@/types";

interface AccountFormProps {
  user: User;
  onSaved: (user: User) => void;
}

export function AccountForm({ user, onSaved }: AccountFormProps) {
  const toast = useToast();
  const [values, setValues] = useState<UserUpdate>({ name: user.name, email: user.email });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const errors = validateAccountForm(values);
  const visibleErrors = submitted ? errors : {};

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors(errors)) return;

    setSaving(true);
    try {
      onSaved(await updateCurrentUser(values));
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
        value={values.name}
        onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
        error={visibleErrors.name}
      />
      <TextField
        label="E-mail"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
        error={visibleErrors.email}
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
