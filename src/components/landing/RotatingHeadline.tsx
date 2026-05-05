"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const PHRASES = [
  "Ты недосыпаешь и не замечаешь этого.",
  "Твой сон хуже, чем ты думаешь.",
  "Узнай свой реальный уровень сна.",
];

export function RotatingHeadline() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % PHRASES.length), 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-[1.2em]">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 block text-fg-soft"
        >
          {PHRASES[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
