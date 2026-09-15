import { Copy, Download, Maximize2 } from "lucide-react";
import { QRCodeImage } from "@/components/shared/qr-code-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPlateQrUrl } from "@/lib/qr";

interface PlateQrCardProps {
  code: string;
  onCopy: () => void;
  onDownload: () => void;
  onExpand: () => void;
}

export function PlateQrCard({ code, onCopy, onDownload, onExpand }: PlateQrCardProps) {
  return (
    <Card className="p-[18px]">
      <h2 className="mb-3.5 text-[15px] font-[620] tracking-[-0.015em]">QR Code</h2>

      <button
        type="button"
        onClick={onExpand}
        aria-label={`Ampliar QR Code da placa ${code}`}
        className="group relative flex w-full justify-center rounded-[11px] border border-line-soft bg-white p-4"
      >
        <QRCodeImage code={code} size={220} />
        <span
          aria-hidden
          className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-lg border border-line bg-surface text-muted group-hover:text-accent"
        >
          <Maximize2 className="size-4" />
        </span>
      </button>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.05em] text-muted">URL do QR Code</p>
      <p className="mt-1.5 break-all rounded-control border border-line-soft bg-subtle px-3 py-2.5 font-mono text-[12.5px]">
        {getPlateQrUrl(code)}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" icon={Copy} className="flex-[1_1_130px]" onClick={onCopy}>
          Copiar URL
        </Button>
        <Button variant="secondary" icon={Download} className="flex-[1_1_130px]" onClick={onDownload}>
          Baixar QR Code
        </Button>
      </div>
    </Card>
  );
}
