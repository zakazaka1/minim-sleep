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
        <div className="grid min-h-dvh place-items-center text-fg-soft">Loading…</div>
      </main>
    );
  }

  if (!recomputed) {
    return (
      <main className="relative isolate min-h-dvh">
        <Aurora />
        <div className="mx-auto max-w-md px-6 py-32 text-center">
          <h1 className="font-display text-3xl tracking-tight">No result yet</h1>
          <p className="mt-3 text-fg-soft">
            Take the check-in first — it&rsquo;s quick.
          </p>
          <Link href="/quiz" className="mt-8 inline-block">
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="size-4" />}>
              Start the analysis
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
            ← Home
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-fg-soft">Your sleep score</p>
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
              sublabel={`Based on ${recomputed.answers.sleepHours}h sleep`}
            />
            <p className="mt-6 text-sm text-fg-soft">
              Computed from duration · mood · stress · habits · rhythm.
            </p>
          </GlassCard>
        </motion.div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard
            label="Focus"
            value={score.focus}
            unit="%"
            accent="mint"
            hint="Mental sharpness today"
          />
          <MetricCard
            label="Fatigue"
            value={score.fatigue}
            unit="%"
            accent="rose"
            hint="Lower is better"
          />
          <MetricCard
            label="Rhythm"
            value={score.consistency}
            unit="%"
            accent="violet"
            hint="Bedtime consistency"
          />
          <MetricCard
            label="Duration"
            value={recomputed.answers.sleepHours}
            unit="h"
            accent="blue"
            hint="Last night"
          />
        </div>

        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl tracking-tight">For tonight</h2>
              <p className="text-sm text-fg-soft">Personal nudges based on your answers.</p>
            </div>
            <Link href="/quiz">
              <Button variant="ghost" size="sm" icon={<RefreshCw className="size-3.5" />}>
                Re-take
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
              <Sparkles className="size-3.5 text-[#5fe6c1]" /> Tip of the day
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
                <p className="font-medium">Saved to your dashboard.</p>
                <p className="text-sm text-fg-soft">View history, trends, and re-runs anytime.</p>
              </div>
              <Link href="/dashboard">
                <Button variant="primary" size="md" iconRight={<ArrowRight className="size-4" />}>
                  Open dashboard
                </Button>
              </Link>
            </GlassCard>
          ) : (
            <GlassCard tone="accent" className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-medium">Don&rsquo;t lose this — sign in to save your progress.</p>
                <p className="text-sm text-fg-soft">
                  Guest results stay only on this device. Sign in to track trends.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                icon={<Save className="size-4" />}
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                Save with Google
              </Button>
            </GlassCard>
          )}
        </section>
      </div>
    </main>
  );
}
