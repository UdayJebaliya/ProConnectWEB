"use client";

import { useCallback, useEffect, useState } from "react";

import { usersApi } from "@/lib/api/endpoints/users";
import { getErrorMessage } from "@/lib/utils/errors";
import type { PagedResult } from "@/lib/types/common";
import type { CreateUserRequest, SetPasswordRequest, UpdateUserRequest, User } from "@/lib/types/user";

const PAGE_SIZE = 10;

export function useUsers(organizationId: number | undefined) {
  const [result, setResult] = useState<PagedResult<User> | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (targetPage: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await usersApi.list({ organizationId, page: targetPage, pageSize: PAGE_SIZE });
        setResult(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [organizationId],
  );

  // Reset to page 1 whenever the organization filter changes.
  useEffect(() => {
    setPage(1);
  }, [organizationId]);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  async function createUser(payload: CreateUserRequest): Promise<void> {
    await usersApi.create(payload);
    await fetchPage(1);
    setPage(1);
  }

  async function updateUser(id: number, payload: UpdateUserRequest): Promise<void> {
    await usersApi.update(id, payload);
    await fetchPage(page);
  }

  async function deleteUser(id: number): Promise<void> {
    await usersApi.remove(id);
    const isLastItemOnPage = result?.items.length === 1 && page > 1;
    await fetchPage(isLastItemOnPage ? page - 1 : page);
    if (isLastItemOnPage) setPage(page - 1);
  }

  async function setPassword(id: number, payload: SetPasswordRequest): Promise<void> {
    await usersApi.setPassword(id, payload);
  }

  return {
    users: result?.items ?? [],
    page,
    pageSize: PAGE_SIZE,
    totalCount: result?.totalCount ?? 0,
    isLoading,
    error,
    setPage,
    createUser,
    updateUser,
    deleteUser,
    setPassword,
  };
}
