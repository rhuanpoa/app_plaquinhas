"use client";

import { createContext, use, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { TOAST_DURATION_MS } from "@/lib/config";
import { cn } from "@/lib/cn";

type ToastKind = "success" | "error" | "info";

type ShowToast = (message: string, kind?: ToastKind) => void;

interface ToastMessage {
  id: number;
  message: string;
  kind: ToastKind;
}

const DOT_CLASSES: Record<ToastKind, string> = {
  success: "bg-toast-success",
  error: "bg-toast-error",
  info: "bg-toast-info",
};

const ToastContext = createContext<ShowToast | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback<ShowToast>((message, kind = "success") => {
    clearTimeout(timerRef.current);
    setToast({ id: Date.now(), message, kind });
    timerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <ToastContext value={showToast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(84px+env(safe-area-inset-bottom))] z-[90] flex justify-center px-4 lg:bottom-8"
      >
        {toast && (
          <div
            key={toast.id}
            className="flex max-w-full animate-fade-up items-center gap-2.5 rounded-[11px] bg-toast px-4 py-[11px] text-[13.5px] font-medium text-white shadow-toast"
          >
            <span className={cn("size-[7px] shrink-0 rounded-full", DOT_CLASSES[toast.kind])} aria-hidden />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext>
  );
}

export function useToast(): ShowToast {
  const showToast = use(ToastContext);
  if (!showToast) throw new Error("useToast precisa estar dentro de ToastProvider.");
  return showToast;
}
