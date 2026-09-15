/**
 * Armazenamento dos dados mockados: fica em memória e é salvo no localStorage
 * para sobreviver ao recarregar a página. Será removido ao integrar o Supabase.
 */
const memoryStore = new Map<string, unknown>();

export function readStored<T>(key: string, createDefault: () => T): T {
  if (memoryStore.has(key)) return memoryStore.get(key) as T;

  let value: T | undefined;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) value = JSON.parse(raw) as T;
  } catch {
    // Armazenamento indisponível ou corrompido: usa os dados padrão.
  }

  const resolved = value ?? createDefault();
  writeStored(key, resolved);
  return resolved;
}

export function writeStored<T>(key: string, value: T): void {
  memoryStore.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sem localStorage os dados ficam só em memória.
  }
}

/** Simula o tempo de resposta de uma API para exibir os estados de carregamento. */
export function simulateLatency(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
