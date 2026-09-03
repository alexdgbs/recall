import type { Difficulty } from "../data";
import { Icon } from "../components/Icon";

export type View = "home" | "learn" | "practice" | "quiz" | "code" | "profile";
export const label = (value: Difficulty) =>
  value === "technical"
    ? "Prueba técnica"
    : value === "intermediate"
      ? "Intermedio"
      : "Básico";
export const Arrow = () => <Icon name="arrow" />;
export const Back = () => <Icon name="back" />;
export const topicMeta = [
  ["Fundamentos", "let · const · tipos · ===", "fundamentals"],
  ["Condicionales", "if · else · switch · ternario", "control"],
  ["Bucles", "for · while · for...of · for...in", "loops"],
  ["Arrays", "slice · splice · push · pop", "arrays"],
  ["Métodos", "map · filter · find · reduce", "methods"],
  ["Funciones", "function · arrow · callback", "functions"],
  ["Objetos", "keys · values · destructuring", "objects"],
  ["Set y Map", "unique · add · get · set", "collections"],
  ["Asincronía", "Promise · async · await", "async"],
  ["DOM y eventos", "selector · click · textContent", "dom"],
  ["Errores", "try · catch · throw", "errors"],
  ["Algoritmos", "buscar · contar · duplicados · Big O", "algorithms"],
] as const;
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
