"use client";

import { motion } from "framer-motion";

export function QuizProgress({ step, total }: { step: number; total: number }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#7c8cff] via-[#b08cff] to-[#5fe6c1]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <span className="shrink-0 text-xs tabular-nums text-fg-soft">
        {step + 1} / {total}
      </span>
    </div>
  );
}
