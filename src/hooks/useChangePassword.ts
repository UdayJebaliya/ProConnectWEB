"use client";

import { useState } from "react";

import { authApi } from "@/lib/api/endpoints/auth";

export function useChangePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ currentPassword, newPassword });
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, changePassword };
}
