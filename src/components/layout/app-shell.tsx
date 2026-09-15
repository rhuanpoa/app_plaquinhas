import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-[clamp(16px,3vw,32px)] pt-[clamp(18px,3vw,34px)] pb-[calc(88px+env(safe-area-inset-bottom))] lg:pb-10">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
