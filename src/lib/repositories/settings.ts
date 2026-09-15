import { APP_NAME, QR_DOMAIN } from "@/lib/config";
import type { SystemSettings } from "@/types";

export async function getSystemSettings(): Promise<SystemSettings> {
  return { systemName: APP_NAME, qrDomain: QR_DOMAIN };
}
