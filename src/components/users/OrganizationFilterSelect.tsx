"use client";

import { useOrganizationOptions } from "@/hooks/useOrganizationOptions";

interface OrganizationFilterSelectProps {
  value: number | undefined;
  onChange: (organizationId: number | undefined) => void;
}

export function OrganizationFilterSelect({ value, onChange }: OrganizationFilterSelectProps) {
  const { organizations, isLoading } = useOrganizationOptions(true);

  return (
    <select
      value={value ?? ""}
      disabled={isLoading}
      onChange={(event) => {
        const raw = event.target.value;
        onChange(raw === "" ? undefined : Number(raw));
      }}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
    >
      <option value="">All organizations</option>
      {organizations.map((organization) => (
        <option key={organization.id} value={organization.id}>
          {organization.name}
        </option>
      ))}
    </select>
  );
}
