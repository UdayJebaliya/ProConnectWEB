import { Suspense } from "react";

import { Spinner } from "@/components/common/Spinner";
import { UsersPageContent } from "@/components/users/UsersPageContent";

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16 text-gray-400">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <UsersPageContent />
    </Suspense>
  );
}
