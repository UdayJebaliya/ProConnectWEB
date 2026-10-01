"use client";

import { useEffect, useState, type FormEvent } from "react";

import { useEscapeKey } from "@/hooks/useEscapeKey";
import { Spinner } from "@/components/common/Spinner";
import type { Organization } from "@/lib/types/organization";

export interface OrganizationFormValues {
  name: string;
  status: boolean;
}

interface OrganizationFormModalProps {
  open: boolean;
  organization: Organization | null;
  isSubmitting: boolean;
  onSubmit: (values: OrganizationFormValues) => Promise<void>;
  onClose: () => void;
}

const emptyValues: OrganizationFormValues = { name: "", status: true };

export function OrganizationFormModal({
  open,
  organization,
  isSubmitting,
  onSubmit,
  onClose,
}: OrganizationFormModalProps) {
  const [values, setValues] = useState<OrganizationFormValues>(emptyValues);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues(
        organization ? { name: organization.name, status: organization.status } : emptyValues,
      );
      setError(null);
    }
  }, [open, organization]);

  useEscapeKey(open && !isSubmitting, onClose);

  if (!open) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!values.name.trim()) {
      setError("Organization name is required.");
      return;
    }
    setError(null);
    await onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">
          {organization ? "Edit organization" : "Add organization"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="org-name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="org-name"
              type="text"
              value={values.name}
              onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={values.status}
              onChange={(event) => setValues((prev) => ({ ...prev, status: event.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Active
          </label>

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
              {organization ? "Save changes" : "Create organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
