import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function inputClasses(hasError = false): string {
  return cn(
    "w-full rounded-control border bg-surface px-3 py-2.5 text-base text-ink outline-none transition-shadow placeholder:text-muted focus:border-accent focus:shadow-focus focus-visible:outline-none read-only:bg-subtle read-only:text-muted lg:text-sm",
    hasError ? "border-danger-field" : "border-line",
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, id, className, ...props }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-medium">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={inputClasses(Boolean(error))}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-[12.5px] text-danger-strong">
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="mt-[7px] text-[12.5px] text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
