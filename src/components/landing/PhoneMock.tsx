"use client";

import { motion } from "framer-motion";
import { Moon, Sparkles } from "lucide-react";
import { ScoreRing } from "@/components/ui/ScoreRing";

export function PhoneMock() {
  return (
    <div className="relative isolate flex items-center justify-center">
      {/* glow */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-[60px] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(124,140,255,0.45),transparent_70%)] blur-2xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[640px] w-[320px] rounded-[52px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-3 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl"
      >
        <div className="absolute inset-x-1/2 top-2 h-6 w-32 -translate-x-1/2 rounded-full bg-black/80 ring-1 ring-white/10" />
        <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-[#0a0c10]">
          {/* aurora inside phone */}
          <div className="pointer-events-none absolute -left-10 -top-20 size-72 rounded-full bg-[#7c8cff]/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 size-72 rounded-full bg-[#5fe6c1]/25 blur-3xl" />

          <div className="relative flex h-full flex-col px-5 pt-12 pb-6">
            <div className="flex items-center justify-between text-[11px] text-fg-soft">
              <span>23:41</span>
              <span className="inline-flex items-center gap-1">
                <Moon className="size-3" /> Сон
              </span>
            </div>

            <p className="mt-7 text-[13px] uppercase tracking-[0.18em] text-fg-soft">
              Сегодня ночью
            </p>
            <h3 className="font-display text-3xl leading-tight tracking-tight">
              Твоя оценка сна
            </h3>

            <div className="mt-3 flex justify-center">
              <ScoreRing
                value={83}
                size={210}
                thickness={12}
                band="excellent"
                label="Отлично"
                sublabel="Лучше чем 78% прошлой недели"
                animate={false}
              />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { l: "Фокус", v: "79", c: "#5fe6c1" },
                { l: "Усталость", v: "17", c: "#7c8cff" },
                { l: "Серия", v: "4д", c: "#b08cff" },
              ].map((m) => (
                <div
                  key={m.l}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center"
                >
                  <div
                    className="font-display text-2xl leading-none"
                    style={{ color: m.c }}
                  >
                    {m.v}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-fg-soft">
                    {m.l}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto rounded-2xl border border-white/5 bg-white/[0.03] p-3">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="size-3.5 text-[#5fe6c1]" />
                <span className="font-medium">Совет дня</span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-fg-soft">
                Утреннее солнце в течение 30 минут после пробуждения задаёт ритм.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating chips */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="glass-strong absolute -left-14 top-24 hidden rounded-2xl px-4 py-3 sm:block"
      >
        <p className="text-[10px] uppercase tracking-widest text-fg-soft">Глубокий сон</p>
        <p className="font-display text-2xl leading-none">1ч 42м</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7 }}
        className="glass-strong absolute -right-10 bottom-32 hidden rounded-2xl px-4 py-3 sm:block"
      >
        <p className="text-[10px] uppercase tracking-widest text-fg-soft">Серия</p>
        <p className="font-display text-2xl leading-none text-[#5fe6c1]">4 дня</p>
      </motion.div>
    </div>
  );
}
