export interface QboConnectUrl {
  redirectUrl: string;
  state: string;
}

export interface QboCallbackRequest {
  organizationId: number;
  code: string;
  realmId: string;
  state: string;
}

export interface TokenConfiguration {
  id: number;
  organizationId: number | null;
  realmId: string | null;
  accessExpiry: string | null;
  refreshExpiry: string | null;
  qboStatus: boolean;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Context persisted client-side (sessionStorage) between "Connect to QuickBooks"
 * and the /qboconnect redirect, since Intuit's redirect only carries
 * code/realmId/state and not our organizationId.
 */
export interface QboConnectContext {
  organizationId: number;
  state: string;
}
