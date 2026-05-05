"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { ArrowRight, RefreshCw, Save, Sparkles } from "lucide-react";
import { Aurora } from "@/components/ui/Aurora";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { RecommendationCard } from "@/components/app/RecommendationCard";
import { computeSleepScore, type SleepScore } from "@/lib/sleep-score";
import { guestStorage, type StoredResult } from "@/lib/storage";
import { getTipForDate } from "@/lib/tips";
import type { Answers } from "@/lib/questions";

type ApiResult = {
  id: string;
  createdAt: string;
  score: SleepScore;
  answers: Answers;
};

export function ResultScreen() {
  const params = useSearchParams();
  const id = params.get("id");
  const { status } = useSession();

  const [result, setResult] = useState<StoredResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Try local first.
      const local = guestStorage.loadResults();
      const found = id ? local.find((r) => r.id === id) : local[0];
      if (found && !cancelled) {
        setResult(found);
      }

      if (status === "authenticated" && id && !id.startsWith("local-")) {
        try {
          const res = await fetch(`/api/results/${encodeURIComponent(id)}`);
          if (res.ok) {
            const data = (await res.json()) as ApiResult;
            if (!cancelled) {
              setResult({
                id: data.id,
                createdAt: data.createdAt,
                answers: data.answers,
                score: data.score,
              });
            }
          }
        } catch {
          // ignore
        }
      }
      if (!cancelled) setLoaded(true);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id, status]);

  const recomputed: StoredResult | null = useMemo(() => {
    if (!result) return null;
    // Re-compute defensively (in case score shape evolves).
    return { ...result, score: computeSleepScore(result.answers) };
  }, [result]);

  const tip = useMemo(() => getTipForDate(), []);

  if (!loaded) {
    return (
      <main className="relative isolate min-h-dvh">
        <Aurora />
        <div className="grid min-h-dvh place-items-center text-fg-soft">Загрузка…</div>
      </main>
    );
  }

  if (!recomputed) {
    return (
      <main className="relative isolate min-h-dvh">
        <Aurora />
        <div className="mx-auto max-w-md px-6 py-32 text-center">
          <h1 className="font-display text-3xl tracking-tight">Пока нет результата</h1>
          <p className="mt-3 text-fg-soft">
            Сначала пройди тест — это быстро.
          </p>
          <Link href="/quiz" className="mt-8 inline-block">
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="size-4" />}>
              Начать анализ
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const { score } = recomputed;

  return (
    <main className="relative isolate min-h-dvh">
      <Aurora />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm text-fg-soft transition hover:text-fg">
            ← Главная
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-fg-soft">Твоя оценка сна</p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <GlassCard tone="accent" className="px-6 py-12 text-center sm:px-12">
            <ScoreRing
              value={score.score}
              size={280}
              thickness={16}
              band={score.band}
              label={score.bandLabel}
              sublabel={`По ${recomputed.answers.sleepHours} ч сна`}
            />
            <p className="mt-6 text-sm text-fg-soft">
              Рассчитано по длительности · настроению · стрессу · привычкам · ритму.
            </p>
          </GlassCard>
        </motion.div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard
            label="Фокус"
            value={score.focus}
            unit="%"
            accent="mint"
            hint="Ясность ума сегодня"
          />
          <MetricCard
            label="Усталость"
            value={score.fatigue}
            unit="%"
            accent="rose"
            hint="Чем меньше — тем лучше"
          />
          <MetricCard
            label="Ритм"
            value={score.consistency}
            unit="%"
            accent="violet"
            hint="Стабильность отхода ко сну"
          />
          <MetricCard
            label="Длительность"
            value={recomputed.answers.sleepHours}
            unit="ч"
            accent="blue"
            hint="Прошлой ночью"
          />
        </div>

        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl tracking-tight">На сегодняшнюю ночь</h2>
              <p className="text-sm text-fg-soft">Персональные советы на основе твоих ответов.</p>
            </div>
            <Link href="/quiz">
              <Button variant="ghost" size="sm" icon={<RefreshCw className="size-3.5" />}>
                Пройти заново
              </Button>
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {score.recommendations.map((r, i) => (
              <RecommendationCard key={r.id} rec={r} index={i} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <GlassCard tone="strong" className="p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg-soft">
              <Sparkles className="size-3.5 text-[#5fe6c1]" /> Совет дня
            </div>
            <p className="mt-3 text-balance text-2xl leading-snug tracking-tight">
              {tip}
            </p>
          </GlassCard>
        </section>

        <section className="mt-10">
          {status === "authenticated" ? (
            <GlassCard tone="strong" className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-medium">Сохранено в твоей панели.</p>
                <p className="text-sm text-fg-soft">История, тренды и повторы доступны в любое время.</p>
              </div>
              <Link href="/dashboard">
                <Button variant="primary" size="md" iconRight={<ArrowRight className="size-4" />}>
                  Открыть панель
                </Button>
              </Link>
            </GlassCard>
          ) : (
            <GlassCard tone="accent" className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-medium">Не потеряй это — войди, чтобы сохранить прогресс.</p>
                <p className="text-sm text-fg-soft">
                  Гостевые результаты хранятся только на этом устройстве. Войди, чтобы отслеживать тренды.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                icon={<Save className="size-4" />}
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                Сохранить в Google
              </Button>
            </GlassCard>
          )}
        </section>
      </div>
    </main>
  );
}
