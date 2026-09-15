import { MAX_BATCH_SIZE } from "@/lib/config";
import type { FormErrors, LoginFormValues, PlateFormValues, UserUpdate } from "@/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function validatePlateForm(values: PlateFormValues): FormErrors<PlateFormValues> {
  const errors: FormErrors<PlateFormValues> = {};
  const url = values.destinationUrl.trim();

  if (!values.clientName.trim()) errors.clientName = "Informe o nome da empresa.";
  if (!url) errors.destinationUrl = "Informe o link de avaliação.";
  else if (!isValidUrl(url)) errors.destinationUrl = "Use um endereço válido, começando com https://";

  return errors;
}

export function validateProfileForm(values: UserUpdate): FormErrors<UserUpdate> {
  const errors: FormErrors<UserUpdate> = {};
  if (!values.name.trim()) errors.name = "Informe seu nome.";
  return errors;
}

export function validateLoginForm(values: LoginFormValues): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {};
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Informe um e-mail válido.";
  if (!values.password) errors.password = "Informe sua senha.";
  return errors;
}

/** Retorna a quantidade válida para geração em lote, ou null se estiver fora do limite. */
export function parseBatchQuantity(raw: string): number | null {
  const quantity = Number(raw);
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_BATCH_SIZE ? quantity : null;
}

export function hasErrors<T>(errors: FormErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
