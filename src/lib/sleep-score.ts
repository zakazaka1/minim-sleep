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
      ? "Отлично"
      : band === "good"
        ? "Хорошо"
        : band === "okay"
          ? "Можно лучше"
          : "Требует внимания";

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
      title: "Стремись к 7–9 часам",
      body: `Ты спал ${a.sleepHours}ч. Взрослым нужны стабильные 7–9 ч для памяти и иммунитета.`,
      icon: "moon",
      severity: "warn",
    });
  } else if (a.sleepHours > 9.5) {
    recs.push({
      id: "duration-high",
      title: "Осторожно с пересыпом",
      body: "Регулярный сон больше 9,5 ч может вызвать вялость. Держи стабильное время подъёма.",
      icon: "clock",
      severity: "info",
    });
  }

  if (a.caffeineLate) {
    recs.push({
      id: "caffeine",
      title: "Кофеин до 14:00",
      body: "Период полувыведения кофеина — 5–6 часов: вечером он всё ещё в крови.",
      icon: "coffee",
      severity: "warn",
    });
  }

  if (a.screensLate) {
    recs.push({
      id: "screens",
      title: "Приглуши свет за час до сна",
      body: "Синий свет задерживает мелатонин. Тёплый тусклый свет и бумажная книга лучше.",
      icon: "phone",
      severity: "tip",
    });
  }

  if (!a.exerciseRegular) {
    recs.push({
      id: "exercise",
      title: "Двигайся ежедневно, хотя бы немного",
      body: "20 минут ходьбы улучшают глубину сна в ту же ночь.",
      icon: "activity",
      severity: "tip",
    });
  }

  if (a.consistency === "rarely" || a.consistency === "sometimes") {
    recs.push({
      id: "consistency",
      title: "Зафиксируй время подъёма",
      body: "Циркадный ритм лучше всего реагирует на фиксированное время подъёма — даже на выходных.",
      icon: "clock",
      severity: "warn",
    });
  }

  if (a.stressLevel >= 7) {
    recs.push({
      id: "stress",
      title: "Ритуал расслабления",
      body: "5 минут медленного дыхания (4 с вдох, 6 с выдох) — это активирует парасимпатику.",
      icon: "sparkles",
      severity: "tip",
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: "maintain",
      title: "Держи свой ритм",
      body: "Привычки в порядке. Сохрани этот режим — особенно время подъёма на выходных.",
      icon: "sparkles",
      severity: "info",
    });
  }

  return recs;
}
