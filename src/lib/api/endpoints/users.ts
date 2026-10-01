import { apiRequest, requestWithBearerToken } from "@/lib/api/client";
import type { PagedResult } from "@/lib/types/common";
import type { CreateUserRequest, SetPasswordRequest, UpdateUserRequest, User } from "@/lib/types/user";

export interface ListUsersParams {
  organizationId?: number;
  page?: number;
  pageSize?: number;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export const usersApi = {
  list(params: ListUsersParams = {}): Promise<PagedResult<User>> {
    const query = buildQuery({
      organizationId: params.organizationId,
      page: params.page,
      pageSize: params.pageSize,
    });
    return apiRequest<PagedResult<User>>(`/api/users${query}`);
  },

  get(id: number): Promise<User> {
    return apiRequest<User>(`/api/users/${id}`);
  },

  create(payload: CreateUserRequest): Promise<User> {
    return apiRequest<User>("/api/users", { method: "POST", body: payload });
  },

  update(id: number, payload: UpdateUserRequest): Promise<User> {
    return apiRequest<User>(`/api/users/${id}`, { method: "PUT", body: payload });
  },

  remove(id: number): Promise<void> {
    return apiRequest<void>(`/api/users/${id}`, { method: "DELETE" });
  },

  /** Admin-initiated reset: caller is an authenticated admin, no current password needed. */
  setPassword(id: number, payload: SetPasswordRequest): Promise<void> {
    return apiRequest<void>(`/api/users/${id}/set-password`, { method: "POST", body: payload });
  },

  /**
   * Self-service activation: caller isn't logged in — the one-time token
   * from the emailed activation link stands in for a session access token.
   */
  setPasswordWithActivationToken(
    id: number,
    payload: SetPasswordRequest,
    activationToken: string,
  ): Promise<void> {
    return requestWithBearerToken<void>(`/api/users/${id}/set-password`, activationToken, {
      method: "POST",
      body: payload,
    });
  },
};
