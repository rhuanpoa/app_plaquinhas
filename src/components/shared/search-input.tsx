import { Search } from "lucide-react";
import { inputClasses } from "@/components/ui/text-field";
import { cn } from "@/lib/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  className?: string;
}

export function SearchInput({ value, onChange, label, placeholder, className }: SearchInputProps) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        placeholder={placeholder}
        className={cn(inputClasses(), "pl-9")}
      />
    </div>
  );
}
