import type { UserType } from "@/lib/constants/enums";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  id: number;
  email: string;
  userType: UserType;
  organizationId: number | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: UserInfo;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  currentPassword: string;
  newPassword: string;
}
