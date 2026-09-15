/**
 * Login com e-mail e senha pelo Supabase Auth. Nenhum e-mail é enviado:
 * a confirmação de e-mail e o cadastro público estão desligados no projeto.
 */
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import type { User } from "@/types";

function toAppUser(user: SupabaseUser): User {
  const email = user.email ?? "";
  const metadataName: unknown = user.user_metadata?.name;
  const name = typeof metadataName === "string" && metadataName.trim() ? metadataName : email.split("@")[0];
  return { id: user.id, name, email };
}

/** Avisa sempre que o usuário logado muda, começando pelo estado atual. Retorna a função para parar de ouvir. */
export function onUserChange(callback: (user: User | null) => void): () => void {
  const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
    callback(session ? toAppUser(session.user) : null);
  });
  return () => data.subscription.unsubscribe();
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await getSupabase().auth.signInWithPassword({ email: email.trim(), password });
  if (!error) return;
  throw new Error(
    error.code === "invalid_credentials" ? "E-mail ou senha incorretos." : "Não foi possível entrar. Tente novamente.",
  );
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw new Error("Não foi possível sair. Tente novamente.");
}

export async function updateProfileName(name: string): Promise<User> {
  const { data, error } = await getSupabase().auth.updateUser({ data: { name: name.trim() } });
  if (error || !data.user) throw new Error("Não foi possível salvar. Tente novamente.");
  return toAppUser(data.user);
}
