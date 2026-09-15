import { ChevronLeft, ChevronRight } from "lucide-react";
import { pluralize } from "@/lib/format";

interface PaginationProps {
  page: number;
  pageCount: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const PAGE_BUTTON =
  "flex size-10 items-center justify-center rounded-lg border border-line bg-surface text-ink hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line disabled:hover:text-ink lg:size-[30px]";

export function Pagination({ page, pageCount, totalItems, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft px-4 py-3">
      <p className="text-[13px] text-muted">
        {pluralize(totalItems, "placa", "placas")} · página {page} de {pageCount}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className={PAGE_BUTTON}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-[15px]" aria-hidden />
        </button>
        <span className="px-1 text-[13px] text-muted tabular-nums" aria-hidden>
          {page} / {pageCount}
        </span>
        <button
          type="button"
          className={PAGE_BUTTON}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Próxima página"
        >
          <ChevronRight className="size-[15px]" aria-hidden />
        </button>
      </div>
    </div>
  );
}
