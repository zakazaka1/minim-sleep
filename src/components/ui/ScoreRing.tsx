"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  value: number; // 0..100
  size?: number;
  thickness?: number;
  label?: string;
  sublabel?: string;
  band?: "excellent" | "good" | "okay" | "poor";
  animate?: boolean;
};

const BAND_COLORS = {
  excellent: { stroke: "#5fe6c1", glow: "rgba(95,230,193,0.45)" },
  good: { stroke: "#7c8cff", glow: "rgba(124,140,255,0.45)" },
  okay: { stroke: "#f4c673", glow: "rgba(244,198,115,0.45)" },
  poor: { stroke: "#ff8095", glow: "rgba(255,128,149,0.45)" },
} as const;

export function ScoreRing({
  value,
  size = 240,
  thickness = 14,
  label,
  sublabel,
  band = "good",
  animate = true,
}: Props) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const safe = Math.max(0, Math.min(100, value));
  const dash = (safe / 100) * circumference;

  const [display, setDisplay] = useState(animate ? 0 : safe);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!animate) {
      setDisplay(safe);
      return;
    }
    const start = performance.now();
    const duration = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(safe * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [safe, animate]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const { stroke, glow } = BAND_COLORS[band];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 65%)` }}
      />
      <svg width={size} height={size} className="relative -rotate-90">
        <defs>
          <linearGradient id={`grad-${band}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={thickness}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#grad-${band})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: animate ? 1.2 : 0, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="font-display text-[64px] leading-none tracking-tight text-fg" style={{ color: stroke }}>
          {display}
          <span className="ml-0.5 align-top text-2xl text-fg-soft">%</span>
        </div>
        {label && <p className="mt-2 text-sm font-medium text-fg">{label}</p>}
        {sublabel && <p className="text-xs text-fg-soft">{sublabel}</p>}
      </div>
    </div>
  );
}
