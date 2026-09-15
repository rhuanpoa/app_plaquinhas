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
  if (plate.status === "available" && onConfigure) {
    return (
      <Button size="sm" onClick={() => onConfigure(plate)} aria-label={`Configurar placa ${plate.code}`}>
        Configurar
      </Button>
    );
  }

  return (
    <Link
      href={getPlateDetailHref(plate.id)}
      aria-label={`Ver placa ${plate.code}`}
      className={buttonClasses({ variant: "secondary", size: "sm" })}
    >
      Ver
    </Link>
  );
}
