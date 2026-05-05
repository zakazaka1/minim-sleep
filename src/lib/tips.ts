export const TIPS = [
  "Morning sunlight within 30 min of waking anchors your circadian rhythm.",
  "Keep your bedroom 16–19°C — cool rooms drop core body temperature for deep sleep.",
  "Caffeine has a 5–6h half-life. Last cup before 2 PM.",
  "If you can't sleep within 20 min, get up and read by dim light. Don't watch the clock.",
  "Breathwork: 4s inhale, 6s exhale for 5 minutes lowers heart rate and prepares for sleep.",
  "Alcohol fragments REM sleep — even a single glass shortens deep sleep windows.",
  "A 20-min walk after lunch improves sleep efficiency the same night.",
  "Late screens delay melatonin by ~30 min. Switch to warm/dim light an hour before bed.",
  "Naps are a tool, not a habit — keep them under 25 min and before 3 PM.",
  "Same wake time every day is the single strongest sleep intervention.",
];

export function getTipForDate(date = new Date()): string {
  const day = Math.floor(date.getTime() / 86_400_000);
  return TIPS[day % TIPS.length];
}
