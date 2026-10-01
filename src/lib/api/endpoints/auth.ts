import { apiRequest, publicRequest } from "@/lib/api/client";
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
} from "@/lib/types/auth";

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return publicRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  refreshToken(payload: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return publicRequest<RefreshTokenResponse>("/api/auth/refresh-token", {
      method: "POST",
      body: payload,
    });
  },

  logout(payload: LogoutRequest): Promise<void> {
    return apiRequest<void>("/api/auth/logout", {
      method: "POST",
      body: payload,
    });
  },

  resetPassword(payload: ResetPasswordRequest): Promise<void> {
    return apiRequest<void>("/api/auth/reset-password", {
      method: "POST",
      body: payload,
    });
  },
};
