import { apiRequest } from "@/lib/api/client";
import type { QboCallbackRequest, QboConnectUrl, TokenConfiguration } from "@/lib/types/qbo";

export const qboApi = {
  getConnectUrl(organizationId: number): Promise<QboConnectUrl> {
    return apiRequest<QboConnectUrl>(`/api/qbo/organizations/${organizationId}/connect-url`);
  },

  callback(payload: QboCallbackRequest): Promise<TokenConfiguration> {
    return apiRequest<TokenConfiguration>("/api/qbo/callback", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * ASSUMPTION: not documented in ProConnectAPI.md (section 5 only lists
   * connect-url and callback). Verify this route against the real backend
   * and update it here once confirmed.
   */
  disconnect(organizationId: number): Promise<void> {
    return apiRequest<void>(`/api/qbo/organizations/${organizationId}/disconnect`, {
      method: "DELETE",
    });
  },
};
