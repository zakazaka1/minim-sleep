import { AGE_NORMS, type AgeBand, type Answers } from "./questions";

export type SleepScore = {
  score: number;
  focus: number;
  fatigue: number;
  consistency: number;
  band: "excellent" | "good" | "okay" | "poor";
  bandLabel: string;
  recommendations: Recommendation[];
  norm: {
    age: AgeBand;
    min: number;
    max: number;
    hours: number;
    /** signed delta vs nearest bound; negative => below norm, positive => above, 0 => within range */
    deltaHours: number;
    /** human-readable Russian sentence */
    summary: string;
  };
  causes: Cause[];
  forecast: {
    declineWeekly: number; // % chance / score points expected to drop in a week without action
    improveWeekly: number; // score points expected to gain in a week with action
    decline: string[];
    improve: string[];
  };
};

export type Recommendation = {
  id: string;
  title: string;
  body: string;
  icon: "moon" | "coffee" | "phone" | "activity" | "clock" | "sparkles";
  severity: "info" | "warn" | "tip";
};

export type Cause = {
  id: string;
  title: string;
  detail: string;
  icon: "moon" | "coffee" | "phone" | "clock" | "zap" | "moon-star";
  severity: "warn" | "tip";
  weight: number; // for sorting
};

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

function durationDelta(hours: number, age: AgeBand): { delta: number; abs: number } {
  const { min, max } = AGE_NORMS[age];
  if (hours >= min && hours <= max) return { delta: 0, abs: 0 };
  if (hours < min) return { delta: hours - min, abs: min - hours };
  return { delta: hours - max, abs: hours - max };
}

function durationPoints(absDeltaHours: number): number {
  // Per spec: in range → +30, −1h → +20, −2h → +10, beyond → 0
  if (absDeltaHours <= 0.25) return 30;
  if (absDeltaHours <= 1) return 20;
  if (absDeltaHours <= 2) return 10;
  return 0;
}

function stressPoints(level: number): number {
  // 0–10. Low (0–3) → +15, mid (4–6) → +10, high (7+) → +5
  if (level <= 3) return 15;
  if (level <= 6) return 10;
  return 5;
}

function moodPoints(mood: Answers["mood"]): number {
  return { awful: 3, bad: 6, okay: 9, good: 12, perfect: 15 }[mood];
}

function consistencyPoints(c: Answers["consistency"]): number {
  return { rarely: 2, sometimes: 5, mostly: 8, very: 10 }[c];
}

function habitsPoints(a: Answers): number {
  let p = 0;
  if (!a.caffeineLate) p += 5;
  if (!a.screensLate) p += 5;
  if (a.exerciseRegular) p += 5;
  return p;
}

export function computeSleepScore(a: Answers): SleepScore {
  const { delta: signedDelta, abs: absDelta } = durationDelta(a.sleepHours, a.age);
  const dPts = durationPoints(absDelta);
  const wPts = a.wakeups ? 5 : 15;
  const sPts = stressPoints(a.stressLevel);
  const mPts = moodPoints(a.mood);
  const cPts = consistencyPoints(a.consistency);
  const hPts = habitsPoints(a);

  const score = clamp(dPts + wPts + sPts + mPts + cPts + hPts, 0, 100);

  // Derived metrics for cards.
  const durationScore = (dPts / 30) * 100;
  const moodScore = (mPts / 15) * 100;
  const consistencyScore = (cPts / 10) * 100;
  const stressScore = (sPts / 15) * 100;
  const wakeupsScore = (wPts / 15) * 100;

  const focus = Math.round(
    clamp(moodScore * 0.4 + durationScore * 0.4 + wakeupsScore * 0.2),
  );
  const fatigue = Math.round(
    clamp(100 - (durationScore * 0.5 + wakeupsScore * 0.25 + stressScore * 0.25)),
  );

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

  const norm = buildNorm(a, signedDelta);
  const causes = buildCauses(a, signedDelta);
  const forecast = buildForecast(a, score, causes);

  return {
    score,
    focus,
    fatigue,
    consistency: Math.round(consistencyScore),
    band,
    bandLabel,
    recommendations: buildRecommendations(a, signedDelta),
    norm,
    causes,
    forecast,
  };
}

function buildNorm(a: Answers, signedDelta: number): SleepScore["norm"] {
  const { min, max } = AGE_NORMS[a.age];
  const absHours = Math.abs(signedDelta);
  const rounded = Math.round(absHours * 10) / 10;
  const hoursWord = (h: number) => {
    const r = Math.round(h);
    if (r === 1 && h === r) return "час";
    if (r >= 2 && r <= 4) return "часа";
    return "часов";
  };
  let summary: string;
  if (signedDelta === 0) {
    summary = "Ты в пределах нормы для своего возраста — так держать.";
  } else if (signedDelta < 0) {
    summary = `Ты спишь на ${rounded} ${hoursWord(rounded)} меньше нормы.`;
  } else {
    summary = `Ты спишь на ${rounded} ${hoursWord(rounded)} больше нормы.`;
  }
  return {
    age: a.age,
    min,
    max,
    hours: a.sleepHours,
    deltaHours: signedDelta,
    summary,
  };
}

