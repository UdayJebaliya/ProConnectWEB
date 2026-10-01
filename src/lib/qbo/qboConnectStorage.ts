import { StorageKeys } from "@/lib/constants/storageKeys";
import type { QboConnectContext } from "@/lib/types/qbo";

/**
 * Intuit's OAuth redirect only returns code/realmId/state — not our internal
 * organizationId — so we stash it here before leaving the app and read it
 * back on the /qboconnect callback page.
 */
export const qboConnectStorage = {
  save(context: QboConnectContext): void {
    window.sessionStorage.setItem(StorageKeys.qboConnectContext, JSON.stringify(context));
  },

  read(): QboConnectContext | null {
    const raw = window.sessionStorage.getItem(StorageKeys.qboConnectContext);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as QboConnectContext;
    } catch {
      return null;
    }
  },

  clear(): void {
    window.sessionStorage.removeItem(StorageKeys.qboConnectContext);
  },
};
