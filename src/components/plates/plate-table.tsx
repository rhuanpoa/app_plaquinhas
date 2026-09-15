import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/cn";
import { formatRelativeDay } from "@/lib/format";
import type { Plate } from "@/types";

interface PlateTableProps {
  plates: Plate[];
  renderAction: (plate: Plate) => ReactNode;
  actionHeader?: string;
}

const HEADER_CELL = "px-[18px] py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted";
const BODY_CELL = "px-[18px] py-[13px]";

/** Tabela no desktop; no celular vira uma lista de cartões. */
export function PlateTable({ plates, renderAction, actionHeader = "Ações" }: PlateTableProps) {
  return (
    <>
      <table className="hidden w-full border-collapse lg:table">
        <thead>
          <tr className="bg-table-head text-left">
            <th scope="col" className={HEADER_CELL}>Código</th>
            <th scope="col" className={HEADER_CELL}>Cliente</th>
            <th scope="col" className={HEADER_CELL}>Status</th>
            <th scope="col" className={HEADER_CELL}>Atualizado em</th>
            <th scope="col" className={cn(HEADER_CELL, "text-right")}>{actionHeader}</th>
          </tr>
        </thead>
        <tbody>
          {plates.map((plate) => (
            <tr key={plate.id} className="border-t border-line-soft">
              <td className={cn(BODY_CELL, "font-mono text-[13.5px] font-medium")}>{plate.code}</td>
              <td className={cn(BODY_CELL, "text-sm", !plate.clientName && "text-muted")}>{plate.clientName ?? "—"}</td>
              <td className={BODY_CELL}>
                <StatusBadge status={plate.status} />
              </td>
              <td className={cn(BODY_CELL, "text-[13.5px] text-muted")}>{formatRelativeDay(plate.updatedAt)}</td>
              <td className={cn(BODY_CELL, "text-right")}>{renderAction(plate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-line-soft lg:hidden">
        {plates.map((plate) => (
          <li key={plate.id} className="flex items-center gap-3 px-4 py-[13px]">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] text-muted">{plate.code}</span>
                <StatusBadge status={plate.status} />
              </div>
              <p className={cn("mt-[3px] truncate text-[14.5px] font-[550]", !plate.clientName && "text-muted")}>
                {plate.clientName ?? "Sem cliente"}
              </p>
              <p className="mt-px text-[12.5px] text-muted">{formatRelativeDay(plate.updatedAt)}</p>
            </div>
            {renderAction(plate)}
          </li>
        ))}
      </ul>
    </>
  );
}
