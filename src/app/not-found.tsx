import { SearchX } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <Card>
      <EmptyState
        icon={SearchX}
        title="Página não encontrada"
        description="O endereço acessado não existe."
        action={
          <Link href="/dashboard" className={buttonClasses()}>
            Ir para o Dashboard
          </Link>
        }
      />
    </Card>
  );
}
