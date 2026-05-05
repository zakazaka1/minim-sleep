"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Gauge, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const STEPS = [
  {
    icon: ClipboardCheck,
    accent: "#7c8cff",
    title: "Take the check-in",
    body: "Nine quiet questions about your night. Sliders, taps, no typing.",
  },
  {
    icon: Gauge,
    accent: "#5fe6c1",
    title: "Get your sleep score",
    body: "A weighted, transparent score — duration, mood, stress, habits, rhythm.",
  },
  {
    icon: Sparkles,
    accent: "#b08cff",
    title: "Personal recommendations",
    body: "A few actionable nudges, calibrated to what you answered. No fluff.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-fg-soft">
          How it works
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          Three quiet steps.
        </h2>
        <p className="mt-4 text-base text-fg-soft">
          Designed to feel like a fitness app, but for the part of life you do
          with your eyes closed.
        </p>
      </header>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard className="group h-full p-7 transition hover:bg-white/[0.05]">
              <div
                className="mb-6 inline-flex size-11 items-center justify-center rounded-2xl ring-1 ring-white/10 transition group-hover:scale-105"
                style={{
                  background: `radial-gradient(80% 80% at 30% 30%, ${s.accent}40, transparent 70%), rgba(255,255,255,0.04)`,
                  color: s.accent,
                }}
              >
                <s.icon className="size-5" />
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-fg-soft">
                Step {i + 1}
              </p>
              <h3 className="mt-2 font-display text-2xl tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-soft">{s.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
