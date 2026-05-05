"use client";

import { motion } from "framer-motion";

type Option = { value: string; label: string; emoji?: string };

type Props = {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
};

export function QuizChoice({ options, value, onChange }: Props) {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${
              selected
                ? "border-white/20 bg-white/[0.07] shadow-[0_8px_30px_rgba(124,140,255,0.18)]"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
            }`}
          >
            {opt.emoji && (
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-2xl text-2xl transition ${
                  selected ? "bg-white/[0.1]" : "bg-white/[0.04]"
                }`}
              >
                {opt.emoji}
              </span>
            )}
            <span className="flex-1 text-base font-medium text-fg">{opt.label}</span>
            <span
              className={`size-4 rounded-full border transition ${
                selected
                  ? "border-white bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                  : "border-white/20"
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
