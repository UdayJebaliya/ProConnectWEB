"use client";

import { useCallback, useEffect, useState } from "react";

import { organizationsApi } from "@/lib/api/endpoints/organizations";
import { getErrorMessage } from "@/lib/utils/errors";
import type { PagedResult } from "@/lib/types/common";
import type {
  CreateOrganizationRequest,
  Organization,
  UpdateOrganizationRequest,
} from "@/lib/types/organization";

const PAGE_SIZE = 10;

export function useOrganizations() {
  const [result, setResult] = useState<PagedResult<Organization> | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await organizationsApi.list({ page: targetPage, pageSize: PAGE_SIZE });
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  async function createOrganization(payload: CreateOrganizationRequest): Promise<void> {
    await organizationsApi.create(payload);
    await fetchPage(1);
    setPage(1);
  }

  async function updateOrganization(id: number, payload: UpdateOrganizationRequest): Promise<void> {
    await organizationsApi.update(id, payload);
    await fetchPage(page);
  }

  async function deleteOrganization(id: number): Promise<void> {
    await organizationsApi.remove(id);
    const isLastItemOnPage = result?.items.length === 1 && page > 1;
    await fetchPage(isLastItemOnPage ? page - 1 : page);
    if (isLastItemOnPage) setPage(page - 1);
  }

  const refetch = useCallback(() => fetchPage(page), [fetchPage, page]);

  return {
    organizations: result?.items ?? [],
    page,
    pageSize: PAGE_SIZE,
    totalCount: result?.totalCount ?? 0,
    isLoading,
    error,
    setPage,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    refetch,
  };
}
