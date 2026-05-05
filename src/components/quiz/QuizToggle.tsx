"use client";

import { motion } from "framer-motion";

type Props = {
  value: boolean;
  onChange: (v: boolean) => void;
};

export function QuizToggle({ value, onChange }: Props) {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {[
        { v: true, label: "Yes", hint: "It happened" },
        { v: false, label: "No", hint: "Didn't this time" },
      ].map((opt, i) => {
        const selected = value === opt.v;
        return (
          <motion.button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.v)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden rounded-2xl border p-6 text-left transition ${
              selected
                ? "border-white/20 bg-white/[0.07]"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
            }`}
          >
            <div
              className={`pointer-events-none absolute -right-10 -top-10 size-32 rounded-full blur-2xl transition ${
                selected ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background: opt.v ? "rgba(255,128,149,0.35)" : "rgba(95,230,193,0.35)",
              }}
            />
            <p className="font-display text-3xl tracking-tight">{opt.label}</p>
            <p className="mt-1 text-sm text-fg-soft">{opt.hint}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
