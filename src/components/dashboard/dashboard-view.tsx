"use client";

import { QrCode } from "lucide-react";
import { PlateAction } from "@/components/plates/plate-action";
import { PlateListSkeleton } from "@/components/plates/plate-list-skeleton";
import { PlateTable } from "@/components/plates/plate-table";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { useResource } from "@/hooks/use-resource";
import { getDashboardData } from "@/lib/repositories/dashboard";
import type { DashboardStats } from "@/types";
import { ScansChart } from "./scans-chart";
import { StatCard } from "./stat-card";

function activeShare(stats: DashboardStats): string | undefined {
  if (stats.totalPlates === 0) return undefined;
  return `${Math.round((stats.activePlates / stats.totalPlates) * 100)}% do total`;
}

export function DashboardView() {
  const { data, loading, error, reload } = useResource(getDashboardData);
  const stats = data?.stats;

  return (
    <div className="animate-fade-up">
      <PageHeader title="Dashboard" subtitle="Visão geral das suas placas" />

      {error ? (
        <Card>
          <ErrorState message={error} onRetry={() => reload({ showLoading: true })} />
        </Card>
      ) : (
        <>
          <div className="mb-[22px] grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            <StatCard label="Total de placas" value={stats?.totalPlates} />
            <StatCard
              label="Placas ativas"
              value={stats?.activePlates}
              detail={stats && activeShare(stats)}
              tone="success"
            />
            <StatCard label="Disponíveis" value={stats?.availablePlates} />
          </div>

          <ScansChart data={data?.dailyScans} total={stats?.scansLast30Days} />

          <Card className="overflow-hidden">
            <div className="border-b border-line-soft px-[18px] py-4">
              <CardTitle title="Placas recentemente configuradas" />
            </div>
            {loading || !data ? (
              <PlateListSkeleton rows={3} />
            ) : data.recentPlates.length > 0 ? (
              <PlateTable
                plates={data.recentPlates}
                actionHeader="Ação"
                renderAction={(plate) => <PlateAction plate={plate} />}
              />
            ) : (
              <EmptyState
                icon={QrCode}
                title="Nenhuma placa configurada"
                description="As placas configuradas aparecem aqui."
                compact
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
}
