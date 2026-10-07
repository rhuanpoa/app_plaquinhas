/**
 * Converte o endereço de uma empresa no Google Maps no link direto de avaliação.
 *
 * A URL do Maps traz o identificador do lugar em dois números hexadecimais:
 *   .../data=!4m8!3m7!1s0x94eb46b53639c7cb:0x358db37ec4bda88f!8m2!...
 *
 * O Google usa esse par, em outro formato (Place ID), no formulário de avaliação:
 *   https://search.google.com/local/writereview?placeid=ChIJy8c5NrVG65QRj6i9xH6zjTU
 */

export const GOOGLE_REVIEW_BASE = "https://search.google.com/local/writereview?placeid=";

const MAPS_PLACE_PATTERN = /!1s(0x[0-9a-f]{1,16}):(0x[0-9a-f]{1,16})/i;
const HEX_PAIR_PATTERN = /^(0x[0-9a-f]{1,16}):(0x[0-9a-f]{1,16})$/i;

export interface ReviewUrlResult {
  /** Link que será salvo na placa. */
  url: string;
  /** true quando veio de uma URL do Google Maps e foi convertido. */
  convertedFromMaps: boolean;
}

/** Os 8 bytes do número hexadecimal, em ordem invertida (little-endian). */
function toReversedBytes(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/i, "").padStart(16, "0");
  const bytes = new Uint8Array(8);
  for (let index = 0; index < 8; index += 1) {
    bytes[7 - index] = Number.parseInt(clean.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function buildPlaceId(hex1: string, hex2: string): string {
  const raw = new Uint8Array(17);
  raw.set(toReversedBytes(hex1), 0);
  raw[8] = 0x11; // separador entre os dois números
  raw.set(toReversedBytes(hex2), 9);
  return `ChIJ${toBase64Url(raw)}`;
}

/**
 * Devolve o link a salvar. URLs do Maps viram link de avaliação;
 * qualquer outro endereço é mantido como está. Texto vazio devolve null.
 */
export function normalizeGoogleReviewUrl(input: string): ReviewUrlResult | null {
  const value = input.trim();
  if (!value) return null;

  const fromMaps = MAPS_PLACE_PATTERN.exec(value) ?? HEX_PAIR_PATTERN.exec(value);
  if (fromMaps) {
    return { url: GOOGLE_REVIEW_BASE + buildPlaceId(fromMaps[1], fromMaps[2]), convertedFromMaps: true };
  }

  return { url: value, convertedFromMaps: false };
}
