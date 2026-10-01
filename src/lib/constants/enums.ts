export enum UserType {
  SuperAdmin = 1,
  OrganizationUser = 2,
}

export const UserTypeLabel: Record<UserType, string> = {
  [UserType.SuperAdmin]: "Super Admin",
  [UserType.OrganizationUser]: "Organization User",
};

export type UserStatus = "active" | "disabled";

export const UserStatusLabel: Record<UserStatus, string> = {
  active: "Active",
  disabled: "Disabled",
};
