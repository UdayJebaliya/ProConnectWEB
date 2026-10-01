import type { PagedResult } from "@/lib/types/common";

export type SummaryLogStatus = "SUCCESS" | "FAILED";

export interface SummaryLog {
  id: number;
  clientId: number | null;
  organizationId: number | null;
  blobName: string | null;
  status: string;
  statusCode: number | null;
  formType: string | null;
  errorMessage: string | null;
  requestJson: string | null;
  createdAt: string;
  updatedAt: string;
}

// Success/failure totals are counted across every page, over the same filters
// as the list except status - so they stay meaningful while the list itself
// is narrowed to one status.
export interface SummaryLogPagedResult extends PagedResult<SummaryLog> {
  totalSuccessCount: number;
  totalFailureCount: number;
}
