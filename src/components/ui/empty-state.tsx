import { CircleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({ icon: Icon, title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={cn("px-6 text-center", compact ? "py-10" : "py-14")}>
      <div className="mx-auto mb-3.5 flex size-[46px] items-center justify-center rounded-xl bg-neutral-bg text-muted">
        <Icon className="size-[21px]" strokeWidth={1.8} aria-hidden />
      </div>
      <p className="text-base font-[620] tracking-[-0.015em]">{title}</p>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <EmptyState
      icon={CircleAlert}
      title="Não foi possível carregar"
      description={message}
      action={
        <Button variant="secondary" onClick={onRetry}>
          Tentar novamente
        </Button>
      }
    />
  );
}
