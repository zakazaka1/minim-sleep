"use client";

import { motion } from "framer-motion";
import { Activity, Clock, Coffee, Moon, Smartphone, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Recommendation } from "@/lib/sleep-score";

const ICONS = {
  moon: Moon,
  coffee: Coffee,
  phone: Smartphone,
  activity: Activity,
  clock: Clock,
  sparkles: Sparkles,
} as const;

const TONE = {
  warn: { color: "#ff8095", glow: "rgba(255,128,149,0.25)" },
  tip: { color: "#5fe6c1", glow: "rgba(95,230,193,0.25)" },
  info: { color: "#7c8cff", glow: "rgba(124,140,255,0.25)" },
} as const;

export function RecommendationCard({ rec, index = 0 }: { rec: Recommendation; index?: number }) {
  const Icon = ICONS[rec.icon];
  const tone = TONE[rec.severity];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard className="flex h-full items-start gap-4 p-5">
        <div
          className="grid size-11 shrink-0 place-items-center rounded-2xl ring-1 ring-white/10"
          style={{
            background: `radial-gradient(80% 80% at 30% 30%, ${tone.color}40, transparent 70%), rgba(255,255,255,0.04)`,
            color: tone.color,
            boxShadow: `0 6px 20px ${tone.glow}`,
          }}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <p className="font-medium tracking-tight">{rec.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-fg-soft">{rec.body}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
