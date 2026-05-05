export type QuestionType = "choice" | "slider" | "toggle" | "time";

export type Question =
  | {
      id: string;
      type: "choice";
      title: string;
      subtitle?: string;
      options: { value: string; label: string; emoji?: string }[];
    }
  | {
      id: string;
      type: "slider";
      title: string;
      subtitle?: string;
      min: number;
      max: number;
      step: number;
      unit: string;
      defaultValue: number;
    }
  | {
      id: string;
      type: "toggle";
      title: string;
      subtitle?: string;
    }
  | {
      id: string;
      type: "time";
      title: string;
      subtitle?: string;
      defaultValue: string;
    };

export const QUESTIONS: Question[] = [
  {
    id: "sleepHours",
    type: "slider",
    title: "Сколько часов ты спал прошлой ночью?",
    subtitle: "Передвинь ползунок к ближайшей оценке",
    min: 3,
    max: 12,
    step: 0.5,
    unit: "ч",
    defaultValue: 7,
  },
  {
    id: "bedtime",
    type: "time",
    title: "Во сколько ты лёг спать?",
    subtitle: "Выбери время, когда заснул",
    defaultValue: "23:30",
  },
  {
    id: "wakeup",
    type: "time",
    title: "Во сколько ты проснулся?",
    subtitle: "В первый раз, когда встал из постели",
    defaultValue: "07:00",
  },
  {
    id: "mood",
    type: "choice",
    title: "Как ты себя чувствуешь сейчас?",
    subtitle: "Будь честным с собой",
    options: [
      { value: "awful", label: "Ужасно", emoji: "😩" },
      { value: "bad", label: "Плохо", emoji: "🙁" },
      { value: "okay", label: "Нормально", emoji: "😐" },
      { value: "good", label: "Хорошо", emoji: "🙂" },
      { value: "perfect", label: "Отлично", emoji: "😄" },
    ],
  },
  {
    id: "stressLevel",
    type: "slider",
    title: "Уровень стресса за последнюю неделю?",
    subtitle: "0 — спокойствие · 10 — перегрузка",
    min: 0,
    max: 10,
    step: 1,
    unit: "",
    defaultValue: 4,
  },
  {
    id: "consistency",
    type: "choice",
    title: "Насколько стабильно время отхода ко сну?",
    subtitle: "За последние 7 дней",
    options: [
      { value: "very", label: "Очень стабильно", emoji: "🎯" },
      { value: "mostly", label: "По большей части", emoji: "✨" },
      { value: "sometimes", label: "Иногда", emoji: "🌙" },
      { value: "rarely", label: "Редко", emoji: "🌀" },
    ],
  },
  {
    id: "caffeineLate",
    type: "toggle",
    title: "Кофеин после 16:00?",
    subtitle: "Кофе, чай, энергетики, тёмный шоколад",
  },
  {
    id: "screensLate",
    type: "toggle",
    title: "Экраны в последний час перед сном?",
    subtitle: "Телефон, ноутбук, ТВ без ночного режима",
  },
  {
    id: "exerciseRegular",
    type: "toggle",
    title: "Регулярная физическая активность?",
    subtitle: "Минимум 3 тренировки по 20+ минут в неделю",
  },
];

export type Answers = {
  sleepHours: number;
  bedtime: string;
  wakeup: string;
  mood: "awful" | "bad" | "okay" | "good" | "perfect";
  stressLevel: number;
  consistency: "very" | "mostly" | "sometimes" | "rarely";
  caffeineLate: boolean;
  screensLate: boolean;
  exerciseRegular: boolean;
};

export const DEFAULT_ANSWERS: Answers = {
  sleepHours: 7,
  bedtime: "23:30",
  wakeup: "07:00",
  mood: "okay",
  stressLevel: 4,
  consistency: "mostly",
  caffeineLate: false,
  screensLate: false,
  exerciseRegular: true,
};
