import type { DailyScans } from "@/types";
import { daysAgoIso } from "./dates";

const DAILY_SCAN_COUNTS = [
  34, 41, 38, 52, 47, 60, 73, 58, 49, 66, 71, 84, 79, 62, 55, 68, 90, 102, 88, 76, 81, 95, 110, 97, 86, 104, 118,
  126, 112, 131,
];

/** Acessos por dia nos últimos 30 dias, do mais antigo para o mais recente. */
export function buildMockDailyScans(now: Date = new Date()): DailyScans[] {
  const lastIndex = DAILY_SCAN_COUNTS.length - 1;
  return DAILY_SCAN_COUNTS.map((count, index) => ({
    date: daysAgoIso(lastIndex - index, now),
    count,
  }));
}
