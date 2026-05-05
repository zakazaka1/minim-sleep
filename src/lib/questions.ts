export type QuestionType = "choice" | "slider" | "toggle" | "time";

export type ChoiceIcon =
  | "baby"
  | "graduation-cap"
  | "rocket"
  | "briefcase"
  | "annoyed"
  | "frown"
  | "meh"
  | "smile"
  | "heart"
  | "target"
  | "sparkles"
  | "moon"
  | "shuffle";

export type Question =
  | {
      id: string;
      type: "choice";
      title: string;
      subtitle?: string;
      options: { value: string; label: string; icon?: ChoiceIcon }[];
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

export type AgeBand = "10-13" | "14-17" | "18-25" | "26+";

export const AGE_NORMS: Record<AgeBand, { min: number; max: number }> = {
  "10-13": { min: 9, max: 11 },
  "14-17": { min: 8, max: 10 },
  "18-25": { min: 7, max: 9 },
  "26+": { min: 7, max: 8 },
};

export const QUESTIONS: Question[] = [
  {
    id: "age",
    type: "choice",
    title: "Сколько тебе лет?",
    subtitle: "Норма сна зависит от возраста",
    options: [
      { value: "10-13", label: "10–13", icon: "baby" },
      { value: "14-17", label: "14–17", icon: "graduation-cap" },
      { value: "18-25", label: "18–25", icon: "rocket" },
      { value: "26+", label: "26+", icon: "briefcase" },
    ],
  },
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
    id: "wakeups",
    type: "toggle",
    title: "Просыпался ли ночью?",
    subtitle: "Прерывистый сон снижает восстановление",
  },
  {
    id: "mood",
    type: "choice",
    title: "Как ты себя чувствуешь сейчас?",
    subtitle: "Будь честным с собой",
    options: [
      { value: "awful", label: "Ужасно", icon: "annoyed" },
      { value: "bad", label: "Плохо", icon: "frown" },
      { value: "okay", label: "Нормально", icon: "meh" },
      { value: "good", label: "Хорошо", icon: "smile" },
      { value: "perfect", label: "Отлично", icon: "heart" },
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
      { value: "very", label: "Очень стабильно", icon: "target" },
      { value: "mostly", label: "По большей части", icon: "sparkles" },
      { value: "sometimes", label: "Иногда", icon: "moon" },
      { value: "rarely", label: "Редко", icon: "shuffle" },
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
  age: AgeBand;
  sleepHours: number;
  bedtime: string;
  wakeup: string;
  wakeups: boolean;
  mood: "awful" | "bad" | "okay" | "good" | "perfect";
  stressLevel: number;
  consistency: "very" | "mostly" | "sometimes" | "rarely";
  caffeineLate: boolean;
  screensLate: boolean;
  exerciseRegular: boolean;
};

export const DEFAULT_ANSWERS: Answers = {
  age: "18-25",
  sleepHours: 7,
  bedtime: "23:30",
  wakeup: "07:00",
  wakeups: false,
  mood: "okay",
  stressLevel: 4,
  consistency: "mostly",
  caffeineLate: false,
  screensLate: false,
  exerciseRegular: true,
};
