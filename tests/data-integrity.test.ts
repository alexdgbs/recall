import { describe, expect, it } from "vitest";
import { challenges, concepts, questions, type Difficulty } from "../src/data";
import {
  TOPICS,
  TOPIC_LABELS,
  challengeProgress,
  findChallenge,
  localDate,
  migrateState,
  normalizeSearch,
} from "../src/domain";
import { createQuiz } from "../src/screens/Quiz";
import { topicMeta } from "../src/screens/shared";

const DIFFICULTIES: Difficulty[] = ["basic", "intermediate", "technical"];

// Comparación profunda como la del worker de codeRunner: mismo criterio
// que usa la app para decidir si un test pasó.
const same = (a: unknown, b: unknown, seen = new WeakMap()): boolean => {
  if (Object.is(a, b)) return true;
  if (
    typeof a !== typeof b ||
    a === null ||
    b === null ||
    typeof a !== "object"
  )
    return false;
  if (seen.get(a as object) === b) return true;
  seen.set(a as object, b);
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b as object).sort();
  return (
    aKeys.length === bKeys.length &&
    aKeys.every(
      (key, index) =>
        key === bKeys[index] &&
        same(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key],
          seen,
        ),
    )
  );
};

// Soluciones de referencia: si un reto no se puede pasar con la solución
// correcta, el test lo caza antes que un usuario.
const referenceSolutions: Record<string, (...args: never[]) => unknown> = {
  "remove-duplicates": (nums: number[]) => [...new Set(nums)],
  "count-occurrences": (items: unknown[]) =>
    items.reduce<Record<string, number>>((acc, item) => {
      const key = String(item);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  palindrome: (text: string) => {
    const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
    return clean === [...clean].reverse().join("");
  },
  "two-sum": (nums: number[], target: number) => {
    const seen = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
      const need = target - nums[i];
      if (seen.has(need)) return [seen.get(need), i];
      seen.set(nums[i], i);
    }
    return [];
  },
  "find-maximum": (nums: number[]) => (nums.length ? Math.max(...nums) : null),
  "binary-search": (nums: number[], target: number) => {
    let lo = 0;
    let hi = nums.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] === target) return mid;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  },
  "sum-evens": (nums: number[]) =>
    nums.filter((n) => n % 2 === 0).reduce((a, b) => a + b, 0),
  "group-by-length": (words: string[]) =>
    words.reduce<Record<number, string[]>>((acc, word) => {
      (acc[word.length] ??= []).push(word);
      return acc;
    }, {}),
  "flatten-one": (arr: unknown[]) => arr.flat(1),
};

