"use client";

import Link from "next/link";

import { DropdownMenu, type DropdownMenuItem } from "@/components/common/DropdownMenu";
import { Spinner } from "@/components/common/Spinner";
import { AppRoutes } from "@/lib/constants/routes";
import { formatDate } from "@/lib/utils/formatDate";
import type { Organization } from "@/lib/types/organization";

interface OrganizationsTableProps {
  organizations: Organization[];
  isSuperAdmin: boolean;
  connectingOrgId: number | null;
  disconnectingOrgId: number | null;
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
  onConnect: (organization: Organization) => void;
  onDisconnect: (organization: Organization) => void;
}

export function OrganizationsTable({
  organizations,
  isSuperAdmin,
  connectingOrgId,
  disconnectingOrgId,
  onEdit,
  onDelete,
  onConnect,
  onDisconnect,
}: OrganizationsTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Name
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Status
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Created
          </th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {organizations.map((organization) => {
          const isConnecting = connectingOrgId === organization.id;
          const isDisconnecting = disconnectingOrgId === organization.id;

          const items: DropdownMenuItem[] = [];
          if (isSuperAdmin) {
            items.push({ label: "Edit", onClick: () => onEdit(organization) });
          }
          if (organization.isConnectedWithTool) {
            items.push({
              label: isDisconnecting ? "Disconnecting…" : "Disconnect QuickBooks",
              onClick: () => onDisconnect(organization),
              disabled: isConnecting || isDisconnecting,
            });
          } else {
            items.push({
              label: isConnecting ? "Connecting…" : "Connect to QuickBooks",
              onClick: () => onConnect(organization),
              disabled: isConnecting || isDisconnecting,
            });
          }
          if (isSuperAdmin) {
            items.push({
              label: "Delete",
              onClick: () => onDelete(organization),
              destructive: true,
            });
          }

          return (
            <tr key={organization.id}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                <Link
                  href={`${AppRoutes.summaryLogs}?organizationId=${organization.id}`}
                  className="hover:text-indigo-600 hover:underline"
                >
                  {organization.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    organization.status
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {organization.status ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(organization.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                {isConnecting || isDisconnecting ? (
                  <Spinner className="ml-auto h-4 w-4 text-gray-400" />
                ) : (
                  <DropdownMenu items={items} />
                )}
              </td>
            </tr>
          );
        })}

        {organizations.length === 0 && (
          <tr>
            <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
              No organizations found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
