"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function QuizTime({ value, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="font-display text-7xl leading-none tracking-tight tabular-nums">
        {value || "00:00"}
      </div>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glass-strong w-full max-w-xs rounded-2xl px-5 py-4 text-center text-xl tracking-wider text-fg outline-none transition focus:border-white/20"
      />
    </div>
  );
}
