import { challenges, type Difficulty } from "./data";
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
// Etiqueta visible por tema: la clave interna sigue sin acento ("Metodos")
// para no romper los datos guardados; lo que se muestra lleva acento.
// Es el único sitio con los nombres visibles: topicMeta (Home) los toma
// de aquí, y Aprender usa topicLabel, así no hay dos versiones.
export const TOPIC_LABELS: Record<Topic, string> = {
  Fundamentos: "Fundamentos",
  Control: "Condicionales",
  Bucles: "Bucles",
  Arrays: "Arrays",
  Metodos: "Métodos",
  Funciones: "Funciones",
  Objetos: "Objetos",
  Colecciones: "Set y Map",
  Async: "Asincronía",
  DOM: "DOM y eventos",
  Errores: "Errores",
  Algoritmos: "Algoritmos",
};
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
  // Último código escrito en cada reto: se guarda en localStorage, así
  // al salir y volver el editor muestra lo escrito, no la plantilla.
  codeDrafts: Record<string, string>;
  updatedAt: number;
}
export const topicLabel = (group: string) =>
  (TOPIC_LABELS as Record<string, string>)[group] ?? group;
// Retos: cuántos de los 9 están completados (solo ids que existen).
export const challengeProgress = (completed: readonly string[]) => {
  const done = challenges.filter((c) => completed.includes(c.id)).length;
  return { done, total: challenges.length };
};
// Reto por id, para abrirlo directo desde la lista.
export const findChallenge = (id: string) =>
  challenges.find((c) => c.id === id);
// Búsqueda sin acentos: "metodos" encuentra "Métodos de string".
export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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
  codeDrafts: {},
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
// Lo que puede venir guardado en localStorage o en un código de respaldo:
// la misma forma que RecallState, pero todo opcional y sin tipos afirmados.
interface StoredState {
  onboarded?: unknown;
  profile?: { name?: unknown };
  stats?: {
    sessions?: unknown;
    totalAnswers?: unknown;
    correctAnswers?: unknown;
  };
  settings?: { difficulty?: unknown; dailyGoal?: unknown };
  activity?: {
    streak?: unknown;
    lastActiveDate?: unknown;
    daily?: { date?: unknown; answers?: unknown };
  };
  errors?: unknown;
  topicStats?: Record<string, { answered?: unknown; correct?: unknown }>;
  codeStats?: { attempts?: unknown; passed?: unknown; completed?: unknown };
  codeDrafts?: unknown;
}
export function migrateState(input: unknown): RecallState {
  const base = freshState();
  if (!input || typeof input !== "object") return base;
  // Forma guardada: se lee campo por campo con comprobaciones, sin afirmar
  // que el objeto desconocido ya es un RecallState completo.
  const p = input as StoredState;
  const name =
    typeof p.profile?.name === "string" ? normalizeUsername(p.profile.name) : "";
  const total = safe(p.stats?.totalAnswers);
  base.onboarded = Boolean(p.onboarded) && isValidUsername(name);
  base.profile = { name };
  base.stats = {
    sessions: safe(p.stats?.sessions),
    totalAnswers: total,
    correctAnswers: Math.min(safe(p.stats?.correctAnswers), total),
  };
  const difficulty = p.settings?.difficulty;
  if (
    difficulty === "basic" ||
    difficulty === "intermediate" ||
    difficulty === "technical"
  )
    base.settings.difficulty = difficulty;
  const dailyGoal = Number(p.settings?.dailyGoal);
  if (dailyGoal === 5 || dailyGoal === 10 || dailyGoal === 20)
    base.settings.dailyGoal = dailyGoal;
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
  // La meta es de hoy: si lo guardado es de otro día, el contador de hoy
  // empieza en cero, no con las respuestas de ayer.
  if (base.activity.daily.date !== localDate())
    base.activity.daily = { date: localDate(), answers: 0 };
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
  // Borradores guardados: solo texto corto de retos que existen.
  const challengeIds = new Set(challenges.map((c) => c.id));
  const drafts =
    p.codeDrafts && typeof p.codeDrafts === "object"
      ? Object.fromEntries(
          Object.entries(p.codeDrafts as Record<string, unknown>).filter(
            ([id, v]) =>
              challengeIds.has(id) &&
              typeof v === "string" &&
              v.length <= 10000,
          ),
        )
      : {};
  base.codeDrafts = drafts as Record<string, string>;
  return base;
}
