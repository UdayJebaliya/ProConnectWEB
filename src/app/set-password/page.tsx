import { Suspense } from "react";

import { Spinner } from "@/components/common/Spinner";
import { SetPasswordForm } from "@/components/activation/SetPasswordForm";

export default function SetPasswordPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">ProConnect</h1>
        <p className="mt-1 text-sm text-gray-500">Set your password</p>
      </div>
      <Suspense fallback={<Spinner className="h-8 w-8 text-gray-400" />}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}
