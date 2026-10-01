"use client";

import Link from "next/link";

import { useQboCallback } from "@/hooks/useQboCallback";
import { Spinner } from "@/components/common/Spinner";
import { AppRoutes } from "@/lib/constants/routes";
import { formatDate } from "@/lib/utils/formatDate";

export function QboConnectCallback() {
  const { status, message, tokenConfig } = useQboCallback();

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
      {status === "processing" && (
        <>
          <Spinner className="mx-auto h-8 w-8 text-indigo-600" />
          <p className="mt-4 text-sm text-gray-600">Finishing your QuickBooks connection…</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            ✓
          </div>
          <h1 className="mt-4 text-lg font-semibold text-gray-900">Connected to QuickBooks</h1>
          {tokenConfig?.realmId && (
            <p className="mt-1 text-sm text-gray-500">Company (Realm ID): {tokenConfig.realmId}</p>
          )}
          {tokenConfig?.accessExpiry && (
            <p className="mt-1 text-sm text-gray-500">
              Access expires: {formatDate(tokenConfig.accessExpiry)}
            </p>
          )}
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            ✕
          </div>
          <h1 className="mt-4 text-lg font-semibold text-gray-900">Connection failed</h1>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </>
      )}

      {status !== "processing" && (
        <Link
          href={AppRoutes.organizations}
          className="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Back to organizations
        </Link>
      )}
    </div>
  );
}
