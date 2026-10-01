"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { useActivateAccount } from "@/hooks/useActivateAccount";
import { Spinner } from "@/components/common/Spinner";
import { AppRoutes } from "@/lib/constants/routes";

export function SetPasswordForm() {
  const { isLinkValid, status, error, submit } = useActivateAccount();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  if (!isLinkValid) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="text-lg font-semibold text-gray-900">Invalid activation link</h1>
        <p className="mt-2 text-sm text-gray-500">
          This link is missing or malformed. Please request a new activation email.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          ✓
        </div>
        <h1 className="mt-4 text-lg font-semibold text-gray-900">Password set</h1>
        <p className="mt-1 text-sm text-gray-500">You can now sign in with your new password.</p>
        <Link
          href={AppRoutes.login}
          className="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    setFormError(null);
    await submit(password);
  }

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
          Confirm password
        </label>
        <input
          id="confirm-password"
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {(formError || error) && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError ?? error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting && <Spinner className="h-4 w-4" />}
        Set password
      </button>
    </form>
  );
}
