"use client";

import { DropdownMenu, type DropdownMenuItem } from "@/components/common/DropdownMenu";
import { UserStatusLabel, UserTypeLabel } from "@/lib/constants/enums";
import { formatDate } from "@/lib/utils/formatDate";
import type { User } from "@/lib/types/user";

interface UsersTableProps {
  users: User[];
  isSuperAdmin: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onSetPassword: (user: User) => void;
}

export function UsersTable({ users, isSuperAdmin, onEdit, onDelete, onSetPassword }: UsersTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Name
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Email
          </th>
          {isSuperAdmin && (
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Type
            </th>
          )}
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Status
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            Last login
          </th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {users.map((user) => {
          const items: DropdownMenuItem[] = [
            { label: "Edit", onClick: () => onEdit(user) },
            { label: "Set password", onClick: () => onSetPassword(user) },
            { label: "Delete", onClick: () => onDelete(user), destructive: true },
          ];

          return (
            <tr key={user.id}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
              {isSuperAdmin && (
                <td className="px-4 py-3 text-sm text-gray-600">{UserTypeLabel[user.userType]}</td>
              )}
              <td className="px-4 py-3 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {UserStatusLabel[user.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(user.lastLoginAt)}</td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu items={items} />
              </td>
            </tr>
          );
        })}

        {users.length === 0 && (
          <tr>
            <td colSpan={isSuperAdmin ? 6 : 5} className="px-4 py-10 text-center text-sm text-gray-500">
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
