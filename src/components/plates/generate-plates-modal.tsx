"use client";

import { CircleCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TextField } from "@/components/ui/text-field";
import { useToast } from "@/components/ui/toast";
import { DEFAULT_BATCH_SIZE, MAX_BATCH_SIZE } from "@/lib/config";
import { formatNumber, pluralize } from "@/lib/format";
import { createPlates } from "@/lib/repositories/plates";
import { parseBatchQuantity } from "@/lib/validation";
import type { Plate } from "@/types";

interface GeneratePlatesModalProps {
  open: boolean;
  onClose: () => void;
  onGenerated: (created: Plate[]) => Promise<unknown>;
  onViewPlates: (created: Plate[]) => void;
}

function describeQuantity(quantity: number | null): string {
  if (quantity === null) return `Informe uma quantidade entre 1 e ${formatNumber(MAX_BATCH_SIZE)}.`;
  if (quantity === 1) return "Será criada 1 nova placa.";
  return `Serão criadas ${formatNumber(quantity)} novas placas.`;
}

export function GeneratePlatesModal({ open, onClose, onGenerated, onViewPlates }: GeneratePlatesModalProps) {
  const toast = useToast();
  const [quantityInput, setQuantityInput] = useState(String(DEFAULT_BATCH_SIZE));
  const [created, setCreated] = useState<Plate[]>([]);
  const [saving, setSaving] = useState(false);

  const quantity = parseBatchQuantity(quantityInput);
  const done = created.length > 0;

  function reset() {
    setQuantityInput(String(DEFAULT_BATCH_SIZE));
    setCreated([]);
  }

  function handleClose() {
    if (saving) return;
    onClose();
    reset();
  }

  function handleViewPlates() {
    onViewPlates(created);
    reset();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (quantity === null || saving) return;

    setSaving(true);
    try {
      const plates = await createPlates(quantity);
      await onGenerated(plates);
      setCreated(plates);
    } catch {
      toast("Não foi possível gerar as placas. Tente novamente.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={done ? "Placas geradas com sucesso." : "Gerar novas placas"}
      description={
        done
          ? `${pluralize(created.length, "placa adicionada", "placas adicionadas")} ao estoque.`
          : "Escolha quantas placas você deseja adicionar ao estoque."
      }
    >
      {done ? (
        <div className="mt-[18px]">
          <div className="flex items-center gap-3 rounded-control border border-success-line bg-success-bg px-3 py-3 text-sm text-success">
            <CircleCheck className="size-5 shrink-0" aria-hidden />
            <span>
              Códigos <strong className="font-mono font-medium">{created[0].code}</strong> até{" "}
              <strong className="font-mono font-medium">{created[created.length - 1].code}</strong>
            </span>
          </div>
          <Button className="mt-[18px] w-full" onClick={handleViewPlates}>
            Ver placas
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-[18px]">
          <TextField
            label="Quantidade"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_BATCH_SIZE}
            value={quantityInput}
            onChange={(event) => setQuantityInput(event.target.value)}
            className="[&_input]:tabular-nums"
          />
          <p
            aria-live="polite"
            className="mt-2.5 rounded-control border border-line-soft bg-subtle px-3 py-2.5 text-[13.5px] text-muted"
          >
            {describeQuantity(quantity)}
          </p>
          <div className="mt-[18px] flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={handleClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={quantity === null} loading={saving}>
              {saving ? "Gerando..." : "Gerar placas"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
