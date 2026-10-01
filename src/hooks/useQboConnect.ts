"use client";

import { useState } from "react";

import { qboApi } from "@/lib/api/endpoints/qbo";
import { qboConnectStorage } from "@/lib/qbo/qboConnectStorage";
import { getErrorMessage } from "@/lib/utils/errors";
import { useToast } from "@/context/ToastContext";
import { SuccessMessages } from "@/lib/constants/errorMessages";

export function useQboConnect() {
  const { showSuccess, showError } = useToast();
  const [connectingOrgId, setConnectingOrgId] = useState<number | null>(null);
  const [disconnectingOrgId, setDisconnectingOrgId] = useState<number | null>(null);

  async function connect(organizationId: number): Promise<void> {
    setConnectingOrgId(organizationId);
    try {
      const { redirectUrl, state } = await qboApi.getConnectUrl(organizationId);
      qboConnectStorage.save({ organizationId, state });
      window.location.href = redirectUrl;
    } catch (error) {
      showError(getErrorMessage(error));
      setConnectingOrgId(null);
    }
  }

  async function disconnect(organizationId: number): Promise<boolean> {
    setDisconnectingOrgId(organizationId);
    try {
      await qboApi.disconnect(organizationId);
      showSuccess(SuccessMessages.QBO_DISCONNECTED);
      return true;
    } catch (error) {
      showError(getErrorMessage(error));
      return false;
    } finally {
      setDisconnectingOrgId(null);
    }
  }

  return { connect, disconnect, connectingOrgId, disconnectingOrgId };
}
