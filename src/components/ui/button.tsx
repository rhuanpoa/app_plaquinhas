import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "danger-outline" | "danger-ghost";
type ButtonSize = "sm" | "md";

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-[7px] whitespace-nowrap font-semibold transition-colors disabled:cursor-not-allowed";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white shadow-button hover:bg-accent-hover disabled:bg-disabled disabled:shadow-none",
  secondary:
    "border border-line bg-surface text-ink hover:border-accent hover:text-accent disabled:opacity-60 disabled:hover:border-line disabled:hover:text-ink",
  danger: "bg-danger-strong text-white hover:bg-danger-hover disabled:opacity-60",
  "danger-outline": "border border-danger-line bg-surface text-danger hover:bg-danger-bg disabled:opacity-60",
  "danger-ghost": "font-medium text-danger hover:bg-danger-bg disabled:opacity-60",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-10 rounded-lg px-3 text-[13px] lg:min-h-8",
  md: "min-h-11 rounded-control px-4 text-sm lg:min-h-10",
};

/** Classes de botão, também usadas em links que se parecem com botões. */
export function buttonClasses({ variant = "primary", size = "md", className }: ButtonStyleOptions = {}): string {
  return cn(BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  icon?: LucideIcon;
  loading?: boolean;
}

export function Button({
  variant,
  size,
  className,
  icon: Icon,
  loading = false,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {loading ? (
        <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />
      ) : (
        Icon && <Icon className="size-4 shrink-0" aria-hidden />
      )}
      {children}
    </button>
  );
}
