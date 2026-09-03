import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { challenges, questions, type Difficulty, type Question } from "./data";
import {
  TOPICS,
  freshState,
  isValidUsername,
  localDate,
  migrateState,
  normalizeUsername,
  type RecallState,
  type Topic,
} from "./domain";
export { TOPICS, isValidUsername, normalizeUsername } from "./domain";

const STORAGE_KEY = "js_practice_local_v1";
const cleanReferences = (value: RecallState) => {
  const questionIds = new Set(questions.map((item) => item.id)),
    challengeIds = new Set(challenges.map((item) => item.id));
  value.errors = value.errors.filter((id) => questionIds.has(id));
  value.codeStats.completed = value.codeStats.completed.filter((id) =>
    challengeIds.has(id),
  );
  value.codeStats.passed = Math.max(
    value.codeStats.passed,
    value.codeStats.completed.length,
  );
  return value;
};
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? cleanReferences(migrateState(JSON.parse(raw))) : freshState();
  } catch {
    return freshState();
  }
};

interface RecallContextValue {
  state: RecallState;
  storageAvailable: boolean;
  accuracy: number;
  streak: number;
  setUsername: (name: string) => boolean;
  finishOnboarding: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setGoal: (goal: 5 | 10 | 20) => void;
  answer: (question: Question, correct: boolean) => void;
  finishSession: () => void;
  registerCodeAttempt: (challengeId: string, passed: boolean) => boolean;
  restore: (input: unknown) => void;
  reset: () => void;
}
const Context = createContext<RecallContextValue | null>(null);
export function RecallProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(load);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [state]);
  const commit = (recipe: (current: RecallState) => RecallState) =>
    setState((current) => {
      const next = recipe(current);
      next.updatedAt = Date.now();
      return next;
    });
  const touch = (draft: RecallState) => {
    const today = localDate();
    if (draft.activity.daily.date !== today)
      draft.activity.daily = { date: today, answers: 0 };
    if (draft.activity.lastActiveDate !== today) {
      draft.activity.streak =
        draft.activity.lastActiveDate === localDate(-1)
          ? draft.activity.streak + 1
          : 1;
      draft.activity.lastActiveDate = today;
    }
  };
  const value = useMemo<RecallContextValue>(
    () => ({
      state,
      storageAvailable,
      accuracy: state.stats.totalAnswers
        ? Math.round(
            (state.stats.correctAnswers / state.stats.totalAnswers) * 100,
          )
        : 0,
      streak: [localDate(), localDate(-1)].includes(
        state.activity.lastActiveDate ?? "",
      )
        ? state.activity.streak
        : 0,
      setUsername: (raw) => {
        const name = normalizeUsername(raw);
        if (!isValidUsername(name)) return false;
        commit((s) => ({ ...s, profile: { name } }));
        return true;
      },
      finishOnboarding: () => commit((s) => ({ ...s, onboarded: true })),
      setDifficulty: (difficulty) =>
        commit((s) => ({ ...s, settings: { ...s.settings, difficulty } })),
      setGoal: (dailyGoal) =>
        commit((s) => ({ ...s, settings: { ...s.settings, dailyGoal } })),
      answer: (question, correct) =>
        commit((s) => {
          const n = structuredClone(s);
          touch(n);
          n.activity.daily.answers++;
          n.stats.totalAnswers++;
          n.topicStats[question.topic as Topic].answered++;
          if (correct) {
            n.stats.correctAnswers++;
            n.topicStats[question.topic as Topic].correct++;
            n.errors = n.errors.filter((id) => id !== question.id);
          } else if (!n.errors.includes(question.id))
            n.errors.push(question.id);
          return n;
        }),
      finishSession: () =>
        commit((s) => ({
          ...s,
          stats: { ...s.stats, sessions: s.stats.sessions + 1 },
        })),
      registerCodeAttempt: (id, passed) => {
        const first = passed && !state.codeStats.completed.includes(id);
        commit((s) => {
          const n = structuredClone(s);
          n.codeStats.attempts++;
          if (first) {
            touch(n);
            n.activity.daily.answers++;
            n.codeStats.completed.push(id);
            n.codeStats.passed++;
          }
          return n;
        });
        return first;
      },
      restore: (input) => {
        const restored = cleanReferences(migrateState(input));
        if (!isValidUsername(restored.profile.name))
          throw new Error("Respaldo inválido");
        commit(() => ({ ...restored, onboarded: true }));
      },
      reset: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
        setState(freshState());
      },
    }),
    [state, storageAvailable],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useRecall = () => {
  const value = useContext(Context);
  if (!value) throw new Error("RecallProvider faltante");
  return value;
};
