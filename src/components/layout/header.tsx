"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { QR_DOMAIN } from "@/lib/config";
import { Logo } from "./logo";
import { getPageLabel } from "./nav-items";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-[58px] items-center gap-3 border-b border-line bg-surface/85 px-[clamp(16px,3vw,32px)] backdrop-blur-md">
      <Link href="/dashboard" aria-label="ReviewQR, ir para o Dashboard" className="rounded-lg lg:hidden">
        <Logo compact />
      </Link>
      <span className="hidden text-[13.5px] text-muted lg:block">{getPageLabel(pathname)}</span>
      <div className="flex-1" />
      <span className="truncate font-mono text-[12.5px] text-muted" title="Domínio dos QR Codes">
        {QR_DOMAIN}
      </span>
    </header>
  );
}
