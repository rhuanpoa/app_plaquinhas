import QRCode from "qrcode";
import { QR_DOMAIN } from "@/lib/config";

/** URL permanente da placa. Nunca depende do link de destino. */
export function getPlateQrUrl(code: string): string {
  return `https://${QR_DOMAIN}/q/${code}`;
}

export function createQrDataUrl(code: string, width: number): Promise<string> {
  return QRCode.toDataURL(getPlateQrUrl(code), {
    errorCorrectionLevel: "M",
    margin: 2,
    width,
    color: { dark: "#000000", light: "#ffffff" },
  });
}

/** Baixa o QR Code em PNG de alta resolução, adequado para impressão. */
export async function downloadQrPng(code: string): Promise<void> {
  const dataUrl = await createQrDataUrl(code, 2048);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${code}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
