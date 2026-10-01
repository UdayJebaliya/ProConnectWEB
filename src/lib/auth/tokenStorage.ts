import { StorageKeys } from "@/lib/constants/storageKeys";
import type { UserInfo } from "@/lib/types/auth";

/**
 * Thin wrapper around localStorage for auth state. Centralized here so the
 * storage mechanism (localStorage today) can be swapped later without
 * touching the api client or auth context.
 */
export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(StorageKeys.accessToken);
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(StorageKeys.refreshToken);
  },

  getUser(): UserInfo | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(StorageKeys.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserInfo;
    } catch {
      return null;
    }
  },

  setSession(accessToken: string, refreshToken: string, user: UserInfo): void {
    window.localStorage.setItem(StorageKeys.accessToken, accessToken);
    window.localStorage.setItem(StorageKeys.refreshToken, refreshToken);
    window.localStorage.setItem(StorageKeys.user, JSON.stringify(user));
  },

  setTokens(accessToken: string, refreshToken: string): void {
    window.localStorage.setItem(StorageKeys.accessToken, accessToken);
    window.localStorage.setItem(StorageKeys.refreshToken, refreshToken);
  },

  clear(): void {
    window.localStorage.removeItem(StorageKeys.accessToken);
    window.localStorage.removeItem(StorageKeys.refreshToken);
    window.localStorage.removeItem(StorageKeys.user);
  },
};
