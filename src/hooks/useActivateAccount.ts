"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { usersApi } from "@/lib/api/endpoints/users";
import { getUserIdFromActivationToken } from "@/lib/utils/jwt";
import { getErrorMessage } from "@/lib/utils/errors";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function useActivateAccount() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const userId = useMemo(() => (token ? getUserIdFromActivationToken(token) : null), [token]);
  const isLinkValid = Boolean(token && userId !== null);

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(newPassword: string): Promise<void> {
    if (!token || userId === null) return;
    setStatus("submitting");
    setError(null);
    try {
      await usersApi.setPasswordWithActivationToken(userId, { newPassword }, token);
      setStatus("success");
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus("error");
    }
  }

  return { isLinkValid, status, error, submit };
}
