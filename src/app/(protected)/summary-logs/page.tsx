import { Suspense } from "react";

import { Spinner } from "@/components/common/Spinner";
import { SummaryLogsPageContent } from "@/components/summaryLogs/SummaryLogsPageContent";

export default function SummaryLogsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16 text-gray-400">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <SummaryLogsPageContent />
    </Suspense>
  );
}
