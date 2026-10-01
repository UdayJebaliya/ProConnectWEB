import { apiRequest } from "@/lib/api/client";
import type { SummaryLogPagedResult } from "@/lib/types/summaryLog";

export interface ListSummaryLogsParams {
  organizationId?: number;
  clientId?: number;
  formType?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export const summaryLogsApi = {
  list(params: ListSummaryLogsParams = {}): Promise<SummaryLogPagedResult> {
    const query = buildQuery({
      organizationId: params.organizationId,
      clientId: params.clientId,
      formType: params.formType,
      status: params.status,
      page: params.page,
      pageSize: params.pageSize,
    });
    return apiRequest<SummaryLogPagedResult>(`/api/summary-logs${query}`);
  },
};
