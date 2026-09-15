import { buildMockDailyScans } from "@/data/mock/scans";
import { RECENT_PLATES_LIMIT } from "@/lib/config";
import { buildDashboardStats, getRecentlyConfiguredPlates } from "@/lib/plates";
import type { DailyScans, DashboardData } from "@/types";
import { getPlates } from "./plates";

async function getDailyScans(): Promise<DailyScans[]> {
  return buildMockDailyScans();
}

export async function getDashboardData(): Promise<DashboardData> {
  const [plates, dailyScans] = await Promise.all([getPlates(), getDailyScans()]);
  return {
    stats: buildDashboardStats(plates, dailyScans),
    dailyScans,
    recentPlates: getRecentlyConfiguredPlates(plates, RECENT_PLATES_LIMIT),
  };
}
