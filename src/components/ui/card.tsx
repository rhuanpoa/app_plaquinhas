import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("rounded-card border border-line bg-surface", className)} {...props} />;
}

interface CardTitleProps {
  title: string;
  description?: string;
}

export function CardTitle({ title, description }: CardTitleProps) {
  return (
    <div>
      <h2 className="text-[15.5px] font-[620] tracking-[-0.015em]">{title}</h2>
      {description && <p className="mt-0.5 text-[13px] text-muted">{description}</p>}
    </div>
  );
}
