"use client";

import { Download } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useToast } from "@/components/ui/toast";
import { pluralize } from "@/lib/format";
import { downloadQrCodesZip, type QrFormat } from "@/lib/qr";
import type { Plate, SelectOption } from "@/types";

const FORMAT_OPTIONS: SelectOption<QrFormat>[] = [
  { value: "png", label: "PNG (imagem)" },
  { value: "svg", label: "SVG (vetor)" },
];

interface DownloadQrCodesModalProps {
  open: boolean;
  onClose: () => void;
  /** Placas da lista atual, já com pesquisa e filtro aplicados. */
  plates: Plate[];
}

export function DownloadQrCodesModal({ open, onClose, plates }: DownloadQrCodesModalProps) {
  const toast = useToast();
  const formatLabelId = useId();
  const [format, setFormat] = useState<QrFormat>("png");
  const [done, setDone] = useState(0);
  const [generating, setGenerating] = useState(false);

  function handleClose() {
    if (generating) return;
    onClose();
    setDone(0);
  }

  async function handleDownload() {
    setGenerating(true);
    setDone(0);
    try {
      await downloadQrCodesZip(
        plates.map((plate) => plate.code),
        format,
        setDone,
      );
      toast("Download iniciado.");
      handleClose();
    } catch {
      toast("Não foi possível gerar os QR Codes.", "error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Baixar QR Codes"
      description={`${pluralize(plates.length, "placa", "placas")} da lista atual, em um arquivo .zip.`}
    >
      <div className="mt-[18px]">
        <p id={formatLabelId} className="mb-1.5 text-[13px] font-medium">
          Formato
        </p>
        <SegmentedControl
          options={FORMAT_OPTIONS}
          value={format}
          onChange={setFormat}
          ariaLabelledBy={formatLabelId}
        />
        <p className="mt-2.5 rounded-control border border-line-soft bg-subtle px-3 py-2.5 text-[13.5px] text-muted">
          {format === "png"
            ? "Imagem pronta para imprimir, com 2048 pixels."
            : "Arquivo vetorial, que não perde qualidade em nenhum tamanho. Algumas gráficas preferem."}
        </p>

        {generating && (
          <p aria-live="polite" className="mt-2.5 text-[13px] text-muted tabular-nums">
            Gerando {done} de {plates.length}...
          </p>
        )}

        <div className="mt-[18px] flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={handleClose} disabled={generating}>
            Cancelar
          </Button>
          <Button icon={Download} className="flex-1" onClick={handleDownload} loading={generating}>
            {generating ? "Gerando..." : "Baixar .zip"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
