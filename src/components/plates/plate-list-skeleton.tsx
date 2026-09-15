import { Skeleton } from "@/components/ui/skeleton";

export function PlateListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Carregando placas" className="divide-y divide-line-soft py-2">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-[18px] py-3.5">
          <Skeleton className="h-3 w-[70px]" />
          <Skeleton className="h-3 max-w-[220px] flex-1" />
          <Skeleton className="h-5 w-16" shape="pill" />
        </div>
      ))}
    </div>
  );
}
