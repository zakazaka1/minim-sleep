"use client";

import { motion } from "framer-motion";
import {
  Annoyed,
  Baby,
  Briefcase,
  Frown,
  GraduationCap,
  Heart,
  type LucideIcon,
  Meh,
  Moon,
  Rocket,
  Shuffle,
  Smile,
  Sparkles,
  Target,
} from "lucide-react";
import type { ChoiceIcon } from "@/lib/questions";

const ICONS: Record<ChoiceIcon, LucideIcon> = {
  baby: Baby,
  "graduation-cap": GraduationCap,
  rocket: Rocket,
  briefcase: Briefcase,
  annoyed: Annoyed,
  frown: Frown,
  meh: Meh,
  smile: Smile,
  heart: Heart,
  target: Target,
  sparkles: Sparkles,
  moon: Moon,
  shuffle: Shuffle,
};

type Option = { value: string; label: string; icon?: ChoiceIcon };

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
        const Icon = opt.icon ? ICONS[opt.icon] : null;
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
            {Icon && (
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-2xl transition ${
                  selected ? "bg-white/[0.1] text-fg" : "bg-white/[0.04] text-fg-soft"
                }`}
                style={
                  selected
                    ? {
                        background:
                          "radial-gradient(80% 80% at 30% 30%, rgba(124,140,255,0.35), transparent 70%), rgba(255,255,255,0.05)",
                      }
                    : undefined
                }
              >
                <Icon className="size-5" strokeWidth={1.6} />
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
