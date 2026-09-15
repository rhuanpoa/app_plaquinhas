import type { Metadata, Viewport } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { UserProvider } from "@/components/layout/user-provider";
import { ToastProvider } from "@/components/ui/toast";
import { APP_NAME } from "@/lib/config";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: "Gerenciamento de placas com QR Code para avaliações no Google.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${instrumentSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ToastProvider>
          <UserProvider>
            <AppShell>{children}</AppShell>
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
