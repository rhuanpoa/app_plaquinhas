import { QrCode } from "lucide-react";
import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/cn";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex items-center justify-center bg-accent text-white",
          compact ? "size-[26px] rounded-[7px]" : "size-7 rounded-lg",
        )}
      >
        <QrCode className={compact ? "size-3.5" : "size-[15px]"} strokeWidth={2.2} aria-hidden />
      </span>
      <span className="text-base font-[650] tracking-[-0.02em] text-ink">{APP_NAME}</span>
    </span>
  );
}