function buildCauses(a: Answers, signedDelta: number): Cause[] {
  const candidates: Cause[] = [];

  if (signedDelta < -0.5) {
    candidates.push({
      id: "duration-low",
      title: "Недостаточная длительность",
      detail: `Спишь на ${Math.abs(signedDelta).toFixed(1)} ч меньше нормы для возраста.`,
      icon: "moon",
      severity: "warn",
      weight: 100 - signedDelta * 20, // bigger gap → bigger weight
    });
  } else if (signedDelta > 1) {
    candidates.push({
      id: "duration-high",
      title: "Избыточный сон",
      detail: "Регулярный пересып снижает дневную энергию.",
      icon: "moon",
      severity: "tip",
      weight: 60 + signedDelta * 5,
    });
  }

  if (a.screensLate) {
    candidates.push({
      id: "screens",
      title: "Использование экрана перед сном",
      detail: "Синий свет смещает выработку мелатонина на 30–60 минут.",
      icon: "phone",
      severity: "warn",
      weight: 80,
    });
  }

  if (a.consistency === "rarely" || a.consistency === "sometimes") {
    candidates.push({
      id: "schedule",
      title: "Сбитый режим",
      detail: "Циркадный ритм требует стабильного времени подъёма.",
      icon: "clock",
      severity: "warn",
      weight: a.consistency === "rarely" ? 90 : 70,
    });
  }

  if (a.stressLevel >= 7) {
    candidates.push({
      id: "stress",
      title: "Высокий уровень стресса",
      detail: "Кортизол держит мозг в режиме бдительности дольше нужного.",
      icon: "zap",
      severity: "warn",
      weight: 60 + a.stressLevel * 3,
    });
  }

  if (a.caffeineLate) {
    candidates.push({
      id: "caffeine",
      title: "Кофеин во второй половине дня",
      detail: "Период полувыведения 5–6 часов — вечером он всё ещё в крови.",
      icon: "coffee",
      severity: "warn",
      weight: 65,
    });
  }

  if (a.wakeups) {
    candidates.push({
      id: "wakeups",
      title: "Прерывистый сон",
      detail: "Каждое пробуждение разрывает фазу глубокого сна.",
      icon: "moon-star",
      severity: "warn",
      weight: 75,
    });
  }

  return candidates.sort((x, y) => y.weight - x.weight).slice(0, 2);
}

function buildForecast(
  a: Answers,
  score: number,
  causes: Cause[],
): SleepScore["forecast"] {
  // Estimate weekly downside if causes persist (capped 0–25).
  const declineWeekly = Math.min(
    25,
    causes.reduce((s, c) => s + (c.severity === "warn" ? 4 : 1), 0) +
      (a.stressLevel >= 7 ? 3 : 0) +
      (a.wakeups ? 3 : 0),
  );

  // Potential improvement: how far from 100, but capped at 18/week.
  const improveWeekly = Math.min(18, Math.max(3, Math.round((100 - score) * 0.35)));

  const decline: string[] = [];
  const improve: string[] = [];

  if (causes.some((c) => c.id.startsWith("duration"))) {
    decline.push("Концентрация падает на 20–30% уже через 4–5 ночей.");
    improve.push("Восстановишь рабочую память и реакцию за 5–7 дней.");
  }
  if (a.screensLate) {
    decline.push("Засыпание занимает на 20–30 минут дольше.");
    improve.push("Уберёшь экраны за час — заснёшь быстрее на 15–20 минут.");
  }
  if (a.consistency !== "very") {
    decline.push("Циркадный ритм продолжает плыть, утра становятся тяжелее.");
    improve.push("Фиксированный подъём — стабильное утро через неделю.");
  }
  if (a.stressLevel >= 7) {
    decline.push("Уровень кортизола остаётся высоким, повышается раздражительность.");
    improve.push("Дыхание 4-6 вечером снизит фоновое напряжение за 3–4 дня.");
  }

  // Always have at least one bullet on each side.
  if (decline.length === 0) {
    decline.push("Без перемен оценка может откатиться к среднему уровню.");
  }
  if (improve.length === 0) {
    improve.push(`+${improveWeekly} к оценке за неделю при удержании режима.`);
  } else {
    improve.unshift(`+${improveWeekly} к оценке за неделю при следовании советам.`);
  }

  return {
    declineWeekly,
    improveWeekly,
    decline: decline.slice(0, 3),
    improve: improve.slice(0, 3),
  };
}

function buildRecommendations(a: Answers, signedDelta: number): Recommendation[] {
  const recs: Recommendation[] = [];
  const { min, max } = AGE_NORMS[a.age];

  if (signedDelta < -0.5) {
    recs.push({
      id: "duration-low",
      title: `Стремись к ${min}–${max} часам`,
      body: `Ты спал ${a.sleepHours}ч. Для возраста ${a.age} норма ${min}–${max} ч — это база для памяти и иммунитета.`,
      icon: "moon",
      severity: "warn",
    });
  } else if (signedDelta > 1) {
    recs.push({
      id: "duration-high",
      title: "Осторожно с пересыпом",
      body: `Регулярный сон больше ${max} ч в твоём возрасте может вызвать вялость. Держи стабильное время подъёма.`,
      icon: "clock",
      severity: "info",
    });
  }

  if (a.wakeups) {
    recs.push({
      id: "wakeups",
      title: "Стабилизируй среду сна",
      body: "Прохладная комната (18–20°C), плотные шторы и тишина — это снижает ночные пробуждения.",
      icon: "moon",
      severity: "tip",
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
