import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PlateDetailSkeleton() {
  return (
    <div role="status" aria-label="Carregando placa">
      <Skeleton className="mb-4 h-4 w-16" />
      <Skeleton className="mb-6 h-7 w-44" />
      <div className="grid items-start gap-3.5 md:grid-cols-2">
        <Card className="p-[18px]">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mx-auto mt-5 aspect-square w-[220px] max-w-full" />
          <Skeleton className="mt-5 h-10 w-full" />
        </Card>
        <Card className="space-y-4 p-[18px]">
          <Skeleton className="h-4 w-40" />
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </Card>
      </div>
    </div>
  );
}
