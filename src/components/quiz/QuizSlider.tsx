"use client";

type Props = {
  min: number;
  max: number;
  step: number;
  unit?: string;
  value: number;
  onChange: (v: number) => void;
};

export function QuizSlider({ min, max, step, unit = "", value, onChange }: Props) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="text-center">
        <div className="font-display text-7xl leading-none tracking-tight text-fg">
          {Number.isInteger(value) ? value : value.toFixed(1)}
          {unit && <span className="ml-2 align-top text-2xl text-fg-soft">{unit}</span>}
        </div>
      </div>
      <div className="relative mt-10">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/[0.06]" />
        <div
          className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#7c8cff] to-[#5fe6c1]"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10 h-8 w-full cursor-grab appearance-none bg-transparent
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:size-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_4px_24px_rgba(124,140,255,0.55)]
            [&::-webkit-slider-thumb]:ring-4
            [&::-webkit-slider-thumb]:ring-[#7c8cff]/30
            [&::-moz-range-thumb]:size-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-[0_4px_24px_rgba(124,140,255,0.55)]
            "
        />
        <div className="mt-3 flex justify-between text-xs text-fg-soft">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}
