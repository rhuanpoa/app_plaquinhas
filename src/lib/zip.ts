/**
 * Gerador de arquivos .zip (sem compressão, método "store").
 *
 * Os QR Codes já são imagens compactadas, então compactar de novo não ajudaria.
 * Assim evitamos uma dependência externa só para juntar arquivos.
 */

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** Data e hora no formato MS-DOS usado pelo zip. */
function dosDateTime(date: Date): { time: number; date: number } {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | (Math.floor(date.getSeconds() / 2) & 0x1f),
    date: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

export function createZip(entries: ZipEntry[], now: Date = new Date()): Blob {
  const encoder = new TextEncoder();
  const { time, date } = dosDateTime(now);
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const crc = crc32(entry.data);

    const localHeader = new DataView(new ArrayBuffer(30));
    localHeader.setUint32(0, 0x04034b50, true); // assinatura
    localHeader.setUint16(4, 20, true); // versão necessária
    localHeader.setUint16(6, 0, true); // flags
    localHeader.setUint16(8, 0, true); // método: store
    localHeader.setUint16(10, time, true);
    localHeader.setUint16(12, date, true);
    localHeader.setUint32(14, crc, true);
    localHeader.setUint32(18, entry.data.length, true);
    localHeader.setUint32(22, entry.data.length, true);
    localHeader.setUint16(26, name.length, true);
    localHeader.setUint16(28, 0, true); // extra

    parts.push(new Uint8Array(localHeader.buffer), name, entry.data);

    const centralHeader = new DataView(new ArrayBuffer(46));
    centralHeader.setUint32(0, 0x02014b50, true);
    centralHeader.setUint16(4, 20, true); // versão de criação
    centralHeader.setUint16(6, 20, true); // versão necessária
    centralHeader.setUint16(8, 0, true);
    centralHeader.setUint16(10, 0, true);
    centralHeader.setUint16(12, time, true);
    centralHeader.setUint16(14, date, true);
    centralHeader.setUint32(16, crc, true);
    centralHeader.setUint32(20, entry.data.length, true);
    centralHeader.setUint32(24, entry.data.length, true);
    centralHeader.setUint16(28, name.length, true);
    centralHeader.setUint16(30, 0, true); // extra
    centralHeader.setUint16(32, 0, true); // comentário
    centralHeader.setUint16(34, 0, true); // disco
    centralHeader.setUint16(36, 0, true); // atributos internos
    centralHeader.setUint32(38, 0, true); // atributos externos
    centralHeader.setUint32(42, offset, true);

    central.push(new Uint8Array(centralHeader.buffer), name);
    offset += 30 + name.length + entry.data.length;
  }

  const centralSize = central.reduce((total, part) => total + part.length, 0);
  const centralOffset = offset;

  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(4, 0, true); // disco
  end.setUint16(6, 0, true); // disco do diretório central
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, centralOffset, true);
  end.setUint16(20, 0, true); // comentário

  const all = [...parts, ...central, new Uint8Array(end.buffer)];
  const output = new Uint8Array(new ArrayBuffer(all.reduce((total, part) => total + part.length, 0)));
  let position = 0;
  for (const part of all) {
    output.set(part, position);
    position += part.length;
  }

  return new Blob([output], { type: "application/zip" });
}
