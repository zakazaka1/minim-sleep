"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, Battery, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { RecommendationCard } from "@/components/app/RecommendationCard";
import { computeSleepScore } from "@/lib/sleep-score";
import { guestStorage, type StoredResult } from "@/lib/storage";
import { getTipForDate } from "@/lib/tips";

type ApiResult = StoredResult;

export function Dashboard() {
  const { status } = useSession();
  const [results, setResults] = useState<StoredResult[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let merged: StoredResult[] = guestStorage.loadResults();
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/results");
          if (res.ok) {
            const data = (await res.json()) as { results: ApiResult[] };
            merged = data.results;
          }
        } catch {
          // ignore network errors, use local
        }
      }
      if (!cancelled) {
        setResults(merged);
        setLoaded(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [status]);

  const latest = results[0];
  const tip = useMemo(() => getTipForDate(), []);
  const score = useMemo(
    () => (latest ? computeSleepScore(latest.answers) : null),
    [latest],
  );

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Late night";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  if (!loaded) {
    return <div className="grid min-h-[60dvh] place-items-center text-fg-soft">Loading…</div>;
  }

  if (!latest || !score) {
    return (
      <div className="mt-10">
        <GlassCard tone="accent" className="p-10 text-center">
          <h1 className="font-display text-3xl tracking-tight">{greeting}.</h1>
          <p className="mt-3 text-fg-soft">
            No score yet. Take a 90-second check-in to see your sleep clearly.
          </p>
          <Link href="/quiz" className="mt-8 inline-block">
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="size-4" />}>
              Start the analysis
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-fg-soft">{greeting}</p>
        <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight">
          Your sleep <span className="text-gradient">today</span>.
        </h1>
      </motion.div>

      <GlassCard tone="accent" className="overflow-hidden">
        <div className="grid items-center gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-10">
          <div className="mx-auto sm:mx-0">
            <ScoreRing
              value={score.score}
              size={220}
              thickness={14}
              band={score.band}
              label={score.bandLabel}
            />
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-fg-soft">Last check-in</p>
            <p className="font-display text-2xl leading-snug tracking-tight">
              {timeAgo(latest.createdAt)} · {latest.answers.sleepHours}h sleep
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Mini icon={<Zap className="size-4" />} label="Focus" value={`${score.focus}%`} color="#5fe6c1" />
              <Mini icon={<Battery className="size-4" />} label="Fatigue" value={`${score.fatigue}%`} color="#ff8095" />
              <Mini icon={<Sparkles className="size-4" />} label="Rhythm" value={`${score.consistency}%`} color="#b08cff" />
            </div>
            <div className="pt-3">
              <Link href="/quiz">
                <Button variant="secondary" size="sm" iconRight={<ArrowRight className="size-3.5" />}>
                  Re-take check-in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>

      <section className="space-y-3">
        <h2 className="font-display text-2xl tracking-tight">Tonight&rsquo;s nudges</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {score.recommendations.slice(0, 4).map((r, i) => (
            <RecommendationCard key={r.id} rec={r} index={i} />
          ))}
        </div>
      </section>

      <GlassCard tone="strong" className="p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg-soft">
          <Sparkles className="size-3.5 text-[#5fe6c1]" /> Tip of the day
        </div>
        <p className="mt-3 text-balance text-xl leading-snug tracking-tight">{tip}</p>
      </GlassCard>
    </div>
  );
}

function Mini({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-fg-soft">
        <span style={{ color }}>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="mt-1.5 font-display text-xl leading-none" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
