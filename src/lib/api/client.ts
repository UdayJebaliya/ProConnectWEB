import { ApiError } from "@/lib/api/apiError";
import { AppRoutes } from "@/lib/constants/routes";
import { ErrorMessages } from "@/lib/constants/errorMessages";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import type { RefreshTokenResponse } from "@/lib/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5195";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip attaching the Authorization header (used by login). */
  skipAuth?: boolean;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data && typeof data.message === "string") {
      return data.message;
    }
  } catch {
    // Response had no JSON body (or wasn't the {message} shape) — fall through.
  }
  return response.statusText || ErrorMessages.UNKNOWN_ERROR;
}

async function rawRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, skipAuth, ...rest } = options;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (!skipAuth) {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      (finalHeaders as Record<string, string>).Authorization = `Bearer ${accessToken}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, ErrorMessages.NETWORK_ERROR);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  return (await response.json()) as T;
}

let refreshPromise: Promise<RefreshTokenResponse> | null = null;

function refreshSession(): Promise<RefreshTokenResponse> {
  if (!refreshPromise) {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(new ApiError(401, ErrorMessages.SESSION_EXPIRED));
    }

    refreshPromise = rawRequest<RefreshTokenResponse>("/api/auth/refresh-token", {
      method: "POST",
      body: { refreshToken },
      skipAuth: true,
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function redirectToLogin(): void {
  tokenStorage.clear();
  if (typeof window !== "undefined") {
    window.location.href = AppRoutes.login;
  }
}

/**
 * Authenticated request. Attaches the access token, and on a 401 transparently
 * refreshes the session once and retries before giving up and logging out.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  try {
    return await rawRequest<T>(path, options);
  } catch (error) {
    const isUnauthorized = error instanceof ApiError && error.status === 401;
    if (!isUnauthorized || options.skipAuth) {
      throw error;
    }

    try {
      const refreshed = await refreshSession();
      tokenStorage.setTokens(refreshed.accessToken, refreshed.refreshToken);
    } catch {
      redirectToLogin();
      throw new ApiError(401, ErrorMessages.SESSION_EXPIRED);
    }

    return rawRequest<T>(path, options);
  }
}

/** Unauthenticated request (login, refresh-token). */
export function publicRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return rawRequest<T>(path, { ...options, skipAuth: true });
}

/**
 * Request authenticated with an explicit bearer token instead of the stored
 * session's access token — used for the account-activation "set password"
 * call, where the caller isn't logged in and only has the one-time token
 * from the activation email link.
 */
export function requestWithBearerToken<T>(
  path: string,
  bearerToken: string,
  options: RequestOptions = {},
): Promise<T> {
  return rawRequest<T>(path, {
    ...options,
    skipAuth: true,
    headers: { ...options.headers, Authorization: `Bearer ${bearerToken}` },
  });
}
