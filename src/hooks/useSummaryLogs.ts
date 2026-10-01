"use client";

import { useCallback, useEffect, useState } from "react";

import { summaryLogsApi } from "@/lib/api/endpoints/summaryLogs";
import { getErrorMessage } from "@/lib/utils/errors";
import type { SummaryLogPagedResult } from "@/lib/types/summaryLog";

const PAGE_SIZE = 20;

export function useSummaryLogs(organizationId: number | undefined, status: string | undefined) {
  const [result, setResult] = useState<SummaryLogPagedResult | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (targetPage: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await summaryLogsApi.list({
          organizationId,
          status,
          page: targetPage,
          pageSize: PAGE_SIZE,
        });
        setResult(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [organizationId, status],
  );

  // Reset to page 1 whenever the status filter changes.
  useEffect(() => {
    setPage(1);
  }, [organizationId, status]);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  return {
    summaryLogs: result?.items ?? [],
    page,
    pageSize: PAGE_SIZE,
    totalCount: result?.totalCount ?? 0,
    totalSuccessCount: result?.totalSuccessCount ?? 0,
    totalFailureCount: result?.totalFailureCount ?? 0,
    isLoading,
    error,
    setPage,
  };
}
