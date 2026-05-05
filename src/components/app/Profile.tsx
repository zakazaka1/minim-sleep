"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { ArrowRight, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { computeSleepScore } from "@/lib/sleep-score";
import { guestStorage, type StoredResult } from "@/lib/storage";

type ApiResults = { results: StoredResult[] };

export function Profile() {
  const { data: session, status } = useSession();
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
            const data = (await res.json()) as ApiResults;
            merged = data.results;
          }
        } catch {
          // ignore
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

  const enriched = useMemo(
    () => results.map((r) => ({ ...r, score: computeSleepScore(r.answers) })),
    [results],
  );

  const avg = useMemo(() => {
    if (!enriched.length) return 0;
    return Math.round(enriched.reduce((sum, r) => sum + r.score.score, 0) / enriched.length);
  }, [enriched]);

  const trend = useMemo(() => {
    if (enriched.length < 2) return 0;
    const recent = enriched.slice(0, 3).reduce((s, r) => s + r.score.score, 0) / Math.min(3, enriched.length);
    const prior = enriched.slice(3, 9);
    if (!prior.length) return 0;
    const priorAvg = prior.reduce((s, r) => s + r.score.score, 0) / prior.length;
    return Math.round(recent - priorAvg);
  }, [enriched]);

  if (!loaded) {
    return <div className="grid min-h-[60dvh] place-items-center text-fg-soft">Loading…</div>;
  }

  return (
    <div className="mt-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-fg-soft">Profile</p>
        <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight">
          {session?.user?.name ?? "Guest"}.
        </h1>
        <p className="mt-1 text-fg-soft">
          {session?.user?.email ?? "Your results stay on this device."}
        </p>
      </motion.div>

      {!session && (
        <GlassCard tone="accent" className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="font-medium">Sign in to keep your history.</p>
            <p className="text-sm text-fg-soft">
              Track trends across nights, devices, and timezones.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => signIn("google", { callbackUrl: "/profile" })}
          >
            Sign in with Google
          </Button>
        </GlassCard>
      )}

      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-soft">Average</p>
          <p className="mt-2 font-display text-4xl leading-none">
            {avg}
            <span className="ml-0.5 align-top text-xl text-fg-soft">%</span>
          </p>
          <p className="mt-2 text-xs text-fg-soft">across {enriched.length} runs</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-soft">Trend</p>
          <p
            className="mt-2 inline-flex items-center gap-2 font-display text-4xl leading-none"
            style={{ color: trend >= 0 ? "#5fe6c1" : "#ff8095" }}
          >
            {trend >= 0 ? <TrendingUp className="size-6" /> : <TrendingDown className="size-6" />}
            {trend >= 0 ? "+" : ""}
            {trend}
          </p>
          <p className="mt-2 text-xs text-fg-soft">vs. previous</p>
        </GlassCard>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-tight">History</h2>
          <Link href="/quiz">
            <Button variant="ghost" size="sm" iconRight={<ArrowRight className="size-3.5" />}>
              New check-in
            </Button>
          </Link>
        </div>

        {enriched.length === 0 ? (
          <GlassCard className="mt-4 p-8 text-center">
            <Sparkles className="mx-auto size-5 text-[#7c8cff]" />
            <p className="mt-3 font-display text-2xl tracking-tight">No history yet</p>
            <p className="mt-1 text-sm text-fg-soft">
              Take your first check-in to see trends.
            </p>
          </GlassCard>
        ) : (
          <div className="mt-4 space-y-3">
            {enriched.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <GlassCard className="flex items-center gap-4 p-4">
                  <div
                    className="grid size-12 place-items-center rounded-2xl text-sm font-medium"
                    style={{
                      background: `radial-gradient(80% 80% at 30% 30%, ${bandColor(r.score.band)}40, transparent 70%), rgba(255,255,255,0.04)`,
                      color: bandColor(r.score.band),
                    }}
                  >
                    {r.score.score}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium tracking-tight">{r.score.bandLabel}</p>
                    <p className="text-xs text-fg-soft">
                      {new Date(r.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      · {r.answers.sleepHours}h
                    </p>
                  </div>
                  <Link href={`/result?id=${encodeURIComponent(r.id)}`} className="text-sm text-fg-soft hover:text-fg">
                    View →
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function bandColor(band: "excellent" | "good" | "okay" | "poor") {
  return {
    excellent: "#5fe6c1",
    good: "#7c8cff",
    okay: "#f4c673",
    poor: "#ff8095",
  }[band];
}
