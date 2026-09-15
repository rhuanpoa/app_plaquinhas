import { cn } from "@/lib/cn";
import type { SelectOption } from "@/types";

interface SegmentedControlProps<T extends string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  ariaLabelledBy,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn("flex gap-1 rounded-control border border-line bg-track p-[3px]", className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-9 flex-1 whitespace-nowrap rounded-[7px] px-2.5 text-[13px] transition-colors sm:px-3 lg:min-h-8",
              selected ? "bg-surface font-semibold text-ink shadow-segment" : "font-medium text-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
