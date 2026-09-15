import type { Metadata } from "next";
import { Suspense } from "react";
import { PlateDetailSkeleton } from "@/components/plates/plate-detail-skeleton";
import { PlateDetailView } from "@/components/plates/plate-detail-view";

export const metadata: Metadata = { title: "Detalhes da placa" };

// A placa vem de ?id= porque o site estático não gera uma página por placa.
export default function PlateDetailPage() {
  return (
    <Suspense fallback={<PlateDetailSkeleton />}>
      <PlateDetailView />
    </Suspense>
  );
}
