import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3.5">
      <div className="min-w-0">
        <h1 className="text-[clamp(22px,3vw,27px)] font-[660] leading-tight tracking-[-0.025em]">{title}</h1>
        {subtitle && <p className="mt-1 text-[14.5px] text-muted">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