describe("preguntas", () => {
  it("cada combinación tema × dificultad tiene al menos 3 preguntas", () => {
    for (const topic of TOPICS) {
      for (const difficulty of DIFFICULTIES) {
        const count = questions.filter(
          (q) => q.topic === topic && q.difficulty === difficulty,
        ).length;
        expect(count, `${topic}/${difficulty}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("ids únicos y sin huecos en los datos", () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const conceptNames = new Set(concepts.map((c) => c.name));
    expect(conceptNames.size).toBe(concepts.length);
    expect(new Set(challenges.map((c) => c.id)).size).toBe(
      challenges.length,
    );
  });

  it("cada pregunta tiene 4 opciones distintas y la correcta en rango", () => {
    for (const q of questions) {
      expect(q.q.trim().length, q.id).toBeGreaterThan(0);
      expect(q.code.trim().length, q.id).toBeGreaterThan(0);
      expect(q.options, q.id).toHaveLength(4);
      expect(new Set(q.options).size, q.id).toBe(4);
      expect(q.correct, q.id).toBeGreaterThanOrEqual(0);
      expect(q.correct, q.id).toBeLessThan(4);
      expect(q.explain.trim().length, q.id).toBeGreaterThan(0);
    }
  });

  it("cada pregunta apunta a un concepto que existe", () => {
    const conceptNames = new Set(concepts.map((c) => c.name));
    for (const q of questions) {
      expect(conceptNames.has(q.concept), q.id).toBe(true);
    }
  });

  it("ninguna pregunta dice el texto genérico", () => {
    for (const q of questions) {
      expect(q.q, q.id).not.toBe("¿Qué imprime este código?");
    }
  });
});

describe("retos", () => {
  it("cada reto tiene tests y su plantilla menciona su función", () => {
    for (const c of challenges) {
      expect(c.tests.length, c.id).toBeGreaterThan(0);
      expect(c.template, c.id).toContain(c.functionName);
    }
  });

  it("las soluciones de referencia pasan todos los tests", () => {
    for (const c of challenges) {
      const solve = referenceSolutions[c.id];
      expect(solve, c.id).toBeDefined();
      for (const [i, test] of c.tests.entries()) {
        const actual = solve(...(test.args as never[]));
        expect(same(actual, test.expected), `${c.id} test ${i + 1}`).toBe(
          true,
        );
      }
    }
  });
});

describe("temas", () => {
  it("topicMeta cubre todos los temas, por clave", () => {
    expect(Object.keys(topicMeta).sort()).toEqual([...TOPICS].sort());
  });

  it("la etiqueta visible de Metodos lleva acento", () => {
    expect(TOPIC_LABELS.Metodos).toBe("Métodos");
    expect(topicMeta.Metodos.title).toBe("Métodos");
  });

  it("el título visible es el mismo en Home y en Aprender", () => {
    // TOPIC_LABELS es el único sitio con los nombres: topicMeta los toma
    // de ahí, así no vuelve a haber "Control" en un lado y
    // "Condicionales" en otro.
    for (const topic of TOPICS)
      expect(topicMeta[topic].title).toBe(TOPIC_LABELS[topic]);
  });
});

// Arreglos de la auditoría 2026-11-08.
describe("retos: lista y progreso", () => {
  it("son 9 retos, 3 por dificultad", () => {
    expect(challenges).toHaveLength(9);
    for (const d of DIFFICULTIES)
      expect(
        challenges.filter((c) => c.difficulty === d),
        d,
      ).toHaveLength(3);
  });

  it("challengeProgress cuenta solo retos que existen", () => {
    expect(
      challengeProgress(["flatten-one", "two-sum", "no-existe"]),
    ).toEqual({ done: 2, total: 9 });
    expect(challengeProgress([])).toEqual({ done: 0, total: 9 });
    expect(
      challengeProgress(challenges.map((c) => c.id)),
    ).toEqual({ done: 9, total: 9 });
  });

  it("findChallenge devuelve el reto por id y undefined si no existe", () => {
    expect(findChallenge("flatten-one")?.title).toBe("Aplana un nivel");
    expect(findChallenge("flatten-one")?.difficulty).toBe("technical");
    expect(findChallenge("no-existe")).toBeUndefined();
  });
});

describe("búsqueda sin acentos", () => {
  // Misma comparación que el buscador de Aprender.
  const search = (term: string) =>
    concepts.filter((c) =>
      normalizeSearch(c.name + c.group + c.summary).includes(
        normalizeSearch(term),
      ),
    );
  it('"metodos" devuelve "Métodos de string"', () => {
    expect(search("metodos").map((c) => c.name)).toContain(
      "Métodos de string",
    );
  });
  it('"Métodos" y "metodos" dan lo mismo', () => {
    expect(search("Métodos").map((c) => c.name)).toEqual(
      search("metodos").map((c) => c.name),
    );
  });
});

describe("repaso sin errores", () => {
  it("createQuiz con lista de repaso vacía no inventa preguntas", () => {
    // Con 0 errores los botones no navegan (y App lo bloquea): el quiz
    // vacío no se abre.
    expect(createQuiz("basic", undefined, [])).toEqual([]);
  });
});

describe("borradores y meta del día", () => {
  it("migrateState guarda los borradores válidos y tira el resto", () => {
    const out = migrateState({
      codeDrafts: {
        "flatten-one": "function flattenOne(arr) {\n  return arr.flat(1);\n}",
        "no-existe": "x",
        roto: 42,
      },
    });
    expect(out.codeDrafts["flatten-one"]).toContain("arr.flat(1)");
    expect(out.codeDrafts["no-existe"]).toBeUndefined();
    expect(out.codeDrafts.roto).toBeUndefined();
  });

  it("migrateState deja la meta de hoy en cero si lo guardado es de ayer", () => {
    const yesterday = localDate(-1);
    const out = migrateState({
      activity: {
        daily: { date: yesterday, answers: 2 },
      },
    });
    expect(out.activity.daily.date).toBe(localDate());
    expect(out.activity.daily.answers).toBe(0);
  });

  it("migrateState conserva las respuestas de hoy", () => {
    const out = migrateState({
      activity: {
        daily: { date: localDate(), answers: 2 },
      },
    });
    expect(out.activity.daily.date).toBe(localDate());
    expect(out.activity.daily.answers).toBe(2);
  });
});
