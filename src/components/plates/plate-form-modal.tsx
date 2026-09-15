"use client";

import { Modal } from "@/components/ui/modal";
import type { Plate, PlateFormMode } from "@/types";
import { PlateForm } from "./plate-form";

interface PlateFormModalProps {
  /** Placa sendo configurada ou editada. `null` mantém o modal fechado. */
  plate: Plate | null;
  mode: PlateFormMode;
  onClose: () => void;
  onSaved: (plate: Plate) => void;
}

export function PlateFormModal({ plate, mode, onClose, onSaved }: PlateFormModalProps) {
  return (
    <Modal
      open={plate !== null}
      onClose={onClose}
      showCloseButton
      title={mode === "configure" ? "Configurar placa" : "Editar placa"}
      description={plate && <span className="font-mono">{plate.code}</span>}
    >
      {plate && <PlateForm key={plate.id} plate={plate} mode={mode} onCancel={onClose} onSaved={onSaved} />}
    </Modal>
  );
}
