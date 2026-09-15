"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";
import { NAV_ITEMS, isNavItemActive } from "./nav-items";
import { useCurrentUser } from "./user-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useCurrentUser();

  return (
    <aside className="sticky top-0 hidden h-dvh w-[252px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <Link href="/dashboard" className="mx-3 mt-3.5 mb-2.5 rounded-lg px-2 py-2">
        <Logo />
      </Link>

      <nav aria-label="Menu principal" className="flex flex-col gap-0.5 px-3 py-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isNavItemActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-control px-[11px] py-[9px] text-sm transition-colors",
                active ? "bg-accent-soft font-semibold text-accent" : "font-medium text-ink-soft hover:bg-hover hover:text-ink",
              )}
            >
              <Icon className="size-[17px]" strokeWidth={1.9} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line-soft p-3.5">
        <div className="flex items-center gap-2.5 p-2">
          <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-avatar text-sm font-[650] text-accent">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            {user ? (
              <>
                <p className="truncate text-[13.5px] font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </>
            ) : (
              <>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-1.5 h-3 w-28" />
              </>
            )}
          </div>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sair"
            title="Sair"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-hover hover:text-ink"
          >
            <LogOut className="size-[17px]" aria-hidden />
          </button>
        </div>
      </div>
    </aside>
  );
}
