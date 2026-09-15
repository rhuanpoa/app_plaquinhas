import { RECENT_PLATES_LIMIT, SCAN_CHART_DAYS } from "@/lib/config";
import { buildDashboardStats, getRecentlyConfiguredPlates } from "@/lib/plates";
import { getSupabase } from "@/lib/supabase/client";
import type { DailyScans, DashboardData } from "@/types";
import { getPlates } from "./plates";

async function getDailyScans(): Promise<DailyScans[]> {
  const { data, error } = await getSupabase().rpc("daily_scans", { days: SCAN_CHART_DAYS });
  if (error) throw new Error("Não foi possível carregar os acessos.");
  // O banco devolve só a data (AAAA-MM-DD); meio-dia evita cair no dia anterior por fuso horário.
  return data.map((row) => ({ date: `${row.day}T12:00:00`, count: Number(row.total) }));
}

export async function getDashboardData(): Promise<DashboardData> {
  const [plates, dailyScans] = await Promise.all([getPlates(), getDailyScans()]);
  return {
    stats: buildDashboardStats(plates, dailyScans),
    dailyScans,
    recentPlates: getRecentlyConfiguredPlates(plates, RECENT_PLATES_LIMIT),
  };
}
