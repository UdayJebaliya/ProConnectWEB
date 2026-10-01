import { apiRequest } from "@/lib/api/client";
import type { PagedResult } from "@/lib/types/common";
import type {
  CreateOrganizationRequest,
  Organization,
  UpdateOrganizationRequest,
} from "@/lib/types/organization";

export interface ListOrganizationsParams {
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

export const organizationsApi = {
  list(params: ListOrganizationsParams = {}): Promise<PagedResult<Organization>> {
    const query = buildQuery({ page: params.page, pageSize: params.pageSize });
    return apiRequest<PagedResult<Organization>>(`/api/organizations${query}`);
  },

  get(id: number): Promise<Organization> {
    return apiRequest<Organization>(`/api/organizations/${id}`);
  },

  create(payload: CreateOrganizationRequest): Promise<Organization> {
    return apiRequest<Organization>("/api/organizations", {
      method: "POST",
      body: payload,
    });
  },

  update(id: number, payload: UpdateOrganizationRequest): Promise<Organization> {
    return apiRequest<Organization>(`/api/organizations/${id}`, {
      method: "PUT",
      body: payload,
    });
  },

  remove(id: number): Promise<void> {
    return apiRequest<void>(`/api/organizations/${id}`, { method: "DELETE" });
  },
};
