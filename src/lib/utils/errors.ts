import { ApiError } from "@/lib/api/apiError";
import { ErrorMessages } from "@/lib/constants/errorMessages";

/** Extracts a user-facing message from any thrown value, preferring the backend's `{ message }` text. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return ErrorMessages.UNKNOWN_ERROR;
}
