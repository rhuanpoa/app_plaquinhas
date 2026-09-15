"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ModalVariant = "sheet" | "dialog";
type ModalSize = "sm" | "md";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** "sheet" sobe da parte de baixo no celular; "dialog" fica sempre centralizado. */
  variant?: ModalVariant;
  size?: ModalSize;
  showCloseButton?: boolean;
}

const VARIANT_CLASSES: Record<ModalVariant, string> = {
  sheet: "mb-0 mt-auto w-full rounded-t-2xl pb-[env(safe-area-inset-bottom)] lg:mb-auto lg:w-[calc(100%-36px)] lg:rounded-2xl lg:pb-0",
  dialog: "w-[calc(100%-36px)] rounded-[14px]",
};

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[460px]",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  variant = "sheet",
  size = "md",
  showCloseButton = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-auto max-h-[92dvh] overflow-y-auto bg-surface p-0 text-ink shadow-overlay backdrop:bg-overlay backdrop:backdrop-blur-[2px]",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
      )}
    >
      {open && (
        <div className="animate-fade-up p-[22px]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-[640] tracking-[-0.02em]">
                {title}
              </h2>
              {description && (
                <div id={descriptionId} className="mt-1.5 text-[13.5px] text-muted">
                  {description}
                </div>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="-mr-2 -mt-2 flex size-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-hover hover:text-ink"
              >
                <X className="size-[18px]" aria-hidden />
              </button>
            )}
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
