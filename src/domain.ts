import type { Difficulty } from "./data";
export const TOPICS = [
  "Fundamentos",
  "Control",
  "Bucles",
  "Arrays",
  "Metodos",
  "Funciones",
  "Objetos",
  "Colecciones",
  "Async",
  "DOM",
  "Errores",
  "Algoritmos",
] as const;
export type Topic = (typeof TOPICS)[number];
type Count = { answered: number; correct: number };
export interface RecallState {
  version: 2;
  onboarded: boolean;
  profile: { name: string };
  stats: { sessions: number; totalAnswers: number; correctAnswers: number };
  settings: { difficulty: Difficulty; dailyGoal: 5 | 10 | 20 };
  activity: {
    streak: number;
    lastActiveDate: string | null;
    daily: { date: string; answers: number };
  };
  errors: string[];
  topicStats: Record<Topic, Count>;
  codeStats: { attempts: number; passed: number; completed: string[] };
  updatedAt: number;
}
export const localDate = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const blankTopics = () =>
  Object.fromEntries(
    TOPICS.map((topic) => [topic, { answered: 0, correct: 0 }]),
  ) as Record<Topic, Count>;
export const freshState = (): RecallState => ({
  version: 2,
  onboarded: false,
  profile: { name: "" },
  stats: { sessions: 0, totalAnswers: 0, correctAnswers: 0 },
  settings: { difficulty: "basic", dailyGoal: 10 },
  activity: {
    streak: 0,
    lastActiveDate: null,
    daily: { date: localDate(), answers: 0 },
  },
  errors: [],
  topicStats: blankTopics(),
  codeStats: { attempts: 0, passed: 0, completed: [] },
  updatedAt: Date.now(),
});
const safe = (value: unknown) =>
  Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 1e7
    ? Number(value)
    : 0;
export const normalizeUsername = (value: string) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9._]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^[._]+|[._]+$/g, "")
    .slice(0, 12)
    .replace(/[._]+$/g, "");
export const isValidUsername = (value: string) =>
  /^[a-z0-9](?:[a-z0-9._]{1,10}[a-z0-9])$/.test(value) && !value.includes("..");
export function migrateState(input: unknown): RecallState {
  const base = freshState();
  if (!input || typeof input !== "object") return base;
  const p = input as Partial<RecallState>;
  const name = normalizeUsername(p.profile?.name ?? "");
  const total = safe(p.stats?.totalAnswers);
  base.onboarded = Boolean(p.onboarded) && isValidUsername(name);
  base.profile = { name };
  base.stats = {
    sessions: safe(p.stats?.sessions),
    totalAnswers: total,
    correctAnswers: Math.min(safe(p.stats?.correctAnswers), total),
  };
  if (
    ["basic", "intermediate", "technical"].includes(
      p.settings?.difficulty ?? "",
    )
  )
    base.settings.difficulty = p.settings!.difficulty!;
  if ([5, 10, 20].includes(Number(p.settings?.dailyGoal)))
    base.settings.dailyGoal = Number(p.settings!.dailyGoal) as 5 | 10 | 20;
  base.activity = {
    streak: safe(p.activity?.streak),
    lastActiveDate:
      typeof p.activity?.lastActiveDate === "string"
        ? p.activity.lastActiveDate
        : null,
    daily: {
      date:
        typeof p.activity?.daily?.date === "string"
          ? p.activity.daily.date
          : localDate(),
      answers: safe(p.activity?.daily?.answers),
    },
  };
  base.errors = Array.isArray(p.errors)
    ? [
        ...new Set(
          p.errors.filter((id): id is string => typeof id === "string"),
        ),
      ].slice(0, 500)
    : [];
  TOPICS.forEach((topic) => {
    const answered = safe(p.topicStats?.[topic]?.answered);
    base.topicStats[topic] = {
      answered,
      correct: Math.min(safe(p.topicStats?.[topic]?.correct), answered),
    };
  });
  const completed = Array.isArray(p.codeStats?.completed)
    ? [
        ...new Set(
          p.codeStats.completed.filter(
            (id): id is string => typeof id === "string",
          ),
        ),
      ].slice(0, 100)
    : [];
  base.codeStats = {
    attempts: safe(p.codeStats?.attempts),
    passed: Math.max(completed.length, safe(p.codeStats?.passed)),
    completed,
  };
  return base;
}
