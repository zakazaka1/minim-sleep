import type { ReactNode } from "react";
import { GlassCard } from "./GlassCard";

type Props = {
  label: string;
  value: ReactNode;
  unit?: string;
  trend?: ReactNode;
  accent?: "blue" | "mint" | "violet" | "rose" | "amber";
  hint?: string;
};

const ACCENT: Record<NonNullable<Props["accent"]>, string> = {
  blue: "from-[#7c8cff]/30 to-transparent",
  mint: "from-[#5fe6c1]/30 to-transparent",
  violet: "from-[#b08cff]/30 to-transparent",
  rose: "from-[#ff8095]/30 to-transparent",
  amber: "from-[#f4c673]/30 to-transparent",
};

export function MetricCard({ label, value, unit, trend, accent = "blue", hint }: Props) {
  return (
    <GlassCard className="p-5">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br blur-2xl ${ACCENT[accent]}`}
      />
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-soft">
        {label}
      </p>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-4xl leading-none tracking-tight">
          {value}
        </span>
        {unit && <span className="text-sm text-fg-soft">{unit}</span>}
      </div>
      {trend && <div className="mt-2 text-xs text-fg-soft">{trend}</div>}
      {hint && !trend && <p className="mt-2 text-xs text-fg-soft">{hint}</p>}
    </GlassCard>
  );
}
