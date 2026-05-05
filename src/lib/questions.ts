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
    title: "How many hours did you sleep last night?",
    subtitle: "Slide to your closest estimate",
    min: 3,
    max: 12,
    step: 0.5,
    unit: "h",
    defaultValue: 7,
  },
  {
    id: "bedtime",
    type: "time",
    title: "When did you go to bed?",
    subtitle: "Pick the time you fell asleep",
    defaultValue: "23:30",
  },
  {
    id: "wakeup",
    type: "time",
    title: "When did you wake up?",
    subtitle: "First time you got out of bed",
    defaultValue: "07:00",
  },
  {
    id: "mood",
    type: "choice",
    title: "How do you feel right now?",
    subtitle: "Be honest with yourself",
    options: [
      { value: "awful", label: "Awful", emoji: "😩" },
      { value: "bad", label: "Bad", emoji: "🙁" },
      { value: "okay", label: "Okay", emoji: "😐" },
      { value: "good", label: "Good", emoji: "🙂" },
      { value: "perfect", label: "Perfect", emoji: "😄" },
    ],
  },
  {
    id: "stressLevel",
    type: "slider",
    title: "Stress level over the past week?",
    subtitle: "0 — calm · 10 — overwhelmed",
    min: 0,
    max: 10,
    step: 1,
    unit: "",
    defaultValue: 4,
  },
  {
    id: "consistency",
    type: "choice",
    title: "How consistent is your bedtime?",
    subtitle: "Within the past 7 days",
    options: [
      { value: "very", label: "Very consistent", emoji: "🎯" },
      { value: "mostly", label: "Mostly consistent", emoji: "✨" },
      { value: "sometimes", label: "Sometimes", emoji: "🌙" },
      { value: "rarely", label: "Rarely", emoji: "🌀" },
    ],
  },
  {
    id: "caffeineLate",
    type: "toggle",
    title: "Caffeine after 4 PM?",
    subtitle: "Coffee, tea, energy drinks, dark chocolate",
  },
  {
    id: "screensLate",
    type: "toggle",
    title: "Screens in the last hour before bed?",
    subtitle: "Phone, laptop, TV without night mode",
  },
  {
    id: "exerciseRegular",
    type: "toggle",
    title: "Regular physical activity?",
    subtitle: "At least 3 sessions of 20+ minutes per week",
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
