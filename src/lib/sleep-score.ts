import type { Answers } from "./questions";

export type SleepScore = {
  score: number;
  focus: number;
  fatigue: number;
  consistency: number;
  band: "excellent" | "good" | "okay" | "poor";
  bandLabel: string;
  recommendations: Recommendation[];
};

export type Recommendation = {
  id: string;
  title: string;
  body: string;
  icon: "moon" | "coffee" | "phone" | "activity" | "clock" | "sparkles";
  severity: "info" | "warn" | "tip";
};

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

export function computeSleepScore(a: Answers): SleepScore {
  // Sleep duration: peak at 8h, soft drop on either side.
  const hoursDelta = Math.abs(a.sleepHours - 8);
  const durationScore = clamp(100 - hoursDelta * 12);

  // Mood: directly contributes.
  const moodScore = {
    awful: 25,
    bad: 45,
    okay: 65,
    good: 82,
    perfect: 95,
  }[a.mood];

  // Consistency.
  const consistencyScore = {
    very: 95,
    mostly: 78,
    sometimes: 55,
    rarely: 30,
  }[a.consistency];

  // Stress (10 = overwhelmed).
  const stressScore = clamp(100 - a.stressLevel * 8);

  // Habits.
  let habitScore = 80;
  if (a.caffeineLate) habitScore -= 15;
  if (a.screensLate) habitScore -= 12;
  if (!a.exerciseRegular) habitScore -= 10;
  habitScore = clamp(habitScore);

  // Final score: weighted average.
  const score = Math.round(
    durationScore * 0.3 +
      moodScore * 0.2 +
      consistencyScore * 0.2 +
      stressScore * 0.15 +
      habitScore * 0.15,
  );

  const focus = Math.round(clamp(moodScore * 0.5 + durationScore * 0.4 + (100 - a.stressLevel * 7) * 0.1));
  const fatigue = Math.round(clamp(100 - (durationScore * 0.5 + moodScore * 0.3 + (100 - a.stressLevel * 6) * 0.2)));

  const band: SleepScore["band"] =
    score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "okay" : "poor";
  const bandLabel =
    band === "excellent"
      ? "Excellent"
      : band === "good"
        ? "Good"
        : band === "okay"
          ? "Could be better"
          : "Needs attention";

  return {
    score,
    focus,
    fatigue,
    consistency: consistencyScore,
    band,
    bandLabel,
    recommendations: buildRecommendations(a),
  };
}

function buildRecommendations(a: Answers): Recommendation[] {
  const recs: Recommendation[] = [];

  if (a.sleepHours < 7) {
    recs.push({
      id: "duration-low",
      title: "Aim for 7–9 hours",
      body: `You slept ${a.sleepHours}h. Adults need consistent 7–9h to support memory and immunity.`,
      icon: "moon",
      severity: "warn",
    });
  } else if (a.sleepHours > 9.5) {
    recs.push({
      id: "duration-high",
      title: "Watch for oversleeping",
      body: "Sleeping over 9.5h regularly can leave you groggy. Try a steady wake-up time.",
      icon: "clock",
      severity: "info",
    });
  }

  if (a.caffeineLate) {
    recs.push({
      id: "caffeine",
      title: "Cap caffeine by 2 PM",
      body: "Caffeine has a 5–6h half-life — afternoon coffee is still in your system at midnight.",
      icon: "coffee",
      severity: "warn",
    });
  }

  if (a.screensLate) {
    recs.push({
      id: "screens",
      title: "Dim the last hour",
      body: "Blue light delays melatonin. Try dim warm light and a paper book before bed.",
      icon: "phone",
      severity: "tip",
    });
  }

  if (!a.exerciseRegular) {
    recs.push({
      id: "exercise",
      title: "Move daily, even briefly",
      body: "A 20-minute walk improves deep sleep latency the same night.",
      icon: "activity",
      severity: "tip",
    });
  }

  if (a.consistency === "rarely" || a.consistency === "sometimes") {
    recs.push({
      id: "consistency",
      title: "Lock in a wake-up time",
      body: "Your circadian rhythm responds best to a fixed wake-up — even on weekends.",
      icon: "clock",
      severity: "warn",
    });
  }

  if (a.stressLevel >= 7) {
    recs.push({
      id: "stress",
      title: "Wind-down ritual",
      body: "Try 5 minutes of slow breathing (4s in, 6s out) — it activates the parasympathetic system.",
      icon: "sparkles",
      severity: "tip",
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: "maintain",
      title: "Keep your rhythm",
      body: "Your habits look strong. Protect this routine — especially weekend wake-up times.",
      icon: "sparkles",
      severity: "info",
    });
  }

  return recs;
}
