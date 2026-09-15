"use client";

import { Download } from "lucide-react";
import { QRCodeImage } from "@/components/shared/qr-code-image";
import { QrUrlText } from "@/components/shared/qr-url-text";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface QrLightboxProps {
  code: string;
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function QrLightbox({ code, open, onClose, onDownload }: QrLightboxProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="dialog"
      showCloseButton
      title={`Placa ${code}`}
      description={<QrUrlText code={code} />}
    >
      <div className="mt-4 flex justify-center rounded-[11px] border border-line-soft bg-white p-4">
        <QRCodeImage code={code} size={380} />
      </div>
      <Button icon={Download} className="mt-4 w-full" onClick={onDownload}>
        Baixar QR Code
      </Button>
    </Modal>
  );
}
