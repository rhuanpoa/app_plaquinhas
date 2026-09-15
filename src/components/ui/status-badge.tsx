import { cn } from "@/lib/cn";
import { PLATE_STATUS_LABEL } from "@/lib/plates";
import type { PlateStatus } from "@/types";

const STATUS_CLASSES: Record<PlateStatus, string> = {
  active: "border-success-line bg-success-bg text-success",
  disabled: "border-danger-line bg-danger-bg text-danger",
  available: "border-neutral-line bg-neutral-bg text-neutral",
};

export function StatusBadge({ status }: { status: PlateStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-[9px] py-[3px] text-[11.5px] font-semibold tracking-[0.01em]",
        STATUS_CLASSES[status],
      )}
    >
      {PLATE_STATUS_LABEL[status]}
    </span>
  );
}
