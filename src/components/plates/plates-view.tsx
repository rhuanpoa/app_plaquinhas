"use client";

import { Plus, QrCode, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useResource } from "@/hooks/use-resource";
import { PLATES_PER_PAGE } from "@/lib/config";
import { filterPlates, getPlateDetailHref } from "@/lib/plates";
import { getPlates } from "@/lib/repositories/plates";
import type { Plate, StatusFilterValue } from "@/types";
import { GeneratePlatesModal } from "./generate-plates-modal";
import { Pagination } from "./pagination";
import { PlateAction } from "./plate-action";
import { PlateFormModal } from "./plate-form-modal";
import { PlateListSkeleton } from "./plate-list-skeleton";
import { PlateTable } from "./plate-table";
import { StatusFilter } from "./status-filter";

export function PlatesView() {
  const router = useRouter();
  const toast = useToast();
  const { data: plates, loading, error, reload } = useResource(getPlates);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [page, setPage] = useState(1);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [plateToConfigure, setPlateToConfigure] = useState<Plate | null>(null);

  const filtered = useMemo(() => filterPlates(plates ?? [], search, statusFilter), [plates, search, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PLATES_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PLATES_PER_PAGE, currentPage * PLATES_PER_PAGE);
  const hasFilters = search.trim() !== "" || statusFilter !== "all";

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleFilterChange(value: StatusFilterValue) {
    setStatusFilter(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  }

  /** Mostra as placas disponíveis já na página onde começam as recém-criadas. */
  function showCreatedPlates(created: Plate[]) {
    const available = filterPlates(plates ?? [], "", "available");
    const firstIndex = available.findIndex((plate) => plate.id === created[0]?.id);
    setGenerateOpen(false);
    setSearch("");
    setStatusFilter("available");
    setPage(firstIndex >= 0 ? Math.floor(firstIndex / PLATES_PER_PAGE) + 1 : 1);
  }

  function handleConfigured(plate: Plate) {
    setPlateToConfigure(null);
    toast("Placa configurada com sucesso.");
    router.push(getPlateDetailHref(plate.id));
  }

  function renderContent() {
    if (loading) return <PlateListSkeleton />;
    if (error) return <ErrorState message={error} onRetry={() => reload({ showLoading: true })} />;

    if (filtered.length === 0) {
      return hasFilters ? (
        <EmptyState
          icon={SearchX}
          title="Nenhuma placa encontrada"
          description="Nenhum resultado para a pesquisa e o filtro aplicados."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Limpar filtros
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={QrCode}
          title="Nenhuma placa cadastrada"
          description="Gere suas primeiras placas para começar."
          action={
            <Button icon={Plus} onClick={() => setGenerateOpen(true)}>
              Gerar placas
            </Button>
          }
        />
      );
    }

    return (
      <>
        <PlateTable
          plates={pageRows}
          renderAction={(plate) => <PlateAction plate={plate} onConfigure={setPlateToConfigure} />}
        />
        <Pagination page={currentPage} pageCount={pageCount} totalItems={filtered.length} onPageChange={setPage} />
      </>
    );
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Placas"
        subtitle="Gerencie suas placas e QR Codes"
        actions={
          <Button icon={Plus} onClick={() => setGenerateOpen(true)}>
            Gerar placas
          </Button>
        }
      />

      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          label="Pesquisar placas"
          placeholder="Pesquisar por código ou cliente..."
          className="flex-[1_1_260px]"
        />
        <StatusFilter value={statusFilter} onChange={handleFilterChange} />
      </div>

      <Card className="overflow-hidden">{renderContent()}</Card>

      <GeneratePlatesModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onGenerated={() => reload()}
        onViewPlates={showCreatedPlates}
      />
      <PlateFormModal
        plate={plateToConfigure}
        mode="configure"
        onClose={() => setPlateToConfigure(null)}
        onSaved={handleConfigured}
      />
    </div>
  );
}
