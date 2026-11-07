import type { Difficulty } from "../data";
import type { Topic } from "../domain";
import { readBackup } from "../services/backup";
import { Icon, type IconName } from "../components/Icon";

export type View = "home" | "learn" | "practice" | "quiz" | "code" | "profile";
export const label = (value: Difficulty) =>
  value === "technical"
    ? "Prueba técnica"
    : value === "intermediate"
      ? "Intermedio"
      : "Básico";
export const tryRestore = (
  restore: (input: unknown) => void,
  code: string,
) => {
  try {
    restore(readBackup(code.trim()));
    return "Datos restaurados correctamente.";
  } catch {
    return "Ese código no es válido o está incompleto.";
  }
};
export const Arrow = () => <Icon name="arrow" />;
export const Back = () => <Icon name="back" />;
// Metadatos por tema, por clave y no por índice: si se reordena TOPICS,
// cada tema sigue con su título, su descripción y su icono.
export const topicMeta: Record<
  Topic,
  { title: string; desc: string; icon: IconName }
> = {
  Fundamentos: {
    title: "Fundamentos",
    desc: "let · const · tipos · ===",
    icon: "fundamentals",
  },
  Control: {
    title: "Condicionales",
    desc: "if · else · switch · ternario",
    icon: "control",
  },
  Bucles: {
    title: "Bucles",
    desc: "for · while · for...of · for...in",
    icon: "loops",
  },
  Arrays: {
    title: "Arrays",
    desc: "slice · splice · push · pop",
    icon: "arrays",
  },
  Metodos: {
    title: "Métodos",
    desc: "map · filter · find · reduce",
    icon: "methods",
  },
  Funciones: {
    title: "Funciones",
    desc: "function · arrow · callback",
    icon: "functions",
  },
  Objetos: {
    title: "Objetos",
    desc: "keys · values · destructuring",
    icon: "objects",
  },
  Colecciones: {
    title: "Set y Map",
    desc: "unique · add · get · set",
    icon: "collections",
  },
  Async: {
    title: "Asincronía",
    desc: "Promise · async · await",
    icon: "async",
  },
  DOM: {
    title: "DOM y eventos",
    desc: "selector · click · textContent",
    icon: "dom",
  },
  Errores: {
    title: "Errores",
    desc: "try · catch · throw",
    icon: "errors",
  },
  Algoritmos: {
    title: "Algoritmos",
    desc: "buscar · contar · duplicados · Big O",
    icon: "algorithms",
  },
};
export const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
export const formatValue = (value: unknown) => {
  if (value === undefined) return "undefined";
  if (typeof value === "number" && Number.isNaN(value)) return "NaN";
  const seen = new WeakSet<object>();
  try {
    return (
      JSON.stringify(value, (_key, item) => {
        if (typeof item === "number" && Number.isNaN(item)) return "NaN";
        if (item && typeof item === "object") {
          if (seen.has(item)) return "[Circular]";
          seen.add(item);
        }
        return item;
      }) ?? String(value)
    );
  } catch {
    return String(value);
  }
};
