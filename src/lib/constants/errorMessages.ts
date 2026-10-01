/**
 * Fallback copy shown when the API is unreachable or returns a shape we
 * don't recognize. Backend `{ message }` strings (401/403/404/409/502) are
 * always shown as-is instead of these.
 */
export const ErrorMessages = {
  NETWORK_ERROR: "Unable to reach the server. Please check your connection and try again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  VALIDATION_ERROR: "Please check the highlighted fields and try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
} as const;

export const SuccessMessages = {
  ORGANIZATION_CREATED: "Organization created successfully.",
  ORGANIZATION_UPDATED: "Organization updated successfully.",
  ORGANIZATION_DELETED: "Organization deleted successfully.",
  QBO_CONNECTED: "Successfully connected to QuickBooks.",
  QBO_DISCONNECTED: "Successfully disconnected from QuickBooks.",
  PASSWORD_UPDATED: "Password updated successfully.",
  USER_CREATED: "User created. An activation email has been sent.",
  USER_UPDATED: "User updated successfully.",
  USER_DELETED: "User deleted successfully.",
  USER_PASSWORD_SET: "Password set successfully.",
} as const;
