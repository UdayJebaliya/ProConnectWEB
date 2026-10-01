"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useSummaryLogs } from "@/hooks/useSummaryLogs";
import { AppRoutes } from "@/lib/constants/routes";
import { Pagination } from "@/components/common/Pagination";
import { Spinner } from "@/components/common/Spinner";
import { SummaryLogsTable } from "@/components/summaryLogs/SummaryLogsTable";

export function SummaryLogsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const organizationIdParam = searchParams.get("organizationId");
  const organizationId = organizationIdParam ? Number(organizationIdParam) : undefined;
  const status = searchParams.get("status") ?? undefined;

  const {
    summaryLogs,
    page,
    pageSize,
    totalCount,
    totalSuccessCount,
    totalFailureCount,
    isLoading,
    error,
    setPage,
  } = useSummaryLogs(organizationId, status);

  function handleStatusChange(nextStatus: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextStatus) {
      params.set("status", nextStatus);
    } else {
      params.delete("status");
    }
    router.push(`${AppRoutes.summaryLogs}?${params.toString()}`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Summary logs</h1>
        <select
          value={status ?? ""}
          onChange={(event) => handleStatusChange(event.target.value || undefined)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total success</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">{totalSuccessCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total failed</p>
          <p className="mt-1 text-2xl font-semibold text-red-600">{totalFailureCount}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {isLoading ? (
          <div className="flex justify-center py-16 text-gray-400">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <p className="px-4 py-10 text-center text-sm text-red-600">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <SummaryLogsTable summaryLogs={summaryLogs} />
            </div>
            <Pagination page={page} pageSize={pageSize} totalCount={totalCount} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
