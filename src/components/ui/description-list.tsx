import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function DescriptionList({ children, className }: { children: ReactNode; className?: string }) {
  return <dl className={cn("border-b border-line-soft", className)}>{children}</dl>;
}

interface DescriptionItemProps {
  label: string;
  children: ReactNode;
  mono?: boolean;
}

export function DescriptionItem({ label, children, mono = false }: DescriptionItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-line-soft py-[11px]">
      <dt className="shrink-0 text-[13.5px] text-muted">{label}</dt>
      <dd
        className={cn(
          "min-w-0 text-right",
          mono ? "break-all font-mono text-[12.5px]" : "break-words text-sm font-[560]",
        )}
      >
        {children}
      </dd>
    </div>
  );
}
