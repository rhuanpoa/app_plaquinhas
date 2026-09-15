import { getPlateQrUrl } from "@/lib/qr";

/** URL do QR Code que, em telas estreitas, quebra antes do código em vez de no meio dele. */
export function QrUrlText({ code }: { code: string }) {
  const url = getPlateQrUrl(code);
  const base = url.slice(0, url.length - code.length);

  return (
    <span className="font-mono [overflow-wrap:anywhere]">
      {base}
      <wbr />
      <span className="whitespace-nowrap">{code}</span>
    </span>
  );
}
