import { PLATE_CODE_DIGITS, PLATE_CODE_PREFIX } from "@/lib/config";
import { normalizeText } from "@/lib/format";
import type { DailyScans, DashboardStats, Plate, PlateStatus, SelectOption, StatusFilterValue } from "@/types";

export const PLATE_STATUS_LABEL: Record<PlateStatus, string> = {
  active: "Ativa",
  available: "Disponível",
  disabled: "Desativada",
};

export const STATUS_FILTER_OPTIONS: SelectOption<StatusFilterValue>[] = [
  { value: "all", label: "Todos" },
  { value: "available", label: "Disponíveis" },
  { value: "active", label: "Ativas" },
  { value: "disabled", label: "Desativadas" },
];

export function formatPlateCode(sequence: number): string {
  return PLATE_CODE_PREFIX + String(sequence).padStart(PLATE_CODE_DIGITS, "0");
}

export function parsePlateCodeSequence(code: string): number {
  const sequence = Number.parseInt(code.slice(PLATE_CODE_PREFIX.length), 10);
  return Number.isNaN(sequence) ? 0 : sequence;
}

export function sortPlatesByCode(plates: Plate[]): Plate[] {
  return [...plates].sort((a, b) => parsePlateCodeSequence(a.code) - parsePlateCodeSequence(b.code));
}

export function filterPlates(plates: Plate[], search: string, status: StatusFilterValue): Plate[] {
  const query = normalizeText(search);
  return plates.filter((plate) => {
    if (status !== "all" && plate.status !== status) return false;
    if (!query) return true;
    return normalizeText(plate.code).includes(query) || normalizeText(plate.clientName ?? "").includes(query);
  });
}

export function getRecentlyConfiguredPlates(plates: Plate[], limit: number): Plate[] {
  return plates
    .filter((plate) => plate.status !== "available")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}

export function buildDashboardStats(plates: Plate[], dailyScans: DailyScans[]): DashboardStats {
  const countBy = (status: PlateStatus) => plates.filter((plate) => plate.status === status).length;
  return {
    totalPlates: plates.length,
    activePlates: countBy("active"),
    availablePlates: countBy("available"),
    disabledPlates: countBy("disabled"),
    scansLast30Days: dailyScans.reduce((sum, day) => sum + day.count, 0),
  };
}

export function getPlateDetailHref(id: string): string {
  return `/plates/view?id=${encodeURIComponent(id)}`;
}
