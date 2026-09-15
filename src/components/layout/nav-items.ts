import { LayoutDashboard, QrCode, SlidersHorizontal, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "Dashboard", icon: LayoutDashboard },
  { href: "/plates", label: "Placas", shortLabel: "Placas", icon: QrCode },
  { href: "/settings", label: "Configurações", shortLabel: "Ajustes", icon: SlidersHorizontal },
];

function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function isNavItemActive(pathname: string, href: string): boolean {
  const path = normalizePath(pathname);
  return path === href || path.startsWith(`${href}/`);
}

export function getPageLabel(pathname: string): string {
  const path = normalizePath(pathname);
  if (path.startsWith("/plates/view")) return "Placas / Detalhes";
  return NAV_ITEMS.find((item) => isNavItemActive(path, item.href))?.label ?? "";
}
