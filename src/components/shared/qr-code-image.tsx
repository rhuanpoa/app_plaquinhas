"use client";

import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { createQrDataUrl } from "@/lib/qr";

interface QRCodeImageProps {
  code: string;
  /** Tamanho de exibição em pixels. A imagem é gerada em resolução maior para ficar nítida. */
  size: number;
  className?: string;
}

type QrState = { status: "loading" } | { status: "ready"; src: string } | { status: "error" };

export function QRCodeImage({ code, size, className }: QRCodeImageProps) {
  const [state, setState] = useState<QrState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    createQrDataUrl(code, Math.max(512, size * 4)).then(
      (src) => {
        if (active) setState({ status: "ready", src });
      },
      () => {
        if (active) setState({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [code, size]);

  const boxStyle = { width: size, maxWidth: "100%" };

  if (state.status === "loading") {
    return <Skeleton className="aspect-square" style={boxStyle} />;
  }

  if (state.status === "error") {
    return (
      <div
        role="img"
        aria-label="Não foi possível gerar o QR Code"
        style={boxStyle}
        className="flex aspect-square items-center justify-center rounded-md bg-danger-bg text-danger"
      >
        <CircleAlert className="size-5" aria-hidden />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- imagem gerada localmente em data URL
    <img
      src={state.src}
      alt={`QR Code da placa ${code}`}
      width={size}
      height={size}
      style={boxStyle}
      className={cn("block aspect-square h-auto [image-rendering:pixelated]", className)}
    />
  );
}
