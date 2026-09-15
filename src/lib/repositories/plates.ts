/**
 * Acesso às placas no Supabase. As telas usam apenas estas funções.
 */
import { sortPlatesByCode } from "@/lib/plates";
import { getSupabase } from "@/lib/supabase/client";
import type { Plate, PlateUpdate } from "@/types";
import type { Database } from "@/types/database";

type PlateRow = Database["public"]["Tables"]["plates"]["Row"];
type PlateRowUpdate = Database["public"]["Tables"]["plates"]["Update"];

const PLATE_COLUMNS = "id, code, client_name, destination_url, status, created_at, updated_at, scans(count)";

// Limite de linhas por requisição da API do Supabase.
const FETCH_PAGE_SIZE = 1000;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toPlate(row: PlateRow, scans = 0): Plate {
  return {
    id: row.id,
    code: row.code,
    clientName: row.client_name,
    destinationUrl: row.destination_url,
    status: row.status,
    scans,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toPlateWithScans(row: PlateRow & { scans: { count: number }[] }): Plate {
  return toPlate(row, row.scans[0]?.count ?? 0);
}

export async function getPlates(): Promise<Plate[]> {
  const supabase = getSupabase();
  const plates: Plate[] = [];

  for (let from = 0; ; from += FETCH_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("plates")
      .select(PLATE_COLUMNS)
      .order("created_at")
      .order("code")
      .range(from, from + FETCH_PAGE_SIZE - 1);

    if (error) throw new Error("Não foi possível carregar as placas.");
    plates.push(...data.map(toPlateWithScans));
    if (data.length < FETCH_PAGE_SIZE) break;
  }

  return sortPlatesByCode(plates);
}

export async function getPlateById(id: string): Promise<Plate | null> {
  if (!UUID_PATTERN.test(id)) return null;

  const { data, error } = await getSupabase().from("plates").select(PLATE_COLUMNS).eq("id", id).maybeSingle();
  if (error) throw new Error("Não foi possível carregar a placa.");
  return data ? toPlateWithScans(data) : null;
}

/** Cria placas disponíveis. Os códigos vêm de uma sequência do banco e nunca se repetem. */
export async function createPlates(quantity: number): Promise<Plate[]> {
  const { data, error } = await getSupabase().rpc("create_plates", { quantity });
  if (error) throw new Error("Não foi possível gerar as placas.");
  return sortPlatesByCode(data.map((row) => toPlate(row)));
}

export async function updatePlate(id: string, changes: PlateUpdate): Promise<Plate> {
  const update: PlateRowUpdate = {};
  if (changes.clientName !== undefined) update.client_name = changes.clientName;
  if (changes.destinationUrl !== undefined) update.destination_url = changes.destinationUrl;
  if (changes.status !== undefined) update.status = changes.status;

  const { data, error } = await getSupabase()
    .from("plates")
    .update(update)
    .eq("id", id)
    .select(PLATE_COLUMNS)
    .maybeSingle();

  if (error) throw new Error("Não foi possível salvar a placa.");
  if (!data) throw new Error("Placa não encontrada.");
  return toPlateWithScans(data);
}

export async function deletePlate(id: string): Promise<void> {
  const { error, count } = await getSupabase().from("plates").delete({ count: "exact" }).eq("id", id);
  if (error) throw new Error("Não foi possível excluir a placa.");
  if (count === 0) throw new Error("Placa não encontrada.");
}
