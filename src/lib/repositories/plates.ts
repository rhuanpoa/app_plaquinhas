/**
 * Acesso aos dados das placas. Hoje usa dados mockados; ao integrar o Supabase,
 * basta reimplementar estas funções mantendo as mesmas assinaturas.
 */
import { buildMockPlates } from "@/data/mock/plates";
import { formatPlateCode, parsePlateCodeSequence, sortPlatesByCode } from "@/lib/plates";
import type { Plate, PlateUpdate } from "@/types";
import { readStored, simulateLatency, writeStored } from "./mock-store";

const STORAGE_KEY = "reviewqr:v1:plates";
const LAST_SEQUENCE_KEY = "reviewqr:v1:last-plate-sequence";

function loadPlates(): Plate[] {
  return readStored(STORAGE_KEY, () => buildMockPlates());
}

function savePlates(plates: Plate[]): void {
  writeStored(STORAGE_KEY, plates);
}

/**
 * Maior sequência já emitida, incluindo placas excluídas. Códigos nunca são
 * reutilizados: uma placa impressa com um código excluído não pode apontar para outro cliente.
 */
function getHighestSequence(plates: Plate[]): number {
  return plates.reduce(
    (max, plate) => Math.max(max, parsePlateCodeSequence(plate.code)),
    readStored(LAST_SEQUENCE_KEY, () => 0),
  );
}

export async function getPlates(): Promise<Plate[]> {
  await simulateLatency();
  return sortPlatesByCode(loadPlates());
}

export async function getPlateById(id: string): Promise<Plate | null> {
  await simulateLatency(250);
  return loadPlates().find((plate) => plate.id === id) ?? null;
}

/** Cria placas disponíveis com códigos sequenciais, continuando do maior código já emitido. */
export async function createPlates(quantity: number): Promise<Plate[]> {
  await simulateLatency(800);
  const plates = loadPlates();
  const lastSequence = getHighestSequence(plates);
  const now = new Date().toISOString();

  const created: Plate[] = Array.from({ length: quantity }, (_, index) => {
    const code = formatPlateCode(lastSequence + index + 1);
    return {
      id: code.toLowerCase(),
      code,
      clientName: null,
      destinationUrl: null,
      status: "available",
      scans: 0,
      createdAt: now,
      updatedAt: now,
    };
  });

  savePlates([...plates, ...created]);
  writeStored(LAST_SEQUENCE_KEY, lastSequence + quantity);
  return created;
}

export async function deletePlate(id: string): Promise<void> {
  await simulateLatency(500);
  const plates = loadPlates();
  if (!plates.some((plate) => plate.id === id)) throw new Error("Placa não encontrada.");

  writeStored(LAST_SEQUENCE_KEY, getHighestSequence(plates));
  savePlates(plates.filter((plate) => plate.id !== id));
}

export async function updatePlate(id: string, data: PlateUpdate): Promise<Plate> {
  await simulateLatency(600);
  const plates = loadPlates();
  const current = plates.find((plate) => plate.id === id);
  if (!current) throw new Error("Placa não encontrada.");

  const updated: Plate = { ...current, ...data, updatedAt: new Date().toISOString() };
  savePlates(plates.map((plate) => (plate.id === id ? updated : plate)));
  return updated;
}
