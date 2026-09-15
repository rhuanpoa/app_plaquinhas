import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

interface StatCardProps {
  label: string;
  value?: number;
  detail?: string;
  tone?: "default" | "success";
}

export function StatCard({ label, value, detail, tone = "default" }: StatCardProps) {
  return (
    <Card className="px-[18px] pt-[18px] pb-4">
      <p className="text-[13px] font-medium text-muted">{label}</p>
      {value === undefined ? (
        <Skeleton className="mt-2.5 h-8 w-16" />
      ) : (
        <div className="mt-1.5 flex items-baseline gap-2">
          <p
            className={cn(
              "text-[32px] font-[640] leading-tight tracking-[-0.03em] tabular-nums",
              tone === "success" && "text-success-strong",
            )}
          >
            {formatNumber(value)}
          </p>
          {detail && <p className="text-[12.5px] text-muted">{detail}</p>}
        </div>
      )}
    </Card>
  );
}
