import { Suspense } from "react";
import { ResultScreen } from "@/components/result/ResultScreen";

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center text-fg-soft">Loading…</div>
      }
    >
      <ResultScreen />
    </Suspense>
  );
}
