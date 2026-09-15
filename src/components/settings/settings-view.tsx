"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { DescriptionItem, DescriptionList } from "@/components/ui/description-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useResource } from "@/hooks/use-resource";
import { getSystemSettings } from "@/lib/repositories/settings";
import { AccountForm } from "./account-form";

export function SettingsView() {
  const { user, signOut } = useAuth();
  const { data: system } = useResource(getSystemSettings);

  return (
    <div className="mx-auto max-w-[620px] animate-fade-up">
      <PageHeader title="Configurações" subtitle="Conta e informações do sistema" />

      <Card className="mb-3.5 p-[18px]">
        <CardTitle title="Informações da conta" description="Dados usados no seu acesso ao painel." />
        {user ? (
          <AccountForm key={user.id} user={user} />
        ) : (
          <Skeleton className="mt-4 h-[168px] w-full" />
        )}
      </Card>

      <Card className="mb-3.5 p-[18px]">
        <CardTitle title="Sistema" description="Configurado pelo administrador." />
        {system ? (
          <DescriptionList className="mt-3.5">
            <DescriptionItem label="Nome do sistema">{system.systemName}</DescriptionItem>
            <DescriptionItem label="Domínio dos QR Codes" mono>
              {system.qrDomain}
            </DescriptionItem>
          </DescriptionList>
        ) : (
          <Skeleton className="mt-3.5 h-[90px] w-full" />
        )}
      </Card>

      <Card className="p-[18px]">
        <CardTitle title="Conta" description="Encerrar a sessão neste dispositivo." />
        <Button variant="secondary" icon={LogOut} className="mt-3.5" onClick={signOut}>
          Sair
        </Button>
      </Card>
    </div>
  );
}
