import type { Answers } from "./questions";
import type { SleepScore } from "./sleep-score";

const RESULTS_KEY = "minimsleep:results";
const ANSWERS_KEY = "minimsleep:answers";

export type StoredResult = {
  id: string;
  createdAt: string;
  answers: Answers;
  score: SleepScore;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const guestStorage = {
  loadResults(): StoredResult[] {
    if (typeof window === "undefined") return [];
    return safeParse<StoredResult[]>(localStorage.getItem(RESULTS_KEY), []);
  },
  saveResult(r: StoredResult) {
    if (typeof window === "undefined") return;
    const all = this.loadResults();
    all.unshift(r);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(all.slice(0, 50)));
  },
  clearResults() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(RESULTS_KEY);
  },
  loadAnswers(): Answers | null {
    if (typeof window === "undefined") return null;
    return safeParse<Answers | null>(localStorage.getItem(ANSWERS_KEY), null);
  },
  saveAnswers(a: Answers) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(a));
  },
  clearAnswers() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ANSWERS_KEY);
  },
};
