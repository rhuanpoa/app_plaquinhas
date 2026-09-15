import Link from "next/link";
import { Button, buttonClasses } from "@/components/ui/button";
import { getPlateDetailHref } from "@/lib/plates";
import type { Plate } from "@/types";

interface PlateActionProps {
  plate: Plate;
  /** Quando informado, placas disponíveis mostram "Configurar" em vez de "Ver". */
  onConfigure?: (plate: Plate) => void;
}

export function PlateAction({ plate, onConfigure }: PlateActionProps) {
  const viewLink = (
    <Link
      href={getPlateDetailHref(plate.id)}
      aria-label={`Ver placa ${plate.code}`}
      className={buttonClasses({ variant: "secondary", size: "sm" })}
    >
      Ver
    </Link>
  );

  if (plate.status !== "available" || !onConfigure) return viewLink;

  // Placa disponível: "Ver" dá acesso ao QR Code para baixar e imprimir antes de configurar.
  return (
    <div className="flex shrink-0 items-center justify-end gap-2">
      {viewLink}
      <Button size="sm" onClick={() => onConfigure(plate)} aria-label={`Configurar placa ${plate.code}`}>
        Configurar
      </Button>
    </div>
  );
}
