"use client";

import { useEffect, useState } from "react";

import { organizationsApi } from "@/lib/api/endpoints/organizations";
import type { Organization } from "@/lib/types/organization";

/** Flat list of organizations for filter/select dropdowns (Super Admin only). */
export function useOrganizationOptions(enabled: boolean) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    setIsLoading(true);
    organizationsApi
      .list({ page: 1, pageSize: 200 })
      .then((result) => {
        if (!cancelled) setOrganizations(result.items);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { organizations, isLoading };
}
