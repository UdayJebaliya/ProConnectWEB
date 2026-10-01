import type { UserStatus, UserType } from "@/lib/constants/enums";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  organizationId: number | null;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * No `password` field: creating a user sends an activation email instead
 * (backend generates the link; the user sets their own password there).
 */
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  userType?: UserType;
  organizationId?: number;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  userType?: UserType;
  organizationId?: number;
}

export interface SetPasswordRequest {
  newPassword: string;
}
