export function FullScreenLoader() {
  return (
    <div role="status" aria-label="Carregando" className="flex min-h-dvh items-center justify-center">
      <span className="size-6 animate-spin rounded-full border-2 border-accent border-r-transparent" aria-hidden />
    </div>
  );
}

export function SupabaseNotConfigured() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-sm text-center">
        <p className="text-base font-[620]">Supabase não configurado</p>
        <p className="mt-1 text-sm text-muted">
          Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY e gere o site novamente.
        </p>
      </div>
    </div>
  );
}
