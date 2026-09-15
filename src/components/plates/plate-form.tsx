"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { QRCodeImage } from "@/components/shared/qr-code-image";
import { QrUrlText } from "@/components/shared/qr-url-text";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextField } from "@/components/ui/text-field";
import { useToast } from "@/components/ui/toast";
import { PLATE_STATUS_LABEL } from "@/lib/plates";
import { updatePlate } from "@/lib/repositories/plates";
import { hasErrors, validatePlateForm } from "@/lib/validation";
import type { Plate, PlateFormMode, PlateFormValues, PlateStatus, SelectOption } from "@/types";

type EditableStatus = Exclude<PlateStatus, "available">;

const EDITABLE_STATUS_OPTIONS: SelectOption<EditableStatus>[] = [
  { value: "active", label: PLATE_STATUS_LABEL.active },
  { value: "disabled", label: PLATE_STATUS_LABEL.disabled },
];

interface PlateFormProps {
  plate: Plate;
  mode: PlateFormMode;
  onCancel: () => void;
  onSaved: (plate: Plate) => void;
}

export function PlateForm({ plate, mode, onCancel, onSaved }: PlateFormProps) {
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const statusLabelId = useId();
  const [values, setValues] = useState<PlateFormValues>({
    clientName: plate.clientName ?? "",
    destinationUrl: plate.destinationUrl ?? "",
  });
  const [status, setStatus] = useState<EditableStatus>(plate.status === "disabled" ? "disabled" : "active");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const errors = validatePlateForm(values);
  const visibleErrors = submitted ? errors : {};

  function handleChange(field: keyof PlateFormValues) {
    return (event: ChangeEvent<HTMLInputElement>) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (hasErrors(errors)) {
      const firstInvalid = Object.keys(errors)[0];
      const field = formRef.current?.elements.namedItem(firstInvalid);
      if (field instanceof HTMLInputElement) field.focus();
      return;
    }

    setSaving(true);
    try {
      const updated = await updatePlate(plate.id, {
        clientName: values.clientName.trim(),
        destinationUrl: values.destinationUrl.trim(),
        status: mode === "configure" ? "active" : status,
      });
      onSaved(updated);
    } catch {
      toast("Não foi possível salvar. Tente novamente.", "error");
      setSaving(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="my-4 flex items-center gap-3.5 rounded-[11px] border border-line-soft bg-subtle p-3">
        <QRCodeImage code={plate.code} size={78} className="rounded-md bg-white" />
        <div className="min-w-0">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-muted">URL do QR Code</p>
          <p className="mt-[3px] text-xs">
            <QrUrlText code={plate.code} />
          </p>
        </div>
      </div>

      <TextField
        label="Nome da empresa"
        name="clientName"
        placeholder="Ex: Barbearia João"
        autoComplete="organization"
        value={values.clientName}
        onChange={handleChange("clientName")}
        error={visibleErrors.clientName}
      />

      <TextField
        label="Link de avaliação do Google"
        name="destinationUrl"
        type="url"
        inputMode="url"
        autoComplete="url"
        placeholder="https://g.page/r/..."
        value={values.destinationUrl}
        onChange={handleChange("destinationUrl")}
        error={visibleErrors.destinationUrl}
        hint="Esse é o endereço para onde o usuário será direcionado ao escanear o QR Code."
        className="mt-4"
      />

      {mode === "edit" && (
        <div className="mt-4">
          <p id={statusLabelId} className="mb-1.5 text-[13px] font-medium">
            Status
          </p>
          <SegmentedControl
            options={EDITABLE_STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
            ariaLabelledBy={statusLabelId}
          />
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" loading={saving}>
          {saving ? "Salvando..." : mode === "configure" ? "Salvar configuração" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
