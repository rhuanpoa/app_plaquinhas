"use client";

import { ChevronLeft, Pencil, Power, QrCode, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useResource } from "@/hooks/use-resource";
import { copyText } from "@/lib/clipboard";
import { downloadQrCode, getPlateQrUrl, type QrFormat } from "@/lib/qr";
import { deletePlate, getPlateById, updatePlate } from "@/lib/repositories/plates";
import type { Plate, PlateFormMode, PlateStatus } from "@/types";
import { PlateDetailSkeleton } from "./plate-detail-skeleton";
import { PlateFormModal } from "./plate-form-modal";
import { PlateInfoCard } from "./plate-info-card";
import { PlateQrCard } from "./plate-qr-card";
import { QrLightbox } from "./qr-lightbox";

export function PlateDetailView() {
  const plateId = useSearchParams().get("id");
  const router = useRouter();
  const toast = useToast();
  const loadPlate = useCallback(() => (plateId ? getPlateById(plateId) : Promise.resolve(null)), [plateId]);
  const { data: plate, loading, error, reload, setData } = useResource(loadPlate);

  const [formMode, setFormMode] = useState<PlateFormMode | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading) return <PlateDetailSkeleton />;
  if (error) return <ErrorState message={error} onRetry={() => reload({ showLoading: true })} />;
  if (!plate) {
    return (
      <EmptyState
        icon={QrCode}
        title="Placa não encontrada"
        description="Ela pode ter sido removida ou o endereço está incorreto."
        action={
          <Link href="/plates" className={buttonClasses()}>
            Ver placas
          </Link>
        }
      />
    );
  }

  const handleCopy = async () => {
    try {
      await copyText(getPlateQrUrl(plate.code));
      toast("URL do QR Code copiada!");
    } catch {
      toast("Não foi possível copiar a URL.", "error");
    }
  };

  const handleDownload = async (format: QrFormat) => {
    try {
      await downloadQrCode(plate.code, format);
      toast(`Download do QR Code em ${format.toUpperCase()} iniciado.`);
    } catch {
      toast("Não foi possível baixar o QR Code.", "error");
    }
  };

  const changeStatus = async (status: PlateStatus, successMessage: string) => {
    setStatusSaving(true);
    try {
      setData(await updatePlate(plate.id, { status }));
      setConfirmOpen(false);
      toast(successMessage);
    } catch {
      toast("Não foi possível atualizar a placa.", "error");
    } finally {
      setStatusSaving(false);
    }
  };

  const handleSaved = (updated: Plate) => {
    toast(formMode === "configure" ? "Placa configurada com sucesso." : "Alterações salvas.");
    setFormMode(null);
    setData(updated);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePlate(plate.id);
      toast(`Placa ${plate.code} excluída.`);
      router.replace("/plates");
    } catch {
      toast("Não foi possível excluir a placa.", "error");
      setDeleting(false);
    }
  };

  const isAvailable = plate.status === "available";

  return (
    <div className="animate-fade-up">
      <Link
        href="/plates"
        className="mb-3.5 inline-flex items-center gap-1.5 rounded-md text-[13.5px] text-muted hover:text-ink"
      >
        <ChevronLeft className="size-[15px]" aria-hidden />
        Placas
      </Link>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[clamp(21px,3vw,26px)] font-[660] leading-tight tracking-[-0.025em]">Placa {plate.code}</h1>
        <StatusBadge status={plate.status} />
        {isAvailable && (
          <Button className="w-full sm:ml-auto sm:w-auto" onClick={() => setFormMode("configure")}>
            Configurar placa
          </Button>
        )}
      </div>

      <div className="grid items-start gap-3.5 md:grid-cols-2">
        <PlateQrCard
          code={plate.code}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onExpand={() => setLightboxOpen(true)}
        />
        <PlateInfoCard
          plate={plate}
          actions={
            <>
              {!isAvailable && (
                <>
                  <Button icon={Pencil} className="flex-[1_1_120px]" onClick={() => setFormMode("edit")}>
                    Editar
                  </Button>
                  {plate.status === "disabled" ? (
                    <Button
                      variant="secondary"
                      icon={Power}
                      className="flex-[1_1_150px]"
                      loading={statusSaving}
                      onClick={() => changeStatus("active", "Placa reativada.")}
                    >
                      Reativar placa
                    </Button>
                  ) : (
                    <Button
                      variant="danger-outline"
                      icon={Power}
                      className="flex-[1_1_150px]"
                      onClick={() => setConfirmOpen(true)}
                    >
                      Desativar placa
                    </Button>
                  )}
                </>
              )}
              <Button variant="danger-ghost" icon={Trash} className="w-full" onClick={() => setDeleteOpen(true)}>
                Excluir placa
              </Button>
            </>
          }
        />
      </div>

      <PlateFormModal
        plate={formMode ? plate : null}
        mode={formMode ?? "edit"}
        onClose={() => setFormMode(null)}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Desativar esta placa?"
        description="Essa placa deixará de redirecionar para o link configurado. Você poderá ativá-la novamente depois."
        confirmLabel="Desativar"
        loading={statusSaving}
        onConfirm={() => changeStatus("disabled", "Placa desativada.")}
        onClose={() => setConfirmOpen(false)}
      />
      <ConfirmDialog
        open={deleteOpen}
        title="Excluir esta placa?"
        description={`A placa ${plate.code} será removida e o QR Code impresso deixará de funcionar. O código não será reutilizado. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
      <QrLightbox
        code={plate.code}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onDownload={() => handleDownload("png")}
      />
    </div>
  );
}
