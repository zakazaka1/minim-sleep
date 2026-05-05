import { Suspense } from "react";
import { Aurora } from "@/components/ui/Aurora";
import { QuizFlow } from "@/components/quiz/QuizFlow";

export default function QuizPage() {
  return (
    <main className="relative isolate min-h-dvh">
      <Aurora />
      <Suspense
        fallback={
          <div className="grid min-h-dvh place-items-center text-fg-soft">
            Loading…
          </div>
        }
      >
        <QuizFlow />
      </Suspense>
    </main>
  );
}
