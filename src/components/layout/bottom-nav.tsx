"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV_ITEMS, isNavItemActive } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Menu principal"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-surface/90 px-1.5 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom))] backdrop-blur-lg lg:hidden"
    >
      {NAV_ITEMS.map(({ href, shortLabel, icon: Icon }) => {
        const active = isNavItemActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-[52px] flex-col items-center justify-center gap-[3px] rounded-lg text-[11px]",
              active ? "font-semibold text-accent" : "font-medium text-muted",
            )}
          >
            <Icon className="size-[19px]" strokeWidth={1.9} aria-hidden />
            {shortLabel}
          </Link>
        );
      })}
    </nav>
  );
}
