"use client";

import { formatDate } from "@/lib/utils/formatDate";
import type { SummaryLog } from "@/lib/types/summaryLog";

interface SummaryLogsTableProps {
  summaryLogs: SummaryLog[];
}

export function SummaryLogsTable({ summaryLogs }: SummaryLogsTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Blob name
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Status
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Created
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Error message
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {summaryLogs.map((log) => {
          const isFailed = log.status === "FAILED";

          return (
            <tr key={log.id}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.blobName ?? "—"}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    isFailed ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {log.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(log.createdAt)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{isFailed ? (log.errorMessage ?? "—") : "—"}</td>
            </tr>
          );
        })}

        {summaryLogs.length === 0 && (
          <tr>
            <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
              No summary logs found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
