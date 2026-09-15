export function getErrorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente."): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
