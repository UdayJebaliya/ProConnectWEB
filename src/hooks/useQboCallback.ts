"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { qboApi } from "@/lib/api/endpoints/qbo";
import { qboConnectStorage } from "@/lib/qbo/qboConnectStorage";
import { getErrorMessage } from "@/lib/utils/errors";
import type { TokenConfiguration } from "@/lib/types/qbo";

type QboCallbackStatus = "processing" | "success" | "error";

export function useQboCallback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<QboCallbackStatus>("processing");
  const [message, setMessage] = useState<string | null>(null);
  const [tokenConfig, setTokenConfig] = useState<TokenConfiguration | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const code = searchParams.get("code");
      const realmId = searchParams.get("realmId");
      const state = searchParams.get("state");
      const context = qboConnectStorage.read();

      if (!code || !realmId || !state) {
        setStatus("error");
        setMessage("QuickBooks did not return the expected code/realmId/state.");
        return;
      }
      if (!context || context.state !== state) {
        setStatus("error");
        setMessage("Connection context expired or doesn't match. Please retry from the organizations page.");
        return;
      }

      try {
        const result = await qboApi.callback({
          organizationId: context.organizationId,
          code,
          realmId,
          state,
        });
        if (cancelled) return;
        setTokenConfig(result);
        setStatus("success");
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(getErrorMessage(error));
      } finally {
        qboConnectStorage.clear();
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return { status, message, tokenConfig };
}
