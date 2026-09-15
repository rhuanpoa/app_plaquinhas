import { SegmentedControl } from "@/components/ui/segmented-control";
import { STATUS_FILTER_OPTIONS } from "@/lib/plates";
import type { StatusFilterValue } from "@/types";

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <SegmentedControl
      options={STATUS_FILTER_OPTIONS}
      value={value}
      onChange={onChange}
      ariaLabel="Filtrar por status"
      className="w-full sm:w-auto"
    />
  );
}
