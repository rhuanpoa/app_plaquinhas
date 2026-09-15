import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { DescriptionItem, DescriptionList } from "@/components/ui/description-list";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatNumber } from "@/lib/format";
import type { Plate } from "@/types";

interface PlateInfoCardProps {
  plate: Plate;
  actions?: ReactNode;
}

export function PlateInfoCard({ plate, actions }: PlateInfoCardProps) {
  return (
    <Card className="p-[18px]">
      <h2 className="text-[15px] font-[620] tracking-[-0.015em]">Informações da placa</h2>

      <DescriptionList className="mt-3.5">
        <DescriptionItem label="Código" mono>
          {plate.code}
        </DescriptionItem>
        <DescriptionItem label="Cliente">{plate.clientName ?? "Não configurada"}</DescriptionItem>
        <DescriptionItem label="Destino" mono>
          {plate.destinationUrl ? (
            <a
              href={plate.destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {plate.destinationUrl}
            </a>
          ) : (
            "—"
          )}
        </DescriptionItem>
        <DescriptionItem label="Status">
          <StatusBadge status={plate.status} />
        </DescriptionItem>
        <DescriptionItem label="Scans">{formatNumber(plate.scans)}</DescriptionItem>
        <DescriptionItem label="Criada em">{formatDate(plate.createdAt)}</DescriptionItem>
        <DescriptionItem label="Atualizada em">{formatDate(plate.updatedAt)}</DescriptionItem>
      </DescriptionList>

      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}
