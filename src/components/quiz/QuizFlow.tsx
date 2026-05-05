"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { QUESTIONS, DEFAULT_ANSWERS, type Answers } from "@/lib/questions";
import { computeSleepScore } from "@/lib/sleep-score";
import { guestStorage, type StoredResult } from "@/lib/storage";
import { QuizProgress } from "./QuizProgress";
import { QuizSlider } from "./QuizSlider";
import { QuizChoice } from "./QuizChoice";
import { QuizToggle } from "./QuizToggle";
import { QuizTime } from "./QuizTime";

export function QuizFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const isGuest = params.get("guest") === "1";
  const { data: session, status } = useSession();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [submitting, setSubmitting] = useState(false);

  // Hydrate from local storage on mount.
  useEffect(() => {
    const saved = guestStorage.loadAnswers();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers((a) => ({ ...a, ...saved }));
    }
  }, []);

  // Persist as we go.
  useEffect(() => {
    guestStorage.saveAnswers(answers);
  }, [answers]);

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];
  const isLast = step === total - 1;

  const update = useCallback(<K extends keyof Answers>(k: K, v: Answers[K]) => {
    setAnswers((a) => ({ ...a, [k]: v }));
  }, []);

  const next = () => {
    setDirection(1);
    if (step < total - 1) setStep((s) => s + 1);
    else void handleSubmit();
  };
  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  async function handleSubmit() {
    setSubmitting(true);
    const score = computeSleepScore(answers);
    const stored: StoredResult = {
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      answers,
      score,
    };

    if (status === "authenticated" && !isGuest) {
      try {
        const res = await fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        if (res.ok) {
          const { id } = (await res.json()) as { id: string };
          stored.id = id;
        }
      } catch {
        // fall back to local copy
      }
    }

    guestStorage.saveResult(stored);
    guestStorage.clearAnswers();
    router.push(`/result?id=${encodeURIComponent(stored.id)}`);
  }

  const value = useMemo(() => {
    switch (q.id) {
      case "sleepHours":
        return answers.sleepHours;
      case "stressLevel":
        return answers.stressLevel;
      case "bedtime":
        return answers.bedtime;
      case "wakeup":
        return answers.wakeup;
      case "mood":
        return answers.mood;
      case "consistency":
        return answers.consistency;
      case "caffeineLate":
        return answers.caffeineLate;
      case "screensLate":
        return answers.screensLate;
      case "exerciseRegular":
        return answers.exerciseRegular;
      default:
        return undefined;
    }
  }, [q.id, answers]);

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6 pb-10 pt-6">
      <div className="flex items-center justify-between gap-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-fg-soft transition hover:text-fg"
        >
          <ArrowLeft className="size-4" /> Назад
        </Link>
        <div className="text-xs uppercase tracking-[0.2em] text-fg-soft">
          {isGuest || !session ? "Гостевой режим" : "Авторизован"}
        </div>
      </div>

      <div className="mt-6">
        <QuizProgress step={step} total={total} />
      </div>

      <div className="relative mt-10 flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <h2 className="text-balance font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              {q.title}
            </h2>
            {q.subtitle && (
              <p className="mt-2 text-sm text-fg-soft">{q.subtitle}</p>
            )}

            <div className="mt-10">
              {q.type === "slider" && (
                <QuizSlider
                  min={q.min}
                  max={q.max}
                  step={q.step}
                  unit={q.unit}
                  value={value as number}
                  onChange={(v) => update(q.id as keyof Answers, v as never)}
                />
              )}
              {q.type === "choice" && (
                <QuizChoice
                  options={q.options}
                  value={value as string}
                  onChange={(v) => update(q.id as keyof Answers, v as never)}
                />
              )}
              {q.type === "toggle" && (
                <QuizToggle
                  value={value as boolean}
                  onChange={(v) => update(q.id as keyof Answers, v as never)}
                />
              )}
              {q.type === "time" && (
                <QuizTime
                  value={value as string}
                  onChange={(v) => update(q.id as keyof Answers, v as never)}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="md"
          onClick={prev}
          disabled={step === 0 || submitting}
          icon={<ArrowLeft className="size-4" />}
        >
          Назад
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={next}
          loading={submitting}
          iconRight={isLast ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
        >
          {isLast ? "Посмотреть результат" : "Дальше"}
        </Button>
      </div>
    </div>
  );
}
