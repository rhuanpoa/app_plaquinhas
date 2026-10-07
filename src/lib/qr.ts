import QRCode from "qrcode";
import { QR_DOMAIN } from "@/lib/config";
import { createZip, type ZipEntry } from "@/lib/zip";

export type QrFormat = "png" | "svg";

/** Largura do PNG gerado para impressão. */
const PRINT_WIDTH = 2048;

const QR_OPTIONS = {
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: "#000000", light: "#ffffff" },
} as const;

/** URL permanente da placa. Nunca depende do link de destino. */
export function getPlateQrUrl(code: string): string {
  return `https://${QR_DOMAIN}/q/${code}`;
}

export function createQrDataUrl(code: string, width: number): Promise<string> {
  return QRCode.toDataURL(getPlateQrUrl(code), { ...QR_OPTIONS, width });
}

/** QR Code em vetor, formato preferido por gráficas. */
export function createQrSvg(code: string): Promise<string> {
  return QRCode.toString(getPlateQrUrl(code), { ...QR_OPTIONS, type: "svg", width: 1024 });
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const binary = atob(dataUrl.slice(dataUrl.indexOf(",") + 1));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function createQrFile(code: string, format: QrFormat): Promise<ZipEntry> {
  const data =
    format === "png"
      ? dataUrlToBytes(await createQrDataUrl(code, PRINT_WIDTH))
      : new TextEncoder().encode(await createQrSvg(code));
  return { name: `${code}.${format}`, data };
}

/** Baixa o QR Code de uma placa, em PNG ou SVG. */
export async function downloadQrCode(code: string, format: QrFormat): Promise<void> {
  const file = await createQrFile(code, format);
  const type = format === "png" ? "image/png" : "image/svg+xml";
  downloadBlob(new Blob([new Uint8Array(file.data)], { type }), file.name);
}

/** Baixa um .zip com os QR Codes de várias placas. */
export async function downloadQrCodesZip(
  codes: string[],
  format: QrFormat,
  onProgress?: (done: number) => void,
): Promise<void> {
  const entries: ZipEntry[] = [];
  for (const code of codes) {
    entries.push(await createQrFile(code, format));
    onProgress?.(entries.length);
  }

  const name = codes.length === 1 ? `${codes[0]}.zip` : `qrcodes-${codes[0]}-${codes[codes.length - 1]}.zip`;
  downloadBlob(createZip(entries), name);
}
