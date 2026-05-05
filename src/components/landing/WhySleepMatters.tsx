"use client";

import { motion } from "framer-motion";
import { Brain, Droplet, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const ITEMS = [
  {
    icon: Brain,
    accent: "#7c8cff",
    title: "Циркадные ритмы",
    body: "Твоё тело работает по 24-часовым часам. Сбей их — и всё посыпется: фокус, настроение, метаболизм.",
    stat: "24ч",
    statLabel: "внутренние часы",
  },
  {
    icon: Droplet,
    accent: "#5fe6c1",
    title: "Мелатонин",
    body: "Выделяется ночью как сигнал ко сну. Яркий свет после заката подавляет его на ~90 минут.",
    stat: "90м",
    statLabel: "задержка от экранов",
  },
  {
    icon: AlertTriangle,
    accent: "#ff8095",
    title: "Недосып",
    body: "Одна короткая ночь снижает когнитивные функции как лёгкое алкогольное опьянение.",
    stat: "−30%",
    statLabel: "фокус на следующий день",
  },
];

export function WhySleepMatters() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-fg-soft">
          Почему сон важен
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          Тело ведёт счёт.
        </h2>
      </header>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {ITEMS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard tone="strong" className="h-full p-7">
              <div
                className="absolute -right-12 -top-12 size-40 rounded-full blur-2xl"
                style={{ background: `${s.accent}33` }}
              />
              <div
                className="mb-6 inline-flex size-11 items-center justify-center rounded-2xl ring-1 ring-white/10"
                style={{
                  background: `radial-gradient(80% 80% at 30% 30%, ${s.accent}40, transparent 70%), rgba(255,255,255,0.04)`,
                  color: s.accent,
                }}
              >
                <s.icon className="size-5" />
              </div>
              <h3 className="font-display text-2xl tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-soft">{s.body}</p>
              <div className="mt-6 flex items-baseline gap-3 border-t border-white/5 pt-5">
                <span
                  className="font-display text-3xl leading-none"
                  style={{ color: s.accent }}
                >
                  {s.stat}
                </span>
                <span className="text-xs uppercase tracking-wider text-fg-soft">
                  {s.statLabel}
                </span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
