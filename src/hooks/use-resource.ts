"use client";

import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/errors";

interface ResourceState<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
}

interface ReloadOptions {
  showLoading?: boolean;
}

/**
 * Carrega dados assíncronos com estados de loading e erro.
 * `load` precisa ser estável (definida fora do componente ou com useCallback).
 */
export function useResource<T>(load: () => Promise<T>) {
  const [state, setState] = useState<ResourceState<T>>({ data: undefined, loading: true, error: null });

  useEffect(() => {
    let active = true;
    load().then(
      (data) => {
        if (active) setState({ data, loading: false, error: null });
      },
      (error: unknown) => {
        if (active) setState({ data: undefined, loading: false, error: getErrorMessage(error) });
      },
    );
    return () => {
      active = false;
    };
  }, [load]);

  const reload = useCallback(
    async ({ showLoading = false }: ReloadOptions = {}): Promise<T | undefined> => {
      if (showLoading) setState((current) => ({ ...current, loading: true, error: null }));
      try {
        const data = await load();
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        setState((current) => ({ ...current, loading: false, error: getErrorMessage(error) }));
        return undefined;
      }
    },
    [load],
  );

  const setData = useCallback((data: T) => setState({ data, loading: false, error: null }), []);

  return { ...state, reload, setData };
}
