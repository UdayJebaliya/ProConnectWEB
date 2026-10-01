"use client";

import { useEffect, useState, type FormEvent } from "react";

import { useOrganizationOptions } from "@/hooks/useOrganizationOptions";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { Spinner } from "@/components/common/Spinner";
import { UserType, UserTypeLabel } from "@/lib/constants/enums";
import type { User } from "@/lib/types/user";

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  userType?: UserType;
  organizationId?: number;
}

interface UserFormModalProps {
  open: boolean;
  user: User | null;
  isSuperAdmin: boolean;
  isSubmitting: boolean;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onClose: () => void;
}

const emptyValues: UserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  userType: UserType.OrganizationUser,
  organizationId: undefined,
};

export function UserFormModal({
  open,
  user,
  isSuperAdmin,
  isSubmitting,
  onSubmit,
  onClose,
}: UserFormModalProps) {
  const [values, setValues] = useState<UserFormValues>(emptyValues);
  const [error, setError] = useState<string | null>(null);
  const { organizations, isLoading: isLoadingOrgs } = useOrganizationOptions(isSuperAdmin && open);

  useEffect(() => {
    if (open) {
      setValues(
        user
          ? {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              userType: user.userType,
              organizationId: user.organizationId ?? undefined,
            }
          : emptyValues,
      );
      setError(null);
    }
  }, [open, user]);

  useEscapeKey(open && !isSubmitting, onClose);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!values.firstName.trim() || !values.lastName.trim() || !values.email.trim()) {
      setError("First name, last name, and email are required.");
      return;
    }
    if (isSuperAdmin && values.userType === UserType.OrganizationUser && !values.organizationId) {
      setError("Select an organization for this user.");
      return;
    }
    setError(null);
    await onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">{user ? "Edit user" : "Add user"}</h2>
        {!user && (
          <p className="mt-1 text-sm text-gray-500">
            An activation email will be sent so the user can set their own password.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="user-first-name" className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                id="user-first-name"
                type="text"
                value={values.firstName}
                onChange={(event) => setValues((prev) => ({ ...prev, firstName: event.target.value }))}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="user-last-name" className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                id="user-last-name"
                type="text"
                value={values.lastName}
                onChange={(event) => setValues((prev) => ({ ...prev, lastName: event.target.value }))}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="user-email"
              type="email"
              value={values.email}
              onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {isSuperAdmin && (
            <>
              <div>
                <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">
                  User type
                </label>
                <select
                  id="user-type"
                  value={values.userType}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, userType: Number(event.target.value) as UserType }))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {Object.values(UserType)
                    .filter((value): value is UserType => typeof value === "number")
                    .map((type) => (
                      <option key={type} value={type}>
                        {UserTypeLabel[type]}
                      </option>
                    ))}
                </select>
              </div>

              {values.userType === UserType.OrganizationUser && (
                <div>
                  <label htmlFor="user-organization" className="block text-sm font-medium text-gray-700">
                    Organization
                  </label>
                  <select
                    id="user-organization"
                    value={values.organizationId ?? ""}
                    disabled={isLoadingOrgs}
                    onChange={(event) =>
                      setValues((prev) => ({ ...prev, organizationId: Number(event.target.value) }))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <option value="">Select an organization</option>
                    {organizations.map((organization) => (
                      <option key={organization.id} value={organization.id}>
                        {organization.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting && <Spinner className="h-4 w-4" />}
              {user ? "Save changes" : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
